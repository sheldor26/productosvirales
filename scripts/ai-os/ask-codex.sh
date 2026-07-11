#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if ! command -v codex >/dev/null 2>&1; then
  echo "Codex CLI no instalado." >&2
  exit 1
fi

MODE="${1:-}"
TARGET="${2:-}"
PROMPT_FILE="${3:-}"

if [[ -z "$MODE" || -z "$TARGET" ]]; then
  cat >&2 <<'USAGE'
Uso:
  scripts/ai-os/ask-codex.sh review-guide <slug> [prompt-extra.md]
  scripts/ai-os/ask-codex.sh ask <nombre-tarea> <prompt.md>

Ejemplos:
  scripts/ai-os/ask-codex.sh review-guide hy300-vs-hy320
  scripts/ai-os/ask-codex.sh ask revisar-og docs/ai/prompts/revisar-og.md
USAGE
  exit 2
fi

STAMP="$(date +%Y-%m-%d-%H%M%S)"
SAFE_TARGET="$(printf '%s' "$TARGET" | tr -cs '[:alnum:]_.-' '-')"
OUT_DIR="docs/ai/codex-asks/${STAMP}-${MODE}-${SAFE_TARGET}"
mkdir -p "$OUT_DIR"

run_with_timeout() {
  local seconds="$1"
  shift
  "$@" &
  local cmd_pid=$!
  (
    sleep "$seconds"
    kill -TERM "$cmd_pid" 2>/dev/null || true
  ) &
  local watchdog_pid=$!
  wait "$cmd_pid"
  local status=$?
  kill "$watchdog_pid" 2>/dev/null || true
  wait "$watchdog_pid" 2>/dev/null || true
  return "$status"
}

build_review_context() {
  local slug="$1"
  local guide_line
  guide_line="$(rg -n "slug: [\"']${slug}[\"']" src/data/guides.ts | head -n 1 | cut -d: -f1 || true)"
  if [[ -z "$guide_line" ]]; then
    echo "No encontre slug '${slug}' en src/data/guides.ts" >&2
    exit 1
  fi

  local start=$(( guide_line > 60 ? guide_line - 60 : 1 ))
  local end=$(( guide_line + 220 ))
  sed -n "${start},${end}p" src/data/guides.ts > "$OUT_DIR/guide-excerpt.ts"
  git diff -- src/data/guides.ts src/data/curated-products.ts docs/ARTICLE_CREATION_WORKFLOW.md docs/guias.md > "$OUT_DIR/diff.patch" || true
  git status --short > "$OUT_DIR/git-status.txt"

  cat > "$OUT_DIR/prompt.md" <<PROMPT
Actua como Codex/GPT, auditor externo de ProductosVirales.

Claude/Kogod es el cerebro principal: escribe e implementa. Tu rol es revisar y sugerir mejoras, no reescribir la guia completa.

Tarea: auditar la guia '${slug}' en modo solo lectura.

Foco:
- SEO editorial, intencion de busqueda, canibalizacion y arquitectura de enlaces internos.
- Consistencia de datos, claims, precios, fichas y regla de honestidad.
- Bugs de implementacion, metadata, OG/Pinterest, render, tokens y monetizacion.
- Mejoras accionables que Claude pueda aplicar.

Contexto:

## Extracto de guia
\`\`\`ts
$(cat "$OUT_DIR/guide-excerpt.ts")
\`\`\`

## Diff actual
\`\`\`diff
$(cat "$OUT_DIR/diff.patch")
\`\`\`

## Estado git
\`\`\`
$(cat "$OUT_DIR/git-status.txt")
\`\`\`

Responde en espanol rioplatense, claro y accionable.
No edites archivos.
Termina con una de estas lineas exactas:
GO: listo para publicar
NO-GO: hay bloqueantes
PROMPT
}

case "$MODE" in
  review-guide)
    build_review_context "$TARGET"
    if [[ -n "$PROMPT_FILE" && -f "$PROMPT_FILE" ]]; then
      {
        echo
        echo "## Prompt extra de Claude"
        cat "$PROMPT_FILE"
      } >> "$OUT_DIR/prompt.md"
    fi
    ;;
  ask)
    if [[ -z "$PROMPT_FILE" || ! -f "$PROMPT_FILE" ]]; then
      echo "Para mode ask, el tercer argumento debe ser un prompt.md existente." >&2
      exit 2
    fi
    cp "$PROMPT_FILE" "$OUT_DIR/prompt.md"
    ;;
  *)
    echo "Modo no soportado: ${MODE}" >&2
    exit 2
    ;;
esac

CODEX_TIMEOUT_SECONDS="${CODEX_TIMEOUT_SECONDS:-120}"
LAST_MESSAGE="$OUT_DIR/codex-review.md"
STDOUT_FILE="$OUT_DIR/codex-stdout.txt"
STDERR_FILE="$OUT_DIR/codex-stderr.txt"

run_with_timeout "$CODEX_TIMEOUT_SECONDS" \
  codex exec \
    --cd "$ROOT_DIR" \
    --sandbox read-only \
    --ephemeral \
    --output-last-message "$LAST_MESSAGE" \
    "$(cat "$OUT_DIR/prompt.md")" \
    > "$STDOUT_FILE" 2> "$STDERR_FILE" || {
      {
        echo "Codex fallo o expiro. Revisar:"
        echo "- ${STDOUT_FILE}"
        echo "- ${STDERR_FILE}"
        echo
        echo "STDOUT:"
        cat "$STDOUT_FILE"
        echo
        echo "STDERR:"
        cat "$STDERR_FILE"
      } > "$LAST_MESSAGE"
    }

cat > "$OUT_DIR/SUMMARY.md" <<EOF
# Consulta Claude -> Codex

Fecha: ${STAMP}
Modo: ${MODE}
Target: ${TARGET}

Respuesta:
- ${LAST_MESSAGE}

Veredicto:
$(tail -n 20 "$LAST_MESSAGE" | rg -io "(GO|NO-GO): [^\n]+" | tail -n 1 || echo "sin veredicto")
EOF

echo "Respuesta Codex guardada en: ${LAST_MESSAGE}"
echo
cat "$OUT_DIR/SUMMARY.md"
