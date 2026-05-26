export default function ProjectStats({ project }) {
  const checklist = project?.checklist || [];
  const done = checklist.filter(c => c.status === 'done' || c.done).length;

  return (
    <div className="row" style={{ justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
      {[
        { label: '总任务', value: checklist.length },
        { label: '已完成', value: done },
        { label: '关联想法', value: (project?.ideas || []).length },
      ].map(s => (
        <div key={s.label} style={{ textAlign: 'center', padding: '12px 24px' }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)', margin: 0, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
          <p style={{ fontSize: 12, color: 'var(--foreground-subtle)', marginTop: 4 }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
