import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchIdeas, fetchCalendar } from '../api';

export default function History() {
  const [ideas, setIdeas] = useState([]);
  const [calendarDates, setCalendarDates] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => { fetchCalendar().then(setCalendarDates); }, []);

  useEffect(() => {
    const params = {};
    if (selectedDate) params.date = selectedDate;
    if (search.trim()) params.search = search.trim();
    fetchIdeas(params).then(setIdeas);
  }, [selectedDate, search]);

  const calendar = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startOffset = first.getDay();
    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, date: ds, hasIdea: calendarDates.includes(ds) });
    }
    return days;
  }, [currentMonth, calendarDates]);

  const monthKey = `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`;
  const today = new Date().toISOString().slice(0, 10);

  const shiftMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 32 }}>
        <div>
          <p className="section-label">回顾</p>
          <h1 className="section-title">想法历史</h1>
        </div>
        <Link to="/write" className="btn btn-primary">记录想法</Link>
      </div>

      {/* Calendar */}
      <div className="card">
        <div className="row-between" style={{ marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>{monthKey}</h2>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-outline btn-sm" onClick={() => shiftMonth(-1)}>上月</button>
            <button className="btn btn-outline btn-sm" onClick={() => shiftMonth(1)}>下月</button>
          </div>
        </div>

        <div className="calendar">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} className="day-header">{d}</div>
          ))}
          {calendar.map((d, i) => (
            <div key={i}
              className={`day${d?.hasIdea ? ' has-idea' : ''}${d?.date === today ? ' today' : ''}`}
              onClick={() => d && setSelectedDate(selectedDate === d.date ? null : d.date)}
              style={{ cursor: d ? 'pointer' : 'default' }}
            >
              {d?.day || ''}
            </div>
          ))}
        </div>

        {selectedDate && (
          <div className="row">
            <span className="chip selected">{selectedDate}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setSelectedDate(null)}>清除筛选</button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="filter-bar" style={{ marginTop: 20 }}>
        <input className="form-input" placeholder="搜索想法标题或内容..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Ideas List */}
      {ideas.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: 40 }}>
            <p>没有找到想法</p>
            <Link to="/write" className="btn btn-primary">写一个新想法</Link>
          </div>
        </div>
      ) : (
        ideas.map(idea => (
          <div key={idea.id} className="idea-card" onClick={() => navigate(`/write/${idea.id}`)}>
            <div className="row-between" style={{ marginBottom: 4 }}>
              <h3 style={{ margin: 0 }}>{idea.title}</h3>
              <span style={{ fontSize: 12, color: 'var(--foreground-subtle)' }}>{idea.date}</span>
            </div>
            <div className="meta">
              {idea.tags?.length > 0
                ? idea.tags.map(t => <span key={t} className="tag">{t}</span>)
                : null}
            </div>
            <p>{idea.content?.slice(0, 150) || '（无正文）'}</p>
          </div>
        ))
      )}
    </div>
  );
}
