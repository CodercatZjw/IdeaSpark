import { Link } from 'react-router-dom';

export default function PitchPreview({ pitches, project }) {
  return (
    <div>
      {pitches.length > 0 ? (
        <div style={{ marginBottom: 16 }}>
          {pitches.slice(0, 3).map((p, i) => (
            <div key={p.id || i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
              <p style={{ fontSize: 14, color: 'var(--foreground)', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{p.content?.slice(0, 200)}</p>
              <div style={{ fontSize: 11, color: 'var(--foreground-subtle)', marginTop: 4 }}>
                {p.created_at?.slice(0, 16)} · 用时 {p.duration || 60}s
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--foreground-subtle)', marginBottom: 16 }}>还没有保存路演稿</p>
      )}
      <Link to="/pitch" className="btn btn-primary btn-sm">打开路演计时器</Link>
    </div>
  );
}
