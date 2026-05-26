import { useState, useEffect } from 'react';
import { fetchStreak, checkin } from '../api';
import { Link } from 'react-router-dom';

export default function StreakWidget() {
  const [streak, setStreak] = useState({ streak: 0, total: 0, dates: [] });
  const [checked, setChecked] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const load = async () => {
    const data = await fetchStreak();
    setStreak(data);
    setChecked(data.dates.includes(today));
  };

  useEffect(() => { load(); }, []);

  const handleCheckin = async () => {
    await checkin();
    setChecked(true);
    load();
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="row-between" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>创意连续记录</h2>
        {!checked ? (
          <button className="btn btn-primary btn-sm" onClick={handleCheckin}>今日打卡</button>
        ) : (
          <span style={{ fontSize: 13, color: '#5CE0D4' }}>已打卡</span>
        )}
      </div>

      <div className="row" style={{ justifyContent: 'center', gap: 32, marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--foreground)', margin: 0, fontVariantNumeric: 'tabular-nums' }}>{streak.streak}</p>
          <p style={{ fontSize: 12, color: 'var(--foreground-subtle)', marginTop: 4 }}>连续天数</p>
        </div>
        <div>
          <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--foreground)', margin: 0, fontVariantNumeric: 'tabular-nums' }}>{streak.total}</p>
          <p style={{ fontSize: 12, color: 'var(--foreground-subtle)', marginTop: 4 }}>累计记录</p>
        </div>
      </div>

      <div className="streak-grid" style={{ justifyContent: 'center' }}>
        {Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          const ds = d.toISOString().slice(0, 10);
          return <div key={i} className={`streak-dot ${streak.dates.includes(ds) ? 'active' : ''}`} />;
        })}
      </div>
      <p style={{ fontSize: 11, color: 'var(--foreground-subtle)', marginTop: 8 }}>过去 30 天</p>
      {streak.streak === 0 && !checked && (
        <p style={{ fontSize: 14, color: 'var(--foreground-muted)', marginTop: 12 }}>
          今天还没有记录想法？<br /><Link to="/write" style={{ color: 'var(--accent-bright)' }}>去写一个 →</Link>
        </p>
      )}
    </div>
  );
}
