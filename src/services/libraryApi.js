// gibberish

const LIBRARY_API_BASE = "/api/library"; // <- change to our real API base

export async function fetchLibraryItems() {
  const res = await fetch(LIBRARY_API_BASE);
  if (!res.ok) throw new Error("Failed to fetch library items");
  return res.json();
}

export async function fetchLibraryItemById(id) {
  const res = await fetch(`${LIBRARY_API_BASE}/${encodeURIComponent(id)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch library item");
  }
  return res.json();
}
