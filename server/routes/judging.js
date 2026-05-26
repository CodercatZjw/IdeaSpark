const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');

const DEFAULT_CRITERIA = [
  { name: '创新创意', weight: 3, max_score: 10, notes: '' },
  { name: '技术实现', weight: 3, max_score: 10, notes: '' },
  { name: '商业潜力', weight: 2, max_score: 10, notes: '' },
  { name: '用户体验', weight: 2, max_score: 10, notes: '' },
  { name: '路演表达', weight: 2, max_score: 10, notes: '' },
];

router.get('/', (req, res) => {
  let items = db.prepare('SELECT * FROM judging_criteria_items WHERE project_id = ?').all(req.params.projectId);
  // Auto-create defaults if none exist
  if (items.length === 0) {
    const ins = db.prepare('INSERT INTO judging_criteria_items (project_id, name, weight, max_score, notes) VALUES (?,?,?,?,?)');
    db.transaction(() => { for (const d of DEFAULT_CRITERIA) ins.run(req.params.projectId, d.name, d.weight, d.max_score, d.notes); })();
    items = db.prepare('SELECT * FROM judging_criteria_items WHERE project_id = ?').all(req.params.projectId);
  }
  res.json(items);
});

router.post('/', (req, res) => {
  const { name, weight, max_score, notes } = req.body;
  const r = db.prepare('INSERT INTO judging_criteria_items (project_id, name, weight, max_score, notes) VALUES (?,?,?,?,?)')
    .run(req.params.projectId, name, weight || 1, max_score || 10, notes || '');
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { name, weight, max_score, self_score, judge_feedback, notes } = req.body;
  db.prepare('UPDATE judging_criteria_items SET name=?, weight=?, max_score=?, self_score=?, judge_feedback=?, notes=? WHERE id=? AND project_id=?')
    .run(name, weight, max_score, self_score, judge_feedback, notes, req.params.id, req.params.projectId);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM judging_criteria_items WHERE id=? AND project_id=?').run(req.params.id, req.params.projectId);
  res.json({ ok: true });
});

module.exports = router;
