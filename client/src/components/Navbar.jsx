import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: '仪表盘' },
  { to: '/write', label: '写想法' },
  { to: '/history', label: '历史' },
  { to: '/projects', label: '项目' },
  { to: '/graph', label: '图谱' },
  { to: '/snippets', label: '代码' },
  { to: '/tools', label: '工具' },
  { to: '/pitch', label: '路演' },
  { to: '/inspiration', label: '灵感库' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">IdeaSpark</Link>
      <div className="nav-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={pathname === l.to ? 'active' : ''}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
