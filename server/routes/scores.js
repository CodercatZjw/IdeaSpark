const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:ideaId', (req, res) => {
  const score = db.prepare('SELECT * FROM idea_scores WHERE idea_id = ?').get(req.params.ideaId);
  res.json(score || { feasibility: 5, impact: 5, innovation: 5, passion: 5 });
});

router.put('/:ideaId', (req, res) => {
  const { feasibility, impact, innovation, passion } = req.body;
  const existing = db.prepare('SELECT * FROM idea_scores WHERE idea_id = ?').get(req.params.ideaId);
  if (existing) {
    db.prepare('UPDATE idea_scores SET feasibility=?, impact=?, innovation=?, passion=? WHERE idea_id=?')
      .run(feasibility ?? 5, impact ?? 5, innovation ?? 5, passion ?? 5, req.params.ideaId);
  } else {
    db.prepare('INSERT INTO idea_scores (idea_id, feasibility, impact, innovation, passion) VALUES (?,?,?,?,?)')
      .run(req.params.ideaId, feasibility ?? 5, impact ?? 5, innovation ?? 5, passion ?? 5);
  }
  res.json({ ok: true });
});

router.get('/', (req, res) => {
  const scores = db.prepare(`
    SELECT s.*, i.title FROM idea_scores s JOIN ideas i ON s.idea_id = i.id ORDER BY (s.feasibility+s.impact+s.innovation+s.passion) DESC
  `).all();
  res.json(scores);
});

module.exports = router;
