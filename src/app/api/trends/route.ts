import { NextResponse } from "next/server";
import { getTrends } from "@/lib/mercadolibre";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category") || undefined;

  const trends = await getTrends(categoryId);
  return NextResponse.json(trends);
}
