import { useState, useEffect } from 'react';
import { fetchCompetitors, createCompetitor, deleteCompetitor } from '../api';

export default function CompetitorPanel({ projectId }) {
  const [competitors, setCompetitors] = useState([]);
  const [name, setName] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [differentiation, setDifferentiation] = useState('');

  const load = () => fetchCompetitors(projectId).then(setCompetitors);

  useEffect(() => { load(); }, [projectId]);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createCompetitor(projectId, { name: name.trim(), strengths, weaknesses, differentiation });
    setName(''); setStrengths(''); setWeaknesses(''); setDifferentiation('');
    load();
  };

  return (
    <div className="card">
      <h2>竞品速查</h2>

      {competitors.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--foreground-subtle)', fontWeight: 500 }}>竞品</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--foreground-subtle)', fontWeight: 500 }}>优势</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--foreground-subtle)', fontWeight: 500 }}>劣势</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--foreground-subtle)', fontWeight: 500 }}>你的差异</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {competitors.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--foreground)' }}>{c.name}</td>
                  <td style={{ padding: '8px 12px', color: '#5CE0D4' }}>{c.strengths}</td>
                  <td style={{ padding: '8px 12px', color: '#fc5c7c' }}>{c.weaknesses}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--accent-bright)' }}>{c.differentiation}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteCompetitor(projectId, c.id).then(load)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={add}>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          <input className="form-input" style={{ flex: 1, minWidth: 120 }} value={name} onChange={e => setName(e.target.value)} placeholder="竞品名称" />
          <input className="form-input" style={{ flex: 1, minWidth: 120 }} value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="优势" />
          <input className="form-input" style={{ flex: 1, minWidth: 120 }} value={weaknesses} onChange={e => setWeaknesses(e.target.value)} placeholder="劣势" />
          <input className="form-input" style={{ flex: 1.5, minWidth: 160 }} value={differentiation} onChange={e => setDifferentiation(e.target.value)} placeholder="你的差异化" />
          <button type="submit" className="btn btn-primary btn-sm">+</button>
        </div>
      </form>
    </div>
  );
}
