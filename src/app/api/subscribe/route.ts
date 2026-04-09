import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  // TODO: Store in database (Vercel KV, Supabase, etc.)
  console.log("New subscriber:", email);

  return NextResponse.json({ success: true, message: "Suscripción exitosa" });
}
