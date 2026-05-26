import { useState, useEffect } from 'react';
import { fetchIdeaHistory } from '../api';

export default function IdeaHistory({ ideaId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => { fetchIdeaHistory(ideaId).then(setHistory); }, [ideaId]);

  if (history.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h2>版本历史 ({history.length})</h2>
      <div className="timeline">
        {history.map((h, i) => {
          const tags = JSON.parse(h.tags || '[]');
          return (
            <div key={h.id} className="timeline-item">
              <div className="timeline-date">{h.recorded_at}</div>
              <p style={{ fontSize: 14, color: 'var(--foreground)', fontWeight: 500 }}>{h.title}</p>
              <p style={{ fontSize: 13, color: 'var(--foreground-muted)' }}>{h.content?.slice(0, 100)}{(h.content?.length > 100 ? '...' : '')}</p>
              <div className="row" style={{ gap: 4 }}>{tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              {i < history.length - 1 && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--foreground-subtle)' }}>↓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
