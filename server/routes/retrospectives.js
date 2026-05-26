const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');

router.get('/', (req, res) => {
  const r = db.prepare('SELECT * FROM retrospectives WHERE project_id = ?').get(req.params.projectId);
  res.json(r || { went_well: '', went_wrong: '', learned: '', next_time: '', continue_project: 0, overall_rating: 0 });
});

router.put('/', (req, res) => {
  const { went_well, went_wrong, learned, next_time, continue_project, overall_rating } = req.body;
  const existing = db.prepare('SELECT * FROM retrospectives WHERE project_id = ?').get(req.params.projectId);
  if (existing) {
    db.prepare(`UPDATE retrospectives SET went_well=?, went_wrong=?, learned=?, next_time=?, continue_project=?, overall_rating=? WHERE project_id=?`)
      .run(went_well ?? '', went_wrong ?? '', learned ?? '', next_time ?? '', continue_project ?? 0, overall_rating ?? 0, req.params.projectId);
  } else {
    db.prepare(`INSERT INTO retrospectives (project_id, went_well, went_wrong, learned, next_time, continue_project, overall_rating) VALUES (?,?,?,?,?,?,?)`)
      .run(req.params.projectId, went_well ?? '', went_wrong ?? '', learned ?? '', next_time ?? '', continue_project ?? 0, overall_rating ?? 0);
  }
  res.json({ ok: true });
});

module.exports = router;
