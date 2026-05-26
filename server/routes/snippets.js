const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { language, project_id, search } = req.query;
  let sql = 'SELECT * FROM snippets WHERE 1=1';
  const params = [];
  if (language) { sql += ' AND language=?'; params.push(language); }
  if (project_id) { sql += ' AND project_id=?'; params.push(project_id); }
  if (search) { sql += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/:id', (req, res) => {
  const s = db.prepare('SELECT * FROM snippets WHERE id=?').get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

router.post('/', (req, res) => {
  const { title, language, framework, description, code, source, project_id } = req.body;
  if (!title || !code) return res.status(400).json({ error: 'title and code required' });
  const r = db.prepare('INSERT INTO snippets (title, language, framework, description, code, source, project_id) VALUES (?,?,?,?,?,?,?)')
    .run(title, language || '', framework || '', description || '', code, source || '', project_id || null);
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { title, language, framework, description, code, source, project_id } = req.body;
  const s = db.prepare('SELECT * FROM snippets WHERE id=?').get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE snippets SET title=?, language=?, framework=?, description=?, code=?, source=?, project_id=? WHERE id=?')
    .run(title ?? s.title, language ?? s.language, framework ?? s.framework, description ?? s.description,
      code ?? s.code, source ?? s.source, project_id ?? s.project_id, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM snippets WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
