import { useState, useEffect } from 'react';
import { fetchScore, saveScore } from '../api';

const DIMS = [
  { key: 'feasibility', label: '可行性', color: '#5E6AD2' },
  { key: 'impact', label: '影响力', color: '#8B5CF6' },
  { key: 'innovation', label: '创新度', color: '#5CE0D4' },
  { key: 'passion', label: '个人热情', color: '#F59E0B' },
];

export default function ScoreMatrix({ ideaId }) {
  const [scores, setScores] = useState({ feasibility: 5, impact: 5, innovation: 5, passion: 5 });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetchScore(ideaId).then(setScores);
  }, [ideaId]);

  const set = (key, v) => { setScores({ ...scores, [key]: v }); setDirty(true); };

  const save = async () => { await saveScore(ideaId, scores); setDirty(false); };

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const avg = total / 4;

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="row-between" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>想法评分</h2>
        <span style={{ fontSize: 14, color: 'var(--foreground-subtle)' }}>
          总分 <strong style={{ color: avg >= 7 ? '#5CE0D4' : avg >= 4 ? 'var(--accent-bright)' : 'var(--foreground-muted)' }}>{total}</strong> / 40
        </span>
      </div>
      <div className="score-grid">
        {DIMS.map(d => (
          <div key={d.key} className="row" style={{ gridColumn: '1/-1', gap: 12 }}>
            <span className="score-label" style={{ minWidth: 60 }}>{d.label}</span>
            <input type="range" min="1" max="10" value={scores[d.key]} onChange={e => set(d.key, Number(e.target.value))}
              style={{ flex: 1, accentColor: d.color }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', minWidth: 20, textAlign: 'center' }}>{scores[d.key]}</span>
          </div>
        ))}
      </div>
      {dirty && <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={save}>保存评分</button>}
    </div>
  );
}
