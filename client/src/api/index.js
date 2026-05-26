const BASE = '/api';

export async function fetchIdeas(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/ideas?${qs}`);
  return res.json();
}

export async function fetchIdea(id) {
  const res = await fetch(`${BASE}/ideas/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

export async function createIdea(data) {
  const res = await fetch(`${BASE}/ideas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateIdea(id, data) {
  await fetch(`${BASE}/ideas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteIdea(id) {
  await fetch(`${BASE}/ideas/${id}`, { method: 'DELETE' });
}

export async function fetchCalendar() {
  const res = await fetch(`${BASE}/ideas/calendar`);
  return res.json();
}

export async function fetchRandomInspiration() {
  const res = await fetch(`${BASE}/inspiration/random`);
  return res.json();
}

export async function fetchInspirations(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/inspiration?${qs}`);
  return res.json();
}

export async function addInspiration(data) {
  const res = await fetch(`${BASE}/inspiration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
