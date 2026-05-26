const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:projectId', (req, res) => {
  const standups = db.prepare('SELECT * FROM standups WHERE project_id = ? ORDER BY date DESC').all(req.params.projectId);
  res.json(standups);
});

router.post('/:projectId', (req, res) => {
  const { author, yesterday, today, blockers_text, date } = req.body;
  const result = db.prepare('INSERT INTO standups (project_id, author, yesterday, today, blockers_text, date) VALUES (?,?,?,?,?,?)')
    .run(req.params.projectId, author, yesterday || '', today || '', blockers_text || '', date);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/:projectId/:id', (req, res) => {
  const { yesterday, today, blockers_text } = req.body;
  db.prepare('UPDATE standups SET yesterday=?, today=?, blockers_text=? WHERE id=? AND project_id=?')
    .run(yesterday, today, blockers_text, req.params.id, req.params.projectId);
  res.json({ ok: true });
});

router.delete('/:projectId/:id', (req, res) => {
  db.prepare('DELETE FROM standups WHERE id=? AND project_id=?').run(req.params.id, req.params.projectId);
  res.json({ ok: true });
});

module.exports = router;
