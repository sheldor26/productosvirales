#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if [[ -f ".env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env"
  set +a
fi

SLUG="${1:-}"
if [[ -z "$SLUG" ]]; then
  echo "Uso: scripts/ai-os/review-guide.sh <slug-guia>" >&2
  exit 2
fi

STAMP="$(date +%Y-%m-%d-%H%M%S)"
OUT_DIR="docs/ai/reviews/${STAMP}-${SLUG}"
mkdir -p "$OUT_DIR"

GUIDE_LINE="$(grep -nE "slug: [\"']${SLUG}[\"']" src/data/guides.ts | head -n 1 | cut -d: -f1 || true)"
if [[ -z "$GUIDE_LINE" ]]; then
  echo "No encontre slug '${SLUG}' en src/data/guides.ts" >&2
  exit 1
fi

START=$(( GUIDE_LINE > 60 ? GUIDE_LINE - 60 : 1 ))
END=$(( GUIDE_LINE + 220 ))
sed -n "${START},${END}p" src/data/guides.ts > "$OUT_DIR/guide-excerpt.txt"

git diff -- src/data/guides.ts src/data/curated-products.ts docs/ARTICLE_CREATION_WORKFLOW.md docs/guias.md > "$OUT_DIR/diff.patch" || true
git status --short > "$OUT_DIR/git-status.txt"

PRODUCT_IDS="$(
  grep -oE "MLA[0-9]+" "$OUT_DIR/guide-excerpt.txt" | sort -u || true
)"

: > "$OUT_DIR/products-excerpts.txt"
while IFS= read -r product_id; do
  [[ -z "$product_id" ]] && continue
  product_line="$(grep -nE "id: ['\"]${product_id}['\"]" src/data/curated-products.ts | head -n 1 | cut -d: -f1 || true)"
  if [[ -n "$product_line" ]]; then
    product_start=$(( product_line > 20 ? product_line - 20 : 1 ))
    product_end=$(( product_line + 80 ))
    {
      echo
      echo "// ===== ${product_id} ====="
      sed -n "${product_start},${product_end}p" src/data/curated-products.ts
    } >> "$OUT_DIR/products-excerpts.txt"
  fi
done <<< "$PRODUCT_IDS"

cat > "$OUT_DIR/review-context.md" <<EOF
# Contexto compacto para revisar ${SLUG}

## Extracto de guia

\`\`\`ts
$(cat "$OUT_DIR/guide-excerpt.txt")
\`\`\`

## Extractos de fichas

\`\`\`ts
$(cat "$OUT_DIR/products-excerpts.txt")
\`\`\`

## Diff actual

\`\`\`diff
$(cat "$OUT_DIR/diff.patch")
\`\`\`

## Estado git

\`\`\`
$(cat "$OUT_DIR/git-status.txt")
\`\`\`
EOF

cat > "$OUT_DIR/gemini-prompt.txt" <<PROMPT
Actua como Gemini, tercer auditor orientado a Google/SERP/AIO para ProductosVirales.

Revisa la guia '${SLUG}' en modo solo lectura. No edites archivos.

Tu foco diferencial:
- intencion de busqueda en Google Argentina;
- cobertura semantica y preguntas que faltan;
- riesgo de canibalizacion;
- probabilidad de ser util para AI Overviews/Gemini;
- multimedia: hero, imagenes, manuales, screenshots, alt text, OG/Pinterest, assets visuales y oportunidades para mejorar comprension/conversion;
- claridad para el usuario comprador y oportunidades de conversion sin humo.

Usa solo este contexto compacto, sin abrir archivos adicionales:

$(cat "$OUT_DIR/review-context.md")

Responde en espanol rioplatense, claro y accionable.

IMPORTANTE (corres via Antigravity CLI en modo agentico): escribi TODA la
auditoria directamente en tu salida de texto. NO crees archivos, NO uses
herramientas de edicion, NO guardes nada aparte: la respuesta completa va inline.

Termina con una de estas lineas exactas:
GO: listo para publicar
NO-GO: hay bloqueantes
PROMPT

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
  return "$status"
}

run_gemini() {
  # La pata "Gemini" del AI-OS corre con Antigravity CLI (agy), que usa la
  # suscripcion Google One AI Pro de Juan. El viejo gemini CLI quedo deprecado
  # por Google (IneligibleTierError para cuentas individuales, jul 2026); agy
  # es el reemplazo oficial y tiene modo -p no-interactivo. Modelo configurable
  # con AGY_MODEL (ver 'agy models'); default: Gemini 3.5 Flash (High).
  if ! command -v agy >/dev/null 2>&1; then
    {
      echo "Antigravity CLI (agy) no instalado."
      echo "Instalar: curl -fsSL https://antigravity.google/cli/install.sh | bash"
      echo "Loguear:  agy   (Google Sign-In con la cuenta del plan Pro)"
    } > "$OUT_DIR/gemini-review.md"
    return 0
  fi

  local gemini_stdout="$OUT_DIR/gemini-stdout.txt"

  # Selector de modelo por tier. AI_OS_TIER: light | medium (default) | heavy.
  # light  = rapido/barato (chequeo liviano)   -> Gemini 3.5 Flash (Low)
  # medium = equilibrio (auditoria normal)      -> Gemini 3.5 Flash (High)
  # heavy  = maxima calidad (guia importante)   -> Gemini 3.1 Pro (High)
  # Override directo: AGY_MODEL="<nombre exacto de 'agy models'>" gana sobre el tier.
  local agy_model="${AGY_MODEL:-}"
  if [[ -z "$agy_model" ]]; then
    case "${AI_OS_TIER:-medium}" in
      light) agy_model="Gemini 3.5 Flash (Low)" ;;
      heavy) agy_model="Gemini 3.1 Pro (High)" ;;
      *)     agy_model="Gemini 3.5 Flash (High)" ;;
    esac
  fi
  echo "Gemini (agy) modelo: ${agy_model} (tier=${AI_OS_TIER:-medium})" >&2
  run_with_timeout "${AI_OS_AGENT_TIMEOUT_SECONDS:-240}" \
    agy -p "$(cat "$OUT_DIR/gemini-prompt.txt")" \
    --model "$agy_model" --mode plan \
    > "$gemini_stdout" 2> "$OUT_DIR/gemini-stderr.txt" || {
      {
        echo "Gemini (agy) fallo. Revisar ${OUT_DIR}/gemini-stderr.txt"
        echo
        echo "STDOUT:"
        cat "$gemini_stdout"
        echo
        echo "STDERR:"
        cat "$OUT_DIR/gemini-stderr.txt"
      } > "$OUT_DIR/gemini-review.md"
      return 0
    }

  mv "$gemini_stdout" "$OUT_DIR/gemini-review.md"
}

run_gemini

cat > "$OUT_DIR/CONSENSUS.md" <<EOF
# Revision AI-OS: ${SLUG}

Fecha: ${STAMP}

## Resultado rapido

- Gemini: $(tail -n 20 "$OUT_DIR/gemini-review.md" | grep -iE "^(GO|NO-GO):" || echo "sin veredicto")
- Codex: pendiente de auditoria en la conversacion

## Regla de publicacion

Solo publicar/pushear si:

1. Claude escribio/aplico los cambios pedidos.
2. Gemini no marca bloqueantes.
3. Codex revisa el diff, valida build/checks y coincide con el GO.

## Archivos

- gemini-review.md
- guide-excerpt.txt
- products-excerpts.txt
- diff.patch
- git-status.txt
EOF

echo "Revision guardada en: ${OUT_DIR}"
echo
cat "$OUT_DIR/CONSENSUS.md"
