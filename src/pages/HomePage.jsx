import { useState } from 'react'
import './HomePage.css'

function HomePage({onOpenProfile}) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskType, setTaskType] = useState('')
  const [taskDuration, setTaskDuration] = useState('')
  const [taskPriority, setTaskPriority] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')
  const [tasks, setTasks] = useState([])
  const [openTaskIndex, setOpenTaskIndex] = useState(null)
  const [editingTaskIndex, setEditingTaskIndex] = useState(null)
  const [originalTask, setOriginalTask] = useState(null)

  function handleAddTask() {
    if (
      taskTitle === '' ||
      taskType === '' ||
      taskDuration === '' ||
      taskPriority === '' ||
      taskDeadline === ''
    ) {
      alert('Заполните все поля')
      return
    }

    const newTask = {
      title: taskTitle,
      type: taskType,
      duration: taskDuration,
      priority: taskPriority,
      deadline: taskDeadline
    }

    console.log(newTask)

    setTasks([...tasks, newTask])

    setTaskTitle('')
    setTaskType('')
    setTaskDuration('')
    setTaskPriority('')
    setTaskDeadline('')

    setIsAddTaskOpen(false)
  }

  return (
    <div className="home-page">
      <div className="home-content">

        <p className="home-date">
          1 октября 2026
        </p>

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

            {tasks.map((task, index) => (
              <div
                className="home-schedule-item"
                key={index}
                onClick={() => {
                  if (openTaskIndex === index) {
                    setOpenTaskIndex(null)
                  } else {
                    setOpenTaskIndex(index)
                  }
                }}
              >

                <div className="home-schedule-main">

                  <span className="home-schedule-time">
                    {task.deadline}
                  </span>

                  {editingTaskIndex === index ? (
                    <input
                      className="home-edit-task-input"
                      type="text"
                      value={task.title}
                      onChange={(event) => {
                        const updatedTasks = [...tasks]

                        updatedTasks[index] = {
                          ...updatedTasks[index],
                          title: event.target.value
                        }

                        setTasks(updatedTasks)
                      }}
                      onClick={(event) => event.stopPropagation()}
                    />
                  ) : (
                    <span className="home-schedule-task">
                      {task.title}
                    </span>
                  )}

                  {editingTaskIndex === index && (
                     <div className="home-edit-task-form">
                      <label className="home-edit-task-label">
                        Тип задачи
                      </label>
                      <select
                        className="home-edit-task-input"
                        value={task.type}
                        onChange={(event) => {
                          const updatedTasks = [...tasks]

                          updatedTasks[index] = {
                            ...updatedTasks[index],
                            type: event.target.value
                          }

                          setTasks(updatedTasks)
                        }}
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
                        value={task.duration}
                        onChange={(event) => {
                          const updatedTasks = [...tasks]

                          updatedTasks[index] = {
                            ...updatedTasks[index],
                            duration: event.target.value
                          }

                          setTasks(updatedTasks)
                        }}
                        onClick={(event) => event.stopPropagation()}
                      />

                      <label className="home-edit-task-label">
                        Приоритет
                      </label>
                      <select
                        className="home-edit-task-input"
                        value={task.priority}
                        onChange={(event) => {
                          const updatedTasks = [...tasks]

                          updatedTasks[index] = {
                            ...updatedTasks[index],
                            priority: event.target.value
                          }

                          setTasks(updatedTasks)
                        }}
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
                        onChange={(event) => {
                          const updatedTasks = [...tasks]

                          updatedTasks[index] = {
                            ...updatedTasks[index],
                            deadline: event.target.value
                          }

                          setTasks(updatedTasks)
                        }}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </div>
                  )}
                </div>

                {openTaskIndex === index && (
                  <div className="home-schedule-details">

                    <p>
                      {task.type} · {task.duration} мин · {task.priority} приоритет
                    </p>

                    {editingTaskIndex !== index && (
                    <button
                      className="home-edit-task-button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setOriginalTask(tasks[index])
                        setEditingTaskIndex(index)
                      }}
                    >
                      Изменить
                    </button>
                  )}

                  {editingTaskIndex !== index && (
                    <button
                      className="home-delete-task-button"
                      onClick={(event) => {
                        event.stopPropagation()
                        
                        const shouldDelete = window.confirm('Удалить эту задачу?')
                        
                        if (!shouldDelete) {
                          return
                        }
                        const updatedTasks = tasks.filter(
                          (_, taskIndex) => taskIndex !== index
                        )

                        setTasks(updatedTasks)
                        setOpenTaskIndex(null)
                      }}
                    >
                      Удалить
                    </button>
                  )}

                    {editingTaskIndex === index && (
                      <div className="home-edit-task-buttons">
                        <button
                          className="home-save-task-button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setEditingTaskIndex(null)
                          }}
                        >
                          Сохранить
                        </button>

                        <button
                          className="home-cancel-task-button"
                          onClick={(event) => {
                            event.stopPropagation()

                            const updatedTasks = [...tasks]
                            updatedTasks[editingTaskIndex] = originalTask

                            setTasks(updatedTasks)
                            setEditingTaskIndex(null)
                            setOriginalTask(null)
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>
            ))}

          </div>

        </div>

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

              <h2>
                Добавить задачу
              </h2>

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

          <button className="home-navigation-item"
                  onClick={onOpenProfile}>
            👤
            <span>Профиль</span>
          </button>

        </nav>

      </div>
    </div>
  )
}

export default HomePage