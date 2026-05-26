const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/projects
router.get('/', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  for (const p of projects) {
    p.team_members = JSON.parse(p.team_members);
    p.tech_stack = JSON.parse(p.tech_stack);
    p.checklist = JSON.parse(p.checklist);
    p.ideas = db.prepare(
      'SELECT i.* FROM ideas i JOIN project_ideas pi ON i.id = pi.idea_id WHERE pi.project_id = ?'
    ).all(p.id);
    for (const idea of p.ideas) idea.tags = JSON.parse(idea.tags);
  }
  res.json(projects);
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  p.team_members = JSON.parse(p.team_members);
  p.tech_stack = JSON.parse(p.tech_stack);
  p.checklist = JSON.parse(p.checklist);
  p.ideas = db.prepare(
    'SELECT i.* FROM ideas i JOIN project_ideas pi ON i.id = pi.idea_id WHERE pi.project_id = ?'
  ).all(p.id);
  for (const idea of p.ideas) idea.tags = JSON.parse(idea.tags);
  res.json(p);
});

// POST /api/projects
router.post('/', (req, res) => {
  const { name, description, deadline, status, team_members, tech_stack, checklist, idea_ids } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const result = db.prepare(
    `INSERT INTO projects (name, description, deadline, status, team_members, tech_stack, checklist)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(name, description || '', deadline || null, status || 'planning',
    JSON.stringify(team_members || []), JSON.stringify(tech_stack || []), JSON.stringify(checklist || []));

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

  const { name, description, deadline, status, team_members, tech_stack, checklist, idea_ids } = req.body;
  db.prepare(
    `UPDATE projects SET name=?, description=?, deadline=?, status=?, team_members=?, tech_stack=?, checklist=?,
     updated_at=datetime('now','localtime') WHERE id=?`
  ).run(
    name ?? existing.name, description ?? existing.description,
    deadline !== undefined ? deadline : existing.deadline,
    status ?? existing.status,
    team_members ? JSON.stringify(team_members) : existing.team_members,
    tech_stack ? JSON.stringify(tech_stack) : existing.tech_stack,
    checklist ? JSON.stringify(checklist) : existing.checklist,
    req.params.id
  );

  if (idea_ids !== undefined) {
    db.prepare('DELETE FROM project_ideas WHERE project_id = ?').run(req.params.id);
    const insert = db.prepare('INSERT INTO project_ideas (project_id, idea_id) VALUES (?, ?)');
    for (const ideaId of idea_ids) insert.run(req.params.id, ideaId);
  }
  res.json({ ok: true });
});

// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/projects/:id/checklist
router.put('/:id/checklist', (req, res) => {
  const { checklist } = req.body;
  db.prepare('UPDATE projects SET checklist=?, updated_at=datetime(\'now\',\'localtime\') WHERE id=?')
    .run(JSON.stringify(checklist), req.params.id);
  res.json({ ok: true });
});

module.exports = router;
