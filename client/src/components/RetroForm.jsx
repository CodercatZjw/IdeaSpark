import { useState, useEffect } from 'react';

export default function RetroForm({ retro, onSave }) {
  const [wentWell, setWentWell] = useState('');
  const [wentWrong, setWentWrong] = useState('');
  const [learned, setLearned] = useState('');
  const [nextTime, setNextTime] = useState('');
  const [continueProj, setContinueProj] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (retro) {
      setWentWell(retro.went_well || '');
      setWentWrong(retro.went_wrong || '');
      setLearned(retro.learned || '');
      setNextTime(retro.next_time || '');
      setContinueProj(!!retro.continue_project);
      setRating(retro.overall_rating || 0);
    }
  }, [retro]);

  const save = () => {
    onSave({ went_well: wentWell, went_wrong: wentWrong, learned, next_time: nextTime, continue_project: continueProj ? 1 : 0, overall_rating: rating });
  };

  const fields = [
    { label: '✅ 做对了什么', value: wentWell, set: setWentWell, ph: '哪些决策、做法、分工是成功的？' },
    { label: '❌ 哪里可以改进', value: wentWrong, set: setWentWrong, ph: '什么没做好？时间分配、技术选型、沟通？' },
    { label: '📖 学到了什么', value: learned, set: setLearned, ph: '新的技术、经验、教训？' },
    { label: '💡 下次怎么做', value: nextTime, set: setNextTime, ph: '如果重来一次，会改变什么？' },
  ];

  return (
    <div>
      {fields.map(f => (
        <div className="form-group" key={f.label}>
          <label>{f.label}</label>
          <textarea className="form-input" style={{ minHeight: 80 }} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} />
        </div>
      ))}
      <div className="row" style={{ gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
        <label className="row" style={{ gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--foreground)' }}>
          <input type="checkbox" checked={continueProj} onChange={e => setContinueProj(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          继续这个项目
        </label>
        <div className="row" style={{ gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>整体评分:</span>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <span key={n} onClick={() => setRating(n)} style={{
              cursor: 'pointer', fontSize: 16, color: n <= rating ? '#f59e0b' : 'var(--border-default)',
              transition: 'color 150ms',
            }}>{n <= rating ? '★' : '☆'}</span>
          ))}
        </div>
      </div>
      <button className="btn btn-primary btn-sm" onClick={save}>保存复盘</button>
    </div>
  );
}
