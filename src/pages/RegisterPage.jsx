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
    if (email === '') {
      setEmailError('Введите email')
    }
    else if (password === '') {
      setPasswordError('Введите пароль')
    }
    else if (password === confirmPassword) {
      setPasswordError('')
      onRegister()
    } else {
      setPasswordError('Пароли не совпадают')
    }
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
                onChange={(event) => setEmail(event.target.value)}
            />

            {emailError && (
              <p className="register-error">
                {emailError}
                </p>)
            }
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
                onChange={(event) => setPassword(event.target.value)}
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
              onChange={(event) => setConfirmPassword(event.target.value)
              }
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