import { useState, useEffect } from 'react';
import { fetchTemplates } from '../api';

export default function TemplateSelector({ onApply }) {
  const [templates, setTemplates] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => { fetchTemplates().then(setTemplates); }, []);

  const apply = (tpl) => {
    const fields = tpl.fields;
    const title = fields[0]?.label || '';
    const content = fields.map(f => `## ${f.label}\n\n${f.hint ? `> ${f.hint}\n\n` : ''}`).join('\n');
    onApply({ title, content });
    setShow(false);
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setShow(!show)}>
        {show ? '关闭模版' : '使用模版'}
      </button>
      {show && (
        <div style={{
          position: 'absolute', zIndex: 20, marginTop: 8,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          borderRadius: 12, padding: 8, minWidth: 200,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {templates.map(tpl => (
            <button key={tpl.id}
              onClick={() => apply(tpl)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
                background: 'transparent', border: 'none', borderRadius: 8,
                color: 'var(--foreground)', fontSize: 14, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 500 }}>{tpl.name}</div>
              <div style={{ fontSize: 12, color: 'var(--foreground-subtle)', marginTop: 2 }}>{tpl.fields.length} 个字段</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
