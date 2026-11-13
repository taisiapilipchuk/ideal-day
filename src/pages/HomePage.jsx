
import { useState, useEffect, useCallback } from 'react'
import {
  getTasks,
  getTaskSchedule,
  createTask,
  updateTask,
  deleteTask,
} from '../api'
import './HomePage.css'

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function mapTaskFromApi(task) {
  const priorityNames = {
    1: 'Низкий',
    2: 'Средний',
    3: 'Высокий',
  }

  return {
    id: task.id,
    title: task.title,
    type: task.task_type,
    duration: String(task.duration),
    priority: priorityNames[task.priority] || 'Средний',
    deadline: task.deadline_time ? task.deadline_time.slice(0, 5) : '',
  }
}

function HomePage({ onOpenProfile }) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskType, setTaskType] = useState('')
  const [taskDuration, setTaskDuration] = useState('')
  const [taskPriority, setTaskPriority] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')

  const [tasks, setTasks] = useState([])
  const [schedule, setSchedule] = useState([])
  const [openTaskId, setOpenTaskId] = useState(null)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [originalTask, setOriginalTask] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const date = getTodayDate()

      const [tasksData, scheduleData] = await Promise.all([
        getTasks(date),
        getTaskSchedule(date),
      ])

      setTasks(tasksData.map(mapTaskFromApi))
      setSchedule(scheduleData.schedule || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  function getPriorityNumber(priority) {
    const priorities = {
      Низкий: 1,
      Средний: 2,
      Высокий: 3,
    }

    return priorities[priority] || 2
  }

  async function handleAddTask() {
    if (
      taskTitle.trim() === '' ||
      taskType === '' ||
      taskDuration === '' ||
      taskPriority === '' ||
      taskDeadline === ''
    ) {
      alert('Заполните все поля')
      return
    }

    try {
      setError('')

      await createTask({
        title: taskTitle.trim(),
        task_type: taskType,
        duration: Number(taskDuration),
        due_date: getTodayDate(),
        deadline_time: taskDeadline,
        priority: getPriorityNumber(taskPriority),
      })

      setTaskTitle('')
      setTaskType('')
      setTaskDuration('')
      setTaskPriority('')
      setTaskDeadline('')
      setIsAddTaskOpen(false)

      await loadData()
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleSaveTask(task) {
    try {
      setError('')

      await updateTask(task.id, {
        title: task.title,
        task_type: task.type,
        duration: Number(task.duration),
        deadline_time: task.deadline || null,
        priority: getPriorityNumber(task.priority),
      })

      setEditingTaskId(null)
      setOriginalTask(null)

      await loadData()
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm('Удалить эту задачу?')

    if (!confirmed) return

    try {
      setError('')
      await deleteTask(taskId)

      setOpenTaskId(null)
      await loadData()
    } catch (error) {
      setError(error.message)
    }
  }

  function updateTaskField(taskId, field, value) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? { ...task, [field]: value }
          : task
      )
    )
  }

  const todayLabel = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="home-page">
      <div className="home-content">

        <p className="home-date">{todayLabel}</p>

        <h1 className="home-title">
          Доброе утро!
        </h1>

        <div className="home-rhythms">
          <h2 className="home-section-title">
            Ваши ритмы
          </h2>

          <div className="home-rhythms-list">
            <div className="home-rhythm">
              <span>🧠 Интеллект</span>
              <span>78%</span>
            </div>

            <div className="home-rhythm">
              <span>❤️ Эмоции</span>
              <span>64%</span>
            </div>

            <div className="home-rhythm">
              <span>💪 Физика</span>
              <span>42%</span>
            </div>
          </div>
        </div>

        <div className="home-advice">
          <h2 className="home-section-title">
            Совет на сегодня
          </h2>

          <p className="home-advice-text">
            Сегодня хорошо сосредоточиться на сложных интеллектуальных задачах
          </p>
        </div>

        <div className="home-schedule">
          <h2 className="home-section-title">
            Ваш день
          </h2>

          <div className="home-schedule-list">

            {loading && <p>Загрузка расписания...</p>}

            {!loading && error && (
              <p className="home-error">{error}</p>
            )}

            {!loading && !error && schedule.length === 0 && (
              <p>На сегодня расписание пока пустое</p>
            )}

            {!loading && schedule.map((item) => (
              <div
                className="home-schedule-item"
                key={item.task_id}
                onClick={() => {
                  setOpenTaskId(
                    openTaskId === item.task_id ? null : item.task_id
                  )
                }}
              >
                <div className="home-schedule-main">

                  <span className="home-schedule-time">
                    {item.start_time} – {item.end_time}
                  </span>

                  {editingTaskId === item.task_id ? (
                    <input
                      className="home-edit-task-input"
                      type="text"
                      value={
                        tasks.find((task) => task.id === item.task_id)?.title || ''
                      }
                      onChange={(event) =>
                        updateTaskField(item.task_id, 'title', event.target.value)
                      }
                      onClick={(event) => event.stopPropagation()}
                    />
                  ) : (
                    <span className="home-schedule-task">
                      {item.title}
                    </span>
                  )}

                  {editingTaskId === item.task_id && (() => {
                    const task = tasks.find((task) => task.id === item.task_id)

                    if (!task) return null

                    return (
                      <div className="home-edit-task-form">

                        <label className="home-edit-task-label">
                          Тип задачи
                        </label>

                        <select
                          className="home-edit-task-input"
                          value={task.type}
                          onChange={(event) =>
                            updateTaskField(task.id, 'type', event.target.value)
                          }
                          onClick={(event) => event.stopPropagation()}
                        >
                          <option value="Интеллект">Интеллект</option>
                          <option value="Физика">Физика</option>
                          <option value="Творчество">Творчество</option>
                          <option value="Коммуникация">Коммуникация</option>
                          <option value="Рутина">Рутина</option>
                          <option value="Отдых">Отдых</option>
                        </select>

                        <label className="home-edit-task-label">
                          Длительность
                        </label>

                        <input
                          className="home-edit-task-input"
                          type="number"
                          min="1"
                          value={task.duration}
                          onChange={(event) =>
                            updateTaskField(task.id, 'duration', event.target.value)
                          }
                          onClick={(event) => event.stopPropagation()}
                        />

                        <label className="home-edit-task-label">
                          Приоритет
                        </label>

                        <select
                          className="home-edit-task-input"
                          value={task.priority}
                          onChange={(event) =>
                            updateTaskField(task.id, 'priority', event.target.value)
                          }
                          onClick={(event) => event.stopPropagation()}
                        >
                          <option value="Низкий">Низкий</option>
                          <option value="Средний">Средний</option>
                          <option value="Высокий">Высокий</option>
                        </select>

                        <label className="home-edit-task-label">
                          Дедлайн
                        </label>

                        <input
                          className="home-edit-task-input"
                          type="time"
                          value={task.deadline}
                          onChange={(event) =>
                            updateTaskField(task.id, 'deadline', event.target.value)
                          }
                          onClick={(event) => event.stopPropagation()}
                        />

                      </div>
                    )
                  })()}

                </div>

                {openTaskId === item.task_id && (
                  <div className="home-schedule-details">

                    {(() => {
                      const task = tasks.find((task) => task.id === item.task_id)

                      if (!task) return null

                      return (
                        <>
                          <p>
                            {task.type} · {task.duration} мин · {task.priority} приоритет
                          </p>

                          {editingTaskId !== task.id && (
                            <>
                              <button
                                className="home-edit-task-button"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  setOriginalTask({ ...task })
                                  setEditingTaskId(task.id)
                                }}
                              >
                                Изменить
                              </button>

                              <button
                                className="home-delete-task-button"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleDeleteTask(task.id)
                                }}
                              >
                                Удалить
                              </button>
                            </>
                          )}

                          {editingTaskId === task.id && (
                            <div className="home-edit-task-buttons">

                              <button
                                className="home-save-task-button"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleSaveTask(task)
                                }}
                              >
                                Сохранить
                              </button>

                              <button
                                className="home-cancel-task-button"
                                onClick={(event) => {
                                  event.stopPropagation()

                                  setTasks((previous) =>
                                    previous.map((item) =>
                                      item.id === task.id ? originalTask : item
                                    )
                                  )

                                  setEditingTaskId(null)
                                  setOriginalTask(null)
                                }}
                              >
                                Отмена
                              </button>

                            </div>
                          )}
                        </>
                      )
                    })()}

                  </div>
                )}
              </div>
            ))}

          </div>
        </div>

        {error && (
          <p className="home-error">
            {error}
          </p>
        )}

        <button
          className="home-add-button"
          onClick={() => setIsAddTaskOpen(true)}
        >
          +
        </button>

        {isAddTaskOpen && (
          <>
            <div
              className="home-overlay"
              onClick={() => setIsAddTaskOpen(false)}
            />

            <div className="home-add-task">

              <h2>Добавить задачу</h2>

              <label className="home-add-task-label">
                Название задачи
              </label>

              <input
                className="home-add-task-input"
                type="text"
                placeholder="Например, изучение Python"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
              />

              <label className="home-add-task-label">
                Тип задачи
              </label>

              <select
                className="home-add-task-input"
                value={taskType}
                onChange={(event) => setTaskType(event.target.value)}
              >
                <option value="">Выберите тип задачи</option>
                <option value="Интеллект">Интеллект</option>
                <option value="Физика">Физика</option>
                <option value="Творчество">Творчество</option>
                <option value="Коммуникация">Коммуникация</option>
                <option value="Рутина">Рутина</option>
                <option value="Отдых">Отдых</option>
              </select>

              <label className="home-add-task-label">
                Длительность
              </label>

              <select
                className="home-add-task-input"
                value={taskDuration}
                onChange={(event) => setTaskDuration(event.target.value)}
              >
                <option value="">Выберите длительность</option>
                <option value="15">15 минут</option>
                <option value="30">30 минут</option>
                <option value="45">45 минут</option>
                <option value="60">1 час</option>
                <option value="90">1 час 30 минут</option>
                <option value="120">2 часа</option>
                <option value="180">3 часа</option>
              </select>

              <label className="home-add-task-label">
                Приоритет
              </label>

              <select
                className="home-add-task-input"
                value={taskPriority}
                onChange={(event) => setTaskPriority(event.target.value)}
              >
                <option value="">Выберите приоритет</option>
                <option value="Низкий">Низкий</option>
                <option value="Средний">Средний</option>
                <option value="Высокий">Высокий</option>
              </select>

              <label className="home-add-task-label">
                Дедлайн
              </label>

              <input
                className="home-add-task-input"
                type="time"
                value={taskDeadline}
                onChange={(event) => setTaskDeadline(event.target.value)}
              />

              <button
                className="home-add-task-button"
                onClick={handleAddTask}
              >
                Добавить задачу
              </button>

            </div>
          </>
        )}

        <nav className="home-navigation">

          <button className="home-navigation-item active">
            🏠
            <span>Главная</span>
          </button>

          <button className="home-navigation-item">
            📊
            <span>Биоритмы</span>
          </button>

          <button
            className="home-navigation-item"
            onClick={onOpenProfile}
          >
            👤
            <span>Профиль</span>
          </button>

        </nav>

      </div>
    </div>
  )
}

export default HomePage
