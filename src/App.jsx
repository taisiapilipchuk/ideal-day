import { useState } from 'react'
import StartPage from './pages/StartPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

function App() {
  const [page, setPage] = useState('start')

  return (
    <div className="app">
      {page === 'start' && (
        <StartPage onRegister={() => setPage('register')}
                    onLogin={() => setPage('login')} />
      )}

      {page === 'register' && (
      <RegisterPage onBack={() => setPage('start')} />
      )}
      {page === 'login' && 
      (<LoginPage onBack={() => setPage('start')} />)}
    </div>
  )
}

export default App