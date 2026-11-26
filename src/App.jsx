import { useState } from 'react'

import LoginPage from './pages/LoginPage/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
import ChronotypePage from './pages/ChronotypePage/ChronotypePage.jsx'
import ChronotypeTestPage from './pages/ChronotypeTest/ChronotypeTestPage.jsx'
import ChronotypeResultPage from './pages/ChronotypeResult/ChronotypeResultPage.jsx'
import BirthDatePage from './pages/BirthDate/BirthDatePage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import BiorhythmsPage from './pages/BiorhythmsPage/BiorhythmsPage.jsx'
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx'

function App() {
  const [page, setPage] = useState('login')

  return (
    <div className="app">
      {page === 'login' && (
        <LoginPage
          onLogin={() => setPage('home')}
          onRegister={() => setPage('register')}
        />
      )}

      {page === 'register' && (
        <RegisterPage
          onRegister={() => setPage('chronotype')}
          onBack={() => setPage('login')}
        />
      )}

      {page === 'chronotype' && (
        <ChronotypePage
          onOpenTest={() => setPage('chronotype-test')}
        />
      )}

      {page === 'chronotype-test' && (
        <ChronotypeTestPage
          onBack={() => setPage('chronotype')}
          onFinish={() => setPage('chronotype-result')}
        />
      )}

      {page === 'chronotype-result' && (
        <ChronotypeResultPage
          chronotype="lark"
          onBack={() => setPage('chronotype-test')}
          onContinue={() => setPage('birth-date')}
        />
      )}

      {page === 'birth-date' && (
        <BirthDatePage
          onBack={() => setPage('chronotype-result')}
          onContinue={() => setPage('home')}
        />
      )}

      {page === 'home' && (
        <HomePage
          onOpenBiorhythms={() => setPage('biorhythms')}
          onOpenProfile={() => setPage('profile')}
        />
      )}

      {page === 'biorhythms' && (
        <BiorhythmsPage
          onOpenHome={() => setPage('home')}
          onOpenProfile={() => setPage('profile')}
        />
      )}

      {page === 'profile' && (
        <ProfilePage
          onOpenHome={() => setPage('home')}
          onOpenBiorhythms={() => setPage('biorhythms')}
        />
      )}
    </div>
  )
}

export default App
