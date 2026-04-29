import { NextResponse } from "next/server";
import { getTrends } from "@/lib/mercadolibre";
import { requireSecret } from "@/lib/api-auth";

export async function GET(request: Request) {
  const denied = requireSecret(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category") || undefined;

  const trends = await getTrends(categoryId);
  return NextResponse.json(trends);
}
