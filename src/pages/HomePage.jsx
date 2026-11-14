import { useCallback, useEffect, useState } from 'react'
import {
  getBiorhythm,
  getRecommendations,
  getTasks,
  getTaskSchedule,
  updateTask,
} from '../api'
import './HomePage.css'

function getTodayDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDateOffset(offset) {
  const date = new Date()
  date.setDate(date.getDate() + offset)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  })
}

function formatTime(time) {
  return time ? String(time).slice(0, 5) : '—'
}

const CYCLES = [
  { key: 'physical', label: 'Физический', color: '#35a99c' },
  { key: 'emotional', label: 'Эмоциональный', color: '#e5a45e' },
  { key: 'intellectual', label: 'Интеллектуальный', color: '#8b79df' },
]

const TASK_TYPES = {
  study: 'Учёба',
  work: 'Работа',
  rest: 'Отдых',
  sport: 'Спорт',
  routine: 'Обычная',
}

function getPriorityLabel(priority) {
  if (priority === 3) return 'Высокий приоритет'
  if (priority === 2) return 'Средний приоритет'
  return 'Низкий приоритет'
}

function HomePage({
  user,
  onOpenProfile,
  onOpenBiorhythms,
  onOpenTasks,
  onOpenSchedule,
}) {
  const [biorhythm, setBiorhythm] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [tasks, setTasks] = useState([])
  const [schedule, setSchedule] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const today = getTodayDate()

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [
        biorhythmData,
        recommendationData,
        tasksData,
        scheduleData,
      ] = await Promise.all([
        getBiorhythm(today),
        getRecommendations(today),
        getTasks(today),
        getTaskSchedule(today),
      ])

      setBiorhythm(biorhythmData)
      setRecommendations(recommendationData.recommendations || [])
      setTasks(Array.isArray(tasksData) ? tasksData : [])
      setSchedule(scheduleData.schedule || [])

      // Загружаем биоритмы за 7 дней для графика.
      const dates = Array.from({ length: 7 }, (_, index) =>
        getDateOffset(index - 3)
      )

      const chartResults = await Promise.all(
        dates.map(async (date) => {
          try {
            return await getBiorhythm(date)
          } catch {
            return null
          }
        })
      )

      setChartData(
        chartResults
          .filter(Boolean)
          .map((item) => ({
            date: item.date,
            physical: item.physical,
            emotional: item.emotional,
            intellectual: item.intellectual,
          }))
      )
    } catch (err) {
      setError(err.message || 'Не удалось загрузить данные')
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleToggleTask(task) {
    try {
      await updateTask(task.id, {
        is_completed: !task.is_completed,
      })

      const updatedTasks = await getTasks(today)
      setTasks(Array.isArray(updatedTasks) ? updatedTasks : [])

      const updatedSchedule = await getTaskSchedule(today)
      setSchedule(updatedSchedule.schedule || [])
    } catch (err) {
      setError(err.message || 'Не удалось обновить задачу')
    }
  }

  const completedTasks = tasks.filter((task) => task.is_completed).length
  const totalTasks = tasks.length
  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  const criticalCycles = biorhythm?.critical_cycles || []

  const firstRecommendation = recommendations[0] ||
    'Пока рекомендаций нет. Продолжайте планировать свой день!'

  const displayName = user?.username || 'Пользователь'

  function getChartPoints(key) {
    if (!chartData.length) return ''

    return chartData
      .map((item, index) => {
        const x = chartData.length === 1
          ? 50
          : (index / (chartData.length - 1)) * 100

        const value = Number(item[key] || 0)
        const y = 80 - ((value + 100) / 200) * 65

        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <div className="home-page">
      <div className="home-content">
        <header className="home-header">
          <div>
            <p className="home-date">{formatDate(today)}</p>

            <h1 className="home-title">
              Добро пожаловать, {displayName}!
            </h1>

            <p className="home-subtitle">
              Вот что происходит сегодня
            </p>
          </div>

          <button
            className="home-avatar"
            onClick={onOpenProfile}
            title="Открыть профиль"
          >
            {displayName.charAt(0).toUpperCase()}
          </button>
        </header>

        {error && (
          <div className="home-empty">
            {error}
            <button onClick={loadData}>Повторить</button>
          </div>
        )}

        {loading ? (
          <div className="home-empty">Загрузка данных...</div>
        ) : (
          <>
            {/* Биоритмы */}

            <section className="home-rhythm-card">
              <div className="home-rhythm-card-top">
                <div>
                  <p className="home-eyebrow">ТВОЁ СОСТОЯНИЕ</p>

                  <p className="home-rhythm-date">
                    Биоритмы на сегодня
                  </p>
                </div>

                <div className="home-orbit-art">
                  <span />
                  <i />
                  <b />
                </div>
              </div>

              <div className="home-rhythm-values">
                {CYCLES.map((cycle) => {
                  const value = Number(biorhythm?.[cycle.key] || 0)
                  const width = Math.abs(value) / 2
                  const left = value >= 0 ? 50 : 50 - width

                  return (
                    <div key={cycle.key}>
                      <div className="home-rhythm-row-label">
                        <span>{cycle.label}</span>
                        <strong>{Math.round(value)}%</strong>
                      </div>

                      <div className="home-rhythm-track">
                        <span className="home-rhythm-zero" />

                        <span
                          className="home-rhythm-progress"
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            background: cycle.color,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="home-model-note">
                Данные рассчитаны сервером на основе даты рождения
              </p>

              <button
                className="home-text-link"
                onClick={onOpenBiorhythms}
              >
                Подробнее о биоритмах →
              </button>
            </section>

            <div className="home-dashboard-grid">
              <div className="home-main-column">
                {/* График биоритмов */}

                <section className="home-card">
                  <div className="home-section-head">
                    <h2>Динамика биоритмов</h2>
                    <span className="home-period-label">7 дней</span>
                  </div>

                  <svg
                    className="home-chart"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {[15, 47.5, 80].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="100"
                        y2={y}
                        className="home-chart-grid"
                      />
                    ))}

                    <line
                      x1="50"
                      y1="5"
                      x2="50"
                      y2="90"
                      className="home-chart-today"
                    />

                    {CYCLES.map((cycle) => (
                      <polyline
                        key={cycle.key}
                        points={getChartPoints(cycle.key)}
                        fill="none"
                        stroke={cycle.color}
                        strokeWidth="1.8"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </svg>

                  <div className="home-chart-legend">
                    {CYCLES.map((cycle) => (
                      <span key={cycle.key}>
                        <i style={{ background: cycle.color }} />
                        {cycle.label}
                      </span>
                    ))}
                  </div>

                  <p className="home-chart-hint">
                    График построен по данным API биоритмов
                  </p>
                </section>

                {/* Расписание */}

                <section className="home-card">
                  <div className="home-section-head">
                    <h2>Расписание на сегодня</h2>

                    <button
                      className="home-text-link"
                      onClick={onOpenSchedule}
                    >
                      Всё расписание →
                    </button>
                  </div>

                  <div className="home-task-list">
                    {schedule.length === 0 ? (
                      <div className="home-empty">
                        На сегодня пока нет запланированных задач
                      </div>
                    ) : (
                      schedule.map((item) => (
                        <div className="home-task" key={item.task_id}>
                          <div className="home-task-summary">
                            <span className="home-task-time">
                              {formatTime(item.start_time)}
                              {' – '}
                              {formatTime(item.end_time)}
                            </span>

                            <div className="home-task-content">
                              <strong>{item.title}</strong>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Задачи */}

                <section className="home-card">
                  <div className="home-section-head">
                    <h2>Мои задачи</h2>

                    <button
                      className="home-add-button"
                      onClick={onOpenTasks}
                      title="Открыть задачи"
                    >
                      +
                    </button>
                  </div>

                  <div className="home-task-list">
                    {tasks.length === 0 ? (
                      <div className="home-empty">
                        У тебя пока нет задач на сегодня
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <div className="home-task" key={task.id}>
                          <div className="home-task-summary">
                            <span className="home-task-time">
                              {formatTime(task.start_time)}
                            </span>

                            <div className="home-task-content">
                              <div className="home-task-meta">
                                <span>
                                  {TASK_TYPES[task.task_type] ||
                                    task.task_type}
                                </span>

                                <small>
                                  {getPriorityLabel(task.priority)}
                                </small>
                              </div>

                              <strong
                                className={
                                  task.is_completed
                                    ? 'home-task-done'
                                    : ''
                                }
                              >
                                {task.title}
                              </strong>

                              <span className="home-task-duration">
                                {task.duration} мин.
                              </span>
                            </div>

                            <span className="home-task-expand">
                              {task.is_completed ? '✓' : '›'}
                            </span>
                          </div>

                          <div className="home-task-actions">
                            <button
                              onClick={() => handleToggleTask(task)}
                            >
                              {task.is_completed
                                ? 'Вернуть в работу'
                                : 'Выполнено'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    className="home-text-link"
                    onClick={onOpenTasks}
                  >
                    Перейти ко всем задачам →
                  </button>
                </section>
              </div>

              <div className="home-side-column">
                {/* Статистика */}

                <section className="home-card home-stat-card">
                  <h2>Мой прогресс</h2>

                  <div
                    className="home-progress-ring"
                    style={{ '--progress': `${progress}%` }}
                  >
                    <div>
                      <strong>{progress}%</strong>
                      <span>выполнено</span>
                    </div>
                  </div>

                  <div className="home-stat-list">
                    <div>
                      <span>Всего задач</span>
                      <strong>{totalTasks}</strong>
                    </div>

                    <div>
                      <span>Выполнено</span>
                      <strong className="home-green">
                        {completedTasks}
                      </strong>
                    </div>

                    <div>
                      <span>Осталось</span>
                      <strong>
                        {totalTasks - completedTasks}
                      </strong>
                    </div>
                  </div>
                </section>

                {/* Рекомендации */}

                <section className="home-recommendation-card">
                  <div className="home-recommendation-star">✦</div>

                  <p className="home-eyebrow">РЕКОМЕНДАЦИЯ ДНЯ</p>

                  <h2>Совет для тебя</h2>

                  <p>{firstRecommendation}</p>

                  {recommendations.length > 1 && (
                    <small>
                      Ещё рекомендаций: {recommendations.length - 1}
                    </small>
                  )}
                </section>

                {/* Критические циклы */}

                <section className="home-card home-critical-card">
                  <h2>Критические циклы</h2>

                  {criticalCycles.length === 0 ? (
                    <>
                      <strong className="home-critical-date">
                        Нет критических циклов
                      </strong>

                      <p>
                        Сегодня все циклы находятся вне критической точки.
                      </p>
                    </>
                  ) : (
                    <>
                      <strong className="home-critical-date">
                        Будь внимательнее
                      </strong>

                      <p>
                        Сегодня критический день для следующих циклов:
                      </p>

                      <p>
                        {criticalCycles
                          .map((cycle) => {
                            const found = CYCLES.find(
                              (item) => item.key === cycle
                            )
                            return found?.label || cycle
                          })
                          .join(', ')}
                      </p>
                    </>
                  )}

                  <small>
                    Информация рассчитана по данным биоритмов
                  </small>
                </section>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Нижняя навигация */}

      <nav className="home-navigation">
        <button className="home-navigation-item active">
          <span>⌂</span>
          Главная
        </button>

        <button
          className="home-navigation-item"
          onClick={onOpenBiorhythms}
        >
          <span>◉</span>
          Биоритмы
        </button>

        <button
          className="home-navigation-item"
          onClick={onOpenTasks}
        >
          <span>✓</span>
          Задачи
        </button>

        <button
          className="home-navigation-item"
          onClick={onOpenSchedule}
        >
          <span>▦</span>
          План
        </button>
      </nav>
    </div>
  )
}

export default HomePage