import { buildPins, type Pin } from "@/lib/pinterest-feed";

// Goteo para el RSS auto-publish de Pinterest. Pinterest publica TODO lo que ve
// en el feed (oldest first, hasta 200/día), así que el propio feed hace de
// compuerta: solo expone los Pins que "ya vencieron" según un calendario
// determinista. Sin base de datos ni cron: el calendario se recalcula desde
// START + el orden estable de buildPins() en cada request.
//
// Cada feed publica a UN solo tablero (config de Pinterest), por eso hay un
// feed por tablero (/pinterest-rss/[board]/feed.xml). El orden global rota
// entre tableros para que cada día toque varios y no sature uno solo.

// Día 0 del goteo. Si Juan conecta los feeds más tarde, lo vencido hasta ahí
// sale de una (por eso conviene conectar el mismo día o mover esta fecha).
const START = process.env.PINTEREST_DRIP_START || "2026-10-13";

// Pins por día EN TOTAL (suma de todos los tableros). Cuenta nueva: arranca
// bajo y sube de a poco, que es lo que pide el antispam de Pinterest.
function pinsOnDay(day: number): number {
  if (day < 7) return 3;
  if (day < 21) return 5;
  return 8;
}

export interface DripPin extends Pin {
  boardSlug: string;
  releaseAt: Date;
}

export function boardSlug(board: string): string {
  return board
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const isGuide = (pin: Pin) => pin.link.includes("/guias/");

/** Todos los Pins con su fecha de salida, en orden de publicación. */
export function buildDripSchedule(): DripPin[] {
  // Por tablero: guías primero (intención alta, duran más), después fichas.
  const byBoard = new Map<string, Pin[]>();
  for (const pin of buildPins()) {
    const list = byBoard.get(pin.board) ?? [];
    list.push(pin);
    byBoard.set(pin.board, list);
  }
  const queues = [...byBoard.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, pins]) => [...pins.filter(isGuide), ...pins.filter((p) => !isGuide(p))]);

  // Rotación entre tableros. Una misma foto no sale dos veces: Pinterest
  // fusiona/suprime Pins por imagen repetida, y el guid del feed es la imagen.
  const ordered: Pin[] = [];
  const seenMedia = new Set<string>();
  for (let i = 0; queues.some((q) => i < q.length); i++) {
    for (const q of queues) {
      if (i >= q.length || seenMedia.has(q[i].media)) continue;
      seenMedia.add(q[i].media);
      ordered.push(q[i]);
    }
  }

  const start = new Date(`${START}T00:00:00Z`).getTime();
  const DAY = 24 * 60 * 60 * 1000;
  const out: DripPin[] = [];
  let day = 0;
  let slot = 0;
  for (const pin of ordered) {
    if (slot >= pinsOnDay(day)) {
      day++;
      slot = 0;
    }
    // Salen a partir de las 09:00 UTC, separados 2 h dentro del día.
    const releaseAt = new Date(start + day * DAY + (9 + slot * 2) * 60 * 60 * 1000);
    out.push({ ...pin, boardSlug: boardSlug(pin.board), releaseAt });
    slot++;
  }
  return out;
}

/** Lo que ya venció a `now`, solo de un tablero, el más nuevo primero. */
export function releasedForBoard(slug: string, now = new Date(), limit = 50): DripPin[] {
  return buildDripSchedule()
    .filter((p) => p.boardSlug === slug && p.releaseAt.getTime() <= now.getTime())
    .reverse()
    .slice(0, limit);
}

/** Tableros con cuántos Pins tienen en total y cuántos ya salieron. */
export function dripBoards(now = new Date()) {
  const boards = new Map<string, { board: string; slug: string; total: number; released: number }>();
  for (const p of buildDripSchedule()) {
    const b = boards.get(p.boardSlug) ?? { board: p.board, slug: p.boardSlug, total: 0, released: 0 };
    b.total++;
    if (p.releaseAt.getTime() <= now.getTime()) b.released++;
    boards.set(p.boardSlug, b);
  }
  return [...boards.values()].sort((a, b) => b.total - a.total);
}
