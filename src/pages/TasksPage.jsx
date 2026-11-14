
import { useEffect, useState } from 'react'
import './TasksPage.css'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskSchedule,
} from '../api'
import { todayISO } from '../utils/schedule'

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

const CATEGORIES = [
  'Интеллект',
  'Физика',
  'Творчество',
  'Коммуникация',
  'Рутина',
  'Отдых',
]

const PRIORITIES = ['Низкий', 'Средний', 'Высокий']

const PRIORITY_TO_API = {
  Низкий: 1,
  Средний: 2,
  Высокий: 3,
}

const PRIORITY_FROM_API = {
  1: 'Низкий',
  2: 'Средний',
  3: 'Высокий',
}

const TYPE_TO_API = {
  Интеллект: 'intellectual',
  Физика: 'physical',
  Творчество: 'creative',
  Коммуникация: 'communication',
  Рутина: 'routine',
  Отдых: 'rest',
}

function getCategoryFromApi(value) {
  const type = String(value || '').toLowerCase()

  if (type.includes('intell') || type.includes('интел')) return 'Интеллект'
  if (type.includes('phys') || type.includes('физ')) return 'Физика'
  if (type.includes('creat') || type.includes('твор')) return 'Творчество'
  if (type.includes('commun') || type.includes('коммун')) return 'Коммуникация'
  if (type.includes('rest') || type.includes('отдых')) return 'Отдых'

  return 'Рутина'
}

function formatTime(value) {
  if (!value) return ''
  return String(value).slice(0, 5)
}

function getEndTime(startTime, duration) {
  if (!startTime) return null

  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + Number(duration)
  const endHours = Math.floor(totalMinutes / 60)
  const endMinutes = totalMinutes % 60

  if (endHours > 23) return null

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:00`
}

function mapApiTask(task, scheduledTask) {
  const fixedTime = formatTime(task.start_time)
  const scheduledTime = formatTime(scheduledTask?.start_time)

  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    type: getCategoryFromApi(task.task_type),
    duration: Number(task.duration),
    priority: PRIORITY_FROM_API[task.priority] || 'Средний',
    date: task.due_date,
    deadline: formatTime(task.deadline_time),
    time: fixedTime || scheduledTime,
    preferredTime: fixedTime || '09:00',
    isFixed: Boolean(task.start_time),
    status: task.is_completed ? 'completed' : 'planned',
    unscheduled: !task.is_completed && !fixedTime && !scheduledTime,
  }
}

function TasksPage({
  onOpenHome,
  onOpenSchedule,
  onOpenBiorhythms,
  onOpenProfile,
}) {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [date, setDate] = useState(todayISO())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [formError, setFormError] = useState('')
  const [pageError, setPageError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function loadTasks(targetDate = date) {
    setLoading(true)
    setPageError('')

    try {
      const [apiTasks, scheduleData] = await Promise.all([
        getTasks(targetDate),
        getTaskSchedule(targetDate),
      ])

      const scheduledTasks = new Map(
        (scheduleData.schedule || []).map((item) => [
          item.task_id,
          item,
        ]),
      )

      const normalizedTasks = apiTasks.map((task) =>
        mapApiTask(task, scheduledTasks.get(task.id)),
      )

      setTasks(normalizedTasks)
    } catch (error) {
      setPageError(error.message || 'Не удалось загрузить задачи.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks(date)
  }, [date])

  const dayTasks = tasks.filter((task) => task.date === date)

  const filteredTasks = dayTasks.filter((task) => {
    if (filter === 'all') return true
    if (filter === 'active') return task.status !== 'completed'
    return task.status === filter
  })

  const counts = {
    all: dayTasks.length,
    active: dayTasks.filter((task) => task.status !== 'completed').length,
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
      time: task.isFixed ? task.time : '09:00',
      isFixed: task.isFixed,
    })

    setFormError('')
    setModalOpen(true)
  }

  async function saveTask(event) {
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

    if (draft.isFixed && !draft.time) {
      setFormError('Укажи время начала закреплённой задачи.')
      return
    }

    const duration = Number(draft.duration)

    const taskData = {
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      task_type: TYPE_TO_API[draft.type] || 'routine',
      duration,
      due_date: draft.date,
      deadline_time: draft.deadline || null,
      start_time: draft.isFixed ? `${draft.time}:00` : null,
      end_time: draft.isFixed
        ? getEndTime(draft.time, duration)
        : null,
      priority: PRIORITY_TO_API[draft.priority] || 2,
    }

    setSaving(true)

    try {
      if (editingId === null) {
        await createTask(taskData)
      } else {
        await updateTask(editingId, taskData)
      }

      setModalOpen(false)
      setEditingId(null)
      setDraft(EMPTY_DRAFT)

      if (draft.date !== date) {
        setDate(draft.date)
      } else {
        await loadTasks(date)
      }
    } catch (error) {
      setFormError(error.message || 'Не удалось сохранить задачу.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleCompleted(task) {
    try {
      await updateTask(task.id, {
        is_completed: task.status !== 'completed',
      })

      await loadTasks(date)
    } catch (error) {
      setPageError(error.message || 'Не удалось изменить статус задачи.')
    }
  }

  async function removeTask(task) {
    if (!window.confirm(`Удалить задачу «${task.title}»?`)) return

    try {
      await deleteTask(task.id)
      await loadTasks(date)
    } catch (error) {
      setPageError(error.message || 'Не удалось удалить задачу.')
    }
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

          <button className="tasks-primary-button" onClick={openNewTask}>
            ＋ Новая задача
          </button>
        </header>

        <section className="tasks-toolbar">
          <label className="tasks-date-label">
            <span>Дата</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>

          <div className="tasks-toolbar-links">
            <button onClick={onOpenSchedule}>
              Открыть расписание →
            </button>
          </div>
        </section>

        <section className="tasks-summary-grid">
          <article>
            <span>Всего задач</span>
            <strong>{counts.all}</strong>
          </article>

          <article>
            <span>Активные</span>
            <strong>{counts.active}</strong>
          </article>

          <article>
            <span>Выполнено</span>
            <strong>{counts.completed}</strong>
          </article>
        </section>

        <section className="tasks-list-panel">
          <div className="tasks-list-heading">
            <div>
              <p className="tasks-eyebrow">СПИСОК НА ДЕНЬ</p>
              <h2>Мои задачи</h2>
            </div>

            <span>
              {new Intl.DateTimeFormat('ru-RU', {
                day: 'numeric',
                month: 'long',
              }).format(new Date(`${date}T00:00:00`))}
            </span>
          </div>

          <div className="tasks-filters" role="tablist" aria-label="Фильтр задач">
            {[
              ['all', `Все (${counts.all})`],
              ['active', `Активные (${counts.active})`],
              ['completed', `Выполненные (${counts.completed})`],
            ].map(([id, label]) => (
              <button
                key={id}
                className={filter === id ? 'active' : ''}
                onClick={() => setFilter(id)}
                role="tab"
                aria-selected={filter === id}
              >
                {label}
              </button>
            ))}
          </div>

          {pageError && (
            <p className="task-form-error">{pageError}</p>
          )}

          <div className="tasks-list">
            {loading && (
              <div className="tasks-empty">
                <strong>Загрузка задач...</strong>
              </div>
            )}

            {!loading && filteredTasks.length === 0 && (
              <div className="tasks-empty">
                <span>✓</span>
                <strong>Задач пока нет</strong>
                <p>Добавь задачу, чтобы составить расписание.</p>
                <button onClick={openNewTask}>Добавить задачу</button>
              </div>
            )}

            {!loading && filteredTasks.map((task) => (
              <article
                className={`task-item task-status-${task.status}`}
                key={task.id}
              >
                <button
                  className={`task-check ${task.status === 'completed' ? 'checked' : ''}`}
                  onClick={() => toggleCompleted(task)}
                  aria-label={
                    task.status === 'completed'
                      ? 'Вернуть задачу в план'
                      : 'Отметить задачу выполненной'
                  }
                >
                  {task.status === 'completed' ? '✓' : ''}
                </button>

                <div className="task-item-main">
                  <div className="task-item-topline">
                    <span className="task-category">{task.type}</span>

                    <span
                      className={`task-priority priority-${
                        task.priority === 'Высокий'
                          ? 'high'
                          : task.priority === 'Низкий'
                            ? 'low'
                            : 'medium'
                      }`}
                    >
                      {task.priority} приоритет
                    </span>
                  </div>

                  <h3 className={task.status === 'completed' ? 'is-done' : ''}>
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}

                  <div className="task-item-details">
                    <span>◷ {task.time || 'Не запланировано'}</span>
                    <span>{task.duration} мин.</span>

                    {task.deadline && (
                      <span>Крайнее время: {task.deadline}</span>
                    )}

                    {task.isFixed && (
                      <span className="task-fixed-tag">
                        Время закреплено
                      </span>
                    )}

                    {task.unscheduled && (
                      <span className="task-unscheduled-tag">
                        Нет свободного времени
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-item-actions">
                  <button onClick={() => openEditTask(task)}>
                    Изменить
                  </button>

                  <button
                    className="delete"
                    onClick={() => removeTask(task)}
                  >
                    Удалить
                  </button>
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
        <div
          className="task-form-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) cancelForm()
          }}
        >
          <form className="task-form-card" onSubmit={saveTask}>
            <div className="task-form-heading">
              <div>
                <p className="tasks-eyebrow">КАРТОЧКА ЗАДАЧИ</p>
                <h2>
                  {editingId === null
                    ? 'Новая задача'
                    : 'Редактирование задачи'}
                </h2>
              </div>

              <button
                type="button"
                onClick={cancelForm}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>

            <label className="task-form-field">
              Название задачи
              <input
                autoFocus
                maxLength={100}
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                placeholder="Например, подготовить презентацию"
              />
            </label>

            <label className="task-form-field">
              Описание
              <textarea
                rows="3"
                maxLength={500}
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
                placeholder="Что нужно сделать?"
              />
            </label>

            <div className="task-form-grid">
              <label className="task-form-field">
                Категория
                <select
                  value={draft.type}
                  onChange={(event) =>
                    setDraft({ ...draft, type: event.target.value })
                  }
                >
                  {CATEGORIES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="task-form-field">
                Продолжительность
                <select
                  value={draft.duration}
                  onChange={(event) =>
                    setDraft({ ...draft, duration: event.target.value })
                  }
                >
                  {[15, 30, 45, 60, 90, 120, 180].map((value) => (
                    <option key={value} value={value}>
                      {value} минут
                    </option>
                  ))}
                </select>
              </label>

              <label className="task-form-field">
                Приоритет
                <select
                  value={draft.priority}
                  onChange={(event) =>
                    setDraft({ ...draft, priority: event.target.value })
                  }
                >
                  {PRIORITIES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="task-form-field">
                Дата выполнения
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) =>
                    setDraft({ ...draft, date: event.target.value })
                  }
                />
              </label>

              <label className="task-form-field">
                Время начала
                <input
                  type="time"
                  value={draft.time}
                  onChange={(event) =>
                    setDraft({ ...draft, time: event.target.value })
                  }
                />
              </label>

              <label className="task-form-field">
                Крайнее время
                <input
                  type="time"
                  value={draft.deadline}
                  onChange={(event) =>
                    setDraft({ ...draft, deadline: event.target.value })
                  }
                />
              </label>
            </div>

            <label className="task-fixed-option">
              <input
                type="checkbox"
                checked={draft.isFixed}
                onChange={(event) =>
                  setDraft({ ...draft, isFixed: event.target.checked })
                }
              />

              <span>
                <strong>Закрепить время</strong>
                <small>
                  Задача будет начинаться в указанное время и не будет
                  автоматически перемещаться.
                </small>
              </span>
            </label>

            {formError && (
              <p className="task-form-error">{formError}</p>
            )}

            <div className="task-form-actions">
              <button
                type="button"
                className="secondary"
                onClick={cancelForm}
                disabled={saving}
              >
                Отмена
              </button>

              <button
                type="submit"
                className="primary"
                disabled={saving}
              >
                {saving
                  ? 'Сохранение...'
                  : editingId === null
                    ? 'Создать задачу'
                    : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

export default TasksPage
