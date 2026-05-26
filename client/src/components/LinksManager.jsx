import { useState, useEffect } from 'react';

const CATS = ['dev_env', 'api_doc', 'tutorial', 'template', 'design_ref', 'tool', 'other'];
const CAT_LABELS = { dev_env: '开发环境', api_doc: 'API 文档', tutorial: '教程', template: '模板', design_ref: '设计参考', tool: '工具', other: '其他' };

export default function LinksManager({ links, onAdd, onDelete }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [cat, setCat] = useState('other');

  const add = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onAdd({ title: title.trim(), url: url.trim(), category: cat });
    setTitle(''); setUrl(''); setCat('other');
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {links.map(l => (
          <div key={l.id} className="row-between" style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row" style={{ gap: 8 }}>
                <a href={l.url} target="_blank" rel="noopener" style={{ fontSize: 14, color: 'var(--accent-bright)', fontWeight: 500, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {l.title}
                </a>
                <span className="tag">{CAT_LABELS[l.category] || l.category}</span>
              </div>
            </div>
            <button className="btn btn-danger btn-sm" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => onDelete(l.id)}>x</button>
          </div>
        ))}
        {links.length === 0 && <p style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>还没有保存链接</p>}
      </div>
      <form onSubmit={add} className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
        <input className="form-input" style={{ flex: 1, minWidth: 120, padding: '6px 10px', fontSize: 13 }} value={title} onChange={e => setTitle(e.target.value)} placeholder="标题" />
        <input className="form-input" style={{ flex: 1.5, minWidth: 160, padding: '6px 10px', fontSize: 13 }} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
        <select className="form-input" style={{ maxWidth: 100, padding: '6px 10px', fontSize: 13 }} value={cat} onChange={e => setCat(e.target.value)}>
          {CATS.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
        </select>
        <button type="submit" className="btn btn-primary btn-sm">添加</button>
      </form>
    </div>
  );
}
