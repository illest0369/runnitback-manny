'use client';

export default function RefreshButton() {
  return (
    <button className="copy-btn" onClick={() => window.location.reload()} aria-label="Refresh data">
      Refresh data
    </button>
  );
}
