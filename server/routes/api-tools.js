const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let sql = 'SELECT * FROM api_tools WHERE 1=1';
  const params = [];
  if (category) { sql += ' AND category=?'; params.push(category); }
  if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }
  sql += ' ORDER BY category, name';
  res.json(db.prepare(sql).all(...params));
});

router.post('/', (req, res) => {
  const { name, description, free_tier, use_cases, url, category } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const r = db.prepare('INSERT INTO api_tools (name, description, free_tier, use_cases, url, category, is_builtin) VALUES (?,?,?,?,?,?,0)')
    .run(name, description || '', free_tier || '', use_cases || '', url || '', category || 'general');
  res.status(201).json({ id: r.lastInsertRowid });
});

router.get('/project/:projectId', (req, res) => {
  const tools = db.prepare(`
    SELECT at.* FROM api_tools at JOIN project_api_tools pat ON at.id = pat.api_tool_id WHERE pat.project_id = ?
  `).all(req.params.projectId);
  res.json(tools);
});

router.post('/project/:projectId', (req, res) => {
  const { tool_id } = req.body;
  db.prepare('INSERT OR IGNORE INTO project_api_tools (project_id, api_tool_id) VALUES (?,?)').run(req.params.projectId, tool_id);
  res.json({ ok: true });
});

router.delete('/project/:projectId/:toolId', (req, res) => {
  db.prepare('DELETE FROM project_api_tools WHERE project_id=? AND api_tool_id=?').run(req.params.projectId, req.params.toolId);
  res.json({ ok: true });
});

module.exports = router;
