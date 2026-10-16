
import { useState } from 'react'
import './LoginPage.css'

function LoginPage({ onBack, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loginError, setLoginError] = useState('')

  function handleLogin() {
    setEmailError('')
    setLoginError('')

    const trimmedEmail = email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (trimmedEmail === '') {
      setEmailError('Введите email')
      return
    }

    if (!emailPattern.test(trimmedEmail)) {
      setEmailError('Введите корректный email, например name@example.com')
      return
    }

    if (password === '') {
      setLoginError('Введите пароль')
      return
    }

    onLogin()
  }

  return (
    <div className="login-page">
      <button className="login-back-button" onClick={onBack}>
        ← Назад
      </button>

      <div className="login-content">
        <h1 className="login-title">
          Вход
        </h1>

        <p className="login-subtitle">
          Войдите, чтобы продолжить планировать свой идеальный день
        </p>

        <div className="login-form">
          <label className="login-label">
            Email
          </label>

          <input
            className="login-input"
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setEmailError('')
            }}
          />

          {emailError && (
            <p className="login-error">
              {emailError}
            </p>
          )}
        </div>

        <div className="login-form">
          <label className="login-label">
            Пароль
          </label>

          <input
            className="login-input"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setLoginError('')
            }}
          />

          {loginError && (
            <p className="login-error">
              {loginError}
            </p>
          )}
        </div>

        <button
          className="login-submit-button"
          onClick={handleLogin}
        >
          Войти
        </button>
      </div>
    </div>
  )
}

export default LoginPage
