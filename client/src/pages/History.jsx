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

  useEffect(() => {
    fetchCalendar().then(setCalendarDates);
  }, []);

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

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 24 }}>
        <h1 className="section-title" style={{ margin: 0 }}>想法历史</h1>
        <Link to="/write" className="btn btn-primary">记录想法</Link>
      </div>

      {/* Calendar */}
      <div className="card">
        <div className="row-between" style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>
            {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
          </h2>
          <div className="row">
            <button className="btn btn-outline btn-sm" onClick={prevMonth}>上月</button>
            <button className="btn btn-outline btn-sm" onClick={nextMonth}>下月</button>
          </div>
        </div>
        <div className="calendar">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d} className="day-header">{d}</div>)}
          {calendar.map((d, i) => (
            <div key={i}
              className={`day ${d?.hasIdea ? 'has-idea' : ''} ${d?.date === today ? 'today' : ''}`}
              onClick={() => d && setSelectedDate(selectedDate === d.date ? null : d.date)}
              style={{ cursor: d ? 'pointer' : 'default' }}
            >
              {d?.day || ''}
            </div>
          ))}
        </div>
        {selectedDate && (
          <div className="row" style={{ marginBottom: 12 }}>
            <span className="chip selected">{selectedDate}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setSelectedDate(null)}>清除</button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="filter-bar">
        <input className="form-input" placeholder="搜索想法..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Idea List */}
      {ideas.length === 0 ? (
        <div className="empty-state"><p>没有找到想法</p></div>
      ) : (
        ideas.map(idea => (
          <div key={idea.id} className="idea-card" onClick={() => navigate(`/write/${idea.id}`)}>
            <h3>{idea.title}</h3>
            <div className="meta">
              <span>{idea.date}</span>
              {idea.tags?.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <p>{idea.content?.slice(0, 150) || '（无正文）'}</p>
          </div>
        ))
      )}
    </div>
  );
}
