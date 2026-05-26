import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchIdea, createIdea, updateIdea, deleteIdea } from '../api';

export default function WriteIdea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchIdea(id).then(idea => {
        setTitle(idea.title);
        setContent(idea.content);
        setDate(idea.date);
        setTags(idea.tags || []);
      });
    }
  }, [id]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(''); }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const data = { title: title.trim(), content, date, tags };
    if (isEdit) {
      await updateIdea(id, data);
    } else {
      await createIdea(data);
    }
    navigate('/history');
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这条想法吗？')) return;
    await deleteIdea(id);
    navigate('/history');
  };

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 24 }}>
        <h1 className="section-title" style={{ margin: 0 }}>{isEdit ? '编辑想法' : '记录新想法'}</h1>
        <div className="row">
          {isEdit && <button className="btn btn-danger btn-sm" onClick={handleDelete}>删除</button>}
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/history')}>取消</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>标题</label>
          <input className="form-input" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="给你的想法起个名字..." autoFocus />
        </div>

        <div className="form-group">
          <label>日期</label>
          <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ maxWidth: 200 }} />
        </div>

        <div className="form-group">
          <label>内容</label>
          <textarea className="form-input" value={content} onChange={e => setContent(e.target.value)}
            placeholder="展开写写你的想法、思路、技术方案..." />
        </div>

        <div className="form-group">
          <label>标签</label>
          <div className="row" style={{ marginBottom: 8 }}>
            {tags.map(t => (
              <span key={t} className="chip selected">{t} <span style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => setTags(tags.filter(x => x !== t))}>&times;</span></span>
            ))}
          </div>
          <div className="row">
            <input className="form-input" style={{ maxWidth: 200 }} value={tagInput}
              onChange={e => setTagInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="输入标签按回车..." />
            <button type="button" className="btn btn-outline btn-sm" onClick={addTag}>添加</button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {isEdit ? '保存修改' : '记录想法'}
        </button>
      </form>
    </div>
  );
}
