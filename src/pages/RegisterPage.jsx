
import { useState } from 'react'
import './RegisterPage.css'

function RegisterPage({ onBack, onRegister }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  function handleRegister() {
    setError('')

    if (!username || !email || !password || !confirmPassword) {
      setError('Заполните все поля')
      return
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    onRegister({
      username,
      email,
      password,
    })
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
            Имя пользователя
          </label>

          <input
            className="register-input"
            type="text"
            placeholder="Введите имя"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

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
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        {error && (
          <p className="register-error">
            {error}
          </p>
        )}

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
