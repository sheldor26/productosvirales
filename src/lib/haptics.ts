/** Vibración corta (progressive enhancement, nunca crítica): en mobile web no
 * existe el tap-highlight táctil de una app nativa, así que el único aviso
 * de que un toque "registró" es visual. Chrome/Android la soporta; Safari y
 * Firefox Android reciente no — en esos casos `navigator.vibrate` ni
 * siquiera existe, así que no hace nada, no rompe nada. */
export function hapticTap() {
  try {
    navigator.vibrate?.(15);
  } catch {
    // Algún navegador puede tirar en contextos raros (iframe de terceros,
    // permisos); nunca debe afectar la acción real que dispara el toque.
  }
}
