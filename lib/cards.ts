import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "cards.json");

export type Card = {
  id: string;
  sourceUrl: string;
  caption: string;
  hashtags: string[];
  assetUrl?: string;
  suggestedTime?: string;
  status: "draft" | "approved" | "scheduled";
  createdAt: string;
  updatedAt: string;
};

async function ensureDb() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  try { await fs.access(DB_PATH); }
  catch { await fs.writeFile(DB_PATH, JSON.stringify({ cards: [] }, null, 2)); }
}

export async function getCards(): Promise<Card[]> {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw).cards || [];
}

export async function saveCards(cards: Card[]) {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify({ cards }, null, 2));
}
