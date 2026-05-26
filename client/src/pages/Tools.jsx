import { useState, useEffect } from 'react';
import { fetchApiTools, createApiTool, fetchTechStacks, createTechStack } from '../api';

const CATS = ['all', 'auth', 'payment', 'backend', 'ai', 'hosting', 'infra', 'communication', 'search', 'cms', 'monitoring', 'maps', 'realtime', 'fintech', 'automation', 'general'];

export default function Tools() {
  const [tab, setTab] = useState('api');
  const [apiTools, setApiTools] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState([]);

  // API form
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [freeTier, setFreeTier] = useState('');
  const [useCases, setUseCases] = useState('');
  const [url, setUrl] = useState('');
  const [catNew, setCatNew] = useState('general');

  // Tech Stack form
  const [tsTitle, setTsTitle] = useState('');
  const [tsDesc, setTsDesc] = useState('');
  const [tsPros, setTsPros] = useState('');
  const [tsCons, setTsCons] = useState('');
  const [tsCurve, setTsCurve] = useState('medium');
  const [tsBestFor, setTsBestFor] = useState('');
  const [tsCommunity, setTsCommunity] = useState('');

  const loadApi = async () => {
    const params = {};
    if (category !== 'all') params.category = category;
    if (search.trim()) params.search = search.trim();
    fetchApiTools(params).then(setApiTools);
  };

  const loadTS = () => fetchTechStacks().then(setTechStacks);

  useEffect(() => { loadApi(); }, [category, search]);
  useEffect(() => { loadTS(); }, []);

  const addApi = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createApiTool({ name, description: desc, free_tier: freeTier, use_cases: useCases, url, category: catNew });
    setName(''); setDesc(''); setFreeTier(''); setUseCases(''); setUrl(''); setCatNew('general');
    setShowForm(false);
    loadApi();
  };

  const addTS = async (e) => {
    e.preventDefault();
    if (!tsTitle.trim()) return;
    await createTechStack({
      title: tsTitle, description: tsDesc,
      pros: tsPros.split(',').map(s => s.trim()).filter(Boolean),
      cons: tsCons.split(',').map(s => s.trim()).filter(Boolean),
      learning_curve: tsCurve, best_for: tsBestFor, community: tsCommunity,
    });
    setTsTitle(''); setTsDesc(''); setTsPros(''); setTsCons(''); setTsBestFor(''); setTsCommunity('');
    loadTS();
  };

  const toggleCompare = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(x => x !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
  };

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 32 }}>
        <div>
          <p className="section-label">工具箱</p>
          <h1 className="section-title">工具与决策</h1>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'api' ? 'active' : ''}`} onClick={() => setTab('api')}>API 工具集</button>
        <button className={`tab ${tab === 'techstack' ? 'active' : ''}`} onClick={() => setTab('techstack')}>技术栈对比</button>
      </div>

      {/* API Tools Tab */}
      {tab === 'api' && (
        <>
          <div className="filter-bar">
            <input className="form-input" style={{ flex: 1, minWidth: 180 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索..." />
            <select className="form-input" style={{ maxWidth: 140 }} value={category} onChange={e => setCategory(e.target.value)}>
              {CATS.map(c => <option key={c} value={c}>{c === 'all' ? '全部分类' : c}</option>)}
            </select>
            <button className="btn btn-outline btn-sm" onClick={() => setShowForm(!showForm)}>添加工具</button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom: 16 }}>
              <form onSubmit={addApi}>
                <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
                  <input className="form-input" style={{ flex: 1, minWidth: 140 }} value={name} onChange={e => setName(e.target.value)} placeholder="工具名称" />
                  <input className="form-input" style={{ flex: 1, minWidth: 140 }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="简短描述" />
                  <input className="form-input" style={{ flex: 1, minWidth: 140 }} value={freeTier} onChange={e => setFreeTier(e.target.value)} placeholder="免费额度" />
                  <input className="form-input" style={{ flex: 1, minWidth: 140 }} value={useCases} onChange={e => setUseCases(e.target.value)} placeholder="典型用途" />
                  <input className="form-input" style={{ flex: 1, minWidth: 140 }} value={url} onChange={e => setUrl(e.target.value)} placeholder="网址" />
                  <select className="form-input" style={{ maxWidth: 120 }} value={catNew} onChange={e => setCatNew(e.target.value)}>
                    {CATS.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button type="submit" className="btn btn-primary btn-sm">添加</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid-2">
            {apiTools.map(t => (
              <div key={t.id} className="card" style={{ marginBottom: 12 }}>
                <div className="row-between" style={{ marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 16, color: 'var(--foreground)' }}>{t.name}</h3>
                  <span className="tag">{t.category}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--foreground-muted)', lineHeight: 1.6 }}>{t.description}</p>
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  <p style={{ color: '#5CE0D4' }}>免费额度：{t.free_tier}</p>
                  <p style={{ color: 'var(--foreground-subtle)' }}>用途：{t.use_cases}</p>
                  {t.url && <a href={t.url} target="_blank" rel="noopener" style={{ color: 'var(--accent-bright)' }}>{t.url}</a>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tech Stack Tab */}
      {tab === 'techstack' && (
        <>
          <div className="row" style={{ marginBottom: 16, gap: 8 }}>
            <button className={`btn btn-sm ${compareMode ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setCompareMode(!compareMode); setSelected([]); }}>
              对比模式 {compareMode ? 'ON' : 'OFF'}
            </button>
            {compareMode && <span style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>选 2-3 个技术栈对比</span>}
          </div>

          {compareMode && selected.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h2>对比结果</h2>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selected.length}, 1fr)`, gap: 16 }}>
                {selected.map(id => {
                  const ts = techStacks.find(t => t.id === id);
                  if (!ts) return null;
                  return (
                    <div key={id}>
                      <h3 style={{ color: 'var(--accent-bright)', marginBottom: 8 }}>{ts.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--foreground-muted)', marginBottom: 8 }}>{ts.description}</p>
                      <div style={{ fontSize: 12, marginBottom: 4 }}><strong style={{ color: '#5CE0D4' }}>学习曲线：</strong>{ts.learning_curve}</div>
                      <div style={{ fontSize: 12, marginBottom: 4 }}><strong style={{ color: 'var(--accent-bright)' }}>适合：</strong>{ts.best_for}</div>
                      <div style={{ fontSize: 12, marginBottom: 4 }}><strong style={{ color: 'var(--foreground)' }}>优点：</strong>
                        {ts.pros.map((p, i) => <span key={i} className="tag" style={{ background: 'rgba(92,224,212,0.08)', color: '#5CE0D4' }}>{p}</span>)}
                      </div>
                      <div style={{ fontSize: 12 }}><strong style={{ color: '#fc5c7c' }}>缺点：</strong>
                        {ts.cons.map((c, i) => <span key={i} className="tag" style={{ background: 'rgba(252,92,124,0.08)', color: '#fc5c7c' }}>{c}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {techStacks.map(ts => (
            <div key={ts.id} className={`card ${compareMode && selected.includes(ts.id) ? '' : ''}`}
              style={{ marginBottom: 16, borderColor: selected.includes(ts.id) ? 'var(--accent)' : undefined }}
              onClick={() => compareMode && toggleCompare(ts.id)}
            >
              <div className="row-between" style={{ marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 17, color: 'var(--foreground)' }}>{ts.title}</h3>
                <div className="row" style={{ gap: 6 }}>
                  <span className="tag">{ts.learning_curve === '低' ? '入门友好' : ts.learning_curve === '中' ? '中等难度' : '较陡'}</span>
                  <span className="tag">{ts.community}</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: 12 }}>{ts.description}</p>
              <div className="row" style={{ gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#5CE0D4', fontWeight: 500 }}>优点：</span>
                {ts.pros.map((p, i) => <span key={i} className="tag" style={{ background: 'rgba(92,224,212,0.08)', color: '#5CE0D4' }}>{p}</span>)}
              </div>
              <div className="row" style={{ gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#fc5c7c', fontWeight: 500 }}>缺点：</span>
                {ts.cons.map((c, i) => <span key={i} className="tag" style={{ background: 'rgba(252,92,124,0.08)', color: '#fc5c7c' }}>{c}</span>)}
              </div>
              <p style={{ fontSize: 12, color: 'var(--foreground-subtle)' }}>最适合：{ts.best_for}</p>
            </div>
          ))}

          {/* Add custom tech stack */}
          <div className="card">
            <h2>添加自定义技术栈</h2>
            <form onSubmit={addTS} style={{ marginTop: 12 }}>
              <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
                <input className="form-input" style={{ flex: 1, minWidth: 140 }} value={tsTitle} onChange={e => setTsTitle(e.target.value)} placeholder="组合名称" />
                <input className="form-input" style={{ flex: 2, minWidth: 200 }} value={tsDesc} onChange={e => setTsDesc(e.target.value)} placeholder="简短描述" />
                <input className="form-input" style={{ flex: 1, minWidth: 140 }} value={tsPros} onChange={e => setTsPros(e.target.value)} placeholder="优点（逗号分隔）" />
                <input className="form-input" style={{ flex: 1, minWidth: 140 }} value={tsCons} onChange={e => setTsCons(e.target.value)} placeholder="缺点（逗号分隔）" />
                <select className="form-input" style={{ maxWidth: 110 }} value={tsCurve} onChange={e => setTsCurve(e.target.value)}>
                  <option value="低">低/入门</option><option value="中">中</option><option value="高">高/陡峭</option>
                </select>
                <input className="form-input" style={{ flex: 1, minWidth: 140 }} value={tsBestFor} onChange={e => setTsBestFor(e.target.value)} placeholder="最适合场景" />
                <button type="submit" className="btn btn-primary btn-sm">添加</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
