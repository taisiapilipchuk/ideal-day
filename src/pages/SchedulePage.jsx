import { useMemo, useState } from 'react'
import './SchedulePage.css'
import {
  adaptDaySchedule,
  getEndTime,
  getTaskConflicts,
  normalizeTasks,
  todayISO,
} from '../utils/schedule'

function SchedulePage({ tasks, onTasksChange, onOpenHome, onOpenTasks, onOpenBiorhythms, onOpenProfile }) {
  const [date, setDate] = useState(todayISO())
  const normalized = useMemo(() => normalizeTasks(tasks), [tasks])
  const dayTasks = normalized
    .filter((task) => task.date === date && task.status !== 'cancelled')
    .sort((a, b) => {
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.localeCompare(b.time)
    })

  const conflicts = useMemo(() => getTaskConflicts(normalized, date), [normalized, date])
  const totalMinutes = dayTasks.reduce((sum, task) => sum + Number(task.duration || 0), 0)
  const completedCount = dayTasks.filter((task) => task.status === 'completed').length
  const unscheduledCount = dayTasks.filter((task) => task.unscheduled || !task.time).length
  const dayLabel = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))

  function updateTime(task, value) {
    const next = normalized.map((item) => item.id === task.id
      ? { ...item, time: value, preferredTime: value, isFixed: true, unscheduled: false }
      : item)
    onTasksChange(adaptDaySchedule(next, date))
  }

  function toggleFixed(task, fixed) {
    const next = normalized.map((item) => item.id === task.id
      ? { ...item, isFixed: fixed, preferredTime: item.time || item.preferredTime }
      : item)
    onTasksChange(adaptDaySchedule(next, date))
  }

  function toggleStatus(task) {
    const status = task.status === 'completed' ? 'planned' : 'completed'
    const next = normalized.map((item) => item.id === task.id ? { ...item, status } : item)
    onTasksChange(adaptDaySchedule(next, date))
  }

  function startTask(task) {
    const next = normalized.map((item) => item.id === task.id
      ? { ...item, status: 'in_progress', isFixed: true }
      : item)
    onTasksChange(adaptDaySchedule(next, date))
  }

  function recalculate() {
    onTasksChange(adaptDaySchedule(normalized, date))
  }

  function moveDate(days) {
    const next = new Date(`${date}T00:00:00`)
    next.setDate(next.getDate() + days)
    const local = new Date(next.getTime() - next.getTimezoneOffset() * 60000)
    setDate(local.toISOString().slice(0, 10))
  }

  return (
    <main className="schedule-page">
      <div className="schedule-content">
        <header className="schedule-header">
          <div>
            <p className="schedule-eyebrow">ПЛАНИРОВАНИЕ ДНЯ</p>
            <h1>Расписание</h1>
            <p>Порядок задач, временные интервалы и корректировка плана.</p>
          </div>
          <button className="schedule-add-button" onClick={onOpenTasks}>＋ Управление задачами</button>
        </header>

        <section className="schedule-date-panel">
          <button onClick={() => moveDate(-1)} aria-label="Предыдущий день">‹</button>
          <label>
            <span>{dayLabel}</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <button onClick={() => moveDate(1)} aria-label="Следующий день">›</button>
        </section>

        <section className="schedule-summary">
          <article><span>Задач запланировано</span><strong>{dayTasks.length}</strong></article>
          <article><span>Выполнено</span><strong className="schedule-green">{completedCount}</strong></article>
          <article><span>Общая длительность</span><strong>{Math.floor(totalMinutes / 60)} ч {totalMinutes % 60} мин</strong></article>
          <article><span>Без времени</span><strong className={unscheduledCount ? 'schedule-warning' : ''}>{unscheduledCount}</strong></article>
        </section>

        <section className="schedule-timeline-panel">
          <div className="schedule-section-heading">
            <div><p className="schedule-eyebrow">ВРЕМЕННАЯ ШКАЛА</p><h2>План дня</h2></div>
            <button onClick={recalculate}>↻ Пересчитать остаток дня</button>
          </div>

          {conflicts.size > 0 && (
            <div className="schedule-alert">
              <strong>Обнаружены пересечения по времени.</strong>
              <span>Измени время одной из задач или сними закрепление, затем пересчитай расписание.</span>
            </div>
          )}

          {dayTasks.length === 0 ? (
            <div className="schedule-empty">
              <strong>На этот день задач нет</strong>
              <p>Добавь задачи, чтобы сформировать расписание.</p>
              <button onClick={onOpenTasks}>Перейти к задачам</button>
            </div>
          ) : (
            <div className="schedule-timeline">
              {dayTasks.map((task) => {
                const endTime = task.time ? getEndTime(task) : ''
                const isConflict = conflicts.has(task.id)
                return (
                  <article className={`schedule-event ${task.status === 'completed' ? 'is-completed' : ''} ${isConflict ? 'has-conflict' : ''} ${task.unscheduled ? 'is-unscheduled' : ''}`} key={task.id}>
                    <div className="schedule-event-time">
                      <strong>{task.time || '—:—'}</strong>
                      <span>{endTime || 'Время не назначено'}</span>
                      <i />
                    </div>
                    <div className="schedule-event-card">
                      <div className="schedule-event-top">
                        <span className="schedule-category">{task.type}</span>
                        <span className={`schedule-status status-${task.status}`}>{task.status === 'completed' ? 'Выполнено' : task.status === 'in_progress' ? 'Выполняется' : task.unscheduled ? 'Не размещена' : 'Запланировано'}</span>
                      </div>
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                      <div className="schedule-event-bottom">
                        <span>{task.duration} минут · {task.priority} приоритет</span>
                        {isConflict && <strong className="schedule-conflict-label">Конфликт времени</strong>}
                      </div>
                      <div className="schedule-event-controls">
                        <label>
                          <span>Начало</span>
                          <input
                            type="time"
                            value={task.time || ''}
                            disabled={task.status === 'completed' || task.status === 'in_progress'}
                            onChange={(event) => updateTime(task, event.target.value)}
                          />
                        </label>
                        <label className="schedule-fixed-toggle">
                          <input
                            type="checkbox"
                            checked={Boolean(task.isFixed)}
                            disabled={task.status === 'completed' || task.status === 'in_progress'}
                            onChange={(event) => toggleFixed(task, event.target.checked)}
                          />
                          <span>Закрепить время</span>
                        </label>
                        {task.status !== 'completed' && task.status !== 'in_progress' && (
                          <button className="schedule-start-button" onClick={() => startTask(task)}>Начать</button>
                        )}
                        {task.status === 'in_progress' && <span className="schedule-running-label">Задача выполняется</span>}
                        <button
                          className="schedule-complete-button"
                          onClick={() => toggleStatus(task)}
                        >{task.status === 'completed' ? 'Вернуть в план' : 'Выполнено'}</button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="schedule-rules">
          <strong>Как работает корректировка</strong>
          <p>Выполненные, выполняемые и задачи с закреплённым временем сохраняют свои интервалы. Остальные задачи автоматически размещаются в ближайших свободных слотах с учётом продолжительности и 10-минутного перерыва. Если свободного времени не хватает, задача помечается как неразмещённая.</p>
        </section>

        <div className="schedule-footer-nav">
          <button onClick={onOpenHome}>← Главная</button>
          <button onClick={onOpenTasks}>Задачи</button>
          <button onClick={onOpenBiorhythms}>Биоритмы</button>
          <button onClick={onOpenProfile}>Профиль</button>
        </div>
      </div>
    </main>
  )
}

export default SchedulePage
