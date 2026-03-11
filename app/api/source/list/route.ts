import { NextResponse } from "next/server";
import { getCards } from "@/lib/cards";

export const runtime = "nodejs";

export async function GET() {
  const cards = await getCards();
  return NextResponse.json({ ok: true, cards });
}
