import { useState, useEffect } from 'react';
import { fetchInspirations, addInspiration } from '../api';

const CATEGORIES = ['all', 'tech', 'business', 'design', 'general', 'wild', 'custom'];

export default function InspirationLib() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('keyword');
  const [category, setCategory] = useState('all');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('custom');

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
    await addInspiration({ type, content: newContent.trim(), category: newCategory });
    setNewContent('');
    load();
  };

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 24 }}>
        <h1 className="section-title" style={{ margin: 0 }}>灵感词库</h1>
        <div className="row" style={{ gap: 4 }}>
          <button className={`btn btn-sm ${type === 'keyword' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setType('keyword')}>关键词</button>
          <button className={`btn btn-sm ${type === 'prompt' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setType('prompt')}>提示语</button>
        </div>
      </div>

      {/* Category filter */}
      <div className="filter-bar">
        {CATEGORIES.map(c => (
          <button key={c}
            className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setCategory(c)}
          >{c === 'all' ? '全部' : c}</button>
        ))}
      </div>

      {/* Items */}
      <div className="card">
        <div className="row" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {type === 'keyword' ? (
            items.map(item => (
              <span key={item.id} className="keyword-badge">{item.content}</span>
            ))
          ) : (
            items.map(item => (
              <div key={item.id} style={{
                padding: '12px 0', borderBottom: '1px solid var(--border)',
                textAlign: 'left', fontSize: 15, color: 'var(--text-bright)'
              }}>
                "{item.content}"
                <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-dim)' }}>{item.category}</span>
              </div>
            ))
          )}
          {items.length === 0 && (
            <div className="empty-state" style={{ padding: 24 }}><p>暂无内容</p></div>
          )}
        </div>
      </div>

      {/* Add new */}
      <div className="card">
        <h2>添加自定义{type === 'keyword' ? '关键词' : '提示语'}</h2>
        <form onSubmit={handleAdd} className="row" style={{ flexWrap: 'wrap', marginTop: 8 }}>
          <input className="form-input" style={{ flex: 1, minWidth: 200 }}
            value={newContent} onChange={e => setNewContent(e.target.value)}
            placeholder={type === 'keyword' ? '输入关键词...' : '输入提示语...'} />
          {type === 'keyword' ? (
            <select className="form-input" style={{ maxWidth: 120 }} value={newCategory}
              onChange={e => setNewCategory(e.target.value)}>
              {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : null}
          <button type="submit" className="btn btn-primary btn-sm">添加</button>
        </form>
      </div>
    </div>
  );
}
