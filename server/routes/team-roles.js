const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM team_roles WHERE project_id = ?').all(req.params.projectId));
});

router.post('/', (req, res) => {
  const { member_name, role, responsibilities, contact } = req.body;
  const r = db.prepare('INSERT INTO team_roles (project_id, member_name, role, responsibilities, contact) VALUES (?,?,?,?,?)')
    .run(req.params.projectId, member_name, role || '', responsibilities || '', contact || '');
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { member_name, role, responsibilities, contact } = req.body;
  db.prepare('UPDATE team_roles SET member_name=?, role=?, responsibilities=?, contact=? WHERE id=? AND project_id=?')
    .run(member_name, role, responsibilities, contact, req.params.id, req.params.projectId);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM team_roles WHERE id=? AND project_id=?').run(req.params.id, req.params.projectId);
  res.json({ ok: true });
});

module.exports = router;
