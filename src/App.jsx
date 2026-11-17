
// import { useState } from 'react'

// // Авторизация
// import LoginPage from './pages/LoginPage/LoginPage.jsx'
// import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
// // Первоначальная настройка пользователя
// import BirthDatePage from './pages/onboarding/BirthDatePage/BirthDatePage'
// import ChronotypeQuestion1Page from './pages/onboarding/chronotype/ChronotypeQuestion1Page'
// import ChronotypeQuestion2Page from './pages/onboarding/chronotype/ChronotypeQuestion2Page'
// import ChronotypeQuestion3Page from './pages/onboarding/chronotype/ChronotypeQuestion3Page'
// import ChronotypeQuestion4Page from './pages/onboarding/chronotype/ChronotypeQuestion4Page'
// import ChronotypeQuestion5Page from './pages/onboarding/chronotype/ChronotypeQuestion5Page'

// // Основные страницы приложения
// import HomePage from './pages/main/HomePage/HomePage'
// import ProfilePage from './pages/main/ProfilePage/ProfilePage'
// import BiorhythmsPage from './pages/main/BiorhythmsPage/BiorhythmsPage'

// function App() {
//   const [page, setPage] = useState('login')

//   return (
//     <div className="app">

//       {/* Авторизация */}

//       {page === 'login' && (
//         <LoginPage
//           onLogin={() => setPage('home')}
//           onRegister={() => setPage('register')}
//         />
//       )}

//       {page === 'register' && (
//         <RegisterPage
//           onBack={() => setPage('login')}
//           onRegister={() => setPage('birthDate')}
//         />
//       )}

//       {/* Первоначальная настройка */}

//       {page === 'birthDate' && (
//         <BirthDatePage
//           onForward={() => setPage('chronotypeQuestion1')}
//         />
//       )}

//       {page === 'chronotypeQuestion1' && (
//         <ChronotypeQuestion1Page
//           onForward={() => setPage('chronotypeQuestion2')}
//         />
//       )}

//       {page === 'chronotypeQuestion2' && (
//         <ChronotypeQuestion2Page
//           onForward={() => setPage('chronotypeQuestion3')}
//           onBack={() => setPage('chronotypeQuestion1')}
//         />
//       )}

//       {page === 'chronotypeQuestion3' && (
//         <ChronotypeQuestion3Page
//           onForward={() => setPage('chronotypeQuestion4')}
//           onBack={() => setPage('chronotypeQuestion2')}
//         />
//       )}

//       {page === 'chronotypeQuestion4' && (
//         <ChronotypeQuestion4Page
//           onForward={() => setPage('chronotypeQuestion5')}
//           onBack={() => setPage('chronotypeQuestion3')}
//         />
//       )}

//       {page === 'chronotypeQuestion5' && (
//         <ChronotypeQuestion5Page
//           onForward={() => setPage('home')}
//           onBack={() => setPage('chronotypeQuestion4')}
//         />
//       )}

//       {/* Основное приложение */}

//       {page === 'home' && (
//         <HomePage
//           onOpenProfile={() => setPage('profile')}
//           onOpenBiorhythms={() => setPage('biorhythms')}
//         />
//       )}

//       {page === 'profile' && (
//         <ProfilePage
//           onOpenHome={() => setPage('home')}
//         />
//       )}

//       {page === 'biorhythms' && (
//         <BiorhythmsPage
//           onOpenHome={() => setPage('home')}
//           onOpenProfile={() => setPage('profile')}
//         />
//       )}

//     </div>
//   )
// }

// export default App




import { useState } from 'react'

import LoginPage from './pages/LoginPage/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
import ChronotypePage from './pages/ChronotypePage/ChronotypePage.jsx'
import ChronotypeTestPage from './pages/ChronotypeTest/ChronotypeTestPage.jsx'
import ChronotypeResultPage from './pages/ChronotypeResult/ChronotypeResultPage.jsx'

function App() {
  const [page, setPage] = useState('login')

  return (
    <div className="app">
      {page === 'login' && (
        <LoginPage
          onLogin={() => {}}
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
          chronotype="owl"
          onBack={() => setPage('chronotype-test')}
          onContinue={() => setPage('home')}
        />
      )}
    </div>
  )
}

export default App
