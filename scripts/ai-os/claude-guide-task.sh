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
BRIEF_FILE="${2:-}"

if [[ -z "$SLUG" || -z "$BRIEF_FILE" ]]; then
  echo "Uso: scripts/ai-os/claude-guide-task.sh <slug-o-nuevo-slug> <brief.md>" >&2
  exit 2
fi

if [[ ! -f "$BRIEF_FILE" ]]; then
  echo "No existe el brief: ${BRIEF_FILE}" >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "Claude CLI no instalado." >&2
  exit 1
fi

STAMP="$(date +%Y-%m-%d-%H%M%S)"
OUT_DIR="docs/ai/claude-tasks/${STAMP}-${SLUG}"
mkdir -p "$OUT_DIR"

cat > "$OUT_DIR/prompt.txt" <<PROMPT
Actua como Claude/Kogod, cerebro principal, redactor e implementador de ProductosVirales.

Tarea: escribir u optimizar la guia '${SLUG}' segun el brief adjunto.

Brief:
$(cat "$BRIEF_FILE")

Reglas obligatorias:
- Leer y respetar docs/guias.md, docs/fichas.md, docs/ARTICLE_CREATION_WORKFLOW.md y la voz del proyecto.
- No inventar specs, precios, ratings, stock, marcas ni datos de manuales. Si un dato no esta sustentado, aclararlo u omitirlo.
- Usar tokens de precio {{precio:MLA...}} y {{preciodif:A:B}}; no tipear precios absolutos en prosa si hay ficha.
- Mantener enlaces internos a guias/fichas relevantes y enlaces afiliados donde corresponde.
- Cuidar multimedia: hero, alt text, imagenes de manuales/listings, OG/Pinterest y assets visuales.
- No tocar cambios ajenos fuera del alcance de esta guia.
- Al terminar, dejar un resumen de archivos modificados, riesgos y verificaciones corridas.

Podés editar archivos. Si hay una duda bloqueante, detenete y explicala.
PROMPT

claude -p --output-format text --permission-mode auto \
  --allowedTools "Read,Grep,Glob,Edit,MultiEdit,Write,Bash(rg *),Bash(sed *),Bash(git diff *),Bash(git status *),Bash(npm run build),Bash(npm run lint),Bash(npm run guides:check)" \
  < "$OUT_DIR/prompt.txt" > "$OUT_DIR/claude-output.md" 2> "$OUT_DIR/claude-stderr.txt" || {
    echo "Claude fallo. Revisar ${OUT_DIR}/claude-output.md y ${OUT_DIR}/claude-stderr.txt" >&2
    exit 1
  }

echo "Tarea Claude guardada en: ${OUT_DIR}"
echo
cat "$OUT_DIR/claude-output.md"
