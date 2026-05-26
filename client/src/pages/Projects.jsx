import { useState, useEffect } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject, fetchIdeas } from '../api';
import ProjectCard from '../components/ProjectCard';

const STATUSES = ['planning', 'building', 'submitted', 'done'];
const STATUS_LABELS = { planning: '规划中', building: '开发中', submitted: '已提交', done: '已完成' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [allIdeas, setAllIdeas] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hackathonName, setHackathonName] = useState('');
  const [theme, setTheme] = useState('');
  const [startTime, setStartTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('planning');
  const [memberInput, setMemberInput] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [repoUrl, setRepoUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [devpostUrl, setDevpostUrl] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [prizeInput, setPrizeInput] = useState('');
  const [prizes, setPrizes] = useState([]);
  const [selectedIdeas, setSelectedIdeas] = useState([]);

  const load = async () => {
    const [projs, ideas] = await Promise.all([fetchProjects(), fetchIdeas()]);
    setProjects(projs);
    setAllIdeas(ideas);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setName(''); setDescription(''); setHackathonName(''); setTheme('');
    setStartTime(''); setDeadline(''); setStatus('planning');
    setMemberInput(''); setTeamMembers([]); setTechInput(''); setTechStack([]);
    setRepoUrl(''); setFigmaUrl(''); setDevpostUrl(''); setSubmissionUrl('');
    setPrizeInput(''); setPrizes([]); setSelectedIdeas([]);
    setEditingId(null); setShowForm(false);
  };

  const openEdit = (p) => {
    setName(p.name); setDescription(p.description);
    setHackathonName(p.hackathon_name || ''); setTheme(p.theme || '');
    setStartTime(p.start_time?.slice(0, 16) || ''); setDeadline(p.deadline?.slice(0, 16) || '');
    setStatus(p.status); setTeamMembers(p.team_members || []);
    setTechStack(p.tech_stack || []);
    setRepoUrl(p.repo_url || ''); setFigmaUrl(p.figma_url || '');
    setDevpostUrl(p.devpost_url || ''); setSubmissionUrl(p.submission_url || '');
    setPrizes(p.prizes_targeted || []);
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
    const data = {
      name: name.trim(), description, hackathon_name: hackathonName, theme,
      start_time: startTime || null, deadline: deadline || null, status,
      team_members: teamMembers, tech_stack: techStack,
      repo_url: repoUrl, figma_url: figmaUrl, devpost_url: devpostUrl,
      submission_url: submissionUrl, prizes_targeted: prizes, idea_ids: selectedIdeas,
    };
    if (editingId) { await updateProject(editingId, data); } else { await createProject(data); }
    resetForm(); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('删除这个项目？')) return;
    await deleteProject(id); load();
  };

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 32 }}>
        <div><p className="section-label">管理</p><h1 className="section-title">黑客松项目</h1></div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>新建项目</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }} onClick={resetForm} />
          <div className="card" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 101, width: '90%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', marginBottom: 0 }}>
            <h2 style={{ marginBottom: 20 }}>{editingId ? '编辑项目' : '新建黑客松项目'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>项目名称 *</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="项目名称" autoFocus /></div>

              <div className="row" style={{ gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}><label>赛事名称</label><input className="form-input" value={hackathonName} onChange={e => setHackathonName(e.target.value)} placeholder="ETHGlobal, HackFS..." /></div>
                <div className="form-group" style={{ flex: 1 }}><label>赛道/主题</label><input className="form-input" value={theme} onChange={e => setTheme(e.target.value)} placeholder="AI + Social Impact" /></div>
              </div>

              <div className="row" style={{ gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}><label>比赛开始</label><input className="form-input" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
                <div className="form-group" style={{ flex: 1 }}><label>提交截止</label><input className="form-input" type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} /></div>
              </div>

              <div className="form-group"><label>描述</label><textarea className="form-input" style={{ minHeight: 80 }} value={description} onChange={e => setDescription(e.target.value)} placeholder="项目简介..." /></div>

              <div className="row" style={{ gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}><label>状态</label><select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>{STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select></div>
                <div className="form-group" style={{ flex: 1 }}><label>提交入口链接</label><input className="form-input" value={submissionUrl} onChange={e => setSubmissionUrl(e.target.value)} placeholder="https://..." /></div>
              </div>

              <div className="form-group"><label>队员</label>
                <div className="row" style={{ marginBottom: 6 }}>{teamMembers.map(m => <span key={m} className="chip selected">{m} <span style={{ cursor: 'pointer' }} onClick={() => setTeamMembers(teamMembers.filter(x => x !== m))}>&times;</span></span>)}</div>
                <div className="row"><input className="form-input" style={{ flex: 1 }} value={memberInput} onChange={e => setMemberInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(teamMembers, setTeamMembers, memberInput, setMemberInput); } }} placeholder="队员名" /><button type="button" className="btn btn-outline btn-sm" onClick={() => addItem(teamMembers, setTeamMembers, memberInput, setMemberInput)}>添加</button></div>
              </div>

              <div className="form-group"><label>技术栈</label>
                <div className="row" style={{ marginBottom: 6 }}>{techStack.map(t => <span key={t} className="chip selected">{t} <span style={{ cursor: 'pointer' }} onClick={() => setTechStack(techStack.filter(x => x !== t))}>&times;</span></span>)}</div>
                <div className="row"><input className="form-input" style={{ flex: 1 }} value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(techStack, setTechStack, techInput, setTechInput); } }} placeholder="React, Node.js" /><button type="button" className="btn btn-outline btn-sm" onClick={() => addItem(techStack, setTechStack, techInput, setTechInput)}>添加</button></div>
              </div>

              <div className="row" style={{ gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}><label>GitHub 仓库</label><input className="form-input" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder="https://github.com/..." /></div>
                <div className="form-group" style={{ flex: 1 }}><label>Figma</label><input className="form-input" value={figmaUrl} onChange={e => setFigmaUrl(e.target.value)} placeholder="https://figma.com/..." /></div>
              </div>
              <div className="form-group"><label>Devpost</label><input className="form-input" value={devpostUrl} onChange={e => setDevpostUrl(e.target.value)} placeholder="https://devpost.com/..." /></div>

              <div className="form-group"><label>目标奖项</label>
                <div className="row" style={{ marginBottom: 6 }}>{prizes.map(p => <span key={p} style={{ fontSize: 12, padding: '2px 8px', background: 'rgba(245,158,11,0.10)', color: '#f59e0b', borderRadius: 9999 }}>{p} <span style={{ cursor: 'pointer' }} onClick={() => setPrizes(prizes.filter(x => x !== p))}>&times;</span></span>)}</div>
                <div className="row"><input className="form-input" style={{ flex: 1 }} value={prizeInput} onChange={e => setPrizeInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(prizes, setPrizes, prizeInput, setPrizeInput); } }} placeholder="Grand Prize, Best AI Hack" /><button type="button" className="btn btn-outline btn-sm" onClick={() => addItem(prizes, setPrizes, prizeInput, setPrizeInput)}>添加</button></div>
              </div>

              <div className="form-group"><label>关联想法</label>
                <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>{allIdeas.map(idea => (<span key={idea.id} className={`chip ${selectedIdeas.includes(idea.id) ? 'selected' : ''}`} onClick={() => setSelectedIdeas(prev => prev.includes(idea.id) ? prev.filter(x => x !== idea.id) : [...prev, idea.id])}>{idea.title}</span>))}{allIdeas.length === 0 && <span style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>暂无想法</span>}</div>
              </div>

              <div className="row" style={{ gap: 8, marginTop: 20 }}><button type="submit" className="btn btn-primary">{editingId ? '保存修改' : '创建项目'}</button><button type="button" className="btn btn-outline" onClick={resetForm}>取消</button></div>
            </form>
          </div>
        </>
      )}

      {/* Project Cards */}
      {projects.length === 0 ? (
        <div className="card"><div className="empty-state"><p>还没有黑客松项目</p></div></div>
      ) : (
        <div className="grid-2">
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
