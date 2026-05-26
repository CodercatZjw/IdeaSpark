import { useState, useCallback } from 'react';

export default function JudgingSelfScore({ criteria, onSave }) {
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState({});

  const setScore = (id, v) => { setScores({ ...scores, [id]: Number(v) }); };
  const setNote = (id, v) => { setNotes({ ...notes, [id]: v }); };

  const saveAll = () => {
    for (const c of criteria) {
      if (scores[c.id] !== undefined || notes[c.id] !== undefined) {
        onSave(c.id, { self_score: scores[c.id] ?? c.self_score, notes: notes[c.id] ?? c.notes });
      }
    }
  };

  const getScore = (c) => scores[c.id] ?? c.self_score ?? 0;
  const getNote = (c) => notes[c.id] ?? c.notes ?? '';

  const weighted = criteria.reduce((sum, c) => sum + getScore(c) * (c.weight || 1), 0);
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 1), 0);
  const avg = totalWeight > 0 ? (weighted / totalWeight).toFixed(1) : 0;

  return (
    <div>
      {criteria.map(c => (
        <div key={c.id} style={{ marginBottom: 16, padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border-default)' }}>
          <div className="row-between" style={{ marginBottom: 8 }}>
            <div className="row" style={{ gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--foreground)' }}>{c.name}</span>
              <span className="tag">权重 {c.weight}</span>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <input type="range" min="1" max={c.max_score || 10} value={getScore(c)} onChange={e => setScore(c.id, Number(e.target.value))} style={{ accentColor: 'var(--accent)', width: 100 }} />
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent-bright)', minWidth: 30, textAlign: 'center' }}>{getScore(c) || '-'}/{c.max_score || 10}</span>
            </div>
          </div>
          <input className="form-input" style={{ padding: '6px 10px', fontSize: 13 }} value={getNote(c)} onChange={e => setNote(c.id, e.target.value)} placeholder="评委可能关注的点..." />
        </div>
      ))}
      <div className="row-between" style={{ marginTop: 12 }}>
        <span style={{ fontSize: 14, color: 'var(--foreground)' }}>
          加权总分: <strong style={{ color: Number(avg) >= 7 ? '#5CE0D4' : 'var(--accent-bright)', fontSize: 18 }}>{avg}</strong> / 10
        </span>
        <button className="btn btn-primary btn-sm" onClick={saveAll}>保存自评</button>
      </div>
    </div>
  );
}
