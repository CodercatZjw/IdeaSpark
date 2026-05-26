import { useState, useEffect } from 'react';
import { fetchSnippets, createSnippet, updateSnippet, deleteSnippet, fetchProjects } from '../api';

const LANGUAGES = ['', 'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'HTML', 'CSS', 'SQL', 'Shell', 'Other'];

export default function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterLang, setFilterLang] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [framework, setFramework] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [source, setSource] = useState('');
  const [projectId, setProjectId] = useState('');

  const load = async () => {
    const params = {};
    if (filterLang) params.language = filterLang;
    if (search.trim()) params.search = search.trim();
    const [s, p] = await Promise.all([fetchSnippets(params), fetchProjects()]);
    setSnippets(s);
    setProjects(p);
  };

  useEffect(() => { load(); }, [filterLang, search]);

  const resetForm = () => {
    setTitle(''); setLanguage(''); setFramework(''); setDescription(''); setCode(''); setSource(''); setProjectId('');
    setEditingId(null); setShowForm(false);
  };

  const openEdit = (s) => {
    setTitle(s.title); setLanguage(s.language); setFramework(s.framework);
    setDescription(s.description); setCode(s.code); setSource(s.source);
    setProjectId(s.project_id || ''); setEditingId(s.id); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    const data = { title, language, framework, description, code, source, project_id: projectId || null };
    if (editingId) {
      await updateSnippet(editingId, data);
    } else {
      await createSnippet(data);
    }
    resetForm();
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('删除这个代码片段？')) return;
    await deleteSnippet(id);
    load();
  };

  const copyCode = async (c) => {
    await navigator.clipboard.writeText(c);
    setCopiedId(c);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 32 }}>
        <div>
          <p className="section-label">代码库</p>
          <h1 className="section-title">代码片段</h1>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>添加片段</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }} onClick={resetForm} />
          <div className="card" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 101, width: '90%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', marginBottom: 0 }}>
            <h2>{editingId ? '编辑片段' : '添加片段'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
              <div className="form-group">
                <label>标题</label>
                <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="片段用途..." autoFocus />
              </div>
              <div className="row" style={{ gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>语言</label>
                  <select className="form-input" value={language} onChange={e => setLanguage(e.target.value)}>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l || '（不限）'}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>框架</label>
                  <input className="form-input" value={framework} onChange={e => setFramework(e.target.value)} placeholder="React, Flask..." />
                </div>
              </div>
              <div className="form-group">
                <label>描述</label>
                <input className="form-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="简短说明..." />
              </div>
              <div className="form-group">
                <label>代码</label>
                <textarea className="form-input code-editor" value={code} onChange={e => setCode(e.target.value)} placeholder="粘贴代码..." spellCheck={false} />
              </div>
              <div className="row" style={{ gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>来源</label>
                  <input className="form-input" value={source} onChange={e => setSource(e.target.value)} placeholder="文档链接或来源..." />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>关联项目</label>
                  <select className="form-input" value={projectId} onChange={e => setProjectId(e.target.value)}>
                    <option value="">（无）</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="row" style={{ gap: 8, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">{editingId ? '保存' : '添加'}</button>
                <button type="button" className="btn btn-outline" onClick={resetForm}>取消</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <input className="form-input" style={{ flex: 2, minWidth: 200 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索片段..." />
        <select className="form-input" style={{ maxWidth: 150 }} value={filterLang} onChange={e => setFilterLang(e.target.value)}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l || '全部语言'}</option>)}
        </select>
      </div>

      {/* Snippet List */}
      {snippets.length === 0 ? (
        <div className="card"><div className="empty-state"><p>还没有代码片段</p></div></div>
      ) : (
        snippets.map(s => (
          <div key={s.id} className="card" style={{ marginBottom: 12 }}>
            <div className="row-between" style={{ marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: 'var(--foreground)' }}>{s.title}</h3>
                <div className="row" style={{ gap: 6, marginTop: 4 }}>
                  {s.language && <span className="tag">{s.language}</span>}
                  {s.framework && <span className="tag">{s.framework}</span>}
                  {s.description && <span style={{ fontSize: 13, color: 'var(--foreground-muted)' }}>{s.description}</span>}
                </div>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--foreground-subtle)' }}>{s.created_at?.slice(0, 10)}</span>
                <button className="btn btn-outline btn-sm" onClick={() => copyCode(s.code)}>
                  {copiedId === s.code ? '已复制!' : '复制'}
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>编辑</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>删除</button>
              </div>
            </div>
            <div className="code-block">
              <div className="copy-btn">
                <button className="btn btn-outline btn-sm" onClick={() => copyCode(s.code)}>
                  {copiedId === s.code ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {s.code}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
