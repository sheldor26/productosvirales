# Dos sesiones de Claude sobre el mismo repo

## Qué pasó el 2026-08-15

Dos sesiones trabajaban al mismo tiempo sobre el mismo working copy y la misma rama `master`:
una escribiendo guías del silo hogar-jardin, otra publicando historias de Instagram.

Consecuencias reales, todas verificadas ese día:

- **La sesión de social corrió `git push` a las 19:23** y se llevó a producción cuatro commits
  de la sesión de contenido que todavía no estaban aprobados para publicar. El push empuja la
  rama entera, no solo lo que esa sesión commiteó.
- **La sesión de contenido corrió `git stash` y `git stash pop`** para un test de build. Durante
  esos segundos, cualquier cambio sin commitear de la otra sesión habría quedado guardado y
  devuelto sin que ninguna se enterara. Hay tres stashes viejos colgados (julio y agosto) que
  probablemente sean restos de choques parecidos.
- **Los `git add -A` de una sesión pueden barrer archivos** que la otra está editando, y meterlos
  en un commit con un mensaje que no tiene nada que ver.

No hay ningún hook culpable. Se revisaron `.git/hooks` (solo los `.sample`), `core.hooksPath`,
alias de git, `crontab`, launchd y el Stop hook `finalize-session.sh` (solo pide actualizar
documentación, no pushea). La causa es simplemente **compartir árbol y rama**.

## La regla

- **En `master`, en el árbol principal, trabaja UNA SOLA sesión.** Por default, la de social:
  publica al toque y necesita pushear para que el sitio se actualice. Si es la única en master,
  su push no puede llevarse trabajo ajeno.
- **Toda sesión de contenido** (guías, fichas, silos, refactors) trabaja en **su propio worktree
  y su propia rama**. Nadie le pushea el trabajo por accidente, y publicar pasa a ser un merge
  explícito.

## Cómo se crea

```bash
./scripts/nueva-sesion.sh silo-bazar
```

Crea `../pv-sesiones/silo-bazar` en la rama `sesion/silo-bazar`, saliendo de `master`.

Los worktrees van **afuera del repo** a propósito: adentro, Next.js y tsc los escanean. Los siete
que dejó el harness en `.claude/worktrees/` pesaban 3,2 GB dentro del proyecto.

## Los dos gotchas que costaron encontrar

1. **`node_modules` no se puede enlazar con symlink.** Turbopack (Next 16) lo rechaza:
   `Symlink [project]/node_modules is invalid, it points out of the filesystem root`. El script lo
   **clona con `cp -Rc`**, que en APFS es copy-on-write: tarda unos 4 segundos, comparte bloques con
   el original y solo ocupa disco de verdad cuando algo se modifica. Con symlink, `tsc` y los checks
   pasan igual y el que falla es el build, así que el problema aparece tarde.
2. **`.env` sí se enlaza.** Es un archivo suelto que el bundler no toca, y así hay una sola fuente
   de verdad para las credenciales. Sin él, los scripts de social fallan, porque hacen `source .env`.

## Publicar desde un worktree

```bash
cd "/Users/juan/Proyectos web/productosvirales"
git merge sesion/silo-bazar
git push
```

## Limpiar cuando termina

```bash
git -C "/Users/juan/Proyectos web/productosvirales" worktree remove "/Users/juan/Proyectos web/pv-sesiones/silo-bazar"
git -C "/Users/juan/Proyectos web/productosvirales" branch -d sesion/silo-bazar
```
