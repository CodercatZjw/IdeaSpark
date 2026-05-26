const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/graph — return nodes and edges for the idea relationship graph
router.get('/', (req, res) => {
  const ideas = db.prepare('SELECT * FROM ideas ORDER BY date').all();
  const nodes = ideas.map(i => ({
    id: i.id,
    title: i.title,
    tags: JSON.parse(i.tags),
    date: i.date,
  }));

  const edges = [];
  const seen = new Set();

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const shared = nodes[i].tags.filter(t => nodes[j].tags.includes(t));
      if (shared.length > 0) {
        const key = `${nodes[i].id}-${nodes[j].id}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ source: nodes[i].id, target: nodes[j].id, tags: shared, weight: shared.length });
        }
      }
    }
  }

  res.json({ nodes, edges });
});

module.exports = router;
