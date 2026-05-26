const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM resource_links WHERE project_id = ? ORDER BY category, id').all(req.params.projectId));
});

router.post('/', (req, res) => {
  const { title, url, category, notes } = req.body;
  const r = db.prepare('INSERT INTO resource_links (project_id, title, url, category, notes) VALUES (?,?,?,?,?)')
    .run(req.params.projectId, title, url, category || 'other', notes || '');
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { title, url, category, notes } = req.body;
  db.prepare('UPDATE resource_links SET title=?, url=?, category=?, notes=? WHERE id=? AND project_id=?')
    .run(title, url, category, notes, req.params.id, req.params.projectId);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM resource_links WHERE id=? AND project_id=?').run(req.params.id, req.params.projectId);
  res.json({ ok: true });
});

module.exports = router;
