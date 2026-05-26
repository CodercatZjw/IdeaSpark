import { useState, useEffect } from 'react';
import { fetchInspirations, addInspiration } from '../api';

const CATEGORIES = ['all', 'tech', 'business', 'design', 'general', 'wild', 'custom'];

export default function InspirationLib() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('keyword');
  const [category, setCategory] = useState('all');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('custom');
  const [adding, setAdding] = useState(false);

  const load = async () => {
    const params = { type };
    if (category !== 'all') params.category = category;
    const data = await fetchInspirations(params);
    setItems(data);
  };

  useEffect(() => { load(); }, [type, category]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setAdding(true);
    await addInspiration({ type, content: newContent.trim(), category: newCategory });
    setNewContent('');
    setAdding(false);
    load();
  };

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 32 }}>
        <div>
          <p className="section-label">词库</p>
          <h1 className="section-title">灵感词库</h1>
        </div>
        <div className="row" style={{ gap: 4 }}>
          <button
            className={`btn btn-sm ${type === 'keyword' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setType('keyword')}
          >关键词</button>
          <button
            className={`btn btn-sm ${type === 'prompt' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setType('prompt')}
          >提示语</button>
        </div>
      </div>

      {/* Category filter */}
      <div className="filter-bar">
        {CATEGORIES.map(c => (
          <button key={c}
            className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setCategory(c)}
            style={{ textTransform: c === 'all' ? 'none' : 'capitalize' }}
          >
            {c === 'all' ? '全部' : c}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="card">
        {type === 'keyword' ? (
          <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap', minHeight: 60 }}>
            {items.map(item => (
              <span key={item.id} className="keyword-badge">{item.content}</span>
            ))}
          </div>
        ) : (
          <div style={{ minHeight: 60 }}>
            {items.map(item => (
              <div key={item.id} style={{
                padding: '14px 0',
                borderBottom: '1px solid var(--border-default)',
                fontSize: 15,
                color: 'var(--foreground)',
                lineHeight: 1.6,
              }}>
                &ldquo;{item.content}&rdquo;
                <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--foreground-subtle)' }}>
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        )}

        {items.length === 0 && (
          <div className="empty-state" style={{ padding: 32 }}>
            <p>暂无内容</p>
          </div>
        )}
      </div>

      {/* Add custom */}
      <div className="card" style={{ marginTop: 20 }}>
        <h2>添加自定义{type === 'keyword' ? '关键词' : '提示语'}</h2>
        <form onSubmit={handleAdd} className="row" style={{ marginTop: 16, flexWrap: 'wrap' }}>
          <input className="form-input" style={{ flex: 1, minWidth: 220 }}
            value={newContent} onChange={e => setNewContent(e.target.value)}
            placeholder={type === 'keyword' ? '输入关键词...' : '输入创意提示语...'} />
          {type === 'keyword' ? (
            <select className="form-input" style={{ maxWidth: 120 }}
              value={newCategory} onChange={e => setNewCategory(e.target.value)}>
              {CATEGORIES.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          ) : null}
          <button type="submit" className="btn btn-primary btn-sm" disabled={adding}>
            {adding ? '添加中...' : '添加'}
          </button>
        </form>
      </div>
    </div>
  );
}
