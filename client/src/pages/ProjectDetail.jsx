import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProject, updateProject, deleteProject, updateChecklist,
  fetchStandups, createStandup, deleteStandup,
  fetchBlockers, createBlocker, updateBlocker, deleteBlocker,
  fetchPitches, fetchCompetitors, createCompetitor, deleteCompetitor,
  fetchSnippets, fetchApiTools } from '../api';

import KanbanBoard from '../components/KanbanBoard';
import BlockerBoard from '../components/BlockerBoard';
import StandupLog from '../components/StandupLog';
import LinkedSnippets from '../components/LinkedSnippets';
import LinksManager from '../components/LinksManager';
import TeamRoleEditor from '../components/TeamRoleEditor';
import ApiRecommendations from '../components/ApiRecommendations';
import MilestoneTimeline from '../components/MilestoneTimeline';
import TimelinePlanner from '../components/TimelinePlanner';
import SubmitChecklist from '../components/SubmitChecklist';
import JudgingSelfScore from '../components/JudgingSelfScore';
import PitchPreview from '../components/PitchPreview';
import CompetitorPanel from '../components/CompetitorPanel';
import RetroForm from '../components/RetroForm';
import ProjectStats from '../components/ProjectStats';
import SharePanel from '../components/SharePanel';

function formatCountdown(deadline) {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return '已截止';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d > 0) return `剩余 ${d}天 ${h}小时`;
  return `剩余 ${h}小时`;
}

const TABS = ['概览', '开发看板', '资源中心', '时间线', '提交&路演', '复盘'];
const STATUS_LABELS = { planning: '规划中', building: '开发中', submitted: '已提交', done: '已完成' };

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tab, setTab] = useState(0);

  // Sub-data states
  const [roles, setRoles] = useState([]);
  const [links, setLinks] = useState([]);
  const [events, setEvents] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [retro, setRetro] = useState(null);
  const [pitches, setPitches] = useState([]);

  const loadProject = async () => {
    const p = await fetchProject(id);
    setProject(p);
    return p;
  };

  const loadAll = async () => {
    const p = await loadProject();
    const [r, l, e, c, ret, plt] = await Promise.all([
      fetch(`/api/projects/${p.id}/roles`).then(r => r.json()),
      fetch(`/api/projects/${p.id}/links`).then(r => r.json()),
      fetch(`/api/projects/${p.id}/events`).then(r => r.json()),
      fetch(`/api/projects/${p.id}/judging`).then(r => r.json()),
      fetch(`/api/projects/${p.id}/retro`).then(r => r.json()),
      fetchPitches({ project_id: p.id }),
    ]);
    setRoles(r); setLinks(l); setEvents(e); setCriteria(c); setRetro(ret); setPitches(plt);
  };

  useEffect(() => { loadAll(); }, [id]);

  const update = async (data) => {
    await updateProject(id, data);
    loadProject();
  };

  const handleDelete = async () => {
    if (!confirm('删除项目？')) return;
    await deleteProject(id);
    navigate('/projects');
  };

  const callApi = async (url, method, body) => {
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  };

  const base = `/api/projects/${id}`;

  // Roles
  const addRole = (data) => callApi(`${base}/roles`, 'POST', data).then(loadAll);
  const delRole = (rid) => callApi(`${base}/roles/${rid}`, 'DELETE').then(loadAll);

  // Links
  const addLink = (data) => callApi(`${base}/links`, 'POST', data).then(loadAll);
  const delLink = (lid) => callApi(`${base}/links/${lid}`, 'DELETE').then(loadAll);

  // Events
  const addEvent = (data) => callApi(`${base}/events`, 'POST', data).then(loadAll);
  const delEvent = (eid) => callApi(`${base}/events/${eid}`, 'DELETE').then(loadAll);

  // Criteria
  const saveCriteria = (cid, data) => callApi(`${base}/judging/${cid}`, 'PUT', data).then(() =>
    fetch(`/api/projects/${id}/judging`).then(r => r.json()).then(setCriteria));

  // Retro
  const saveRetro = (data) => callApi(`${base}/retro`, 'PUT', data).then(() =>
    fetch(`/api/projects/${id}/retro`).then(r => r.json()).then(setRetro));

  // Mark submitted
  const markSubmitted = () => update({
    status: 'submitted',
    submitted_at: new Date().toISOString(),
  });

  if (!project) {
    return <div className="container"><div className="card" style={{ textAlign: 'center', padding: 60 }}><p>加载中...</p></div></div>;
  }

  const countdown = formatCountdown(project.deadline);
  const checklist = project.checklist || [];

  return (
    <div>
      {/* Header */}
      <div className="row-between" style={{ marginBottom: 24 }}>
        <div>
          <p className="section-label">{project.hackathon_name || '项目'}</p>
          <h1 className="section-title">{project.name}</h1>
          <div className="row" style={{ gap: 10, marginTop: 8 }}>
            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 9999, background: 'rgba(94,106,210,0.12)', color: 'var(--accent-bright)' }}>
              {STATUS_LABELS[project.status] || project.status}
            </span>
            {countdown && <span style={{ fontSize: 13, color: 'var(--foreground-subtle)', fontVariantNumeric: 'tabular-nums' }}>{countdown}</span>}
            {project.theme && <span className="tag">{project.theme}</span>}
          </div>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/projects')}>返回列表</button>
          <button className="btn btn-outline btn-sm" onClick={() => {
            // open edit modal from parent concept — just navigate to edit mode
            navigate('/projects');
          }}>编辑</button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>删除</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: 20 }}>
        {/* Tab 0: Overview */}
        {tab === 0 && (
          <>
            <div className="card">
              <h2>赛事信息</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
                {project.hackathon_name && <><span style={{ color: 'var(--foreground-subtle)' }}>赛事</span><span style={{ color: 'var(--foreground)' }}>{project.hackathon_name}</span></>}
                {project.theme && <><span style={{ color: 'var(--foreground-subtle)' }}>赛道</span><span style={{ color: 'var(--accent-bright)' }}>{project.theme}</span></>}
                {project.start_time && <><span style={{ color: 'var(--foreground-subtle)' }}>开始</span><span style={{ color: 'var(--foreground)' }}>{project.start_time?.slice(0, 16)}</span></>}
                {project.deadline && <><span style={{ color: 'var(--foreground-subtle)' }}>截止</span><span style={{ color: '#fc5c7c' }}>{project.deadline?.slice(0, 16)}</span></>}
                {project.prizes_targeted?.length > 0 && <><span style={{ color: 'var(--foreground-subtle)' }}>目标奖项</span><div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>{project.prizes_targeted.map(p => <span key={p} style={{ fontSize: 12, padding: '2px 8px', background: 'rgba(245,158,11,0.10)', color: '#f59e0b', borderRadius: 9999 }}>{p}</span>)}</div></>}
              </div>
            </div>

            <div className="card">
              <h2>团队角色</h2>
              <TeamRoleEditor roles={roles} onAdd={addRole} onDelete={delRole} />
            </div>

            <div className="card">
              <h2>里程碑</h2>
              <MilestoneTimeline events={events} onAdd={addEvent} onDelete={delEvent} />
            </div>
          </>
        )}

        {/* Tab 1: Dev Board */}
        {tab === 1 && (
          <>
            <div className="card">
              <h2>开发看板</h2>
              <KanbanBoard items={checklist}
                onToggle={(item, newStatus) => {
                  const updated = checklist.map(c => (c.text === item.text ? { ...c, status: newStatus } : c));
                  updateChecklist(id, updated).then(loadAll);
                }}
                onAdd={(text) => {
                  updateChecklist(id, [...checklist, { text, status: 'todo' }]).then(loadAll);
                }}
                onDelete={(item) => {
                  updateChecklist(id, checklist.filter(c => c.text !== item.text)).then(loadAll);
                }}
              />
            </div>
            <BlockerBoard projectId={Number(id)} />
            <StandupLog projectId={Number(id)} />
            <div className="card">
              <h2>关联代码片段</h2>
              <LinkedSnippets projectId={Number(id)} />
            </div>
          </>
        )}

        {/* Tab 2: Resources */}
        {tab === 2 && (
          <>
            <div className="card">
              <h2>重要链接</h2>
              <LinksManager links={links} onAdd={addLink} onDelete={delLink} />
            </div>

            <div className="card">
              <h2>技术栈</h2>
              <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {project.tech_stack?.length > 0
                  ? project.tech_stack.map(t => <span key={t} className="keyword-badge">{t}</span>)
                  : <span style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>未设置</span>}
              </div>
            </div>

            <div className="card">
              <ApiRecommendations techStack={project.tech_stack || []} />
            </div>

            <div className="card">
              <h2>快捷链接</h2>
              <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
                {project.repo_url && <a className="btn btn-outline btn-sm" href={project.repo_url} target="_blank" rel="noopener">GitHub</a>}
                {project.figma_url && <a className="btn btn-outline btn-sm" href={project.figma_url} target="_blank" rel="noopener">Figma</a>}
                {project.devpost_url && <a className="btn btn-outline btn-sm" href={project.devpost_url} target="_blank" rel="noopener">Devpost</a>}
                {!project.repo_url && !project.figma_url && !project.devpost_url && <span style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>还没设置快捷链接（编辑项目添加）</span>}
              </div>
            </div>
          </>
        )}

        {/* Tab 3: Timeline */}
        {tab === 3 && (
          <>
            <TimelinePlanner projectDeadline={project.deadline} projectId={Number(id)} />
            <div className="card">
              <h2>关键里程碑</h2>
              <MilestoneTimeline events={events} onAdd={addEvent} onDelete={delEvent} />
            </div>
          </>
        )}

        {/* Tab 4: Submit & Pitch */}
        {tab === 4 && (
          <>
            <div className="card">
              <h2>提交准备</h2>
              <SubmitChecklist project={project} onMarkSubmitted={markSubmitted} onUpdateSubmission={update} />
            </div>

            <div className="card">
              <h2>评审自评</h2>
              <JudgingSelfScore criteria={criteria} onSave={saveCriteria} />
            </div>

            <div className="card">
              <h2>竞品速查</h2>
              <CompetitorPanel projectId={Number(id)} />
            </div>

            <div className="card">
              <h2>路演准备</h2>
              <PitchPreview pitches={pitches} project={project} />
            </div>

            <SharePanel type="project" data={project} />
          </>
        )}

        {/* Tab 5: Retrospective */}
        {tab === 5 && (
          <>
            <div className="card">
              <h2>项目复盘</h2>
              <RetroForm retro={retro} onSave={saveRetro} />
            </div>
            <div className="card">
              <h2>项目统计</h2>
              <ProjectStats project={project} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
