const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/ideas?date=&search=&tag=
router.get('/', (req, res) => {
  const { date, search, tag } = req.query;
  let sql = 'SELECT * FROM ideas WHERE 1=1';
  const params = [];

  if (date) { sql += ' AND date = ?'; params.push(date); }
  if (search) { sql += ' AND (title LIKE ? OR content LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (tag) { sql += ' AND tags LIKE ?'; params.push(`%"${tag}"%`); }

  sql += ' ORDER BY date DESC, created_at DESC';
  const ideas = db.prepare(sql).all(...params);
  ideas.forEach(i => { i.tags = JSON.parse(i.tags); });
  res.json(ideas);
});

// GET /api/ideas/calendar
router.get('/calendar', (req, res) => {
  const dates = db.prepare('SELECT DISTINCT date FROM ideas ORDER BY date').all();
  res.json(dates.map(d => d.date));
});

// GET /api/ideas/:id
router.get('/:id', (req, res) => {
  const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(req.params.id);
  if (!idea) return res.status(404).json({ error: 'Not found' });
  idea.tags = JSON.parse(idea.tags);
  res.json(idea);
});

// POST /api/ideas
router.post('/', (req, res) => {
  const { title, content, date, tags } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'title and date are required' });
  const result = db.prepare(
    'INSERT INTO ideas (title, content, date, tags, created_at, updated_at) VALUES (?, ?, ?, ?, datetime(\'now\',\'localtime\'), datetime(\'now\',\'localtime\'))'
  ).run(title, content || '', date, JSON.stringify(tags || []));
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/ideas/:id
router.put('/:id', (req, res) => {
  const { title, content, date, tags } = req.body;
  const existing = db.prepare('SELECT * FROM ideas WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  // Save history before update
  db.prepare('INSERT INTO idea_history (idea_id, title, content, tags) VALUES (?,?,?,?)')
    .run(req.params.id, existing.title, existing.content, existing.tags);

  db.prepare(
    'UPDATE ideas SET title=?, content=?, date=?, tags=?, updated_at=datetime(\'now\',\'localtime\') WHERE id=?'
  ).run(
    title ?? existing.title,
    content ?? existing.content,
    date ?? existing.date,
    tags ? JSON.stringify(tags) : existing.tags,
    req.params.id
  );
  res.json({ ok: true });
});

// DELETE /api/ideas/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM ideas WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
