/** Copia `text` al portapapeles. Intenta la Clipboard API moderna primero;
 * si no existe (contexto no seguro, algunos WebView de apps como Instagram/
 * TikTok) o falla (permiso denegado), cae al viejo `document.execCommand`
 * con un `<textarea>` descartable — sigue funcionando en más casos en vez
 * de fallar en silencio. Devuelve `true` solo si alguno de los dos caminos
 * realmente copió. */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Sigue al fallback de abajo en vez de devolver false acá.
    }
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
