import { useState } from 'react';
import { generateShareToken, exportMarkdown } from '../api';

export default function SharePanel({ type, data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const shareUrl = `${window.location.origin}/share/${generateShareToken(type, data.id)}`;
  const md = exportMarkdown(type, data);

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyMd = () => {
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <h2>分享与导出</h2>
      <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
        <button className="btn btn-outline btn-sm" onClick={copyUrl}>
          {copied ? '已复制!' : '复制分享链接'}
        </button>
        <button className="btn btn-outline btn-sm" onClick={copyMd}>
          导出 Markdown
        </button>
      </div>
    </div>
  );
}
