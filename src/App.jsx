import { useEffect, useState } from 'react'
import StartPage from './pages/StartPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import BiorhythmsPage from './pages/BiorhythmsPage'
import BirthDatePage from './pages/BirthDatePage'
import ChronotypeQuestionPage from './pages/ChronotypeQuestionPage'
import ChronotypeQuestion2Page from './pages/ChronotypeQuestion2Page'
import ChronotypeQuestion3Page from './pages/ChronotypeQuestion3Page'
import ChronotypeQuestion4Page from './pages/ChronotypeQuestion4Page'
import ChronotypeQuestion5Page from './pages/ChronotypeQuestion5Page'
import ProfilePage from './pages/ProfilePage'
import TasksPage from './pages/TasksPage'
import SchedulePage from './pages/SchedulePage'
import SettingsPage from './pages/SettingsPage'
import AppNavigation from './components/AppNavigation'
import { adaptDaySchedule, normalizeTasks, todayISO } from './utils/schedule'
import { readAppSettings } from './utils/appSettings'

const DEFAULT_TASKS = [
  { id: 1, title: 'Подготовить презентацию', description: 'Завершить слайды и проверить материалы перед выступлением.', type: 'Интеллект', duration: 60, priority: 'Высокий', time: '09:00', preferredTime: '09:00', status: 'completed' },
  { id: 2, title: 'Изучить SQL', description: 'Повторить JOIN и выполнить практические упражнения.', type: 'Интеллект', duration: 90, priority: 'Высокий', time: '10:00', preferredTime: '10:00', status: 'planned' },
  { id: 3, title: 'Ответить на сообщения', description: '', type: 'Коммуникация', duration: 30, priority: 'Средний', time: '11:45', preferredTime: '11:45', status: 'planned' },
  { id: 4, title: 'Тренировка', description: '', type: 'Физика', duration: 60, priority: 'Средний', time: '13:00', preferredTime: '13:00', status: 'suggested' },
]

function readTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem('ideal-day-tasks'))
    if (Array.isArray(saved)) return normalizeTasks(saved)
  } catch {
    // If stored data is invalid, initialize the demo task list.
  }
  const seeded = DEFAULT_TASKS.map((task) => ({
    ...task,
    date: todayISO(),
    deadline: '',
    isFixed: task.status === 'completed',
    unscheduled: false,
  }))
  return adaptDaySchedule(seeded, todayISO())
}

const DEFAULT_PROFILE = {
  name: 'Александра',
  email: 'alexandra@example.com',
  birthDate: '2007-05-15',
  chronotype: 'Голубь',
}

function readProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem('ideal-day-profile'))
    return saved && typeof saved === 'object'
      ? { ...DEFAULT_PROFILE, ...saved }
      : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

function localDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function App() {
  const [page, setPage] = useState('start')
  const [profile, setProfile] = useState(readProfile)
  const [tasks, setTasks] = useState(readTasks)
  const [settings, setSettings] = useState(readAppSettings)
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    const handleInstallPrompt = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }
    const handleAppInstalled = () => setInstallPrompt(null)
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ideal-day-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('ideal-day-profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('ideal-day-settings', JSON.stringify(settings))
    document.documentElement.dataset.compactMode = settings.compactMode ? 'true' : 'false'
    document.documentElement.dataset.reduceMotion = settings.reduceMotion ? 'true' : 'false'
  }, [settings])

  useEffect(() => {
    if (!settings.notificationsEnabled || typeof Notification === 'undefined') return undefined
    if (Notification.permission !== 'granted') return undefined

    const checkReminder = () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const dateKey = localDateKey(now)
      if (currentTime !== settings.reminderTime) return
      if (localStorage.getItem('ideal-day-last-reminder-date') === dateKey) return

      localStorage.setItem('ideal-day-last-reminder-date', dateKey)
      const title = 'Пора заглянуть в Ideal Day'
      const options = {
        body: 'Проверь задачи и расписание на сегодня. Хорошего дня!',
        icon: '/icons/pwa-192.png',
        badge: '/icons/pwa-192.png',
        tag: 'ideal-day-daily-reminder',
      }
      const showReminder = async () => {
        try {
          const registration = 'serviceWorker' in navigator
            ? await navigator.serviceWorker.getRegistration()
            : null
          if (registration?.active) {
            await registration.showNotification(title, options)
          } else {
            new Notification(title, options)
          }
        } catch {
          new Notification(title, options)
        }
      }
      void showReminder()
    }

    checkReminder()
    const intervalId = window.setInterval(checkReminder, 15000)
    return () => window.clearInterval(intervalId)
  }, [settings.notificationsEnabled, settings.reminderTime])

  return (
    <div className={`app${settings.compactMode ? ' app-compact' : ''}${settings.reduceMotion ? ' app-reduce-motion' : ''}`}>
      {page === 'start' && (
        <StartPage onRegister={() => setPage('register')} onLogin={() => setPage('login')} />
      )}

      {page === 'register' && (
        <RegisterPage onBack={() => setPage('start')} onRegister={() => setPage('birthDate')} />
      )}

      {page === 'login' && (
        <LoginPage onBack={() => setPage('start')} onLogin={() => setPage('home')} />
      )}

      {page === 'home' && (
        <HomePage
          profile={profile}
          tasks={tasks}
          onTasksChange={setTasks}
          onOpenProfile={() => setPage('profile')}
          onOpenBiorhythms={() => setPage('biorhythms')}
          onOpenTasks={() => setPage('tasks')}
          onOpenSchedule={() => setPage('schedule')}
          onOpenSettings={() => setPage('settings')}
        />
      )}

      {page === 'profile' && (
        <ProfilePage
          profile={profile}
          settings={settings}
          onProfileChange={setProfile}
          onOpenHome={() => setPage('home')}
          onOpenSettings={() => setPage('settings')}
        />
      )}

      {page === 'biorhythms' && (
        <BiorhythmsPage
          profile={profile}
          onOpenHome={() => setPage('home')}
          onOpenProfile={() => setPage('profile')}
          onOpenSettings={() => setPage('settings')}
        />
      )}

      {page === 'tasks' && (
        <TasksPage
          tasks={tasks}
          onTasksChange={setTasks}
          onOpenHome={() => setPage('home')}
          onOpenSchedule={() => setPage('schedule')}
          onOpenBiorhythms={() => setPage('biorhythms')}
          onOpenProfile={() => setPage('profile')}
        />
      )}

      {page === 'schedule' && (
        <SchedulePage
          tasks={tasks}
          onTasksChange={setTasks}
          onOpenHome={() => setPage('home')}
          onOpenTasks={() => setPage('tasks')}
          onOpenBiorhythms={() => setPage('biorhythms')}
          onOpenProfile={() => setPage('profile')}
        />
      )}

      {page === 'settings' && (
        <SettingsPage
          settings={settings}
          installPrompt={installPrompt}
          onInstallPromptClear={() => setInstallPrompt(null)}
          onSettingsChange={setSettings}
          onOpenHome={() => setPage('home')}
          onOpenTasks={() => setPage('tasks')}
          onOpenSchedule={() => setPage('schedule')}
          onOpenProfile={() => setPage('profile')}
        />
      )}

      {page === 'birthDate' && (
        <BirthDatePage onForward={(birthDate) => {
          setProfile((current) => ({ ...current, birthDate }))
          setPage('chronotypeQuestion')
        }} />
      )}

      {page === 'chronotypeQuestion' && (
        <ChronotypeQuestionPage onForward={() => setPage('chronotypeQuestion2')} />
      )}

      {page === 'chronotypeQuestion2' && (
        <ChronotypeQuestion2Page
          onForward={() => setPage('chronotypeQuestion3')}
          onBack={() => setPage('chronotypeQuestion')}
        />
      )}

      {page === 'chronotypeQuestion3' && (
        <ChronotypeQuestion3Page
          onForward={() => setPage('chronotypeQuestion4')}
          onBack={() => setPage('chronotypeQuestion2')}
        />
      )}

      {page === 'chronotypeQuestion4' && (
        <ChronotypeQuestion4Page
          onForward={() => setPage('chronotypeQuestion5')}
          onBack={() => setPage('chronotypeQuestion3')}
        />
      )}

      {page === 'chronotypeQuestion5' && (
        <ChronotypeQuestion5Page
          onForward={() => setPage('home')}
          onBack={() => setPage('chronotypeQuestion4')}
        />
      )}

      {['home', 'biorhythms', 'tasks', 'schedule', 'profile', 'settings'].includes(page) && (
        <AppNavigation activePage={page} onNavigate={setPage} />
      )}
    </div>
  )
}

export default App
