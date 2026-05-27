#!/usr/bin/env bash
# Stop hook: al cerrar una sesión, pide a Claude actualizar CURRENT_STATE.md y LEARNINGS.md
# antes de soltar el control. Solo bloquea una vez por session_id (evita loop infinito).

set -euo pipefail

input="$(cat)"
session_id="$(printf '%s' "$input" | sed -n 's/.*"session_id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
stop_active="$(printf '%s' "$input" | sed -n 's/.*"stop_hook_active"[[:space:]]*:[[:space:]]*\(true\|false\).*/\1/p')"

# Si Claude ya está respondiendo al bloqueo previo, no volver a bloquear.
if [ "${stop_active:-false}" = "true" ]; then
  exit 0
fi

flag_dir=".claude/.session-state"
mkdir -p "$flag_dir"
flag_file="$flag_dir/last-finalized"

if [ -f "$flag_file" ] && [ "$(cat "$flag_file" 2>/dev/null)" = "$session_id" ]; then
  exit 0
fi

printf '%s' "$session_id" > "$flag_file"

cat <<'JSON'
{
  "decision": "block",
  "reason": "Antes de cerrar la sesión, hacé estos pasos en este orden:\n\n1) APPENDEÁ UNA ENTRADA NUEVA ARRIBA en SESSION_LOG.md con la fecha de hoy y un resumen de qué se hizo en esta sesión (seguir la plantilla del archivo). Esto es el log histórico — siempre suma, nunca borra.\n\n2) ACTUALIZÁ CURRENT_STATE.md para que refleje el estado actual del proyecto (productos, guías, pendientes). Esto es un snapshot vivo — se sobrescribe.\n\n3) Si algo salió mal o fue confuso, agregá una entrada arriba en MISTAKES.md (formato: fecha — qué pasó — por qué — cómo evitarlo).\n\n4) Si algo funcionó muy bien y vale la pena repetir, agregá una entrada arriba en LEARNINGS.md.\n\nSi no hubo cambios relevantes, decilo en SESSION_LOG.md igual (1 línea: 'sin cambios') y terminá. No vuelvas a explorar el repo si ya cumpliste."
}
JSON
