"use client";

import { useEffect, useState } from "react";

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

useEffect(() => {
(async () => {
try {
const res = await fetch("/api/source/list");
const data = await res.json();
if (data?.ok && Array.isArray(data.cards)) setCards(data.cards);
} catch {}
})();
}, []);

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
value={card.suggestedTime ? new Date(card.suggestedTime).toISOString().slice(0, 16) : ""}
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
}"use client";

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
value={card.suggestedTime ? new Date(card.suggestedTime).toISOString().slice(0, 16) : ""}
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
}
