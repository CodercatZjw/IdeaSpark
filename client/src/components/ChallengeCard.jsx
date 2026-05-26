import { useState, useEffect } from 'react';
import { fetchRandomChallenge } from '../api';

export default function ChallengeCard() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const c = await fetchRandomChallenge();
    setChallenge(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const categoryLabels = { tech: '技术约束', design: '设计约束', general: '通用约束', wild: '疯狂模式' };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="row-between" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>随机挑战卡</h2>
        <button className="btn btn-outline btn-sm" onClick={load} disabled={loading}>换一张</button>
      </div>
      {challenge && (
        <div style={{
          padding: '24px', background: 'rgba(94,106,210,0.06)', borderRadius: 12,
          border: '1px solid rgba(94,106,210,0.15)',
        }}>
          <span style={{ fontSize: 12, color: 'var(--accent-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>
            {categoryLabels[challenge.category] || '约束'}
          </span>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.5 }}>
            {challenge.content}
          </p>
        </div>
      )}
    </div>
  );
}
