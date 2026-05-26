import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchIdeas, fetchRandomInspiration } from '../api';
import CombinationEngine from '../components/CombinationEngine';

export default function Dashboard() {
  const [todayIdeas, setTodayIdeas] = useState([]);
  const [inspo, setInspo] = useState(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const load = async () => {
    const [ideas, insp] = await Promise.all([
      fetchIdeas({ date: today }),
      fetchRandomInspiration(),
    ]);
    setTodayIdeas(ideas);
    setInspo(insp);
  };

  const refreshInspo = async () => {
    setLoading(true);
    const insp = await fetchRandomInspiration();
    setInspo(insp);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 32 }}>
        <div>
          <p className="section-label">今日灵感</p>
          <h1 className="section-title">Dashboard</h1>
        </div>
        <div className="row">
          <span style={{ color: 'var(--foreground-subtle)', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
            {today}
          </span>
          <Link to="/write" className="btn btn-primary">记录想法</Link>
        </div>
      </div>

      {/* Inspiration Cards */}
      {inspo && (
        <div className="grid-2" style={{ marginBottom: 32 }}>
          <div className="inspiration-card">
            <p className="section-label">关键词组合</p>
            <div style={{ marginTop: 8 }}>
              {inspo.keywords.map(k => (
                <span key={k.id} className="keyword-badge">{k.content}</span>
              ))}
            </div>
          </div>
          <div className="inspiration-card">
            <p className="section-label">创意提示</p>
            <p className="prompt-text" style={{ marginTop: 8 }}>
              &ldquo;{inspo.prompts[0]?.content}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Combination Engine */}
      <CombinationEngine />

      {/* Today's Ideas */}
      <div className="card">
        <div className="row-between" style={{ marginBottom: 20 }}>
          <h2>今日想法{todayIdeas.length > 0 && <span style={{ color: 'var(--foreground-subtle)', fontWeight: 400, marginLeft: 8 }}>{todayIdeas.length}</span>}</h2>
          <button className="btn btn-outline btn-sm" onClick={refreshInspo} disabled={loading}>
            {loading ? '刷新中...' : '刷新灵感'}
          </button>
        </div>

        {todayIdeas.length === 0 ? (
          <div className="empty-state" style={{ padding: 32 }}>
            <p>今天还没有记录想法</p>
            <Link to="/write" className="btn btn-primary">写下第一个想法</Link>
          </div>
        ) : (
          todayIdeas.map(idea => (
            <Link key={idea.id} to={`/write/${idea.id}`} style={{ textDecoration: 'none' }}>
              <div className="idea-card">
                <h3>{idea.title}</h3>
                <div className="meta">
                  {idea.tags?.length > 0
                    ? idea.tags.map(t => <span key={t} className="tag">{t}</span>)
                    : <span>无标签</span>}
                </div>
                <p>{idea.content?.slice(0, 200) || '（无正文）'}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
