import { useState, useEffect } from 'react';
import { fetchBlockers, createBlocker, updateBlocker, deleteBlocker } from '../api';

const SEVERITY = { blocking: '阻塞', large: '严重', medium: '中等', small: '轻微' };

export default function BlockerBoard({ projectId }) {
  const [blockers, setBlockers] = useState([]);
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [showResolved, setShowResolved] = useState(false);

  const load = () => fetchBlockers({ project_id: projectId }).then(setBlockers);

  useEffect(() => { load(); }, [projectId]);

  const add = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return;
    await createBlocker({ project_id: projectId, description: desc.trim(), severity });
    setDesc('');
    load();
  };

  const toggleResolved = async (b) => {
    await updateBlocker(b.id, { resolved: b.resolved ? 0 : 1 });
    load();
  };

  const active = blockers.filter(b => !b.resolved);
  const resolved = blockers.filter(b => b.resolved);

  return (
    <div className="card">
      <h2>障碍追踪看板</h2>

      <form onSubmit={add} className="row" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="form-input" style={{ flex: 1, minWidth: 200 }} value={desc}
          onChange={e => setDesc(e.target.value)} placeholder="描述你遇到的问题..." />
        <select className="form-input" style={{ maxWidth: 100 }} value={severity} onChange={e => setSeverity(e.target.value)}>
          {Object.entries(SEVERITY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button type="submit" className="btn btn-primary btn-sm">添加</button>
      </form>

      {active.map(b => (
        <div key={b.id} className={`blocker-card severity-${b.severity}`}>
          <div className="row-between">
            <span style={{ fontSize: 14 }}>{b.description}</span>
            <div className="row" style={{ gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--foreground-subtle)' }}>{SEVERITY[b.severity]}</span>
              <button className="btn btn-outline btn-sm" onClick={() => toggleResolved(b)}>解决</button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteBlocker(b.id).then(load)}>删除</button>
            </div>
          </div>
        </div>
      ))}

      {resolved.length > 0 && (
        <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={() => setShowResolved(!showResolved)}>
          {showResolved ? '隐藏' : '显示'} {resolved.length} 个已解决
        </button>
      )}

      {showResolved && resolved.map(b => (
        <div key={b.id} className="blocker-card resolved" style={{ marginTop: 4 }}>
          <span style={{ fontSize: 13 }}>{b.description}</span>
        </div>
      ))}

      {active.length === 0 && resolved.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>没有障碍，很好！</p>
      )}
    </div>
  );
}
