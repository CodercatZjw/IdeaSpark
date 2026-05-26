import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchIdeas, fetchRandomInspiration } from '../api';

export default function Dashboard() {
  const [todayIdeas, setTodayIdeas] = useState([]);
  const [inspo, setInspo] = useState(null);

  const today = new Date().toISOString().slice(0, 10);

  const load = async () => {
    const ideas = await fetchIdeas({ date: today });
    setTodayIdeas(ideas);
    const insp = await fetchRandomInspiration();
    setInspo(insp);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 24 }}>
        <h1 className="section-title">今日灵感</h1>
        <div className="row">
          <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>{today}</span>
          <Link to="/write" className="btn btn-primary">记录想法</Link>
        </div>
      </div>

      {/* Random Inspiration */}
      {inspo && (
        <div className="grid-2" style={{ marginBottom: 28 }}>
          <div className="inspiration-card">
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 12 }}>关键词组合</p>
            <div>
              {inspo.keywords.map(k => (
                <span key={k.id} className="keyword-badge">{k.content}</span>
              ))}
            </div>
          </div>
          <div className="inspiration-card">
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 12 }}>创意提示</p>
            <p className="prompt-text">"{inspo.prompts[0]?.content}"</p>
          </div>
        </div>
      )}

      {/* Today's Ideas */}
      <div className="card">
        <div className="row-between" style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>今日想法 {todayIdeas.length > 0 && `(${todayIdeas.length})`}</h2>
          <button className="btn btn-outline btn-sm" onClick={load}>刷新灵感</button>
        </div>
        {todayIdeas.length === 0 ? (
          <div className="empty-state" style={{ padding: 24 }}>
            <p>今天还没有记录想法</p>
            <Link to="/write" className="btn btn-primary">写一个</Link>
          </div>
        ) : (
          todayIdeas.map(idea => (
            <Link key={idea.id} to={`/write/${idea.id}`} style={{ textDecoration: 'none' }}>
              <div className="idea-card">
                <h3>{idea.title}</h3>
                <div className="meta">{idea.tags?.map(t => <span key={t} className="tag">{t}</span>)}</div>
                <p>{idea.content?.slice(0, 200) || '（无正文）'}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
