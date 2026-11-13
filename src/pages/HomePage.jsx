import { useMemo, useState } from 'react'
import { adaptDaySchedule, todayISO } from '../utils/schedule'
import './HomePage.css'

const CYCLES = [
  { id: 'physical', name: 'Физический', period: 23, color: '#078b91' },
  { id: 'emotional', name: 'Эмоциональный', period: 28, color: '#e76591' },
  { id: 'intellectual', name: 'Интеллектуальный', period: 33, color: '#6046ed' },
]

function rhythmValue(birthDate, date, period) {
  const birth = new Date(`${birthDate}T00:00:00`)
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const elapsed = Math.floor((day - birth) / 86400000)
  return Math.round(Math.sin((2 * Math.PI * elapsed) / period) * 100)
}

function dateText(date) {
  return new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
}

function HomePage({ profile, tasks, onTasksChange, onOpenProfile, onOpenBiorhythms, onOpenTasks, onOpenSchedule }) {
  const [expandedId, setExpandedId] = useState(null)
  const today = new Date()
  const todayKey = todayISO()
  const todayTasks = tasks.filter((task) => (task.date || todayKey) === todayKey)
  const rhythms = CYCLES.map((cycle) => ({ ...cycle, value: rhythmValue(profile.birthDate, today, cycle.period) }))

  const stats = useMemo(() => {
    const active = todayTasks.filter((task) => task.status !== 'cancelled')
    const completed = active.filter((task) => task.status === 'completed').length
    const overdue = active.filter((task) => task.status === 'overdue').length
    return {
      total: active.length,
      completed,
      overdue,
      pending: active.length - completed - overdue,
      percent: active.length ? Math.round((completed / active.length) * 100) : 0,
    }
  }, [todayTasks])

  const recommendation = useMemo(() => {
    const best = [...rhythms].sort((a, b) => b.value - a.value)[0]
    return `Сейчас наибольшее расчётное значение у физического, эмоционального или интеллектуального цикла: ${best.name.toLowerCase()} (${best.value > 0 ? '+' : ''}${best.value}%). Используй подсказку как ориентир, учитывая самочувствие и реальные планы.`
  }, [rhythms])

  const chartLines = useMemo(() => CYCLES.map((cycle) => {
    const points = Array.from({ length: 15 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index - 7)
      const value = rhythmValue(profile.birthDate, date, cycle.period)
      return `${10 + index * 42.8},${75 - value * 0.31}`
    }).join(' ')
    return { ...cycle, points }
  }), [profile.birthDate])

  function openCreate() {
    onOpenTasks()
  }

  function editTask() {
    onOpenTasks()
  }

  function setStatus(id, status) {
    const next = tasks.map((task) => task.id === id ? { ...task, status } : task)
    onTasksChange(adaptDaySchedule(next, todayKey))
  }

  function removeTask(id) {
    if (window.confirm('Удалить эту задачу?')) {
      onTasksChange(tasks.filter((task) => task.id !== id))
      setExpandedId(null)
    }
  }

  const nextCritical = useMemo(() => {
    for (let offset = 0; offset <= 35; offset += 1) {
      const date = new Date(today)
      date.setDate(today.getDate() + offset)
      const crossed = CYCLES.filter((cycle) => {
        const current = rhythmValue(profile.birthDate, date, cycle.period)
        const tomorrow = new Date(date)
        tomorrow.setDate(date.getDate() + 1)
        const next = rhythmValue(profile.birthDate, tomorrow, cycle.period)
        return current === 0 || next === 0 || current * next < 0
      })
      if (crossed.length) return { date, crossed }
    }
    return null
  }, [profile.birthDate])

  return (
    <main className="home-page">
      <div className="home-content">
        <header className="home-header">
          <div>
            <p className="home-date">{dateText(today)}</p>
            <h1 className="home-title">Привет, {profile.name}!</h1>
            <p className="home-subtitle">Вот как проходит твой день</p>
          </div>
          <button className="home-avatar" onClick={onOpenProfile} aria-label="Открыть профиль">{(profile.name || 'П')[0]}</button>
        </header>

        <section className="home-rhythm-card">
          <div className="home-rhythm-card-top">
            <div>
              <p className="home-eyebrow">ТВОЙ РИТМ СЕГОДНЯ</p>
              <p className="home-rhythm-date">{dateText(today)}</p>
            </div>
            <div className="home-orbit-art" aria-hidden="true"><span /><i /><b /></div>
          </div>
          <div className="home-rhythm-values">
            {rhythms.map((rhythm) => (
              <div className="home-rhythm-row" key={rhythm.id}>
                <div className="home-rhythm-row-label">
                  <span>{rhythm.name}</span>
                  <strong style={{ color: rhythm.color }}>{rhythm.value > 0 ? '+' : ''}{rhythm.value}%</strong>
                </div>
                <div className="home-rhythm-track">
                  <span className="home-rhythm-zero" />
                  <span className="home-rhythm-progress" style={{
                    background: rhythm.color,
                    left: rhythm.value < 0 ? `${50 + rhythm.value / 2}%` : '50%',
                    width: `${Math.abs(rhythm.value) / 2}%`,
                  }} />
                </div>
              </div>
            ))}
          </div>
          <p className="home-model-note">Расчётные значения математической модели биоритмов</p>
        </section>

        <div className="home-dashboard-grid">
          <div className="home-main-column">
            <section className="home-card home-chart-card">
              <div className="home-section-head">
                <div><p className="home-eyebrow">ДИНАМИКА</p><h2>График биоритмов</h2></div>
                <span className="home-period-label">7 дней</span>
              </div>
              <svg className="home-chart" viewBox="0 0 620 150" preserveAspectRatio="none" role="img" aria-label="График трёх биоритмов">
                {[15, 45, 75, 105, 135].map((y) => <line key={y} x1="8" x2="612" y1={y} y2={y} className="home-chart-grid" />)}
                <line x1="310" x2="310" y1="8" y2="142" className="home-chart-today" />
                {chartLines.map((line) => <polyline key={line.id} points={line.points} fill="none" stroke={line.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />)}
              </svg>
              <div className="home-chart-legend">
                {CYCLES.map((cycle) => <span key={cycle.id}><i style={{ background: cycle.color }} />{cycle.name}</span>)}
              </div>
              <div className="home-chart-footer"><p className="home-chart-hint">Подробный прогноз на день, неделю и месяц — в разделе «Биоритмы».</p><button className="home-text-link" onClick={onOpenBiorhythms}>Открыть прогноз →</button></div>
            </section>

            <section className="home-card home-schedule-card">
              <div className="home-section-head">
                <div><p className="home-eyebrow">ПЛАН НА ДЕНЬ</p><h2>Расписание</h2></div>
                <div className="home-task-shortcuts">
                  <button onClick={onOpenTasks}>Все задачи</button>
                  <button onClick={onOpenSchedule}>Расписание</button>
                  <button className="home-add-button" onClick={openCreate} aria-label="Добавить задачу">+</button>
                </div>
              </div>
              <div className="home-task-list">
                {todayTasks.length === 0 && <p className="home-empty">Задач пока нет. Добавь первую задачу.</p>}
                {todayTasks.map((task) => (
                  <article className={`home-task status-${task.status}`} key={task.id}>
                    <button className="home-task-summary" onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}>
                      <span className="home-task-time">{task.time}</span>
                      <span className="home-task-content">
                        <span className="home-task-meta"><span>{task.type}</span><small>{task.status === 'completed' ? '✓ Выполнено' : task.status === 'overdue' ? 'Просрочено' : task.status === 'suggested' ? 'Предложено' : 'Запланировано'}</small></span>
                        <strong className={task.status === 'completed' ? 'home-task-done' : ''}>{task.title}</strong>
                        <small className="home-task-duration">{task.duration} минут · {task.priority} приоритет</small>
                      </span>
                      <span className="home-task-expand">{expandedId === task.id ? '−' : '+'}</span>
                    </button>
                    {expandedId === task.id && (
                      <div className="home-task-actions">
                        <button onClick={() => setStatus(task.id, task.status === 'completed' ? 'planned' : 'completed')}>{task.status === 'completed' ? 'Вернуть в план' : 'Отметить выполненной'}</button>
                        <button onClick={() => editTask(task)}>Изменить</button>
                        <button className="home-danger" onClick={() => removeTask(task.id)}>Удалить</button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="home-side-column">
            <section className="home-card home-stat-card">
              <p className="home-eyebrow">РЕЗУЛЬТАТ СЕГОДНЯ</p>
              <h2>Выполнение задач</h2>
              <div className="home-progress-ring" style={{ '--progress': `${stats.percent}%` }}>
                <div><strong>{stats.percent}%</strong><span>выполнено</span></div>
              </div>
              <div className="home-stat-list">
                <div><span>Всего задач</span><strong>{stats.total}</strong></div>
                <div><span>Выполнено</span><strong className="home-green">{stats.completed}</strong></div>
                <div><span>Осталось</span><strong>{stats.pending}</strong></div>
                <div><span>Просрочено</span><strong className="home-red">{stats.overdue}</strong></div>
              </div>
            </section>

            <section className="home-recommendation-card">
              <span className="home-recommendation-star">✦</span>
              <p className="home-eyebrow">ПЕРСОНАЛЬНАЯ ПОДСКАЗКА</p>
              <h2>Совет на сегодня</h2>
              <p>{recommendation}</p>
              <small>Хронотип: {profile.chronotype}</small>
            </section>

            <section className="home-card home-critical-card">
              <p className="home-eyebrow">БИОРИТМИЧЕСКИЙ КАЛЕНДАРЬ</p>
              <h2>Ближайший критический день</h2>
              {nextCritical ? <>
                <strong className="home-critical-date">{new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(nextCritical.date)}</strong>
                <p>Пересечение нулевой отметки: {nextCritical.crossed.map((cycle) => cycle.name.toLowerCase()).join(', ')}.</p>
              </> : <p>В ближайшие 35 дней пересечений не найдено.</p>}
              <small>Это математическая модель, а не медицинский прогноз.</small>
            </section>
          </aside>
        </div>
      </div>

      <nav className="home-navigation">
        <button className="home-navigation-item active"><span>⌂</span>Главная</button>
        <button className="home-navigation-item" onClick={onOpenBiorhythms}><span>⌁</span>Биоритмы</button>
        <button className="home-navigation-item" onClick={onOpenProfile}><span>♙</span>Профиль</button>
      </nav>

    </main>
  )
}

export default HomePage
