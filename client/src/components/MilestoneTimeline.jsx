import { useState } from 'react';

const EVENT_TYPES = [
  { value: 'idea_selected', label: '选题确定' },
  { value: 'tech_decided', label: '技术栈确定' },
  { value: 'first_commit', label: '首次提交' },
  { value: 'mvp_ready', label: 'MVP 完成' },
  { value: 'beta_ready', label: '可演示版本' },
  { value: 'submitted', label: '已提交' },
  { value: 'prize_won', label: '获奖' },
  { value: 'custom', label: '自定义' },
];

export default function MilestoneTimeline({ events, onAdd, onDelete }) {
  const [type, setType] = useState('idea_selected');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('');

  const add = (e) => {
    e.preventDefault();
    if (!time) return;
    onAdd({ event_type: type, description: desc, occurred_at: time });
    setDesc(''); setTime('');
  };

  return (
    <div>
      <div className="timeline">
        {events.map(ev => (
          <div key={ev.id} className="timeline-item">
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--foreground)' }}>
                  {EVENT_TYPES.find(x => x.value === ev.event_type)?.label || ev.event_type}
                </div>
                {ev.description && <div style={{ fontSize: 13, color: 'var(--foreground-muted)', marginTop: 2 }}>{ev.description}</div>}
                <div className="timeline-date">{ev.occured_at?.slice(0, 16) || ev.occurred_at?.slice(0, 16)}</div>
              </div>
              <button className="btn btn-danger btn-sm" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => onDelete(ev.id)}>x</button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p style={{ fontSize: 13, color: 'var(--foreground-subtle)', paddingLeft: 28 }}>还没有里程碑事件</p>}
      </div>
      <form onSubmit={add} className="row" style={{ flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        <select className="form-input" style={{ maxWidth: 130, padding: '6px 10px', fontSize: 13 }} value={type} onChange={e => setType(e.target.value)}>
          {EVENT_TYPES.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
        <input className="form-input" style={{ flex: 1, minWidth: 140, padding: '6px 10px', fontSize: 13 }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="描述（可选）" />
        <input className="form-input" style={{ maxWidth: 180, padding: '6px 10px', fontSize: 13 }} value={time} onChange={e => setTime(e.target.value)} type="datetime-local" />
        <button type="submit" className="btn btn-primary btn-sm">记录</button>
      </form>
    </div>
  );
}
