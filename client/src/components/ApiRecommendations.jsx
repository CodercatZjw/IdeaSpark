import { useState, useEffect } from 'react';
import { fetchApiTools } from '../api';

function getRecommendations(techStack) {
  if (!techStack || techStack.length === 0) return [];
  const map = {
    'react': ['Vercel', 'Clerk', 'Sentry'],
    'next.js': ['Vercel', 'Supabase', 'Clerk'],
    'firebase': ['Firebase', 'Algolia', 'Resend'],
    'supabase': ['Supabase', 'Vercel', 'Stripe'],
    'express': ['Railway', 'Sentry', 'Resend'],
    'node': ['Railway', 'Sentry', 'Upstash'],
    'python': ['Hugging Face', 'Railway', 'Sentry'],
    'ai': ['OpenAI API', 'Hugging Face', 'Supabase'],
    'ml': ['Hugging Face', 'OpenAI API', 'Railway'],
    'blockchain': ['Algolia', 'Resend', 'Sentry'],
  };
  const recs = new Set();
  for (const t of techStack) {
    const matches = map[t.toLowerCase()] || [];
    for (const m of matches) recs.add(m);
  }
  return [...recs].slice(0, 6);
}

export default function ApiRecommendations({ techStack }) {
  const [allTools, setAllTools] = useState([]);
  const recs = getRecommendations(techStack);

  useEffect(() => { fetchApiTools().then(setAllTools); }, []);

  const recommended = allTools.filter(t => recs.includes(t.name));
  if (recommended.length === 0) return null;

  return (
    <div>
      <h3 style={{ fontSize: 14, color: 'var(--foreground-muted)', marginBottom: 10 }}>推荐工具</h3>
      <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
        {recommended.map(t => (
          <div key={t.id} style={{
            padding: '8px 14px', background: 'rgba(94,106,210,0.06)',
            border: '1px solid rgba(94,106,210,0.15)', borderRadius: 10, fontSize: 13,
          }}>
            <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{t.name}</span>
            <span style={{ fontSize: 11, color: 'var(--foreground-subtle)', marginLeft: 8 }}>{t.free_tier}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
