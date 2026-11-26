
import { useState } from 'react'
import '../../styles/auth.css'

import eyeOpen from '../../assets/icons/eye-open.svg'
import eyeClose from '../../assets/icons/eye-close.svg'

function RegisterPage({ onBack, onRegister }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const hasLetter = /[a-zа-яё]/i.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^a-zа-яё0-9]/i.test(password)

  let passwordStrength = 0

  if (password.length > 0) passwordStrength = 1

  if (password.length >= 8) {
    passwordStrength = 2
  }

  if (password.length >= 8 && hasLetter && hasNumber) {
    passwordStrength = 3
  }

  if (
    password.length >= 8 &&
    hasLetter &&
    hasNumber &&
    hasSpecial
  ) {
    passwordStrength = 4
  }

  function handleRegister(event) {
    event.preventDefault()

    setNameError('')
    setEmailError('')
    setPasswordError('')

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmedName) {
      setNameError('Введи своё имя')
      return
    }

    if (!trimmedEmail) {
      setEmailError('Введи email')
      return
    }

    if (!emailPattern.test(trimmedEmail)) {
      setEmailError('Введи корректный email')
      return
    }

    if (!password) {
      setPasswordError('Придумай пароль')
      return
    }

    if (password.length < 8) {
      setPasswordError('Пароль должен содержать минимум 8 символов')
      return
    }

    onRegister()
  }

  return (
    <main className="auth-page">
      <div className='auth-page-header'>
        <span className="auth-logo">
        идеальный день
      </span>

        <h1 className="auth-title">
          Начни жить <br /> в своём ритме
        </h1>

        <p className="auth-subtitle">
          Планируй день в гармонии со своими биоритмами
        </p>
      </div>

        <form
          id="register-form"
          className="auth-form"
          onSubmit={handleRegister}
          noValidate
        >
          <div className="auth-field">
            <label className="auth-label" htmlFor="register-name">
              Как тебя зовут?
            </label>

            <input
              id="register-name"
              className="auth-input"
              type="text"
              placeholder="Твоё имя"
              value={name}
              autoComplete="name"
              onChange={(event) => {
                setName(event.target.value)
                setNameError('')
              }}
              aria-invalid={Boolean(nameError)}
            />

            {nameError && (
              <p className="auth-error" role="alert">
                {nameError}
              </p>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="register-email">
              Электронная почта
            </label>

            <input
              id="register-email"
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
            <label className="auth-label" htmlFor="register-password">
              Пароль
            </label>

            <div className="auth-password-wrapper">
              <input
                id="register-password"
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Придумай пароль"
                value={password}
                autoComplete="new-password"
                onChange={(event) => {
                  setPassword(event.target.value)
                  setPasswordError('')
                }}
                aria-invalid={Boolean(passwordError)}
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

            <p className="auth-hint">
              Минимум 8 символов
            </p>

            {password.length > 0 && (
              <div
                className={`auth-password-strength strength-${passwordStrength}`}
                aria-label={`Надёжность пароля: ${passwordStrength} из 4`}
              >
                <div className="auth-password-strength-info">
                  <span className="auth-password-strength-title">
                    Надёжность пароля
                  </span>

                  <span className="strength-label">
                    {['', 'Очень слабый', 'Слабый', 'Средний', 'Надёжный'][passwordStrength]}
                  </span>
                </div>

                <div className="auth-password-strength-bars">
                  {[1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={
                        level <= passwordStrength
                          ? 'strength-bar active'
                          : 'strength-bar'
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {passwordError && (
              <p className="auth-error" role="alert">
                {passwordError}
              </p>
            )}
          </div>
        </form>

        <div className="auth-register">

          <button
            className="auth-submit-button"
            type="submit"
            form="register-form"
          >
            Создать аккаунт
          </button>

          <div className='auth-register-link'>
            <span>Уже есть аккаунт?</span>

          <a
            href="/register"
            className="auth-link"
            onClick={(event) => {
              event.preventDefault()
              onBack()
            }}
          >
            Войти
          </a>
          </div>
        </div>
    </main>
  )
}

export default RegisterPage
