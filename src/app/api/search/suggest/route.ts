import { NextResponse } from "next/server";
import { getVisibleProducts, toFeedCard } from "@/lib/products";
import { normalizeSearch, fuzzyWordMatch } from "@/lib/utils";

const SUGGESTION_LIMIT = 6;

// Autocomplete público del header: mismo matcheo exacto-con-fallback-a-fuzzy
// que ya usa HomeFeed sobre `?q=`, para que tipear en el buscador y ver
// sugerencias no encuentre algo distinto de lo que después muestra el submit.
// Sin secret (a diferencia de /api/search): es el mismo catálogo que ya va
// en el HTML público, no datos sensibles.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  if (query.length < 2) return NextResponse.json([]);

  const words = normalizeSearch(query).split(/\s+/);
  const cards = getVisibleProducts().map(toFeedCard);

  const exact = cards.filter((p) => words.every((word) => p.search.includes(word)));
  const matches =
    exact.length > 0
      ? exact
      : cards.filter((p) => {
          const haystackWords = p.search.split(/\s+/);
          return words.every((word) => fuzzyWordMatch(word, haystackWords));
        });

  const suggestions = matches.slice(0, SUGGESTION_LIMIT).map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.image,
    category: p.category,
  }));

  return NextResponse.json(suggestions);
}
