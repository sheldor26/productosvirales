import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/mercadolibre";
import { requireSecret } from "@/lib/api-auth";

export async function GET(request: Request) {
  const denied = requireSecret(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const results = await searchProducts(query, limit);
  return NextResponse.json(results);
}
