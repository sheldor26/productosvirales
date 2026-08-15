#!/usr/bin/env bash
# Crea un worktree aislado para una sesión de Claude que vaya a trabajar en contenido.
#
# POR QUÉ EXISTE
# El 2026-08-15 dos sesiones de Claude estaban trabajando al mismo tiempo sobre el mismo
# working copy y la misma rama master. Consecuencias reales de ese día:
#   - La sesión de social corrió `git push` y se llevó a producción cuatro commits de la
#     otra sesión que todavía no estaban aprobados para publicar.
#   - La sesión de contenido corrió `git stash` para un test y, durante esos segundos,
#     cualquier cambio sin commitear de la otra sesión habría quedado guardado sin aviso.
#   - Los `git add -A` de una sesión pueden barrer archivos que estaba editando la otra.
#
# LA REGLA QUE SALE DE ESO
#   - En master, en el árbol principal, trabaja UNA SOLA sesión: la de social, que publica
#     al toque y necesita pushear para que el sitio se actualice.
#   - Toda sesión de contenido (guías, fichas, silos, refactors) trabaja en su propio
#     worktree y su propia rama, creada con este script. Nadie le pushea su trabajo por
#     accidente, y publicar pasa a ser un merge explícito.
#
# USO
#   ./scripts/nueva-sesion.sh estanteria-flotante
#   ./scripts/nueva-sesion.sh silo-bazar
#
# Al terminar el trabajo, desde el worktree:
#   git push -u origin sesion/<nombre>     # opcional, para respaldarlo
# Y para publicar, desde el árbol principal:
#   git merge sesion/<nombre> && git push

set -euo pipefail

NOMBRE="${1:-}"
if [ -z "$NOMBRE" ]; then
  echo "Uso: ./scripts/nueva-sesion.sh <nombre-corto>" >&2
  echo "Ejemplo: ./scripts/nueva-sesion.sh silo-bazar" >&2
  exit 1
fi

# Normaliza: minúsculas, espacios y guiones bajos a guiones.
NOMBRE="$(printf '%s' "$NOMBRE" | tr '[:upper:] _' '[:lower:]--' | tr -cd 'a-z0-9-')"

PRINCIPAL="$(git rev-parse --show-toplevel)"
# Los worktrees van AFUERA del repo a propósito: adentro, Next.js y tsc los escanean y
# el build se vuelve lento y confuso (los 7 worktrees que dejó el harness en
# .claude/worktrees/ pesaban 3,2 GB adentro del proyecto).
BASE="$(dirname "$PRINCIPAL")/pv-sesiones"
DESTINO="$BASE/$NOMBRE"
RAMA="sesion/$NOMBRE"

if [ -e "$DESTINO" ]; then
  echo "Ya existe $DESTINO" >&2
  echo "Entrá ahí, o borralo con: git worktree remove \"$DESTINO\"" >&2
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/$RAMA"; then
  echo "Ya existe la rama $RAMA. Elegí otro nombre o borrala primero." >&2
  exit 1
fi

mkdir -p "$BASE"

echo "→ Creando worktree en $DESTINO (rama $RAMA, desde master)"
git -C "$PRINCIPAL" worktree add -b "$RAMA" "$DESTINO" master

# node_modules NO se puede enlazar con symlink: Turbopack (Next 16) lo rechaza con
# "Symlink [project]/node_modules is invalid, it points out of the filesystem root".
# Se clona con `cp -Rc`, que en APFS es copy-on-write: tarda ~4 segundos, comparte los
# bloques con el original y solo ocupa disco de verdad cuando algo se modifica.
# Si el disco no fuera APFS, cae a una copia con hardlinks (`cp -Rl`) y, en última
# instancia, a una copia común.
if [ -d "$PRINCIPAL/node_modules" ]; then
  echo "  clonando node_modules (copy-on-write)..."
  if cp -Rc "$PRINCIPAL/node_modules" "$DESTINO/node_modules" 2>/dev/null; then
    echo "  node_modules: clon APFS"
  elif cp -Rl "$PRINCIPAL/node_modules" "$DESTINO/node_modules" 2>/dev/null; then
    echo "  node_modules: copia con hardlinks"
  else
    cp -R "$PRINCIPAL/node_modules" "$DESTINO/node_modules"
    echo "  node_modules: copia completa (ocupa disco de verdad)"
  fi
else
  echo "  OJO: no hay node_modules en el árbol principal. Corré 'npm install' en el worktree."
fi

# Estos sí se enlazan: son archivos sueltos, no los toca el bundler, y así hay una sola
# fuente de verdad para las credenciales.
for enlace in .env .claude/settings.local.json; do
  origen="$PRINCIPAL/$enlace"
  if [ -e "$origen" ]; then
    mkdir -p "$(dirname "$DESTINO/$enlace")"
    ln -s "$origen" "$DESTINO/$enlace"
    echo "  enlazado: $enlace"
  else
    echo "  OJO: no existe $enlace en el árbol principal, no se enlazó"
  fi
done

cat <<FIN

Listo. La sesión nueva trabaja acá:

  cd "$DESTINO"

Queda en la rama $RAMA, aislada de master. Nada de lo que commitees ahí sale a
producción hasta que lo mergees a mano.

Para publicar cuando esté aprobado, desde el árbol principal:

  cd "$PRINCIPAL"
  git merge $RAMA
  git push

Para borrar el worktree cuando termines:

  git -C "$PRINCIPAL" worktree remove "$DESTINO"
  git -C "$PRINCIPAL" branch -d $RAMA

FIN
