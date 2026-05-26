import { useNavigate } from 'react-router-dom';

const STATUS_LABELS = { planning: '规划中', building: '开发中', submitted: '已提交', done: '已完成' };
const STATUS_COLORS = { planning: 'var(--foreground-subtle)', building: 'var(--accent-bright)', submitted: '#5CE0D4', done: 'var(--foreground-subtle)' };

function formatCountdown(deadline) {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return '已截止';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d > 0) return `剩余 ${d}天 ${h}小时`;
  return `剩余 ${h}小时`;
}

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();
  const checklist = project.checklist || [];
  const done = checklist.filter(c => c.status === 'done' || c.done).length;
  const total = checklist.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => navigate(`/projects/${project.id}`)}>
      {/* Header */}
      <div className="row-between" style={{ marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {project.hackathon_name && (
            <span style={{ fontSize: 11, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4, display: 'block' }}>
              {project.hackathon_name}
            </span>
          )}
          <h3 style={{ margin: 0, fontSize: 17, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.name}
          </h3>
        </div>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 9999, background: project.status === 'done' ? 'rgba(92,224,212,0.12)' : 'rgba(94,106,210,0.12)', color: STATUS_COLORS[project.status] || 'var(--foreground-subtle)', whiteSpace: 'nowrap' }}>
          {STATUS_LABELS[project.status] || project.status}
        </span>
      </div>

      {/* Theme & Countdown */}
      <div className="row" style={{ gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        {project.theme && <span style={{ fontSize: 12, color: 'var(--accent-bright)' }}>{project.theme}</span>}
        {project.deadline && (
          <span style={{ fontSize: 12, color: new Date(project.deadline).getTime() - Date.now() < 86400000 ? '#fc5c7c' : 'var(--foreground-subtle)', fontVariantNumeric: 'tabular-nums' }}>
            {formatCountdown(project.deadline)}
          </span>
        )}
      </div>

      {/* Team */}
      {project.team_members?.length > 0 && (
        <div className="row" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 4 }}>
          {project.team_members.map(m => <span key={m} className="tag">{m}</span>)}
        </div>
      )}

      {/* Tech + links */}
      <div className="row" style={{ gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        {project.tech_stack?.map(t => <span key={t} className="keyword-badge" style={{ padding: '2px 8px', fontSize: 11 }}>{t}</span>)}
      </div>

      {/* Progress */}
      {total > 0 && (
        <div style={{ marginTop: 8 }}>
          <div className="row-between" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--foreground-subtle)' }}>进度</span>
            <span style={{ fontSize: 11, color: 'var(--foreground-subtle)' }}>{done}/{total} ({progress}%)</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #5E6AD2, #8B5CF6)', width: `${progress}%`, transition: 'width 400ms var(--ease-expo)' }} />
          </div>
        </div>
      )}

      {/* Prizes */}
      {project.prizes_targeted?.length > 0 && (
        <div className="row" style={{ gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {project.prizes_targeted.map(p => (
            <span key={p} style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(245,158,11,0.10)', color: '#f59e0b', borderRadius: 9999 }}>{p}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="row" style={{ gap: 6, marginTop: 12, borderTop: '1px solid var(--border-default)', paddingTop: 12 }} onClick={e => e.stopPropagation()}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/projects/${project.id}`)}>进入项目</button>
        <button className="btn btn-outline btn-sm" onClick={() => onEdit(project)}>编辑</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(project.id)}>删除</button>
      </div>
    </div>
  );
}
