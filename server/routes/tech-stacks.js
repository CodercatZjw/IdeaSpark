const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM tech_stacks ORDER BY id').all();
  res.json(rows.map(r => ({ ...r, pros: JSON.parse(r.pros), cons: JSON.parse(r.cons) })));
});

router.post('/', (req, res) => {
  const { title, description, pros, cons, learning_curve, best_for, community } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const r = db.prepare('INSERT INTO tech_stacks (title, description, pros, cons, learning_curve, best_for, community) VALUES (?,?,?,?,?,?,?)')
    .run(title, description || '', JSON.stringify(pros || []), JSON.stringify(cons || []), learning_curve || 'medium', best_for || '', community || '');
  res.status(201).json({ id: r.lastInsertRowid });
});

module.exports = router;
