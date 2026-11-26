
import { useState } from 'react'
import '../../styles/auth.css'

import eyeOpen from '../../assets/icons/eye-open.svg'
import eyeClose from '../../assets/icons/eye-close.svg'

function LoginPage({ onLogin, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [loginError, setLoginError] = useState('')

  function handleLogin(event) {
    event.preventDefault()

    setEmailError('')
    setLoginError('')

    const trimmedEmail = email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmedEmail) {
      setEmailError('Введите email')
      return
    }

    if (!emailPattern.test(trimmedEmail)) {
      setEmailError('Введите корректный email')
      return
    }

    if (!password.trim()) {
      setLoginError('Введите пароль')
      return
    }

    onLogin()
  }

  return (
    <main className="auth-page">
      <div className="auth-intro">
        <span className="auth-logo">идеальный день</span>

        <h1 className="auth-title">
          Твой день. <br />
          Твой ритм.
        </h1>

        <p className="auth-subtitle">
          Планируй день в гармонии со своими биоритмами.
        </p>
      </div>

      <form
        id="login-form"
        className="auth-form"
        onSubmit={handleLogin}
        noValidate
      >
        <div className="auth-field">
          <label className="auth-label" htmlFor="login-email">
            Электронная почта
          </label>

          <input
            id="login-email"
            className="auth-input"
            type="email"
            placeholder="name@example.com"
            value={email}
            autoComplete="email"
            onChange={(event) => {
              setEmail(event.target.value)
              setEmailError('')
            }}
            aria-invalid={Boolean(emailError)}
          />

          {emailError && (
            <p className="auth-error" role="alert">
              {emailError}
            </p>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-password">
            Пароль
          </label>

          <div className="auth-password-wrapper">
            <input
              id="login-password"
              className="auth-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Введите пароль"
              value={password}
              autoComplete="current-password"
              onChange={(event) => {
                setPassword(event.target.value)
                setLoginError('')
              }}
              aria-invalid={Boolean(loginError)}
            />

            <button
              className="auth-password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              <img
                src={showPassword ? eyeOpen : eyeClose}
                alt=""
              />
            </button>
          </div>

          <a href="/forgot-password" className="forgot-password">
            Забыли пароль?
          </a>

          {loginError && (
            <p className="auth-error" role="alert">
              {loginError}
            </p>
          )}
        </div>
      </form>

      <div className="auth-action">
        <button
          className="auth-submit-button"
          type="submit"
          form="login-form"
        >
          Войти
        </button>

        <div className="auth-register">
          <div className='auth-register-link'>
            <span>Впервые в «Идеальный день»?</span>

          <a
            href="/register"
            className="auth-link"
            onClick={(event) => {
              event.preventDefault()
              onRegister()
            }}
          >
            Зарегистрироваться
          </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
