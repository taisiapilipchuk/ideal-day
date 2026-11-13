import { useMemo, useState } from 'react'
import './TasksPage.css'
import { adaptDaySchedule, normalizeTasks, todayISO } from '../utils/schedule'

const EMPTY_DRAFT = {
  title: '',
  description: '',
  type: 'Интеллект',
  duration: '60',
  priority: 'Средний',
  date: todayISO(),
  deadline: '',
  time: '09:00',
  isFixed: false,
}

const CATEGORIES = ['Интеллект', 'Физика', 'Творчество', 'Коммуникация', 'Рутина', 'Отдых']
const PRIORITIES = ['Низкий', 'Средний', 'Высокий']

function TasksPage({ tasks, onTasksChange, onOpenHome, onOpenSchedule, onOpenBiorhythms, onOpenProfile }) {
  const [filter, setFilter] = useState('all')
  const [date, setDate] = useState(todayISO())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [formError, setFormError] = useState('')

  const normalized = useMemo(() => normalizeTasks(tasks), [tasks])
  const dayTasks = normalized.filter((task) => task.date === date)
  const filteredTasks = dayTasks.filter((task) => {
    if (filter === 'all') return task.status !== 'cancelled'
    if (filter === 'active') return task.status !== 'completed' && task.status !== 'cancelled'
    return task.status === filter
  })

  const counts = {
    all: dayTasks.filter((task) => task.status !== 'cancelled').length,
    active: dayTasks.filter((task) => task.status !== 'completed' && task.status !== 'cancelled').length,
    completed: dayTasks.filter((task) => task.status === 'completed').length,
  }

  function openNewTask() {
    setEditingId(null)
    setDraft({ ...EMPTY_DRAFT, date })
    setFormError('')
    setModalOpen(true)
  }

  function openEditTask(task) {
    setEditingId(task.id)
    setDraft({
      title: task.title,
      description: task.description || '',
      type: task.type,
      duration: String(task.duration),
      priority: task.priority,
      date: task.date,
      deadline: task.deadline || '',
      time: task.preferredTime || task.time || '09:00',
      isFixed: Boolean(task.isFixed),
    })
    setFormError('')
    setModalOpen(true)
  }

  function saveTask(event) {
    event.preventDefault()
    setFormError('')

    if (!draft.title.trim()) {
      setFormError('Укажи название задачи.')
      return
    }
    if (!draft.date) {
      setFormError('Укажи дату выполнения.')
      return
    }
    if (!draft.duration || Number(draft.duration) <= 0) {
      setFormError('Продолжительность должна быть больше нуля.')
      return
    }
    if (draft.deadline && draft.deadline < draft.date) {
      setFormError('Крайний срок не может быть раньше даты выполнения.')
      return
    }

    const task = {
      id: editingId ?? Date.now(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      type: draft.type,
      duration: Number(draft.duration),
      priority: draft.priority,
      date: draft.date,
      deadline: draft.deadline,
      time: draft.time || '09:00',
      preferredTime: draft.time || '09:00',
      isFixed: Boolean(draft.isFixed),
      status: editingId === null
        ? 'planned'
        : normalized.find((item) => item.id === editingId)?.status || 'planned',
      unscheduled: false,
    }

    const previousTask = editingId === null
      ? null
      : normalized.find((item) => item.id === editingId)
    let next = editingId === null
      ? [...normalized, task]
      : normalized.map((item) => item.id === editingId ? task : item)

    if (previousTask && previousTask.date !== task.date) {
      next = adaptDaySchedule(next, previousTask.date)
    }
    onTasksChange(adaptDaySchedule(next, task.date))
    setModalOpen(false)
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
  }

  function toggleCompleted(task) {
    const status = task.status === 'completed' ? 'planned' : 'completed'
    const next = normalized.map((item) => item.id === task.id ? { ...item, status } : item)
    onTasksChange(adaptDaySchedule(next, date))
  }

  function deleteTask(task) {
    if (!window.confirm(`Удалить задачу «${task.title}»?`)) return
    onTasksChange(normalized.filter((item) => item.id !== task.id))
  }

  function cancelForm() {
    setModalOpen(false)
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setFormError('')
  }

  return (
    <main className="tasks-page">
      <div className="tasks-content">
        <header className="tasks-page-header">
          <div>
            <p className="tasks-eyebrow">ПЛАНИРОВАНИЕ</p>
            <h1>Задачи</h1>
            <p>Создавай дела, задавай приоритеты и управляй планом дня.</p>
          </div>
          <button className="tasks-primary-button" onClick={openNewTask}>＋ Новая задача</button>
        </header>

        <section className="tasks-toolbar">
          <label className="tasks-date-label">
            <span>Дата</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <div className="tasks-toolbar-links">
            <button onClick={onOpenSchedule}>Открыть расписание →</button>
          </div>
        </section>

        <section className="tasks-summary-grid">
          <article><span>Всего задач</span><strong>{counts.all}</strong></article>
          <article><span>Активные</span><strong>{counts.active}</strong></article>
          <article><span>Выполнено</span><strong>{counts.completed}</strong></article>
        </section>

        <section className="tasks-list-panel">
          <div className="tasks-list-heading">
            <div><p className="tasks-eyebrow">СПИСОК НА ДЕНЬ</p><h2>Мои задачи</h2></div>
            <span>{new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date(`${date}T00:00:00`))}</span>
          </div>

          <div className="tasks-filters" role="tablist" aria-label="Фильтр задач">
            {[['all', `Все (${counts.all})`], ['active', `Активные (${counts.active})`], ['completed', `Выполненные (${counts.completed})`]].map(([id, label]) => (
              <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)} role="tab" aria-selected={filter === id}>{label}</button>
            ))}
          </div>

          <div className="tasks-list">
            {filteredTasks.length === 0 && (
              <div className="tasks-empty">
                <span>✓</span>
                <strong>Задач пока нет</strong>
                <p>Добавь задачу, чтобы составить расписание.</p>
                <button onClick={openNewTask}>Добавить задачу</button>
              </div>
            )}

            {filteredTasks.map((task) => (
              <article className={`task-item task-status-${task.status}`} key={task.id}>
                <button className={`task-check ${task.status === 'completed' ? 'checked' : ''}`} onClick={() => toggleCompleted(task)} aria-label={task.status === 'completed' ? 'Вернуть задачу в план' : 'Отметить задачу выполненной'}>
                  {task.status === 'completed' ? '✓' : ''}
                </button>
                <div className="task-item-main">
                  <div className="task-item-topline">
                    <span className="task-category">{task.type}</span>
                    <span className={`task-priority priority-${task.priority === 'Высокий' ? 'high' : task.priority === 'Низкий' ? 'low' : 'medium'}`}>{task.priority} приоритет</span>
                  </div>
                  <h3 className={task.status === 'completed' ? 'is-done' : ''}>{task.title}</h3>
                  {task.description && <p className="task-description">{task.description}</p>}
                  <div className="task-item-details">
                    <span>◷ {task.time || 'Не запланировано'}</span>
                    <span>{task.duration} мин.</span>
                    {task.deadline && <span>Срок: {new Intl.DateTimeFormat('ru-RU').format(new Date(`${task.deadline}T00:00:00`))}</span>}
                    {task.isFixed && <span className="task-fixed-tag">Время закреплено</span>}
                    {task.unscheduled && <span className="task-unscheduled-tag">Нет свободного времени</span>}
                  </div>
                </div>
                <div className="task-item-actions">
                  <button onClick={() => openEditTask(task)}>Изменить</button>
                  <button className="delete" onClick={() => deleteTask(task)}>Удалить</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="tasks-page-bottom">
          <button onClick={onOpenHome}>← Главная</button>
          <button onClick={onOpenBiorhythms}>Биоритмы</button>
          <button onClick={onOpenProfile}>Профиль</button>
        </div>
      </div>

      {modalOpen && (
        <div className="task-form-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) cancelForm() }}>
          <form className="task-form-card" onSubmit={saveTask}>
            <div className="task-form-heading">
              <div><p className="tasks-eyebrow">КАРТОЧКА ЗАДАЧИ</p><h2>{editingId === null ? 'Новая задача' : 'Редактирование задачи'}</h2></div>
              <button type="button" onClick={cancelForm} aria-label="Закрыть">×</button>
            </div>

            <label className="task-form-field">Название задачи<input autoFocus maxLength={100} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Например, подготовить презентацию" /></label>
            <label className="task-form-field">Описание<textarea rows="3" maxLength={500} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Что нужно сделать?" /></label>

            <div className="task-form-grid">
              <label className="task-form-field">Категория<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="task-form-field">Продолжительность<select value={draft.duration} onChange={(event) => setDraft({ ...draft, duration: event.target.value })}>{[15, 30, 45, 60, 90, 120, 180].map((value) => <option key={value} value={value}>{value} минут</option>)}</select></label>
              <label className="task-form-field">Приоритет<select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value })}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="task-form-field">Дата выполнения<input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label>
              <label className="task-form-field">Предпочтительное время<input type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} /></label>
              <label className="task-form-field">Крайний срок<input type="date" value={draft.deadline} min={draft.date} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} /></label>
            </div>

            <label className="task-fixed-option">
              <input type="checkbox" checked={draft.isFixed} onChange={(event) => setDraft({ ...draft, isFixed: event.target.checked })} />
              <span><strong>Закрепить время</strong><small>Задача не будет автоматически перемещаться при перестроении расписания.</small></span>
            </label>

            {formError && <p className="task-form-error">{formError}</p>}
            <div className="task-form-actions">
              <button type="button" className="secondary" onClick={cancelForm}>Отмена</button>
              <button type="submit" className="primary">{editingId === null ? 'Создать задачу' : 'Сохранить изменения'}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

export default TasksPage
