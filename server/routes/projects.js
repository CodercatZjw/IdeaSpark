const express = require('express');
const router = express.Router();
const db = require('../db');

function parseProject(p) {
  p.team_members = JSON.parse(p.team_members || '[]');
  p.tech_stack = JSON.parse(p.tech_stack || '[]');
  p.checklist = JSON.parse(p.checklist || '[]');
  p.judging_criteria_raw = JSON.parse(p.judging_criteria_raw || '[]');
  p.prizes_targeted = JSON.parse(p.prizes_targeted || '[]');
  p.ideas = db.prepare(
    'SELECT i.* FROM ideas i JOIN project_ideas pi ON i.id = pi.idea_id WHERE pi.project_id = ?'
  ).all(p.id);
  for (const idea of p.ideas) idea.tags = JSON.parse(idea.tags || '[]');
  return p;
}

// GET /api/projects
router.get('/', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  res.json(projects.map(parseProject));
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(parseProject(p));
});

// POST /api/projects
router.post('/', (req, res) => {
  const { name, description, hackathon_name, theme, start_time, deadline, status,
    team_members, tech_stack, checklist, repo_url, figma_url, devpost_url,
    submission_url, prizes_targeted, idea_ids } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const result = db.prepare(
    `INSERT INTO projects (name, description, hackathon_name, theme, start_time, deadline, status,
     team_members, tech_stack, checklist, repo_url, figma_url, devpost_url,
     submission_url, prizes_targeted)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).run(name, description || '', hackathon_name || '', theme || '',
    start_time || null, deadline || null, status || 'planning',
    JSON.stringify(team_members || []), JSON.stringify(tech_stack || []), JSON.stringify(checklist || []),
    repo_url || '', figma_url || '', devpost_url || '', submission_url || '',
    JSON.stringify(prizes_targeted || []));

  const projectId = result.lastInsertRowid;
  if (idea_ids && idea_ids.length > 0) {
    const insert = db.prepare('INSERT INTO project_ideas (project_id, idea_id) VALUES (?, ?)');
    for (const ideaId of idea_ids) insert.run(projectId, ideaId);
  }
  res.status(201).json({ id: projectId });
});

// PUT /api/projects/:id
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const fields = ['name', 'description', 'hackathon_name', 'theme', 'deadline', 'status',
    'repo_url', 'figma_url', 'devpost_url', 'submission_url', 'submission_notes', 'presentation_url'];
  const jsonFields = ['team_members', 'tech_stack', 'checklist', 'prizes_targeted', 'judging_criteria_raw'];

  const sets = [];
  const vals = [];

  for (const f of fields) {
    if (req.body[f] !== undefined) { sets.push(`${f}=?`); vals.push(req.body[f]); }
  }
  if (req.body.start_time !== undefined) { sets.push('start_time=?'); vals.push(req.body.start_time); }
  if (req.body.submitted_at !== undefined) { sets.push('submitted_at=?'); vals.push(req.body.submitted_at); }

  for (const f of jsonFields) {
    if (req.body[f] !== undefined) { sets.push(`${f}=?`); vals.push(JSON.stringify(req.body[f])); }
  }

  if (sets.length > 0) {
    sets.push("updated_at=datetime('now','localtime')");
    vals.push(req.params.id);
    db.prepare(`UPDATE projects SET ${sets.join(', ')} WHERE id=?`).run(...vals);
  }

  if (req.body.idea_ids !== undefined) {
    db.prepare('DELETE FROM project_ideas WHERE project_id = ?').run(req.params.id);
    const insert = db.prepare('INSERT INTO project_ideas (project_id, idea_id) VALUES (?, ?)');
    for (const ideaId of req.body.idea_ids) insert.run(req.params.id, ideaId);
  }
  res.json({ ok: true });
});

// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// PUT /api/projects/:id/checklist
router.put('/:id/checklist', (req, res) => {
  const { checklist } = req.body;
  db.prepare("UPDATE projects SET checklist=?, updated_at=datetime('now','localtime') WHERE id=?")
    .run(JSON.stringify(checklist), req.params.id);
  res.json({ ok: true });
});

module.exports = router;
