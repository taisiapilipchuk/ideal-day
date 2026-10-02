import { useState } from 'react'
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

function App() {
  const [page, setPage] = useState('start')

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
        <HomePage />
      )}

      {page === 'birthDate' && (
        <BirthDatePage  onForward={() => setPage('chronotypeQuestion')}/>
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