import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const resp = await client.responses.create({
model: "gpt-4.1-mini",
input: prompt || "Say hello from Runnit Back.",
});

return NextResponse.json({ ok: true, text: resp.output_text });
} catch (err: any) {
return NextResponse.json(
{ ok: false, error: err?.message || "unknown_error" },
{ status: 500 }
);
}
}
