import { useState, useEffect, useRef } from 'react';
import { fetchIdeas, fetchProjects, createPitch, fetchPitches } from '../api';

export default function PitchTimer() {
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [content, setContent] = useState('');
  const [type, setType] = useState('idea');
  const [targetId, setTargetId] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pitches, setPitches] = useState([]);
  const intervalRef = useRef(null);

  const load = async () => {
    const [i, p, plt] = await Promise.all([
      fetchIdeas(), fetchProjects(),
      fetchPitches(type === 'idea' ? { idea_id: targetId } : { project_id: targetId }),
    ]);
    setIdeas(i); setProjects(p); setPitches(plt);
  };

  useEffect(() => { load(); }, [type, targetId]);

  const start = () => {
    if (seconds <= 0) return;
    setRunning(true); setFinished(false);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); setRunning(false); setFinished(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => { clearInterval(intervalRef.current); setRunning(false); };
  const reset = () => { clearInterval(intervalRef.current); setSeconds(60); setRunning(false); setFinished(false); };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const savePitch = async () => {
    if (!content.trim()) return;
    await createPitch({ [type === 'idea' ? 'idea_id' : 'project_id']: targetId || null, content, duration: 60 - seconds });
    setContent('');
    setPitches([...pitches, { content, duration: 60 - seconds, created_at: new Date().toISOString() }]);
  };

  const timerState = finished ? 'finished' : running ? 'running' : seconds < 15 ? 'warning' : '';
  const tips = [
    '先展示 demo 再说方案，抓住注意力',
    '用数据说话，一句话量化价值',
    '准备好 live demo 的 fallback 录屏',
    '结尾重复你的产品名字',
    '一个清晰的用户故事胜过十页 PPT',
  ];

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 32 }}>
        <div>
          <p className="section-label">路演</p>
          <h1 className="section-title">60 秒发布会</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={`pitch-timer ${timerState}`}>
            {seconds}
          </div>
          <div className="row" style={{ gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
            <select className="form-input" style={{ maxWidth: 60, padding: '4px 8px', fontSize: 13 }}
              value={seconds} onChange={e => { const v = Number(e.target.value); setSeconds(v); reset(); }}>
              <option value={30}>30s</option><option value={60}>60s</option><option value={90}>90s</option><option value={120}>120s</option>
            </select>
            {!running ? (
              <button className="btn btn-primary btn-sm" onClick={start}>{finished ? '重来' : '开始'}</button>
            ) : (
              <button className="btn btn-outline btn-sm" onClick={pause}>暂停</button>
            )}
            <button className="btn btn-outline btn-sm" onClick={reset}>重置</button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h2>路演技巧</h2>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          {tips.map((t, i) => (
            <span key={i} className="keyword-badge">{t}</span>
          ))}
        </div>
      </div>

      {/* Pitch Editor */}
      <div className="card">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>写你的路演稿</h2>
          <div className="row" style={{ gap: 8 }}>
            <div className="row" style={{ gap: 4 }}>
              <button className={`btn btn-sm ${type === 'idea' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setType('idea'); setTargetId(''); }}>想法</button>
              <button className={`btn btn-sm ${type === 'project' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setType('project'); setTargetId(''); }}>项目</button>
            </div>
            <select className="form-input" style={{ maxWidth: 180, padding: '4px 8px', fontSize: 13 }}
              value={targetId} onChange={e => setTargetId(e.target.value)}>
              <option value="">（不关联）</option>
              {type === 'idea'
                ? ideas.map(i => <option key={i.id} value={i.id}>{i.title}</option>)
                : projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <textarea className="form-input" value={content} onChange={e => setContent(e.target.value)}
          placeholder="写你的 60 秒路演稿..." style={{ minHeight: 160 }}
          disabled={running} />
        <div className="row" style={{ gap: 8, marginTop: 12 }}>
          <button className="btn btn-primary btn-sm" onClick={savePitch} disabled={!content.trim()}>保存路演稿</button>
          {finished && <span style={{ fontSize: 14, color: '#fc5c7c', fontWeight: 600 }}>时间到！</span>}
        </div>
      </div>

      {/* Past Pitches */}
      {pitches.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>历史路演稿 ({pitches.length})</h2>
          {pitches.map((p, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-default)' }}>
              <p style={{ fontSize: 14, color: 'var(--foreground)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{p.content}</p>
              <p style={{ fontSize: 11, color: 'var(--foreground-subtle)', marginTop: 4 }}>
                {p.created_at?.slice(0, 16)} · 用时 {p.duration || 60}s
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
