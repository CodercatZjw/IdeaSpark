const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM project_events WHERE project_id = ? ORDER BY occurred_at ASC').all(req.params.projectId));
});

router.post('/', (req, res) => {
  const { event_type, description, occurred_at } = req.body;
  const r = db.prepare('INSERT INTO project_events (project_id, event_type, description, occurred_at) VALUES (?,?,?,?)')
    .run(req.params.projectId, event_type, description || '', occurred_at || new Date().toISOString());
  res.status(201).json({ id: r.lastInsertRowid });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM project_events WHERE id=? AND project_id=?').run(req.params.id, req.params.projectId);
  res.json({ ok: true });
});

module.exports = router;
