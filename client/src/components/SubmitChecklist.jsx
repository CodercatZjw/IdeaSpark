import { useState } from 'react';

const DEFAULT_ITEMS = [
  'README.md 写好了（项目描述、截图、技术栈、安装步骤）',
  '录制了 2-3 分钟 Demo 视频',
  'Devpost / 赛事平台项目描述完整',
  '所有环境变量和密钥已从代码中移除',
  '在另一台设备上测试过可以运行',
  '所有队员确认提交内容无误',
  '至少提前 30 分钟提交',
];

export default function SubmitChecklist({ project, onMarkSubmitted, onUpdateSubmission }) {
  const [submissionUrl, setSubmissionUrl] = useState(project.submission_url || '');
  const [submissionNotes, setSubmissionNotes] = useState(project.submission_notes || '');
  const [checked, setChecked] = useState([]);
  const submitted = !!project.submitted_at;

  const toggle = (i) => {
    if (checked.includes(i)) setChecked(checked.filter(x => x !== i));
    else setChecked([...checked, i]);
  };

  const allChecked = DEFAULT_ITEMS.length === checked.length;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        {DEFAULT_ITEMS.map((item, i) => (
          <div key={i} className="row" style={{ gap: 10, marginBottom: 8 }}>
            <input type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)}
              style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
            <span style={{ fontSize: 14, color: checked.includes(i) ? 'var(--foreground-subtle)' : 'var(--foreground)' }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="row" style={{ gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
          <label>提交入口链接</label>
          <input className="form-input" style={{ padding: '6px 10px', fontSize: 13 }} value={submissionUrl} onChange={e => setSubmissionUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
          <label>提交备注</label>
          <input className="form-input" style={{ padding: '6px 10px', fontSize: 13 }} value={submissionNotes} onChange={e => setSubmissionNotes(e.target.value)} placeholder="用了什么 API、特殊配置..." />
        </div>
      </div>

      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-outline btn-sm" onClick={() => onUpdateSubmission({ submission_url: submissionUrl, submission_notes: submissionNotes })}>保存链接</button>
        {submitted ? (
          <span style={{ fontSize: 14, color: '#5CE0D4', fontWeight: 500 }}>
            已提交 {project.submitted_at?.slice(0, 16)}
          </span>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => { if (allChecked && confirm('确认标记为已提交？')) onMarkSubmitted(); }}>
            标记为已提交
          </button>
        )}
      </div>
    </div>
  );
}
