import { useState, useEffect } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject, updateChecklist, fetchIdeas } from '../api';

const STATUSES = ['planning', 'building', 'submitted', 'done'];
const STATUS_LABELS = { planning: '规划中', building: '开发中', submitted: '已提交', done: '已完成' };

function formatCountdown(deadline) {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return '已截止';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days}天 ${hours}小时`;
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [allIdeas, setAllIdeas] = useState([]);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('planning');
  const [memberInput, setMemberInput] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [selectedIdeas, setSelectedIdeas] = useState([]);

  const load = async () => {
    const [projs, ideas] = await Promise.all([fetchProjects(), fetchIdeas()]);
    setProjects(projs);
    setAllIdeas(ideas);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setName(''); setDescription(''); setDeadline(''); setStatus('planning');
    setMemberInput(''); setTeamMembers([]); setTechInput(''); setTechStack([]);
    setSelectedIdeas([]); setEditingId(null); setShowForm(false);
  };

  const openEdit = (p) => {
    setName(p.name); setDescription(p.description); setDeadline(p.deadline || '');
    setStatus(p.status); setTeamMembers(p.team_members || []);
    setTechStack(p.tech_stack || []);
    setSelectedIdeas((p.ideas || []).map(i => i.id));
    setEditingId(p.id); setShowForm(true);
  };

  const addItem = (list, setList, input, setInput) => {
    const v = input.trim();
    if (v && !list.includes(v)) { setList([...list, v]); setInput(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const data = { name: name.trim(), description, deadline: deadline || null, status, team_members: teamMembers, tech_stack: techStack, idea_ids: selectedIdeas };
    if (editingId) {
      await updateProject(editingId, data);
    } else {
      await createProject(data);
    }
    resetForm();
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('删除这个项目？')) return;
    await deleteProject(id);
    load();
  };

  const toggleCheckItem = async (projectId, index) => {
    const proj = projects.find(p => p.id === projectId);
    const checklist = [...proj.checklist];
    checklist[index] = { ...checklist[index], done: !checklist[index].done };
    await updateChecklist(projectId, checklist);
    load();
  };

  const addCheckItem = async (projectId, text) => {
    if (!text.trim()) return;
    const proj = projects.find(p => p.id === projectId);
    const checklist = [...proj.checklist, { text: text.trim(), done: false }];
    await updateChecklist(projectId, checklist);
    load();
  };

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 32 }}>
        <div>
          <p className="section-label">管理</p>
          <h1 className="section-title">黑客松项目</h1>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          新建项目
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <>
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} onClick={() => resetForm()} />
          <div className="card" style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 101, width: '90%', maxWidth: 540, maxHeight: '90vh', overflow: 'auto',
            marginBottom: 0,
          }}>
            <h2 style={{ marginBottom: 20 }}>{editingId ? '编辑项目' : '新建项目'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>项目名称</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="项目名称..." autoFocus />
              </div>
              <div className="form-group">
                <label>描述</label>
                <textarea className="form-input" style={{ minHeight: 80 }} value={description} onChange={e => setDescription(e.target.value)} placeholder="项目简介..." />
              </div>
              <div className="row" style={{ gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>截止日期</label>
                  <input className="form-input" type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>状态</label>
                  <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>队员</label>
                <div className="row" style={{ marginBottom: 6 }}>
                  {teamMembers.map(m => <span key={m} className="chip selected">{m} <span style={{ cursor: 'pointer' }} onClick={() => setTeamMembers(teamMembers.filter(x => x !== m))}>&times;</span></span>)}
                </div>
                <div className="row">
                  <input className="form-input" style={{ flex: 1 }} value={memberInput} onChange={e => setMemberInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(teamMembers, setTeamMembers, memberInput, setMemberInput); } }} placeholder="队员名..." />
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => addItem(teamMembers, setTeamMembers, memberInput, setMemberInput)}>添加</button>
                </div>
              </div>
              <div className="form-group">
                <label>技术栈</label>
                <div className="row" style={{ marginBottom: 6 }}>
                  {techStack.map(t => <span key={t} className="chip selected">{t} <span style={{ cursor: 'pointer' }} onClick={() => setTechStack(techStack.filter(x => x !== t))}>&times;</span></span>)}
                </div>
                <div className="row">
                  <input className="form-input" style={{ flex: 1 }} value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(techStack, setTechStack, techInput, setTechInput); } }} placeholder="React, Node.js..." />
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => addItem(techStack, setTechStack, techInput, setTechInput)}>添加</button>
                </div>
              </div>
              <div className="form-group">
                <label>关联想法</label>
                <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
                  {allIdeas.map(idea => (
                    <span key={idea.id}
                      className={`chip ${selectedIdeas.includes(idea.id) ? 'selected' : ''}`}
                      onClick={() => setSelectedIdeas(prev => prev.includes(idea.id) ? prev.filter(x => x !== idea.id) : [...prev, idea.id])}
                    >{idea.title}</span>
                  ))}
                  {allIdeas.length === 0 && <span style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>暂无想法，先去记录一些</span>}
                </div>
              </div>
              <div className="row" style={{ gap: 8, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary">{editingId ? '保存修改' : '创建项目'}</button>
                <button type="button" className="btn btn-outline" onClick={resetForm}>取消</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Project Cards */}
      {projects.length === 0 ? (
        <div className="card">
          <div className="empty-state"><p>还没有黑客松项目</p></div>
        </div>
      ) : (
        <div className="grid-2">
          {projects.map(p => (
            <div key={p.id} className="card" style={{ position: 'relative' }}>
              <div className="row-between" style={{ marginBottom: 12 }}>
                <h2 style={{ margin: 0 }}>{p.name}</h2>
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 9999,
                  background: p.status === 'done' ? 'rgba(92,224,212,0.12)' : 'rgba(94,106,210,0.12)',
                  color: p.status === 'done' ? 'var(--accent2)' : 'var(--accent-bright)',
                }}>
                  {STATUS_LABELS[p.status]}
                </span>
              </div>

              {p.deadline && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{
                    fontSize: 13, color: new Date(p.deadline).getTime() - Date.now() < 86400000 ? '#fc5c7c' : 'var(--foreground-subtle)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {formatCountdown(p.deadline)}
                  </span>
                </div>
              )}

              {p.description && <p style={{ fontSize: 14, color: 'var(--foreground-muted)', marginBottom: 12, lineHeight: 1.6 }}>{p.description}</p>}

              {p.team_members?.length > 0 && (
                <div className="row" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 4 }}>
                  {p.team_members.map(m => <span key={m} className="tag">{m}</span>)}
                </div>
              )}
              {p.tech_stack?.length > 0 && (
                <div className="row" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 4 }}>
                  {p.tech_stack.map(t => <span key={t} className="keyword-badge" style={{ padding: '2px 10px', fontSize: 12 }}>{t}</span>)}
                </div>
              )}

              {p.ideas?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--foreground-subtle)' }}>关联想法：</span>
                  {p.ideas.map(i => <span key={i.id} className="tag" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--foreground-muted)' }}>{i.title}</span>)}
                </div>
              )}

              {/* Checklist */}
              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12, marginTop: 8 }}>
                {p.checklist.map((item, i) => (
                  <div key={i} className="row" style={{ gap: 8, marginBottom: 6 }}>
                    <input type="checkbox" checked={item.done} onChange={() => toggleCheckItem(p.id, i)}
                      style={{ accentColor: 'var(--accent)' }} />
                    <span style={{
                      fontSize: 13, color: item.done ? 'var(--foreground-subtle)' : 'var(--foreground)',
                      textDecoration: item.done ? 'line-through' : 'none', flex: 1,
                    }}>{item.text}</span>
                  </div>
                ))}
                <form onSubmit={e => { e.preventDefault(); addCheckItem(p.id, e.target.elements.check.value); e.target.elements.check.value = ''; }}
                  className="row" style={{ gap: 6, marginTop: 4 }}>
                  <input name="check" className="form-input" style={{ flex: 1, padding: '6px 10px', fontSize: 13 }} placeholder="添加待办..." />
                  <button type="submit" className="btn btn-outline btn-sm">+</button>
                </form>
              </div>

              <div className="row" style={{ gap: 6, marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>编辑</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>删除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
