
import { useState } from 'react'
import './RegisterPage.css'

function RegisterPage({ onBack, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')

  function handleRegister() {
    setEmailError('')
    setPasswordError('')

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
      setPasswordError('Введите пароль')
      return
    }

    if (confirmPassword === '') {
      setPasswordError('Повторите пароль')
      return
    }

    if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают')
      return
    }

    onRegister()
  }

  return (
    <div className="register-page">
      <button className="register-back-button" onClick={onBack}>
        ← Назад
      </button>

      <div className="register-content">
        <h1 className="register-title">
          Создать аккаунт
        </h1>

        <p className="register-subtitle">
          Заполните данные, чтобы начать планировать свой идеальный день
        </p>

        <div className="register-form">
          <label className="register-label">
            Email
          </label>

          <input
            className="register-input"
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setEmailError('')
            }}
          />

          {emailError && (
            <p className="register-error">
              {emailError}
            </p>
          )}
        </div>

        <div className="register-form">
          <label className="register-label">
            Пароль
          </label>

          <input
            className="register-input"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setPasswordError('')
            }}
          />
        </div>

        <div className="register-form">
          <label className="register-label">
            Повторите пароль
          </label>

          <input
            className="register-input"
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setPasswordError('')
            }}
          />

          {passwordError && (
            <p className="register-error">
              {passwordError}
            </p>
          )}
        </div>

        <button
          className="register-submit-button"
          onClick={handleRegister}
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  )
}

export default RegisterPage
