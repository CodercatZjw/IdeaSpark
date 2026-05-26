import { useState, useEffect } from 'react';
import { fetchDailyWord } from '../api';

export default function DailyWord() {
  const [word, setWord] = useState(null);

  useEffect(() => { fetchDailyWord().then(setWord); }, []);

  if (!word) return null;

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="row-between" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>每日一词</h2>
        <span className="section-label">{word.date}</span>
      </div>
      <div style={{
        display: 'inline-block', padding: '8px 20px', background: 'rgba(92,224,212,0.08)',
        border: '1px solid rgba(92,224,212,0.2)', borderRadius: 9999,
        fontSize: 18, fontWeight: 600, color: '#5CE0D4', marginBottom: 12,
      }}>
        {word.word}
      </div>
      <p style={{ fontSize: 14, color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: 12, maxWidth: 500, margin: '0 auto 12px' }}>
        {word.desc}
      </p>
      <p style={{ fontSize: 15, color: 'var(--accent-bright)', fontStyle: 'italic' }}>
        {word.question}
      </p>
    </div>
  );
}
