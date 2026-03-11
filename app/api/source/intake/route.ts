import { NextResponse } from "next/server";
import { getCards, saveCards, type Card } from "@/lib/cards";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { sourceUrl } = await req.json();
    if (!sourceUrl || typeof sourceUrl !== "string") {
      return NextResponse.json({ ok: false, error: "sourceUrl required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const card: Card = {
      id: crypto.randomUUID(),
      sourceUrl,
      caption: "Draft caption from source",
      hashtags: ["#runnitback", "#nfl", "#sports"],
      assetUrl: "",
      suggestedTime: new Date(Date.now() + 3600_000).toISOString(),
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };

    const cards = await getCards();
    cards.unshift(card);
    await saveCards(cards);

    return NextResponse.json({ ok: true, card });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown_error" }, { status: 500 });
  }
}
