import { useState } from 'react';

const COLS = [
  { key: 'todo', label: '待做', color: 'var(--foreground-subtle)' },
  { key: 'in_progress', label: '进行中', color: 'var(--accent-bright)' },
  { key: 'done', label: '已完成', color: '#5CE0D4' },
];

export default function KanbanBoard({ items, onToggle, onAdd, onDelete }) {
  const [newText, setNewText] = useState('');
  const statuses = COLS.map(c => c.key);

  const add = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAdd(newText.trim());
    setNewText('');
  };

  const cycleStatus = (item) => {
    const idx = statuses.indexOf(item.status || 'todo');
    const next = statuses[(idx + 1) % statuses.length];
    onToggle(item, next);
  };

  return (
    <div>
      <div className="kanban-columns">
        {COLS.map(col => {
          const colItems = items.filter(i => (i.status || 'todo') === col.key);
          return (
            <div key={col.key} className="kanban-col">
              <div className="row-between" style={{ marginBottom: 10 }}>
                <h3 style={{ color: col.color }}>{col.label}</h3>
                <span style={{ fontSize: 12, color: 'var(--foreground-subtle)' }}>{colItems.length}</span>
              </div>
              {colItems.map((item, i) => (
                <div key={i} className="blocker-card" style={{ cursor: 'pointer', fontSize: 13 }}
                  onClick={() => cycleStatus(item)}>
                  <div className="row-between">
                    <span style={{ flex: 1, color: item.status === 'done' ? 'var(--foreground-subtle)' : 'var(--foreground)',
                      textDecoration: item.status === 'done' ? 'line-through' : 'none' }}>{item.text}</span>
                    <button className="btn btn-danger btn-sm" style={{ padding: '2px 6px', fontSize: 11 }}
                      onClick={e => { e.stopPropagation(); onDelete(item); }}>x</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <form onSubmit={add} className="row" style={{ gap: 6, marginTop: 8 }}>
        <input className="form-input" style={{ flex: 1, padding: '6px 10px', fontSize: 13 }} value={newText}
          onChange={e => setNewText(e.target.value)} placeholder="添加任务..." />
        <button type="submit" className="btn btn-outline btn-sm">+</button>
      </form>
    </div>
  );
}
