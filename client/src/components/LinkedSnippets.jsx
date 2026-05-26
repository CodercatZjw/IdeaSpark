import { useState, useEffect } from 'react';
import { fetchSnippets } from '../api';
import { Link } from 'react-router-dom';

export default function LinkedSnippets({ projectId }) {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    fetchSnippets({ project_id: projectId }).then(setSnippets);
  }, [projectId]);

  return (
    <div>
      {snippets.length === 0 ? (
        <div className="row-between">
          <p style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>没有关联的代码片段</p>
          <Link to="/snippets" className="btn btn-outline btn-sm">添加片段</Link>
        </div>
      ) : (
        <div>
          {snippets.map(s => (
            <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
              <div className="row-between">
                <div className="row" style={{ gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)' }}>{s.title}</span>
                  {s.language && <span className="tag">{s.language}</span>}
                </div>
                <span style={{ fontSize: 11, color: 'var(--foreground-subtle)' }}>{s.created_at?.slice(0, 10)}</span>
              </div>
            </div>
          ))}
          <Link to="/snippets" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>管理所有片段</Link>
        </div>
      )}
    </div>
  );
}
