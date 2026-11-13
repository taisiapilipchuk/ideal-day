
const API_URL = '/api'

// ---------- Общая функция запросов ----------

async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Произошла ошибка запроса')
  }

  return data
}

// ---------- Пользователи ----------

export async function registerUser(userData) {
  return apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function loginUser(email, password) {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getCurrentUser() {
  return apiRequest('/users/me')
}

// ---------- Задачи ----------

export async function getTasks(targetDate) {
  const query = targetDate
    ? `?target_date=${targetDate}`
    : ''

  return apiRequest(`/tasks${query}`)
}

export async function createTask(taskData) {
  return apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  })
}

export async function updateTask(taskId, taskData) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(taskData),
  })
}

export async function deleteTask(taskId) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
}

export async function getTaskSchedule(targetDate) {
  return apiRequest(`/tasks/schedule?target_date=${targetDate}`)
}
