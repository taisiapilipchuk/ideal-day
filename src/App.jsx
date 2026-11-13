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
import { adaptDaySchedule, normalizeTasks, todayISO } from './utils/schedule'

const DEFAULT_TASKS = [
  { id: 1, title: 'Подготовить презентацию', description: 'Завершить слайды и проверить материалы перед выступлением.', type: 'Интеллект', duration: 60, priority: 'Высокий', time: '09:00', preferredTime: '09:00', status: 'completed' },
  { id: 2, title: 'Изучить SQL', description: 'Повторить JOIN и выполнить практические упражнения.', type: 'Интеллект', duration: 90, priority: 'Высокий', time: '10:00', preferredTime: '10:00', status: 'planned' },
  { id: 3, title: 'Ответить на сообщения', description: '', type: 'Коммуникация', duration: 30, priority: 'Средний', time: '11:45', preferredTime: '11:45', status: 'planned' },
  { id: 4, title: 'Тренировка', description: '', type: 'Физика', duration: 60, priority: 'Средний', time: '13:00', preferredTime: '13:00', status: 'suggested' },
]

function readTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem('ideal-day-tasks'))
    if (Array.isArray(saved)) {
      return normalizeTasks(saved)
    }
  } catch {
    // If the stored value is invalid, initialize the demo task list.
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

function App() {
  const [page, setPage] = useState('start')
  const [profile, setProfile] = useState(readProfile)
<<<<<<< Updated upstream
=======
  const [tasks, setTasks] = useState(readTasks)

  useEffect(() => {
    localStorage.setItem('ideal-day-tasks', JSON.stringify(tasks))
  }, [tasks])
>>>>>>> Stashed changes

  useEffect(() => {
    localStorage.setItem('ideal-day-profile', JSON.stringify(profile))
  }, [profile])

  return (
    <div className="app">
      {page === 'start' && (
        <StartPage onRegister={() => setPage('register')}
                    onLogin={() => setPage('login')} />
      )}

      {page === 'register' && (
      <RegisterPage onBack={() => setPage('start')}
                    onRegister={() => setPage('birthDate')} />
      )}
      {page === 'login' && 
      (<LoginPage onBack={() => setPage('start')}
                  onLogin={() => setPage('home')} />
      )}

      {page === 'home' && (
        <HomePage
          profile={profile}
<<<<<<< Updated upstream
          onOpenProfile={() => setPage('profile')}
          onOpenBiorhythms={() => setPage('biorhythms')}
=======
          tasks={tasks}
          onTasksChange={setTasks}
          onOpenProfile={() => setPage('profile')}
          onOpenBiorhythms={() => setPage('biorhythms')}
          onOpenTasks={() => setPage('tasks')}
          onOpenSchedule={() => setPage('schedule')}
>>>>>>> Stashed changes
        />
      )}

      {page === 'profile' && (
        <ProfilePage
          profile={profile}
          onProfileChange={setProfile}
          onOpenHome={() => setPage('home')}
        />
      )}

      {page === 'biorhythms' && (
        <BiorhythmsPage
          profile={profile}
          onOpenHome={() => setPage('home')}
          onOpenProfile={() => setPage('profile')}
        />
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
      )}

      {page === 'birthDate' && (
        <BirthDatePage onForward={(birthDate) => {
          setProfile((current) => ({ ...current, birthDate }))
          setPage('chronotypeQuestion')
        }} />
      )}

      {page === 'chronotypeQuestion' && (
        <ChronotypeQuestionPage onForward={() => setPage('chronotypeQuestion2')}/>
      )}

      {page === 'chronotypeQuestion2' && (
        <ChronotypeQuestion2Page onForward={() => setPage('chronotypeQuestion3')}
                                onBack={() => setPage('chronotypeQuestion')}/>
      )}

      {page === 'chronotypeQuestion3' && (
        <ChronotypeQuestion3Page onForward={() => setPage('chronotypeQuestion4')}
                                onBack={() => setPage('chronotypeQuestion2')}/>
      )}

      {page === 'chronotypeQuestion4' && (
        <ChronotypeQuestion4Page onForward={() => setPage('chronotypeQuestion5')}
                                onBack={() => setPage('chronotypeQuestion3')}/>
      )}

      {page === 'chronotypeQuestion5' && (
        <ChronotypeQuestion5Page onForward={() => setPage('home')}
                                onBack={() => setPage('chronotypeQuestion4')}/>
      )}

      
    </div>
  )
}

export default App