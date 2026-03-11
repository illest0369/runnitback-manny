import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
try {
const payload = await req.json();
return NextResponse.json({ ok: true, card: payload });
} catch (err: any) {
return NextResponse.json({ ok: false, error: err?.message || "unknown_error" }, { status: 500 });
}
}
