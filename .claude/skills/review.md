---
name: review
description: Análisis semanal de auto-mejora. Mira lo que pasó esta semana en el repo y propone mejoras. Úsala cuando Juan pida un review semanal o cuando empiece una sesión fresca después de varios días.
---

# Review semanal

Objetivo: cada 7 días, mirar qué pasó y proponer 2-3 cosas concretas para mejorar la próxima semana. Sin alarmismo, sin to-do lists infinitas.

## 1. Recolectar evidencia

```bash
git log --since="7 days ago" --oneline
git diff --stat HEAD~10
```

Leer también:

- [CURRENT_STATE.md](../../CURRENT_STATE.md) — qué pendientes quedaron.
- [MISTAKES.md](../../MISTAKES.md) — qué falló esta semana.
- [LEARNINGS.md](../../LEARNINGS.md) — qué funcionó.
- `docs/clusters/*/NEXT_ARTICLES.md` (si existen) — qué contenido está prometido.

## 2. Responder 5 preguntas

1. **¿Qué se publicó / cambió esta semana?** (commits, guías nuevas, productos nuevos)
2. **¿Qué pendiente sigue pendiente desde hace más de una semana?** Identificar el cuello de botella.
3. **¿Hubo errores repetidos?** Si un mismo tipo de error aparece dos veces en `MISTAKES.md` → patrón, no incidente.
4. **¿Hay deuda técnica empezando a doler?** Ej: convenciones mixtas, imports rotos, links internos a guías que no existen, precios `stale` acumulándose.
5. **¿Hay contenido que ya generó tráfico y se podría amplificar?** (productos en `featured`, guías con muchos enlaces internos apuntándolas).

## 3. Chequeos automáticos a ejecutar

```bash
# Tipos + lint
npm run lint
npm run build

# Precios viejos
grep -c 'priceStatus: "stale"' src/data/curated-products.ts
grep -c 'priceStatus: "out_of_stock"' src/data/curated-products.ts

# Guías sin actualizar hace mucho
# (revisar updatedDate más viejas de 90 días)

# Links internos rotos: buscar /guias/ en sections y validar contra slugs existentes
```

## 4. Output del review

Entregar a Juan en este formato (corto, en lenguaje simple):

```markdown
## Review semanal — YYYY-MM-DD

### Lo que pasó
- ...

### Lo que está atascado
- ...

### Top 3 sugerencias para la próxima semana
1. ...
2. ...
3. ...

### Salud del proyecto
- Build: ✅ / ⚠️
- Precios stale: N de 170
- Guías con links internos rotos: N
- Pendientes >7 días: N
```

## 5. Actualizar archivos al final

- Si el review revela un patrón nuevo de error → entrada en [MISTAKES.md](../../MISTAKES.md).
- Si revela un patrón de éxito → entrada en [LEARNINGS.md](../../LEARNINGS.md).
- Actualizar [CURRENT_STATE.md](../../CURRENT_STATE.md) con el estado fresco.

## Regla de oro del review

Si el output del review es más largo que lo que Juan va a leer en 3 minutos, está mal. Recortar.
