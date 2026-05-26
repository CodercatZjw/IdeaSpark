const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { project_id, resolved } = req.query;
  let sql = 'SELECT * FROM blockers WHERE 1=1';
  const params = [];
  if (project_id) { sql += ' AND project_id=?'; params.push(project_id); }
  if (resolved !== undefined) { sql += ' AND resolved=?'; params.push(resolved); }
  sql += ' ORDER BY CASE severity WHEN "blocking" THEN 0 WHEN "large" THEN 1 WHEN "medium" THEN 2 ELSE 3 END, created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.post('/', (req, res) => {
  const { project_id, description, severity } = req.body;
  const result = db.prepare('INSERT INTO blockers (project_id, description, severity) VALUES (?,?,?)')
    .run(project_id || null, description, severity || 'medium');
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { description, severity, resolved } = req.body;
  const b = db.prepare('SELECT * FROM blockers WHERE id=?').get(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE blockers SET description=?, severity=?, resolved=? WHERE id=?')
    .run(description ?? b.description, severity ?? b.severity, resolved ?? b.resolved, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM blockers WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
