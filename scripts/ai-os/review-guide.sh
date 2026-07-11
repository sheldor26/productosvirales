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

GUIDE_LINE="$(rg -n "slug: [\"']${SLUG}[\"']" src/data/guides.ts | head -n 1 | cut -d: -f1 || true)"
if [[ -z "$GUIDE_LINE" ]]; then
  echo "No encontre slug '${SLUG}' en src/data/guides.ts" >&2
  exit 1
fi

START=$(( GUIDE_LINE > 60 ? GUIDE_LINE - 60 : 1 ))
END=$(( GUIDE_LINE + 320 ))
sed -n "${START},${END}p" src/data/guides.ts > "$OUT_DIR/guide-excerpt.ts"

git diff -- src/data/guides.ts src/data/curated-products.ts docs/ARTICLE_CREATION_WORKFLOW.md docs/guias.md > "$OUT_DIR/diff.patch" || true
git status --short > "$OUT_DIR/git-status.txt"

PRODUCT_IDS="$(
  rg -o "MLA[0-9]+" "$OUT_DIR/guide-excerpt.ts" | sort -u || true
)"

: > "$OUT_DIR/products-excerpts.ts"
while IFS= read -r product_id; do
  [[ -z "$product_id" ]] && continue
  product_line="$(rg -n "id: ['\"]${product_id}['\"]" src/data/curated-products.ts | head -n 1 | cut -d: -f1 || true)"
  if [[ -n "$product_line" ]]; then
    product_start=$(( product_line > 20 ? product_line - 20 : 1 ))
    product_end=$(( product_line + 120 ))
    {
      echo
      echo "// ===== ${product_id} ====="
      sed -n "${product_start},${product_end}p" src/data/curated-products.ts
    } >> "$OUT_DIR/products-excerpts.ts"
  fi
done <<< "$PRODUCT_IDS"

cat > "$OUT_DIR/claude-prompt.txt" <<PROMPT
Actua como Claude/Kogod, auditor tecnico-editorial de ProductosVirales.

Revisa la guia '${SLUG}' en modo solo lectura. No edites archivos.

Tu foco:
- bugs de implementacion, metadata, OG/Pinterest, rendering o links rotos;
- consistencia con fichas reales y regla de honestidad;
- SEO, conversion, enlaces internos, monetizacion y canibalizacion;
- si hay bloqueantes antes de publicar/pushear.

Contexto disponible:
- Extracto de guia: ${OUT_DIR}/guide-excerpt.ts
- Extractos de fichas: ${OUT_DIR}/products-excerpts.ts
- Diff actual: ${OUT_DIR}/diff.patch
- Estado git: ${OUT_DIR}/git-status.txt
- Reglas: docs/guias.md y docs/ARTICLE_CREATION_WORKFLOW.md

Responde en espanol rioplatense, claro y accionable.
Termina con una de estas lineas exactas:
GO: listo para publicar
NO-GO: hay bloqueantes
PROMPT

cat > "$OUT_DIR/gemini-prompt.txt" <<PROMPT
Actua como Gemini, tercer auditor orientado a Google/SERP/AIO para ProductosVirales.

Revisa la guia '${SLUG}' en modo solo lectura. No edites archivos.

Tu foco diferencial:
- intencion de busqueda en Google Argentina;
- cobertura semantica y preguntas que faltan;
- riesgo de canibalizacion;
- probabilidad de ser util para AI Overviews/Gemini;
- claridad para el usuario comprador y oportunidades de conversion sin humo.

Contexto disponible:
- Extracto de guia: ${OUT_DIR}/guide-excerpt.ts
- Extractos de fichas: ${OUT_DIR}/products-excerpts.ts
- Diff actual: ${OUT_DIR}/diff.patch
- Estado git: ${OUT_DIR}/git-status.txt
- Reglas: docs/guias.md y docs/ARTICLE_CREATION_WORKFLOW.md

Responde en espanol rioplatense, claro y accionable.
Termina con una de estas lineas exactas:
GO: listo para publicar
NO-GO: hay bloqueantes
PROMPT

run_claude() {
  if ! command -v claude >/dev/null 2>&1; then
    echo "Claude CLI no instalado." > "$OUT_DIR/claude-review.md"
    return 0
  fi

  local claude_stdout="$OUT_DIR/claude-stdout.txt"
  claude -p --output-format text --permission-mode auto --no-session-persistence \
    --allowedTools "Read,Grep,Glob,Bash(git diff *),Bash(git status *),Bash(rg *),Bash(sed *)" \
    < "$OUT_DIR/claude-prompt.txt" > "$claude_stdout" 2> "$OUT_DIR/claude-stderr.txt" || {
      {
        echo "Claude fallo. Revisar ${OUT_DIR}/claude-stderr.txt"
        echo
        echo "STDOUT:"
        cat "$claude_stdout"
        echo
        echo "STDERR:"
        cat "$OUT_DIR/claude-stderr.txt"
      } > "$OUT_DIR/claude-review.md"
      return 0
    }

  mv "$claude_stdout" "$OUT_DIR/claude-review.md"
}

run_gemini() {
  if ! command -v gemini >/dev/null 2>&1; then
    echo "Gemini CLI no instalado." > "$OUT_DIR/gemini-review.md"
    return 0
  fi

  if [[ -z "${GEMINI_API_KEY:-}" && -z "${GOOGLE_GENAI_USE_VERTEXAI:-}" && -z "${GOOGLE_GENAI_USE_GCA:-}" ]]; then
    {
      echo "Gemini no autenticado."
      echo "Configurar GEMINI_API_KEY, GOOGLE_GENAI_USE_VERTEXAI o GOOGLE_GENAI_USE_GCA."
    } > "$OUT_DIR/gemini-review.md"
    return 0
  fi

  local gemini_stdout="$OUT_DIR/gemini-stdout.txt"
  gemini -p "$(cat "$OUT_DIR/gemini-prompt.txt")" \
    --approval-mode plan --output-format text --skip-trust \
    > "$gemini_stdout" 2> "$OUT_DIR/gemini-stderr.txt" || {
      {
        echo "Gemini fallo. Revisar ${OUT_DIR}/gemini-stderr.txt"
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

run_claude
run_gemini

cat > "$OUT_DIR/CONSENSUS.md" <<EOF
# Revision tri-IA: ${SLUG}

Fecha: ${STAMP}

## Resultado rapido

- Claude: $(tail -n 20 "$OUT_DIR/claude-review.md" | rg -i "^(GO|NO-GO):" || echo "sin veredicto")
- Gemini: $(tail -n 20 "$OUT_DIR/gemini-review.md" | rg -i "^(GO|NO-GO):" || echo "sin veredicto")

## Regla de publicacion

Solo publicar/pushear si:

1. Claude no marca bloqueantes.
2. Gemini no marca bloqueantes.
3. Codex revisa ambas respuestas y coincide con el GO.

## Archivos

- claude-review.md
- gemini-review.md
- guide-excerpt.ts
- products-excerpts.ts
- diff.patch
- git-status.txt
EOF

echo "Revision guardada en: ${OUT_DIR}"
echo
cat "$OUT_DIR/CONSENSUS.md"
