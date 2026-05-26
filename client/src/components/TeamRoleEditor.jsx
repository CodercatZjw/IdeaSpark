import { useState } from 'react';

const ROLES = [
  { value: 'frontend', label: '前端开发' },
  { value: 'backend', label: '后端开发' },
  { value: 'fullstack', label: '全栈' },
  { value: 'design', label: 'UI/UX 设计' },
  { value: 'pm', label: '项目管理' },
  { value: 'pitch', label: '路演答辩' },
  { value: 'ml', label: '机器学习' },
  { value: 'other', label: '其他' },
];

export default function TeamRoleEditor({ roles, onAdd, onUpdate, onDelete }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('frontend');
  const [resp, setResp] = useState('');
  const [contact, setContact] = useState('');

  const add = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ member_name: name.trim(), role, responsibilities: resp, contact });
    setName(''); setRole('frontend'); setResp(''); setContact('');
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {roles.map(r => (
          <div key={r.id} className="row-between" style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
            <div style={{ flex: 1 }}>
              <div className="row" style={{ gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{r.member_name}</span>
                <span className="tag">{ROLES.find(x => x.value === r.role)?.label || r.role}</span>
              </div>
              {(r.responsibilities || r.contact) && <div style={{ fontSize: 12, color: 'var(--foreground-subtle)', marginTop: 4, display: 'flex', gap: 12 }}>{r.responsibilities && <span>{r.responsibilities}</span>}{r.contact && <span>{r.contact}</span>}</div>}
            </div>
            <button className="btn btn-danger btn-sm" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => onDelete(r.id)}>x</button>
          </div>
        ))}
        {roles.length === 0 && <p style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>还没有添加队员</p>}
      </div>
      <form onSubmit={add} className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
        <input className="form-input" style={{ flex: 1, minWidth: 100, padding: '6px 10px', fontSize: 13 }} value={name} onChange={e => setName(e.target.value)} placeholder="名字" />
        <select className="form-input" style={{ maxWidth: 110, padding: '6px 10px', fontSize: 13 }} value={role} onChange={e => setRole(e.target.value)}>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <input className="form-input" style={{ flex: 1, minWidth: 120, padding: '6px 10px', fontSize: 13 }} value={resp} onChange={e => setResp(e.target.value)} placeholder="职责" />
        <input className="form-input" style={{ flex: 1, minWidth: 120, padding: '6px 10px', fontSize: 13 }} value={contact} onChange={e => setContact(e.target.value)} placeholder="联系方式" />
        <button type="submit" className="btn btn-primary btn-sm">添加</button>
      </form>
    </div>
  );
}
