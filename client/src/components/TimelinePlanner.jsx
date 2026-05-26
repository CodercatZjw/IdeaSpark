import { useState } from 'react';

export default function TimelinePlanner({ projectId, projectDeadline }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState(projectDeadline || '');

  const phases = [];
  if (start && end) {
    const startD = new Date(start);
    const endD = new Date(end);
    const totalH = (endD.getTime() - startD.getTime()) / 3600000;
    const defs = [
      { label: '确认选题', pct: 0.05 },
      { label: '技术验证', pct: 0.15 },
      { label: '核心开发', pct: 0.50 },
      { label: '打磨优化', pct: 0.25 },
      { label: '提交准备', pct: 0.10 },
    ];
    let acc = 0;
    for (const d of defs) {
      const t = new Date(startD.getTime() + acc * 3600000);
      acc += totalH * d.pct;
      const tEnd = new Date(startD.getTime() + acc * 3600000);
      phases.push({ label: d.label, start: t, end: tEnd });
    }
  }

  return (
    <div className="card">
      <h2>时间线规划器</h2>
      <div className="row" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
          <label>比赛开始</label>
          <input className="form-input" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
          <label>比赛结束</label>
          <input className="form-input" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
      </div>

      {phases.length > 0 && (
        <div className="timeline" style={{ marginTop: 8 }}>
          {phases.map((p, i) => (
            <div key={i} className="timeline-item">
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--foreground)' }}>{p.label}</div>
              <div className="timeline-date">
                {p.start.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                {' → '}
                {p.end.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{
                height: 4, borderRadius: 2, background: 'var(--border-default)',
                marginTop: 4, maxWidth: 240,
              }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  background: 'linear-gradient(90deg, #5E6AD2, #8B5CF6)',
                  width: `${[5, 15, 50, 25, 10][i]}%`,
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
