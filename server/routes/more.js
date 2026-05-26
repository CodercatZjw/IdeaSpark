const express = require('express');
const router = express.Router();
const db = require('../db');

// --- challenges ---
router.get('/challenges/random', (req, res) => {
  const c = db.prepare('SELECT * FROM challenges ORDER BY RANDOM() LIMIT 1').get();
  res.json(c || null);
});

router.get('/challenges', (req, res) => {
  res.json(db.prepare('SELECT * FROM challenges ORDER BY category, id').all());
});

router.post('/challenges', (req, res) => {
  const { content, category } = req.body;
  const r = db.prepare('INSERT INTO challenges (content, category) VALUES (?,?)').run(content, category || 'general');
  res.status(201).json({ id: r.lastInsertRowid });
});

// --- templates ---
router.get('/templates', (req, res) => {
  const rows = db.prepare('SELECT * FROM templates ORDER BY id').all();
  res.json(rows.map(r => ({ ...r, fields: JSON.parse(r.fields) })));
});

// --- daily word ---
router.get('/daily-word', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const words = [
    { word: 'CRDT', desc: 'Conflict-free Replicated Data Types — 无冲突复制数据类型', question: '如果用它来做实时协作功能，你的黑客松项目会有什么新可能？' },
    { word: 'WebRTC', desc: 'Web Real-Time Communication — 浏览器原生点对点通信', question: '能不能用它做一个不依赖服务器的通信工具？' },
    { word: 'Edge Functions', desc: '在 CDN 边缘节点执行的 Serverless 函数', question: '什么逻辑放在边缘能带来质的飞跃？' },
    { word: 'WebAssembly', desc: '浏览器中的低级字节码，性能接近原生', question: '如果用 WASM 把某个重型库搬进浏览器，能做什么？' },
    { word: 'Vector Embeddings', desc: '将文本/图像转为高维向量进行语义搜索', question: '语义搜索能给你的项目带来什么智能体验？' },
    { word: 'Event Sourcing', desc: '将状态变更记录为事件序列而非当前快照', question: '完整的操作日志对用户来说有什么价值？' },
    { word: 'Isomorphic Rendering', desc: '服务端和客户端共用一套渲染代码', question: '首屏秒开 + SEO 友好，适合做什么类型的产品？' },
    { word: 'WebSocket', desc: '全双工通信协议，服务器可主动推送', question: '哪些场景下轮询是不够的，必须是实时推送？' },
    { word: 'Differential Privacy', desc: '差分隐私 — 发布统计信息时不泄露个体数据', question: '如何在收集有用数据的同时让用户完全放心？' },
    { word: 'Content Security Policy', desc: '浏览器安全策略，防止 XSS 和数据注入', question: '安全功能本身能不能做成一个有吸引力的产品特性？' },
    { word: 'Progressive Web App', desc: '渐进式 Web 应用，可安装、离线运行、推送通知', question: '打包成 PWA 后，你的项目能覆盖哪些原生场景？' },
    { word: 'GraphQL', desc: 'API 查询语言，客户端精确指定需要的数据', question: '如果 REST 让你联调痛苦，GraphQL 会怎么改变你的开发流程？' },
    { word: 'Micro Frontends', desc: '微前端 — 大型应用拆分为独立可部署模块', question: '不同团队并行开发不同页面模块，效率能提升多少？' },
    { word: 'eBPF', desc: 'Extended Berkeley Packet Filter — 内核级可编程观测', question: '在用户态实现不了的高性能观测，eBPF 能做什么？' },
    { word: 'Local-First', desc: '本地优先 — 数据在本地，云端是可选同步', question: '你的应用中哪些数据不需要云端，全部放本地会怎样？' },
    { word: 'WebTransport', desc: '新一代 Web 传输协议，低延迟多路复用', question: '比 WebSocket 更低的延迟，适合做什么实时应用？' },
    { word: 'OAuth 2.1', desc: '最新一代授权框架，整合了 OAuth 2.0 的最佳实践', question: '更安全的授权流程能让你接入哪些敏感场景？' },
    { word: 'Homomorphic Encryption', desc: '同态加密 — 在加密数据上直接计算', question: '用户的数据永远加密，但你仍能提供服务，能做什么产品？' },
    { word: 'Web Workers', desc: '浏览器后台线程，不阻塞 UI', question: '如果把所有重计算移到 Worker，UI 的丝滑体验能带来什么？' },
    { word: 'Peer-to-Peer', desc: '去中心化的点对点网络', question: '不需要服务器，用户之间直接共享数据，你的应用能成立吗？' },
    { word: 'WebGPU', desc: '下一代浏览器图形 API，GPU 计算能力', question: '浏览器里跑 GPU 计算，音频/视频/ML 实时处理能做什么新体验？' },
    { word: 'Content-addressed Storage', desc: '内容寻址存储 — 用内容哈希定位而非路径', question: '数据永远不被篡改且去重存储，适合什么场景？' },
    { word: 'WebAuthn', desc: 'Web Authentication — 用指纹/Face ID/YubiKey 登录', question: '无密码体验是未来的常态，你的项目会如何利用它？' },
    { word: 'State Machines', desc: '用有限状态机管理复杂的 UI 状态', question: '每个状态一目了然，不可能进入非法状态，省多少 bug？' },
    { word: 'Semantic Search', desc: '基于语义理解的搜索而非关键词匹配', question: '用户用自己的话描述需求就能搜到，比填表单好多少？' }
  ];
  const idx = Math.abs(today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % words.length;
  res.json({ ...words[idx], date: today });
});

// --- streak ---
router.get('/streak', (req, res) => {
  const dates = db.prepare('SELECT date FROM streak ORDER BY date DESC').all().map(d => d.date);
  let streak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    if (dates.includes(ds)) streak++;
    else break;
  }
  // Count total recorded days
  const total = db.prepare('SELECT COUNT(*) as c FROM streak').get().c;
  res.json({ streak, total, dates });
});

router.post('/streak/checkin', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  db.prepare('INSERT OR IGNORE INTO streak (date) VALUES (?)').run(today);
  const total = db.prepare('SELECT COUNT(*) as c FROM streak').get().c;
  res.json({ date: today, total });
});

// --- share ---
router.get('/share/:token', (req, res) => {
  const token = req.params.token;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.type === 'idea') {
      const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(decoded.id);
      if (!idea) return res.status(404).json({ error: 'Not found' });
      idea.tags = JSON.parse(idea.tags);
      res.json({ type: 'idea', data: idea });
    } else if (decoded.type === 'project') {
      const proj = db.prepare('SELECT * FROM projects WHERE id = ?').get(decoded.id);
      if (!proj) return res.status(404).json({ error: 'Not found' });
      proj.team_members = JSON.parse(proj.team_members);
      proj.tech_stack = JSON.parse(proj.tech_stack);
      proj.checklist = JSON.parse(proj.checklist);
      const ideas = db.prepare(`
        SELECT i.* FROM ideas i JOIN project_ideas pi ON i.id = pi.idea_id WHERE pi.project_id = ?
      `).all(decoded.id);
      ideas.forEach(i => { i.tags = JSON.parse(i.tags); });
      res.json({ type: 'project', data: proj, ideas });
    } else {
      res.status(400).json({ error: 'Invalid share token' });
    }
  } catch { res.status(400).json({ error: 'Invalid share token' }); }
});

// --- idea history ---
router.get('/ideas/:id/history', (req, res) => {
  const history = db.prepare('SELECT * FROM idea_history WHERE idea_id = ? ORDER BY recorded_at DESC').all(req.params.id);
  res.json(history);
});

// --- competitors ---
router.get('/competitors/:projectId', (req, res) => {
  res.json(db.prepare('SELECT * FROM competitors WHERE project_id = ? ORDER BY created_at DESC').all(req.params.projectId));
});

router.post('/competitors/:projectId', (req, res) => {
  const { name, strengths, weaknesses, differentiation } = req.body;
  const r = db.prepare('INSERT INTO competitors (project_id, name, strengths, weaknesses, differentiation) VALUES (?,?,?,?,?)')
    .run(req.params.projectId, name, strengths || '', weaknesses || '', differentiation || '');
  res.status(201).json({ id: r.lastInsertRowid });
});

router.delete('/competitors/:projectId/:id', (req, res) => {
  db.prepare('DELETE FROM competitors WHERE id=? AND project_id=?').run(req.params.id, req.params.projectId);
  res.json({ ok: true });
});

// --- pitches ---
router.get('/pitches', (req, res) => {
  const { idea_id, project_id } = req.query;
  let sql = 'SELECT * FROM pitches WHERE 1=1';
  const params = [];
  if (idea_id) { sql += ' AND idea_id=?'; params.push(idea_id); }
  if (project_id) { sql += ' AND project_id=?'; params.push(project_id); }
  sql += ' ORDER BY created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.post('/pitches', (req, res) => {
  const { idea_id, project_id, content, duration } = req.body;
  const r = db.prepare('INSERT INTO pitches (idea_id, project_id, content, duration) VALUES (?,?,?,?)')
    .run(idea_id || null, project_id || null, content || '', duration || 60);
  res.status(201).json({ id: r.lastInsertRowid });
});

module.exports = router;
