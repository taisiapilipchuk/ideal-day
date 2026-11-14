export const DAY_START_MINUTES = 8 * 60
export const DAY_END_MINUTES = 22 * 60
export const TASK_BREAK_MINUTES = 10

export function todayISO() {
  const date = new Date()
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

export function toMinutes(time) {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return DAY_START_MINUTES
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function fromMinutes(value) {
  const safe = Math.max(0, Math.min(23 * 60 + 59, Math.round(value)))
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`
}

export function getEndTime(task) {
  return fromMinutes(toMinutes(task.time) + Number(task.duration || 0))
}

export function normalizeTasks(tasks) {
  const today = todayISO()
  return (Array.isArray(tasks) ? tasks : []).map((task) => ({
    ...task,
    date: task.date || today,
    deadline: task.deadline || '',
    description: task.description || '',
    duration: Number(task.duration) > 0 ? Number(task.duration) : 60,
    priority: task.priority || 'Средний',
    type: task.type || 'Рутина',
    time: task.time || '09:00',
    preferredTime: task.preferredTime || task.time || '09:00',
    status: task.status || 'planned',
    isFixed: Boolean(task.isFixed),
    unscheduled: Boolean(task.unscheduled),
  }))
}

function overlaps(start, end, item) {
  return start < item.end + TASK_BREAK_MINUTES && end + TASK_BREAK_MINUTES > item.start
}

function findAvailableStart(preferred, duration, occupied) {
  const step = 5
  const latestStart = DAY_END_MINUTES - duration

  for (let candidate = Math.max(DAY_START_MINUTES, preferred); candidate <= latestStart; candidate += step) {
    const end = candidate + duration
    if (!occupied.some((item) => overlaps(candidate, end, item))) return candidate
  }

  return null
}

/**
 * Keeps completed, in-progress and manually fixed tasks in place.
 * Flexible tasks are placed in their preferred order into the next free slots.
 */
export function adaptDaySchedule(allTasks, date) {
  const tasks = normalizeTasks(allTasks)
  const dayTasks = tasks.filter((task) => task.date === date)
  const otherTasks = tasks.filter((task) => task.date !== date)

  const locked = dayTasks.filter((task) =>
    task.status === 'completed' || task.status === 'in_progress' || task.isFixed
  )
  const flexible = dayTasks.filter((task) =>
    task.status !== 'completed' && task.status !== 'in_progress' && !task.isFixed
  )

  const occupied = locked
    .filter((task) => task.time)
    .map((task) => ({
      id: task.id,
      start: toMinutes(task.time),
      end: toMinutes(task.time) + Number(task.duration || 0),
    }))

  const priorityWeight = { Высокий: 3, Средний: 2, Низкий: 1 }
  flexible.sort((a, b) => {
    const timeDifference = toMinutes(a.preferredTime || a.time) - toMinutes(b.preferredTime || b.time)
    return timeDifference || (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
  })

  const adjusted = new Map()
  for (const task of flexible) {
    const preferred = toMinutes(task.preferredTime || task.time)
    const start = findAvailableStart(preferred, Number(task.duration || 60), occupied)

    if (start === null) {
      adjusted.set(task.id, { ...task, time: '', unscheduled: true })
      continue
    }

    const end = start + Number(task.duration || 60)
    occupied.push({ id: task.id, start, end })
    occupied.sort((a, b) => a.start - b.start)
    adjusted.set(task.id, { ...task, time: fromMinutes(start), unscheduled: false })
  }

  const updatedDay = dayTasks.map((task) => adjusted.get(task.id) || task)
  return [...otherTasks, ...updatedDay].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    if (!a.time) return 1
    if (!b.time) return -1
    return a.time.localeCompare(b.time)
  })
}

export function getTaskConflicts(tasks, date) {
  const dayTasks = normalizeTasks(tasks)
    .filter((task) => task.date === date && task.time && task.status !== 'cancelled')
    .sort((a, b) => toMinutes(a.time) - toMinutes(b.time))
  const conflicts = new Set()

  for (let leftIndex = 0; leftIndex < dayTasks.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < dayTasks.length; rightIndex += 1) {
      const left = dayTasks[leftIndex]
      const right = dayTasks[rightIndex]
      const leftStart = toMinutes(left.time)
      const leftEnd = leftStart + Number(left.duration || 0)
      const rightStart = toMinutes(right.time)
      const rightEnd = rightStart + Number(right.duration || 0)
      if (leftStart < rightEnd && rightStart < leftEnd) {
        conflicts.add(left.id)
        conflicts.add(right.id)
      }
    }
  }

  return conflicts
}
