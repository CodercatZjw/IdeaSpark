import { useState, useEffect } from 'react';
import { fetchStandups, createStandup, deleteStandup } from '../api';

export default function StandupLog({ projectId }) {
  const [standups, setStandups] = useState([]);
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockersText, setBlockersText] = useState('');
  const [author, setAuthor] = useState('');

  const load = () => fetchStandups(projectId).then(setStandups);

  useEffect(() => { load(); }, [projectId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!author.trim()) return;
    await createStandup(projectId, {
      author: author.trim(), yesterday, today, blockers_text: blockersText,
      date: new Date().toISOString().slice(0, 10),
    });
    setYesterday(''); setToday(''); setBlockersText('');
    load();
  };

  return (
    <div className="card">
      <h2>每日站会日志</h2>

      <form onSubmit={submit} style={{ marginBottom: 16 }}>
        <div className="form-group">
          <label>你的名字</label>
          <input className="form-input" value={author} onChange={e => setAuthor(e.target.value)} placeholder="输入名字..." style={{ maxWidth: 200 }} />
        </div>
        <div className="form-group">
          <label>昨天完成了什么</label>
          <textarea className="form-input" style={{ minHeight: 60 }} value={yesterday} onChange={e => setYesterday(e.target.value)} placeholder="昨天做了什么..." />
        </div>
        <div className="form-group">
          <label>今天计划做什么</label>
          <textarea className="form-input" style={{ minHeight: 60 }} value={today} onChange={e => setToday(e.target.value)} placeholder="今天计划..." />
        </div>
        <div className="form-group">
          <label>遇到的障碍</label>
          <textarea className="form-input" style={{ minHeight: 60 }} value={blockersText} onChange={e => setBlockersText(e.target.value)} placeholder="什么阻碍了进度..." />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">记录站会</button>
      </form>

      <div className="timeline">
        {standups.map(s => (
          <div key={s.id} className="timeline-item">
            <div className="timeline-date">{s.date} — {s.author}</div>
            <div style={{ fontSize: 13, color: 'var(--foreground-muted)' }}>
              {s.yesterday && <p><strong style={{ color: 'var(--foreground-subtle)' }}>昨天：</strong>{s.yesterday}</p>}
              {s.today && <p><strong style={{ color: 'var(--foreground-subtle)' }}>今天：</strong>{s.today}</p>}
              {s.blockers_text && <p><strong style={{ color: '#fc5c7c' }}>障碍：</strong>{s.blockers_text}</p>}
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 4 }} onClick={() => deleteStandup(projectId, s.id).then(load)}>删除</button>
          </div>
        ))}
        {standups.length === 0 && <p style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>还没有站会记录</p>}
      </div>
    </div>
  );
}
