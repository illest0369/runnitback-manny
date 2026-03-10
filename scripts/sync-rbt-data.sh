#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/RBT_Core/state"
DST="$ROOT/runnitback-mobile/public/data"
PREV="$ROOT/runnitback-mobile/public/previews"

mkdir -p "$DST" "$PREV"

cp "$SRC/schedule_queue.json" "$DST/schedule_queue.json"
cp "$SRC/top_clips.json" "$DST/top_clips.json"
cp "$SRC/caption_pack.json" "$DST/caption_pack.json"
cp "$SRC/hashtags_pack.json" "$DST/hashtags_pack.json"
cp "$SRC/best_post.json" "$DST/best_post.json"
cp "$SRC/last_cycle.json" "$DST/last_cycle.json"
cp "$SRC/opus_outputs.json" "$DST/opus_outputs.raw.json" 2>/dev/null || true

python3 - <<'PY'
import json, pathlib, shutil
root = pathlib.Path('/Users/malyhernandez/.openclaw/workspace')
dst = root / 'runnitback-mobile' / 'public' / 'data'
prev = root / 'runnitback-mobile' / 'public' / 'previews'
raw = dst / 'opus_outputs.raw.json'
out = dst / 'opus_outputs.json'

if not raw.exists():
    out.write_text(json.dumps({'generated_at': None, 'source': 'sync', 'items': []}, indent=2) + '\n')
    raise SystemExit

data = json.loads(raw.read_text())
items = []
for i, item in enumerate(data.get('items', []), start=1):
    p = pathlib.Path(item.get('local_path', ''))
    if not p.exists() or p.suffix.lower() != '.mp4':
        continue
    if p.name.startswith('_') or any(x in p.name.lower() for x in ['tmp', 'caption', 'anim']):
        continue
    target = prev / f'opus_{i}.mp4'
    shutil.copy2(p, target)
    new_item = dict(item)
    new_item['preview_url'] = f'/previews/{target.name}'
    new_item['local_path'] = str(p)
    items.append(new_item)

payload = {
    'generated_at': data.get('generated_at'),
    'source': data.get('source', 'sync'),
    'items': items
}
out.write_text(json.dumps(payload, indent=2) + '\n')
PY

echo "RBT mobile data synced."
