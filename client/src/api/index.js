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

// --- Projects ---

export async function fetchProjects() {
  const res = await fetch(`${BASE}/projects`);
  return res.json();
}

export async function fetchProject(id) {
  const res = await fetch(`${BASE}/projects/${id}`);
  return res.json();
}

export async function createProject(data) {
  const res = await fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProject(id, data) {
  await fetch(`${BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id) {
  await fetch(`${BASE}/projects/${id}`, { method: 'DELETE' });
}

export async function updateChecklist(id, checklist) {
  await fetch(`${BASE}/projects/${id}/checklist`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checklist }),
  });
}

// --- Graph ---

export async function fetchGraph() {
  const res = await fetch(`${BASE}/graph`);
  return res.json();
}

// --- Scores ---
export async function fetchScores() {
  const res = await fetch(`${BASE}/scores`);
  return res.json();
}

export async function fetchScore(ideaId) {
  const res = await fetch(`${BASE}/scores/${ideaId}`);
  return res.json();
}

export async function saveScore(ideaId, data) {
  await fetch(`${BASE}/scores/${ideaId}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
}

// --- Standups ---
export async function fetchStandups(projectId) {
  const res = await fetch(`${BASE}/standups/${projectId}`);
  return res.json();
}

export async function createStandup(projectId, data) {
  const res = await fetch(`${BASE}/standups/${projectId}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteStandup(projectId, id) {
  await fetch(`${BASE}/standups/${projectId}/${id}`, { method: 'DELETE' });
}

// --- Blockers ---
export async function fetchBlockers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/blockers?${qs}`);
  return res.json();
}

export async function createBlocker(data) {
  const res = await fetch(`${BASE}/blockers`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBlocker(id, data) {
  await fetch(`${BASE}/blockers/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
}

export async function deleteBlocker(id) {
  await fetch(`${BASE}/blockers/${id}`, { method: 'DELETE' });
}

// --- Snippets ---
export async function fetchSnippets(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/snippets?${qs}`);
  return res.json();
}

export async function createSnippet(data) {
  const res = await fetch(`${BASE}/snippets`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateSnippet(id, data) {
  await fetch(`${BASE}/snippets/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
}

export async function deleteSnippet(id) {
  await fetch(`${BASE}/snippets/${id}`, { method: 'DELETE' });
}

// --- API Tools ---
export async function fetchApiTools(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/api-tools?${qs}`);
  return res.json();
}

export async function createApiTool(data) {
  const res = await fetch(`${BASE}/api-tools`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}

// --- Tech Stacks ---
export async function fetchTechStacks() {
  const res = await fetch(`${BASE}/tech-stacks`);
  return res.json();
}

export async function createTechStack(data) {
  const res = await fetch(`${BASE}/tech-stacks`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}

// --- Challenges ---
export async function fetchRandomChallenge() {
  const res = await fetch(`${BASE}/more/challenges/random`);
  return res.json();
}

export async function fetchChallenges() {
  const res = await fetch(`${BASE}/more/challenges`);
  return res.json();
}

// --- Templates ---
export async function fetchTemplates() {
  const res = await fetch(`${BASE}/more/templates`);
  return res.json();
}

// --- Daily Word ---
export async function fetchDailyWord() {
  const res = await fetch(`${BASE}/more/daily-word`);
  return res.json();
}

// --- Streak ---
export async function fetchStreak() {
  const res = await fetch(`${BASE}/more/streak`);
  return res.json();
}

export async function checkin() {
  const res = await fetch(`${BASE}/more/streak/checkin`, { method: 'POST' });
  return res.json();
}

// --- Share ---
export function generateShareToken(type, id) {
  return btoa(JSON.stringify({ type, id }));
}

// --- Competitors ---
export async function fetchCompetitors(projectId) {
  const res = await fetch(`${BASE}/more/competitors/${projectId}`);
  return res.json();
}

export async function createCompetitor(projectId, data) {
  const res = await fetch(`${BASE}/more/competitors/${projectId}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCompetitor(projectId, id) {
  await fetch(`${BASE}/more/competitors/${projectId}/${id}`, { method: 'DELETE' });
}

// --- Pitches ---
export async function fetchPitches(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/more/pitches?${qs}`);
  return res.json();
}

export async function createPitch(data) {
  const res = await fetch(`${BASE}/more/pitches`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}

// --- Idea History ---
export async function fetchIdeaHistory(ideaId) {
  const res = await fetch(`${BASE}/more/ideas/${ideaId}/history`);
  return res.json();
}

// --- Export ---
export function exportMarkdown(type, data) {
  if (type === 'idea') return `# ${data.title}\n\n**日期:** ${data.date}\n**标签:** ${(data.tags || []).join(', ')}\n\n${data.content}`;
  if (type === 'project') {
    let md = `# ${data.name}\n\n**状态:** ${data.status}\n**截止:** ${data.deadline || '未设'}\n\n${data.description || ''}\n\n## 队员\n\n${(data.team_members||[]).map(m=>`- ${m}`).join('\n')}\n\n## 技术栈\n\n${(data.tech_stack||[]).map(t=>`- ${t}`).join('\n')}\n\n## 待办\n\n${(data.checklist||[]).map(c=>`- [${c.done?'x':' '}] ${c.text}`).join('\n')}`;
    return md;
  }
  return '';
}
