import { NextResponse } from "next/server";
import { getCards, saveCards } from "@/lib/cards";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const cards = await getCards();
    const idx = cards.findIndex((c) => c.id === payload.id);
    if (idx < 0) return NextResponse.json({ ok: false, error: "card_not_found" }, { status: 404 });

    const updated = {
      ...cards[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    cards[idx] = updated;
    await saveCards(cards);

    return NextResponse.json({ ok: true, card: updated });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown_error" }, { status: 500 });
  }
}
