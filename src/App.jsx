
import { useState, useEffect } from 'react'
import { registerUser, getCurrentUser } from './api'

import StartPage from './pages/StartPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import BirthDatePage from './pages/BirthDatePage'
import ChronotypeQuestionPage from './pages/ChronotypeQuestionPage'
import ChronotypeQuestion2Page from './pages/ChronotypeQuestion2Page'
import ChronotypeQuestion3Page from './pages/ChronotypeQuestion3Page'
import ChronotypeQuestion4Page from './pages/ChronotypeQuestion4Page'
import ChronotypeQuestion5Page from './pages/ChronotypeQuestion5Page'
import ProfilePage from './pages/ProfilePage'

function App() {
  const [page, setPage] = useState('start')
  const [registrationError, setRegistrationError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [registrationData, setRegistrationData] = useState({
    username: '',
    email: '',
    password: '',
    birth_date: '',
    answers: ['', '', '', '', ''],
  })

  // Проверяем авторизацию при запуске приложения
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('access_token')

      if (!token) {
        setCheckingAuth(false)
        return
      }

      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
        setPage('home')
      } catch (error) {
        localStorage.removeItem('access_token')
        setCurrentUser(null)
        setPage('start')
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [])

  function updateRegistrationData(data) {
    setRegistrationData((previous) => ({
      ...previous,
      ...data,
    }))
  }

  function updateChronotypeAnswer(index, answer) {
    setRegistrationData((previous) => {
      const answers = [...previous.answers]
      answers[index] = answer

      return {
        ...previous,
        answers,
      }
    })
  }

  async function handleCompleteRegistration(answer) {
    const chronotypeMap = {
      'Определенно «жаворонок»': 'lark',
      'Скорее «жаворонок», чем «сова»': 'lark',
      'Ни то, ни другое (аритмик)': 'pigeon',
      'Скорее «сова», чем «жаворонок»': 'owl',
      'Определенно «сова»': 'owl',
    }

    const userData = {
      username: registrationData.username,
      email: registrationData.email,
      password: registrationData.password,
      birth_date: registrationData.birth_date,
      chronotype: chronotypeMap[answer],
    }

    setRegistrationError('')

    try {
      await registerUser(userData)
      setPage('login')
    } catch (error) {
      setRegistrationError(error.message)
    }
  }

  async function handleLogin() {
    const user = await getCurrentUser()
    setCurrentUser(user)
    setPage('home')
  }

  if (checkingAuth) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="app">
      {page === 'start' && (
        <StartPage
          onRegister={() => setPage('register')}
          onLogin={() => setPage('login')}
        />
      )}

      {page === 'register' && (
        <RegisterPage
          onBack={() => setPage('start')}
          onRegister={(data) => {
            updateRegistrationData(data)
            setPage('birthDate')
          }}
        />
      )}

      {page === 'login' && (
        <LoginPage
          onBack={() => setPage('start')}
          onLogin={handleLogin}
        />
      )}

      {page === 'home' && (
        <HomePage
          onOpenProfile={() => setPage('profile')}
        />
      )}

      {page === 'profile' && (
        <ProfilePage
          onOpenHome={() => setPage('home')}
          user={currentUser}
        />
      )}

      {page === 'birthDate' && (
        <BirthDatePage
          onForward={(birth_date) => {
            updateRegistrationData({ birth_date })
            setPage('chronotypeQuestion')
          }}
        />
      )}

      {page === 'chronotypeQuestion' && (
        <ChronotypeQuestionPage
          onForward={(answer) => {
            updateChronotypeAnswer(0, answer)
            setPage('chronotypeQuestion2')
          }}
        />
      )}

      {page === 'chronotypeQuestion2' && (
        <ChronotypeQuestion2Page
          onForward={(answer) => {
            updateChronotypeAnswer(1, answer)
            setPage('chronotypeQuestion3')
          }}
          onBack={() => setPage('chronotypeQuestion')}
        />
      )}

      {page === 'chronotypeQuestion3' && (
        <ChronotypeQuestion3Page
          onForward={(answer) => {
            updateChronotypeAnswer(2, answer)
            setPage('chronotypeQuestion4')
          }}
          onBack={() => setPage('chronotypeQuestion2')}
        />
      )}

      {page === 'chronotypeQuestion4' && (
        <ChronotypeQuestion4Page
          onForward={(answer) => {
            updateChronotypeAnswer(3, answer)
            setPage('chronotypeQuestion5')
          }}
          onBack={() => setPage('chronotypeQuestion3')}
        />
      )}

      {page === 'chronotypeQuestion5' && (
        <>
          <ChronotypeQuestion5Page
            onForward={handleCompleteRegistration}
            onBack={() => setPage('chronotypeQuestion4')}
          />

          {registrationError && (
            <p className="chronotype-error">
              {registrationError}
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default App
