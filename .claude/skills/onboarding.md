---
name: onboarding
description: Cuando Claude arranca en una computadora nueva o en una sesión donde no conoce el proyecto, esta skill lo pone al día rápido. Úsala si Juan dice "ponete al día", "qué hay en este repo", "arranquemos desde cero", "estás nuevo acá", o si la sesión arrancó sin contexto previo.
---

# Onboarding — ponerme al día con el proyecto

Aplicable cuando: Juan está en una computadora nueva, en una sesión recién abierta, o pide explícitamente "ponete al día".

Objetivo: en 5 minutos saber qué es el proyecto, qué está pasando ahora, y qué reglas no romper.

## 1. Leer en orden (sin omitir)

1. **[CLAUDE.md](../../CLAUDE.md)** — identidad + reglas de oro + qué NO hacer. Es el contrato.
2. **[AGENTS.md](../../AGENTS.md)** — aviso: Next 16 tiene breaking changes. Crítico para no escribir código viejo.
3. **[ARCHITECTURE.md](../../ARCHITECTURE.md)** — stack, decisiones técnicas, estructura.
4. **[CURRENT_STATE.md](../../CURRENT_STATE.md)** — qué hay HOY: productos, guías, pendientes, último commit relevante.
5. **[MISTAKES.md](../../MISTAKES.md)** — errores del pasado para no repetir.
6. **[LEARNINGS.md](../../LEARNINGS.md)** — patrones que funcionaron.

## 2. Chequear estado del repo

```bash
git status --short          # qué cambió sin commitear
git log -5 --oneline        # últimos 5 commits
git branch --show-current   # rama actual
```

Reportar a Juan:
- En qué rama está.
- Si hay cambios sin commitear (cuántos archivos).
- Cuándo fue el último commit.

## 3. Verificar que el proyecto corre

```bash
ls node_modules >/dev/null 2>&1 && echo "deps OK" || echo "deps faltantes — correr npm install"
```

Si `node_modules` falta, avisar a Juan antes de hacer `npm install` (es decisión suya).

## 4. Identificar el cluster activo

Buscar en `docs/clusters/*/NEXT_ARTICLES.md` qué cluster tiene artículos planeados sin publicar.
Buscar en `CURRENT_STATE.md` la sección "Próximas decisiones esperando a Juan".

Reportar:
- En qué cluster se está laburando hoy.
- Qué artículo es el próximo lógico.

## 5. Resumen para Juan

Después de los pasos 1-4, entregar este resumen en 5 líneas o menos:

```
Listo. Estado del proyecto al <fecha>:
- Rama: <branch>. <N archivos sin commitear / repo limpio>.
- Último commit: <hash + mensaje en una línea>.
- Cluster activo: <cluster>. Próximo artículo: <slug planeado>.
- Sin alertas / Hay X alertas (listarlas).
- Listo para tareas.
```

## 6. Si Juan no dice qué hacer después

Sugerir UNA acción concreta, sacada de:
- El último `## Próximas decisiones esperando a Juan` en CURRENT_STATE.md.
- El último `NEXT_ARTICLES.md` con prioridad 1.
- El último review pendiente.

No avanzar sin confirmación.

## Anti-patterns

- ❌ Saltarse CLAUDE.md "porque ya sé Next.js" — Next 16 tiene cosas distintas.
- ❌ Hacer `npm install` sin avisar.
- ❌ Tocar código antes de leer CURRENT_STATE.md.
- ❌ Asumir que la memoria del usuario (`~/.claude/projects/...`) viajó con el repo. NO viaja — solo lo que está en git es portable.
