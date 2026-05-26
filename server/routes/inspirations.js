const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/inspiration/random — 返回 3 个随机关键词 + 1 个随机提示语
router.get('/random', (req, res) => {
  const keywords = db.prepare(
    'SELECT * FROM inspirations WHERE type = ? ORDER BY RANDOM() LIMIT 3'
  ).all('keyword');
  const prompt = db.prepare(
    'SELECT * FROM inspirations WHERE type = ? ORDER BY RANDOM() LIMIT 1'
  ).all('prompt');
  res.json({ keywords, prompts: prompt });
});

// GET /api/inspiration
router.get('/', (req, res) => {
  const { type, category } = req.query;
  let sql = 'SELECT * FROM inspirations WHERE 1=1';
  const params = [];
  if (type) { sql += ' AND type = ?'; params.push(type); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  sql += ' ORDER BY type, category, id';
  res.json(db.prepare(sql).all(...params));
});

// POST /api/inspiration
router.post('/', (req, res) => {
  const { type, content, category } = req.body;
  if (!type || !content) return res.status(400).json({ error: 'type and content are required' });
  const result = db.prepare(
    'INSERT INTO inspirations (type, content, category) VALUES (?, ?, ?)'
  ).run(type, content, category || 'custom');
  res.status(201).json({ id: result.lastInsertRowid });
});

module.exports = router;
