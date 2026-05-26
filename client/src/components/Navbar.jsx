import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/', label: '仪表盘' },
    { to: '/write', label: '写想法' },
    { to: '/history', label: '历史' },
    { to: '/inspiration', label: '灵感库' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">IdeaSpark</Link>
      <div className="nav-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
