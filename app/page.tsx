"use client";

import { useState } from "react";

type ContentCard = {
id: string;
sourceUrl: string;
caption: string;
hashtags: string[];
assetUrl?: string;
suggestedTime?: string;
status: "draft" | "approved" | "scheduled";
};

export default function Page() {
const [sourceUrl, setSourceUrl] = useState("");
const [cards, setCards] = useState<ContentCard[]>([]);
const [loading, setLoading] = useState(false);

async function fetchSource() {
if (!sourceUrl.trim()) return;
setLoading(true);
try {
const res = await fetch("/api/source/intake", {
method: "POST",
headers: { "content-type": "application/json" },
body: JSON.stringify({ sourceUrl }),
});
const data = await res.json();
if (data?.ok && data?.card) {
setCards((prev) => [data.card, ...prev]);
setSourceUrl("");
}
} finally {
setLoading(false);
}
}

async function updateCard(card: ContentCard, status?: ContentCard["status"]) {
const payload = { ...card, status: status ?? card.status };
const res = await fetch("/api/source/update", {
method: "POST",
headers: { "content-type": "application/json" },
body: JSON.stringify(payload),
});
const data = await res.json();
if (data?.ok && data?.card) {
setCards((prev) => prev.map((c) => (c.id === card.id ? data.card : c)));
}
}

return (
<main style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
<h1>RunnitBack Manny — Source Intake</h1>

<div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
<input
value={sourceUrl}
onChange={(e) => setSourceUrl(e.target.value)}
placeholder="Paste link here"
style={{ flex: 1, padding: 10 }}
/>
<button onClick={fetchSource} disabled={loading}>
{loading ? "Fetching..." : "Fetch Source"}
</button>
</div>

<div style={{ display: "grid", gap: 12 }}>
{cards.map((card) => (
<div key={card.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
<div><b>Source:</b> {card.sourceUrl}</div>
<div style={{ marginTop: 8 }}>
<label><b>Caption</b></label>
<textarea
value={card.caption}
onChange={(e) =>
setCards((prev) =>
prev.map((c) => (c.id === card.id ? { ...c, caption: e.target.value } : c))
)
}
rows={4}
style={{ width: "100%" }}
/>
</div>

<div style={{ marginTop: 8 }}>
<label><b>Hashtags (comma-separated)</b></label>
<input
value={card.hashtags.join(", ")}
onChange={(e) =>
setCards((prev) =>
prev.map((c) =>
c.id === card.id
? { ...c, hashtags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }
: c
)
)
}
style={{ width: "100%", padding: 8 }}
/>
</div>

<div style={{ marginTop: 8 }}>
<label><b>Suggested Time</b></label>
<input
type="datetime-local"
value={card.suggestedTime ? new Date(card.suggestedTime).toISOString().slice(0,16) : ""}
onChange={(e) =>
setCards((prev) =>
prev.map((c) =>
c.id === card.id ? { ...c, suggestedTime: new Date(e.target.value).toISOString() } : c
)
)
}
/>
</div>

<div style={{ marginTop: 10, display: "flex", gap: 8 }}>
<button onClick={() => updateCard(card, "draft")}>Save Draft</button>
<button onClick={() => updateCard(card, "scheduled")}>Approve & Schedule</button>
<span>Status: <b>{card.status}</b></span>
</div>
</div>
))}
</div>
</main>
);
}import { readFile } from 'fs/promises';
import path from 'path';
import CopyButton from './CopyButton';
import RefreshButton from './RefreshButton';

async function readJson(name: string, fallback: any) {
  try {
    const p = path.join(process.cwd(), 'public/data', name);
    const raw = await readFile(p, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function initials(text = '') {
  return text.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase() || 'RB';
}

export default async function Page() {
  const queue = await readJson('schedule_queue.json', { items: [] });
  const top = await readJson('top_clips.json', { selected: [] });
  const best = await readJson('best_post.json', {});
  const cycle = await readJson('last_cycle.json', {});
  const opus = await readJson('opus_outputs.json', { items: [] });

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="avatar">RB</div>
          <div>
            <h1>RunnitBack TV</h1>
            <p>Mobile Command Center</p>
          </div>
        </div>
        <div className="action-row">
          <span className="chip">{cycle?.ran_at ? new Date(cycle.ran_at).toLocaleString() : 'No cycle yet'}</span>
          <RefreshButton />
        </div>
      </header>

      <section id="home" className="hero-card" aria-label="Best post">
        <p className="eyebrow">Best Post Right Now</p>
        <h2>{best?.title || 'No best post selected'}</h2>
        <p className="hook">{best?.hook || 'Run cycle to generate hook.'}</p>
        <p className="caption">{best?.caption || 'No caption generated yet.'}</p>
        <div className="action-row">
          <CopyButton text={best?.caption || ''} label="Copy caption" />
          <CopyButton text={(best?.hashtags || []).join(' ')} label="Copy hashtags" />
        </div>
        <div className="tags-wrap">{(best?.hashtags || []).map((h: string, i: number) => <span key={i} className="tag">{h}</span>)}</div>
      </section>

      <section id="queue" className="panel" aria-label="Queue">
        <div className="panel-head">
          <h3>Today Queue</h3>
          <span>{(queue?.items || []).length} items</span>
        </div>
        <div className="stack">
          {(queue?.items || []).map((item: any, i: number) => (
            <article key={i} className="queue-item">
              <div className="row">
                <span className="slot">{item.slot}</span>
                <span className="league">{item.league}</span>
                <span className="status">{item.status}</span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.caption_template}</p>
              <p className="hashtags">{(item.hashtags || []).join(' ')}</p>
              <div className="action-row">
                <CopyButton text={item.caption_template || ''} label="Copy caption" />
                <CopyButton text={(item.hashtags || []).join(' ')} label="Copy hashtags" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="clips" className="panel" aria-label="Top clips">
        <div className="panel-head">
          <h3>Top Clip Candidates</h3>
          <span>{(top?.selected || []).length} clips</span>
        </div>
        <div className="stack">
          {(top?.selected || []).map((clip: any, i: number) => (
            <article key={i} className="clip-item">
              <div className="clip-icon">{initials(clip.league)}</div>
              <div>
                <h4>{clip.title}</h4>
                <p>{clip.reason}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" aria-label="Opus previews">
        <div className="panel-head">
          <h3>Opus Top 3 Preview</h3>
          <span>{(opus?.items || []).length} loaded</span>
        </div>
        <div className="stack">
          {(opus?.items || []).length === 0 ? (
            <article className="queue-item"><p>No playable previews yet. Run a fresh production cycle, then sync data.</p></article>
          ) : (opus?.items || []).map((v: any, i: number) => (
            <article key={i} className="queue-item">
              <div className="row">
                <span className="slot">{v.id}</span>
                <span className="league">{v.league}</span>
                <span className="status">{v.status}</span>
              </div>
              <h4>{v.title}</h4>
              <p>{v.reason}</p>
              <video className="video-preview" controls preload="metadata" src={v.preview_url} playsInline />
              <div className="action-row">
                <a className="copy-btn" href={`https://t.me/mal3000bot?start=approve_final_${v.id}_phone_app`}>Approve this clip</a>
                <CopyButton text={`approve_final_${v.id}_phone_app`} label="Copy command" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="publish" className="panel" aria-label="Approval action">
        <div className="panel-head">
          <h3>Final Approval</h3>
          <span>Single-button flow</span>
        </div>
        <p>Tap once to save latest approved final MP4 to Photos app.</p>
        <div className="action-row">
          <a className="copy-btn" href="https://t.me/mal3000bot?start=approve_final_phone_app">Approve & Save Final MP4</a>
          <CopyButton text="approve_final_phone_app" label="Copy command" />
        </div>
      </section>

      <nav className="tabbar" aria-label="Primary">
        <a className="tab active" href="#home">Home</a>
        <a className="tab" href="#queue">Queue</a>
        <a className="tab" href="#clips">Clips</a>
        <a className="tab" href="#publish">Publish</a>
      </nav>
    </main>
  );
}
