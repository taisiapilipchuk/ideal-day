
import { useState, useRef, useEffect } from 'react'

import './HomePage.css'
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation.jsx'

// Временные данные. Позже заменим ответом API.
const mockBiorhythms = [
  {
    id: 1,
    name: 'Физический',
    value: 10,
    type: 'physical'
  },
  {
    id: 3,
    name: 'Эмоциональный',
    value: -20,
    type: 'emotion'
  },
  {
    id: 2,
    name: 'Интеллектуальный',
    value: 65,
    type: 'intellect'
  }
]

// Названия категорий
const categoryNames = {
  intellect: 'Интеллект',
  creativity: 'Творчество',
  communication: 'Общение',
  physics: 'Физическая',
  routine: 'Рутина',
  rest: 'Отдых'
}

// Форматирование времени из минут в часы и минуты
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

// Форматирование длительности
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0 && mins > 0) {
    return `${hours} ч ${mins} мин`
  }

  if (hours > 0) {
    return `${hours} ч`
  }

  return `${mins} мин`
}

// Получение текущего времени в минутах
function getCurrentTimeInMinutes() {
  const now = new Date()

  return now.getHours() * 60 + now.getMinutes()
}

// Определение состояния задачи по времени
function getTaskStatus(task, currentTime) {
   // Если задача выполнена
  if (task.completed) {
    return 'completed'
  }
  // Если задача еще не началась
  if (currentTime < task.startTime) {
    return 'upcoming'
  }

  // Если задача выполняется прямо сейчас
  if (currentTime >= task.startTime && currentTime < task.endTime) {
    return 'active'
  }

  // Если время задачи уже закончилось
  return 'overdue'
}

// Определение рекомендации для задачи на основе биоритмов
function getTaskRecommendation(task) {
  // Связываем категории задач с биоритмами
  const rhythmTypes = {
    intellect: 'intellect',
    physics: 'physical',
    creativity: 'emotion',
    communication: 'emotion',
    routine: 'intellect',
    rest: 'physical'
  }

  // Определяем, какой биоритм соответствует задаче
  const rhythmType = rhythmTypes[task.category]

  // Находим значение соответствующего биоритма
  const rhythm = mockBiorhythms.find(
    (item) => item.type === rhythmType
  )

  // Если биоритм не найден
  if (!rhythm) return 'move'

  // Выбираем рекомендацию по значению биоритма
  if (rhythm.value >= 30) {
    return 'suitable'
  }

  if (rhythm.value <= -30) {
    return 'outside-peak'
  }

  return 'move'
}

// Настройки рекомендаций для задач
const taskRecommendationConfig = {
  suitable: {
    text: 'Подходит по ритму',
    className: 'suitable'
  },

  move: {
    text: 'Можно перенести',
    className: 'move'
  },

  'outside-peak': {
    text: 'Вне пика активности',
    className: 'outside-peak'
  }
}

// Компонент одной шкалы биоритма
function BiorhythmCard({ name, value, type }) {
  const fillStyle = value >= 0
    ? {
        left: '50%',
        width: `${value / 2}%`
      }
    : {
        left: `${50 + value / 2}%`,
        width: `${Math.abs(value) / 2}%`
      }

  return (
    <div className={`biorhythm-card biorhythm-${type}`}>
      <div className="biorhythm-header">
        <p className="biorhythm-name">{name}</p>

        <span className="biorhythm-value">
          {value > 0 ? '+' : ''}{value}%
        </span>
      </div>

      <div className="biorhythm-bar">
        <div
          className="biorhythm-progress"
          style={fillStyle}
        />

        <span className="biorhythm-marker" />
      </div>
    </div>
  )
}

const taskCategoryConfig = {
  intellect: {
    name: 'Интеллект',
    icon: '/icons/task-item-category-intellect.svg',
    color: '#5644D8',
  },
  creativity: {
    name: 'Творчество',
    icon: '/icons/task-item-category-creativity.svg',
    color: '#D96D91',
  },
  communication: {
    name: 'Коммуникация',
    icon: '/icons/task-item-category-communication.svg',
    color: '#087F83',
  },
  physics: {
    name: 'Физическая',
    icon: '/icons/task-item-category-physics.svg',
    color: '#20252B',
  },
  routine: {
    name: 'Рутина',
    icon: '/icons/task-item-category-routine.svg',
    color: '#667085',
  },
  rest: {
    name: 'Отдых',
    icon: '/icons/task-item-category-rest.svg',
    color: '#7B9BCB',
  },
}

// Компонент карточки задачи
function ScheduleTask({ task, status, recommendation }) {
  const category = taskCategoryConfig[task.category]

  return (
    <div className={`schedule-task schedule-task--${status}`}>

      {/* Верхняя строка */}
      <div className="schedule-task-header">

        {/* Категория слева */}
        <div
          className="schedule-task-category"
          style={{ color: category.color }}
        >
          <img src={category.icon} alt="" />
          <span>{category.name}</span>
        </div>

        {/* Время справа */}
        <div className={`schedule-task-time schedule-task-time--${status}`}>
          
          {/* Индикатор активной или выполненной задачи */}
          {(status === 'active' || status === 'completed') && (
            <span className={`schedule-task-indicator schedule-task-indicator--${status}`} />
          )}

          <span>
            {formatTime(task.startTime)} - {formatTime(task.endTime)}
          </span>

        </div>

      </div>

      {/* Название */}
      <h3 className={`schedule-task-name ${task.completed ? 'schedule-task-name--completed' : ''}`}>
        {task.name || 'Ответить на сообщения'}
      </h3>

      {/* Нижняя часть карточки */}
      <div className="schedule-task-footer">
        <p className="schedule-task-duration">
          {formatDuration(task.duration)}
        </p>

        {/* Статус выполненной задачи */}
        {status === 'completed' ? (
          <div className="schedule-task-status schedule-task-status--completed">
            <img
              src="/icons/task-status-completed.svg"
              alt=""
            />
            <span>Выполнено</span>
          </div>

        ) : status === 'overdue' ? (
          <div className="schedule-task-status schedule-task-status--overdue">
            <img
              src="/icons/task-status-overdue.svg"
              alt=""
            />
            <span>Просрочена</span>
          </div>

        ) : recommendation && (
          <div
            className={`schedule-task-status schedule-task-status--${recommendation.className}`}
          >
            <span>{recommendation.text}</span>
          </div>
        )}
      </div>

    </div>
  )
}

function HomePage({ onOpenBiorhythms, onOpenProfile }) {
  // Список задач расписания
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  // Bottom Sheet переноса задачи
  const [isMoveSheetOpen, setIsMoveSheetOpen] = useState(false)
  // Выбранный способ переноса задачи
  const [moveOption, setMoveOption] = useState('')
  // Время для переноса задачи
  const [moveTaskTime, setMoveTaskTime] = useState('')
  
  // Окно подтверждения удаления
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  // Текущее время в минутах
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInMinutes)

  // Состояние Bottom Sheet
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // ID задачи, которую редактируем
  // null — создание новой задачи
  const [editingTaskId, setEditingTaskId] = useState(null)
  // Данные новой задачи
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskCategory, setTaskCategory] = useState('')
  const [taskDuration, setTaskDuration] = useState('')
  const [taskTiming, setTaskTiming] = useState('')
  const [taskTime, setTaskTime] = useState('')

  // Собственная длительность
  const [isCustomDurationOpen, setIsCustomDurationOpen] = useState(false)
  const [customDurationValue, setCustomDurationValue] = useState('')
  const [customDurationUnit, setCustomDurationUnit] = useState('min')
  const [customDurationMinutes, setCustomDurationMinutes] = useState('')

  // Проверка заполнения всех обязательных полей
  const isTaskFormValid =
    taskName.trim() !== '' &&
    taskDescription.trim() !== '' &&
    taskCategory !== '' &&
    taskDuration !== '' &&
    taskTiming !== '' &&
    (taskTiming !== 'wishful' || taskTime !== '')

  // Положение верхнего края панели относительно верха экрана
  const [sheetPosition, setSheetPosition] = useState(0)

  // Ссылки для управления перетаскиванием
  const sheetPositionRef = useRef(0)
  const dragStartY = useRef(0)
  const dragStartPosition = useRef(0)
  const closeTimer = useRef(null)

  // Дата
  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  })

  const weekday = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long'
  })

  // Обновление текущего времени каждую минуту
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(getCurrentTimeInMinutes())
    }

    // Обновляем время сразу после запуска эффекта
    updateCurrentTime()

    // Затем обновляем каждую минуту
    const interval = setInterval(updateCurrentTime, 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Обновление положения панели
  const updateSheetPosition = (position) => {
    sheetPositionRef.current = position
    setSheetPosition(position)
  }

  // Плавное появление панели после открытия
  useEffect(() => {
    if (!isTaskSheetOpen) return

    const frame = requestAnimationFrame(() => {
      updateSheetPosition(window.innerHeight / 2)
    })

    return () => cancelAnimationFrame(frame)
  }, [isTaskSheetOpen])

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current)
      }
    }
  }, [])

  // Очистка формы
  const resetTaskForm = () => {
    setTaskName('')
    setTaskDescription('')
    setTaskCategory('')
    setTaskDuration('')
    setTaskTiming('')
    setTaskTime('')

    setIsCustomDurationOpen(false)
    setCustomDurationValue('')
    setCustomDurationUnit('min')
    setCustomDurationMinutes('')
  }

  // Открытие редактирования задачи
  // Открытие редактирования задачи
const openEditTaskSheet = (task) => {
  if (closeTimer.current) {
    clearTimeout(closeTimer.current)
  }

  // Запоминаем ID редактируемой задачи
  setEditingTaskId(task.id)

  // Заполняем форму данными выбранной задачи
  setTaskName(task.name)
  setTaskDescription(task.description || '')
  setTaskCategory(task.category)
  setTaskTiming(task.timing || 'optimal')

  // Если задача запланирована на конкретное время
  setTaskTime(
    task.timing === 'wishful'
      ? formatTime(task.startTime)
      : ''
  )

  // Сбрасываем состояние собственной длительности
  setIsCustomDurationOpen(false)
  setCustomDurationUnit('min')

  // Если длительность совпадает с готовым вариантом
  const presetDurations = ['15', '30', '60', '120', '180']

  if (presetDurations.includes(String(task.duration))) {
    setTaskDuration(String(task.duration))
    setCustomDurationValue('')
    setCustomDurationMinutes('')
  } else {
    // Если длительность пользовательская
    setTaskDuration('other')
    setCustomDurationMinutes(String(task.duration))

    if (task.duration >= 60 && task.duration % 60 === 0) {
      setCustomDurationValue(String(task.duration / 60))
      setCustomDurationUnit('hour')
    } else {
      setCustomDurationValue(String(task.duration))
      setCustomDurationUnit('min')
    }
  }

  // Закрываем окно деталей задачи
  setSelectedTask(null)

  // Открываем Bottom Sheet редактирования
  updateSheetPosition(window.innerHeight)
  setIsClosing(false)
  setIsTaskSheetOpen(true)
}

  // Открытие окна добавления задачи
  const openTaskSheet = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
    }

    // Режим создания новой задачи
    setEditingTaskId(null)
    resetTaskForm()

    updateSheetPosition(window.innerHeight)
    setIsClosing(false)
    setIsTaskSheetOpen(true)
  }

  // Закрытие окна
  const closeTaskSheet = () => {
    if (isClosing) return

    setIsDragging(false)
    setIsClosing(true)
    setIsCustomDurationOpen(false)

    updateSheetPosition(window.innerHeight)

    closeTimer.current = setTimeout(() => {
      setIsTaskSheetOpen(false)
      setIsClosing(false)
      resetTaskForm()
    }, 320)
  }

  // Начало перетаскивания
  const handleDragStart = (event) => {
    if (isClosing) return

    dragStartY.current = event.clientY
    dragStartPosition.current = sheetPositionRef.current

    setIsDragging(true)

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  // Перемещение панели за пальцем
  const handleDragMove = (event) => {
    if (!isDragging) return

    const dragDistance = event.clientY - dragStartY.current
    const newPosition = dragStartPosition.current + dragDistance

    const limitedPosition = Math.min(
      window.innerHeight,
      Math.max(0, newPosition)
    )

    updateSheetPosition(limitedPosition)
  }

  // Завершение перетаскивания
  const handleDragEnd = () => {
    if (!isDragging) return

    setIsDragging(false)

    const screenHeight = window.innerHeight
    const currentPosition = sheetPositionRef.current

    if (currentPosition > screenHeight * 0.75) {
      closeTaskSheet()
      return
    }

    if (currentPosition < screenHeight * 0.25) {
      updateSheetPosition(0)
      return
    }

    updateSheetPosition(screenHeight / 2)
  }

  // Автоматическое сохранение собственной длительности
  const updateCustomDuration = (value, unit = customDurationUnit) => {
    setCustomDurationValue(value)

    const number = Number(value)

    if (
      value.trim() === '' ||
      !Number.isFinite(number) ||
      number <= 0
    ) {
      setCustomDurationMinutes('')
      setTaskDuration('')
      return
    }

    const durationInMinutes = unit === 'hour'
      ? number * 60
      : number

    setCustomDurationMinutes(String(durationInMinutes))
    setTaskDuration('other')
  }

  // Изменение единицы измерения
  const changeCustomDurationUnit = (unit) => {
    setCustomDurationUnit(unit)

    const number = Number(customDurationValue)

    if (
      customDurationValue.trim() === '' ||
      !Number.isFinite(number) ||
      number <= 0
    ) {
      return
    }

    const durationInMinutes = unit === 'hour'
      ? number * 60
      : number

    setCustomDurationMinutes(String(durationInMinutes))
    setTaskDuration('other')
  }

  // Получение длительности задачи в минутах
  const getTaskDuration = () => {
    if (taskDuration === 'other') {
      return Number(customDurationMinutes)
    }

    return Number(taskDuration)
  }

  // Получение времени начала задачи
  const getTaskStartTime = (duration) => {
    // Если пользователь указал желаемое время
    if (taskTiming === 'wishful') {
      const [hours, minutes] = taskTime.split(':').map(Number)

      return hours * 60 + minutes
    }

    // Если это первая задача — начинаем с 09:00
    if (tasks.length === 0) {
      return 9 * 60
    }

    // Ищем самое позднее окончание предыдущих задач
    const latestEndTime = Math.max(
      ...tasks.map((task) => task.endTime)
    )

    return latestEndTime
  }

  // Добавление задачи в расписание
  // Добавление задачи в расписание
const addTaskToSchedule = () => {
  if (!isTaskFormValid) return

  const duration = getTaskDuration()

  if (!Number.isFinite(duration) || duration <= 0) return

  // Определяем время начала новой задачи
  const startTime = getTaskStartTime(duration)
  const endTime = startTime + duration

  // Создаем новую задачу
  const newTask = {
    id: Date.now(),
    name: taskName.trim(),
    description: taskDescription.trim(),
    category: taskCategory,
    duration,
    startTime,
    endTime,
    timing: taskTiming,
    completed: false
  }

  // Добавляем новую задачу в расписание
  setTasks((previousTasks) =>
    [...previousTasks, newTask].sort(
      (a, b) => a.startTime - b.startTime
    )
  )

  // Закрываем окно добавления
  closeTaskSheet()
}

  // Проверка, изменились ли поля редактируемой задачи
const hasTaskChanges = () => {
  if (editingTaskId === null) return false

  const originalTask = tasks.find(
    (task) => task.id === editingTaskId
  )

  if (!originalTask) return false

  const currentDuration = getTaskDuration()

  const currentStartTime = taskTiming === 'wishful'
    ? taskTime
    : originalTask.startTime

  return (
    taskName.trim() !== originalTask.name ||
    taskDescription.trim() !== (originalTask.description || '') ||
    taskCategory !== originalTask.category ||
    taskTiming !== (originalTask.timing || 'optimal') ||
    currentDuration !== originalTask.duration ||
    (
      taskTiming === 'wishful' &&
      currentStartTime !== formatTime(originalTask.startTime)
    )
  )
}

  // Отметка задачи как выполненной
  const completeTask = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: true }
          : task
      )
    )
  }
  // Сохранение изменений задачи
  const saveEditedTask = () => {
    if (!isTaskFormValid || editingTaskId === null) return

    const duration = getTaskDuration()

    if (!Number.isFinite(duration) || duration <= 0) return

    const startTime = getTaskStartTime(duration)
    const endTime = startTime + duration

    // Создаем обновленную задачу, сохраняя её ID
    const updatedTask = {
      ...tasks.find((task) => task.id === editingTaskId),
      name: taskName.trim(),
      description: taskDescription.trim(),
      category: taskCategory,
      duration,
      startTime,
      endTime,
      timing: taskTiming
    }

    // Обновляем задачу в расписании
    setTasks((previousTasks) =>
      previousTasks
        .map((task) =>
          task.id === editingTaskId ? updatedTask : task
        )
        .sort((a, b) => a.startTime - b.startTime)
    )

    // Если детали этой задачи открыты — обновляем их
    setSelectedTask((previousTask) =>
      previousTask?.id === editingTaskId
        ? updatedTask
        : previousTask
    )

    // Закрываем форму
    closeTaskSheet()
  }

  // Перенос задачи на выбранное время
    const moveSelectedTask = () => {
      if (!selectedTask || !moveTaskTime) return

      // Перевод выбранного времени в минуты
      const [hours, minutes] = moveTaskTime.split(':').map(Number)
      const newStartTime = hours * 60 + minutes

      // Пересчитываем время окончания с сохранением длительности
      const newEndTime = newStartTime + selectedTask.duration

      // Обновляем задачу в расписании
      const updatedTask = {
        ...selectedTask,
        startTime: newStartTime,
        endTime: newEndTime
      }

      setTasks((previousTasks) =>
        previousTasks
          .map((task) =>
            task.id === selectedTask.id ? updatedTask : task
          )
          .sort((a, b) => a.startTime - b.startTime)
      )

      // Обновляем выбранную задачу в окне деталей
      setSelectedTask(updatedTask)

      // Закрываем окно переноса
      setIsMoveSheetOpen(false)

      // Сбрасываем выбор времени
      setMoveOption('')
      setMoveTaskTime('')
    }

  // Удаление задачи после подтверждения
  const deleteSelectedTask = () => {
    if (!selectedTask) return

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== selectedTask.id)
    )

    setIsDeleteConfirmOpen(false)
    setSelectedTask(null)
  }

  return (
    <>
      <main className="home-page">

        <div className="home-header">
          <div className="home-intro">
            <p className="home-greeting">
              Привет, Александра
            </p>

            <img
              className="home-profile-icon"
              src="/icons/home-profile.svg"
              alt="Профиль"
            />
          </div>

          <h1 className="home-title">
            Твой день
          </h1>

          <p className="home-date">
            {weekday.charAt(0).toUpperCase() + weekday.slice(1)}, {today}
          </p>
        </div>

        <section className="home-biorhythms">
          <div className="biorhythms-header">
            <h2 className="biorhythms-title">
              ТВОЙ РИТМ СЕГОДНЯ
            </h2>

            <span className="biorhythms-date">
              {today}
            </span>

            <img
              className="home-biorythms-png"
              src="/icons/home-biorythms.png"
              alt=""
            />
          </div>

          <div className="biorhythms-list">
            {mockBiorhythms.map((item) => (
              <BiorhythmCard
                key={item.id}
                name={item.name}
                value={item.value}
                type={item.type}
              />
            ))}
          </div>
        </section>

        {/* Расписание */}
        <section className="home-schedule">

          <div className="home-schedule-header">
            <h2 className="home-schedule-title">
              Расписание
            </h2>

            <button
              className="home-add-button"
              type="button"
              aria-label="Добавить задачу"
              onClick={openTaskSheet}
            >
              <img
                className="home-button-svg"
                src="/icons/home-button-add.svg"
                alt=""
              />
            </button>
          </div>

          {/* Список задач */}
          {tasks.length > 0 ? (
            <div className="schedule-list">

              {tasks.map((task, index) => {
                // Определяем состояние текущей задачи
                const status = getTaskStatus(task, currentTime)

                return (
                  <div
                    className={`schedule-item schedule-item--${status}`}
                    key={task.id}
                  >

                    {/* Временная шкала */}
                    <div className={`schedule-timeline schedule-timeline--${status}`}>

                      <span className={`schedule-time schedule-time--${status}`}>
                        {formatTime(task.startTime)}
                      </span>

                      <div className="schedule-timeline-line">
                        <span className={`schedule-timeline-dot schedule-timeline-dot--${status}`} />

                        {index !== tasks.length - 1 && (
                          <span className="schedule-timeline-connector" />
                        )}
                      </div>

                    </div>

                    {/* Карточка задачи */}
                    <div
                      className="schedule-item-content"
                      onClick={() => setSelectedTask(task)}
                    >
                      <ScheduleTask
                        task={task}
                        status={status}
                        recommendation={
                          status === 'overdue'
                            ? null
                            : taskRecommendationConfig[getTaskRecommendation(task)]
                        }
                      />
                    </div>

                  </div>
                )
              })}

            </div>
          ) : (
            <div className="schedule-empty">
              <p className="schedule-empty-title">
                Пока нет задач
              </p>

              <p className="schedule-empty-description">
                Добавь первую задачу, чтобы спланировать свой день
              </p>
            </div>
          )}

        </section>

      </main>

      {/* Bottom Sheet с деталями задачи */}
      {selectedTask && (
        <div
          className="task-detail-overlay"
          onClick={() => setSelectedTask(null)}
        >
          <section
            className="task-detail-sheet"
            onClick={(event) => event.stopPropagation()}
          >

            {/* Ползунок */}
            <div className="task-detail-handle-area">
              <div className="task-detail-handle" />
            </div>

            {/* Заголовок */}
            <div className="task-detail-header">
              <h2 className="task-detail-title">
                ДЕТАЛИ ЗАДАЧИ
              </h2>

              <button
                className="task-detail-close"
                type="button"
                onClick={() => setSelectedTask(null)}
                aria-label="Закрыть"
              >
                <img
                  src="/icons/task-add-close.svg"
                  alt="Иконка закрытия"
                />
              </button>
            </div>

            {/* Категория и статус */}
            <div className="task-detail-meta">

              <div
                className="task-detail-category"
                style={{ color: taskCategoryConfig[selectedTask.category].color }}
              >
                <img
                  src={taskCategoryConfig[selectedTask.category].icon}
                  alt=""
                />
              </div>

              {(() => {
                const status = getTaskStatus(selectedTask, currentTime)

                const statusNames = {
                  upcoming: 'Запланирована',
                  active: 'В процессе',
                  overdue: 'Просрочена',
                  completed: 'Выполнено'
                }

                return (
                  <span className={`task-detail-status task-detail-status--${status}`}>
                    {statusNames[status]}
                  </span>
                )
              })()}

            </div>

            {/* Название */}
            <h3 className="task-detail-name">
              {selectedTask.name}
            </h3>

            {/* Описание */}
            <div className="task-detail-description">
              <p>{selectedTask.description || 'Описание отсутствует'}</p>
            </div>

            {/* Информация о времени */}
          <div className="task-detail-info">

            {/* Время начала */}
            <div className="task-detail-info-item">
              <span className="task-detail-info-label">
                <img src="/icons/task-detail-time.svg" alt="" />
                Время
              </span>

              <span className="task-detail-info-value">
                {formatTime(selectedTask.startTime)}
              </span>
            </div>

            {/* Длительность */}
            <div className="task-detail-info-item">
              <span className="task-detail-info-label">
                <img src="/icons/task-detail-duration.svg" alt="" />
                Длительность
              </span>

              <span className="task-detail-info-value">
                {formatDuration(selectedTask.duration)}
              </span>
            </div>

          </div>

            {/* Отметить выполненной */}
            {!selectedTask.completed && (
              <button
                className="task-detail-complete-button"
                type="button"
                onClick={() => {
                  completeTask(selectedTask.id)
                  setSelectedTask({
                    ...selectedTask,
                    completed: true
                  })
                }}
              >
                <img
                  src="/icons/task-detail-complete.svg"
                  alt=""
                />
                <span>Отметить выполненной</span>
              </button>
            )}

            {/* Дополнительные действия */}
            <div className="task-detail-actions">

              {/* Редактирование */}
              <button
                className="task-detail-edit-button"
                type="button"
                onClick={() => openEditTaskSheet(selectedTask)}
              >
                <img
                  src="/icons/task-detail-edit.svg"
                  alt=""
                />
                <span>Редактировать</span>
              </button>

              {/* Перенос */}
              <button
                className="task-detail-move-button"
                type="button"
                onClick={() => setIsMoveSheetOpen(true)}
              >
                <img
                  src="/icons/task-detail-move.svg"
                  alt=""
                />
                <span>Перенести</span>
              </button>

            </div>

            {/* Удаление */}
            <button
              className="task-detail-delete-button"
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              <img
                src="/icons/task-detail-delete.svg"
                alt=""
              />
              <span>Удалить задачу</span>
            </button>

              {/* Подтверждение удаления */}
              {isDeleteConfirmOpen && (
                <div
                  className="task-delete-confirm-overlay"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                >
                  <div
                    className="task-delete-confirm"
                    onClick={(event) => event.stopPropagation()}
                  >

                    <div className="task-delete-header">
                      <div className="task-delete-confirm-icon">
                        <img
                          src="/icons/task-detail-delete-confirm.svg"
                          alt=""
                        />
                      </div>

                      {/* Заголовок */}
                      <h3 className="task-delete-confirm-title">
                        Удалить задачу?
                      </h3>
                    </div>

                    {/* Описание */}
                    <p className="task-delete-confirm-description">
                      Ты действительно хочешь удалить эту задачу?
                      Восстановить её после удаления не получится.
                    </p>

                    {/* Кнопки */}
                    <div className="task-delete-confirm-actions">

                      <button
                        className="task-delete-confirm-cancel"
                        type="button"
                        onClick={() => setIsDeleteConfirmOpen(false)}
                      >
                        Отмена
                      </button>

                      <button
                        className="task-delete-confirm-submit"
                        type="button"
                        onClick={deleteSelectedTask}
                      >
                        <img
                          src="/icons/task-detail-delete-2.svg"
                          alt=""
                        />
                        Удалить
                      </button>

                    </div>

                  </div>
                </div>
              )}
          </section>
        </div>
      )}

      {/* Bottom Sheet переноса задачи */}
      {isMoveSheetOpen && selectedTask && (
        <div
          className="task-move-overlay"
          onClick={() => setIsMoveSheetOpen(false)}
        >
          <section
            className="task-move-sheet"
            onClick={(event) => event.stopPropagation()}
          >
             <div className="task-detail-handle task-move-handle"></div>


            {/* Заголовок */}
            <div className="task-move-header">
              <h2 className="task-move-title task-detail-title">
                ПЕРЕНОС ЗАДАЧИ
              </h2>

              {/* Закрытие окна */}
              <button
                className="task-move-close-button"
                type="button"
                onClick={() => setIsMoveSheetOpen(false)}
                aria-label="Закрыть"
              >
                <img
                  src="/icons/task-add-close.svg"
                  alt=""
                />
              </button>
            </div>

            {/* Название задачи */}
            <div className="task-move-task">

              <div className="task-move-task-info">
                <h3 className="task-move-task-name">
                  {selectedTask.name}
                </h3>

                {/* Текущее время задачи */}
                <div className="task-move-task-time">
                  <span>Сейчас</span>
                  <span className="task-move-time-dot">·</span>
                  <span>{formatTime(selectedTask.startTime)}</span>
                </div>
              </div>

              {/* Иконка категории */}
              <img
                className="task-move-task-icon"
                src={taskCategoryConfig[selectedTask.category]?.icon}
                alt=""
              />

            </div>

            {/* Действия переноса */}
            <div className="task-move-actions">
              {/* Подобрать другое время */}
              <button
                className={`task-move-button task-move-custom-button ${moveOption === 'suggest' ? 'is-selected' : ''}`}
                type="button"
                onClick={() => setMoveOption(moveOption === 'suggest' ? '' : 'suggest')}
              >
                <img
                  src="/icons/task-move-suggest.svg"
                  alt=""
                />
                <span>Подобрать другое время</span>
              </button>

              {/* Указать время вручную */}
              <div className={`task-move-custom-option ${moveOption === 'custom' ? 'is-open' : ''}`}>

                <button
                  className={`task-move-button task-move-custom-button-self ${moveOption === 'custom' ? 'is-selected' : ''}`}
                  type="button"
                  onClick={() => setMoveOption(moveOption === 'custom' ? '' : 'custom')}
                >
                  <div className="task-move-button-content">
                    <img
                      src="/icons/task-add-time.svg"
                      alt=""
                    />
                    <span>Указать время</span>
                  </div>
                </button>

                {/* Поле выбора времени */}
                <div className="task-move-time-collapse">
                  <div className="task-move-time-inner">
                    <label className="task-move-time-field">
                      <input
                        type="time"
                        value={moveTaskTime}
                        onChange={(event) => setMoveTaskTime(event.target.value)}
                        aria-label="Выбрать время переноса задачи"
                      />

                      <img
                        className="task-move-time-icon"
                        src="/icons/task-add-time.svg"
                        alt=""
                      />
                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* Подтвердить перенос */}
            <button
              className="task-move-submit-button"
              type="button"
              disabled={
                moveOption !== 'suggest' &&
                (moveOption !== 'custom' || moveTaskTime === '')
              }
              onClick={moveSelectedTask}
            >
              Перенести задачу
            </button>

          </section>
        </div>
      )}


      {/* Bottom Sheet */}
      {isTaskSheetOpen && (
        <div
          className={`task-sheet-overlay ${isClosing ? 'task-sheet-overlay-closing' : ''}`}
          onClick={closeTaskSheet}
        >
          <section
            className="task-sheet"
            style={{
              transform: `translate3d(0, ${sheetPosition}px, 0)`,
              transition: isDragging
                ? 'none'
                : 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            onClick={(event) => event.stopPropagation()}
          >

            {/* Область перетаскивания */}
            <div
              className="task-sheet-handle-area"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
            >
              <div className="task-sheet-handle" />
            </div>

            {/* Заголовок и закрытие */}
            <div className="task-add-intro">
              <h2 className="task-add-title">
                {editingTaskId !== null ? 'РЕДАКТИРОВАНИЕ ЗАДАЧИ' : 'НОВАЯ ЗАДАЧА'}
              </h2>

              <button
                className="task-add-close"
                type="button"
                onClick={closeTaskSheet}
                aria-label="Закрыть"
              >
                <img
                  src="/icons/task-add-close.svg"
                  alt=""
                />
              </button>
            </div>

            <div className="task-add-settings">

              {/* Название задачи */}
              <div className="task-add-field">
                <label className="task-add-label" htmlFor="task-name">
                  Название задачи
                </label>

                <input
                  className="task-add-input"
                  id="task-name"
                  type="text"
                  placeholder="Например, подготовить презентацию"
                  value={taskName}
                  onChange={(event) => setTaskName(event.target.value)}
                />
              </div>

              {/* Описание задачи */}
              <div className="task-add-field">
                <label className="task-add-label" htmlFor="task-description">
                  Описание
                </label>

                <textarea
                  className="task-add-textarea"
                  id="task-description"
                  placeholder="Добавь подробности о задаче"
                  value={taskDescription}
                  onChange={(event) => setTaskDescription(event.target.value)}
                />
              </div>

              {/* Категория */}
              <div className="task-add-section">
                <div className="task-add-section-intro">
                  <h3 className="task-add-label">Категория</h3>
                  <p className="task-add-description">Выбери одну</p>
                </div>

                <div className="task-add-options task-add-categories">

                  <button
                    className={`task-add-option option-intellect ${taskCategory === 'intellect' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskCategory('intellect')}
                  >
                    <img src="/icons/task-add-intellect.svg" alt="" />
                    <span>Интеллект</span>
                  </button>

                  <button
                    className={`task-add-option option-creativity ${taskCategory === 'creativity' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskCategory('creativity')}
                  >
                    <img src="/icons/task-add-creativity.svg" alt="" />
                    <span>Творчество</span>
                  </button>

                  <button
                    className={`task-add-option option-communication ${taskCategory === 'communication' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskCategory('communication')}
                  >
                    <img src="/icons/task-add-communication.svg" alt="" />
                    <span>Общение</span>
                  </button>

                  <button
                    className={`task-add-option option-physics ${taskCategory === 'physics' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskCategory('physics')}
                  >
                    <img src="/icons/task-add-physics.svg" alt="" />
                    <span>Физическая</span>
                  </button>

                  <button
                    className={`task-add-option option-routine ${taskCategory === 'routine' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskCategory('routine')}
                  >
                    <img src="/icons/task-add-routine.svg" alt="" />
                    <span>Рутина</span>
                  </button>

                  <button
                    className={`task-add-option option-rest ${taskCategory === 'rest' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskCategory('rest')}
                  >
                    <img src="/icons/task-add-rest.svg" alt="" />
                    <span>Отдых</span>
                  </button>

                </div>
              </div>

              {/* Длительность */}
              <div className="task-add-section">
                <div className="task-add-section-intro">
                  <h3 className="task-add-label">Длительность</h3>
                  <p className="task-add-description">
                    Сколько времени займет задача
                  </p>
                </div>

                <div className="task-add-options task-add-duration">

                  <button
                    className={`task-add-option ${taskDuration === '15' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskDuration('15')}
                  >
                    15 минут
                  </button>

                  <button
                    className={`task-add-option ${taskDuration === '30' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskDuration('30')}
                  >
                    30 минут
                  </button>

                  <button
                    className={`task-add-option ${taskDuration === '60' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskDuration('60')}
                  >
                    1 час
                  </button>

                  <button
                    className={`task-add-option ${taskDuration === '120' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskDuration('120')}
                  >
                    2 часа
                  </button>

                  <button
                    className={`task-add-option ${taskDuration === '180' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskDuration('180')}
                  >
                    3 часа
                  </button>

                  <button
                    className={`task-add-option ${taskDuration === 'other' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setIsCustomDurationOpen(true)}
                  >
                    {taskDuration === 'other' && customDurationMinutes
                      ? `${customDurationValue} ${customDurationUnit === 'hour' ? 'ч' : 'мин'}`
                      : 'Другое'}
                  </button>

                </div>
              </div>

              {/* Когда выполнить */}
              <div className="task-add-section">
                <div className="task-add-section-intro">
                  <h3 className="task-add-label">Когда выполнить?</h3>
                  <p className="task-add-description">Можно изменить позже</p>
                </div>

                <div className="task-add-timing-section">

                  {/* Оптимальное время */}
                  <button
                    className={`task-add-timing task-add-timing-optimal ${taskTiming === 'optimal' ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => setTaskTiming('optimal')}
                  >
                    <div className="task-add-timing-content">
                      <img src="/icons/task-add-timing-optimal.svg" alt="" />
                      <span>Подобрать оптимальное время</span>
                    </div>

                    {taskTiming === 'optimal' && (
                      <img
                        className="task-add-done"
                        src="/icons/task-add-done.svg"
                        alt=""
                      />
                    )}
                  </button>

                  {/* Желаемое время */}
                  <div className={`task-add-timing-option ${taskTiming === 'wishful' ? 'is-open' : ''}`}>

                    <button
                      className={`task-add-timing task-add-timing-wishful ${taskTiming === 'wishful' ? 'is-selected' : ''}`}
                      type="button"
                      onClick={() => setTaskTiming(taskTiming === 'wishful' ? '' : 'wishful')}
                    >
                      <div className="task-add-timing-content">
                        <img src="/icons/task-add-time.svg" alt="" />
                        <span>Указать желаемое время</span>
                      </div>
                    </button>

                    {/* Поле времени */}
                    <div className="task-add-time-collapse">
                      <div className="task-add-time-inner">
                        <label className="task-add-time-field">
                          <input
                            type="time"
                            value={taskTime}
                            onChange={(event) => setTaskTime(event.target.value)}
                            aria-label="Выбрать желаемое время"
                          />

                          <img
                            className="task-add-time-icon"
                            src="/icons/task-add-time.svg"
                            alt=""
                          />
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Добавление задачи */}
            <button
              className="task-add-button"
              type="button"
              disabled={
                !isTaskFormValid ||
                (editingTaskId !== null && !hasTaskChanges())
              }
              onClick={editingTaskId !== null ? saveEditedTask : addTaskToSchedule}
            >
              {editingTaskId === null && (
                <svg
                  className="task-add-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              <span>
                {editingTaskId !== null
                  ? 'Сохранить изменения'
                  : 'Добавить в расписание'}
              </span>
            </button>

            {/* Отмена */}
            <button
              className="task-add-cancel-button"
              type="button"
              onClick={closeTaskSheet}
            >
              <span>Отмена</span>
            </button>

          </section>
        </div>
      )}

      {/* Окно собственной длительности */}
      {isCustomDurationOpen && (
        <div
          className="duration-modal-overlay"
          onClick={() => setIsCustomDurationOpen(false)}
        >
          <div
            className="duration-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="duration-modal-controls">

              <input
                className="duration-modal-input"
                type="number"
                min="1"
                step="1"
                placeholder="00"
                value={customDurationValue}
                onChange={(event) => updateCustomDuration(event.target.value)}
                aria-label="Количество времени"
              />

              <div className="duration-modal-units">

                <button
                  className={customDurationUnit === 'min' ? 'is-selected' : ''}
                  type="button"
                  onClick={() => changeCustomDurationUnit('min')}
                >
                  мин
                </button>

                <button
                  className={customDurationUnit === 'hour' ? 'is-selected' : ''}
                  type="button"
                  onClick={() => changeCustomDurationUnit('hour')}
                >
                  ч
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
      {/* Нижняя навигация */}
      <BottomNavigation
        activeTab="home"
        onOpenHome={() => {}}
        onOpenBiorhythms={onOpenBiorhythms}
        onOpenProfile={onOpenProfile}
      />
    </>
  )
}

export default HomePage
