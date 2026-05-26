const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/ideas', require('./routes/ideas'));
app.use('/api/inspiration', require('./routes/inspirations'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/graph', require('./routes/graph'));
app.use('/api/scores', require('./routes/scores'));
app.use('/api/standups', require('./routes/standups'));
app.use('/api/blockers', require('./routes/blockers'));
app.use('/api/snippets', require('./routes/snippets'));
app.use('/api/api-tools', require('./routes/api-tools'));
app.use('/api/tech-stacks', require('./routes/tech-stacks'));
app.use('/api/more', require('./routes/more'));
app.use('/api/projects/:projectId/roles', require('./routes/team-roles'));
app.use('/api/projects/:projectId/links', require('./routes/resource-links'));
app.use('/api/projects/:projectId/judging', require('./routes/judging'));
app.use('/api/projects/:projectId/retro', require('./routes/retrospectives'));
app.use('/api/projects/:projectId/events', require('./routes/events'));

// Serve static frontend in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`IdeaSpark server running at http://localhost:${PORT}`);
});
