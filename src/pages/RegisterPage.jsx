import { useState } from 'react'
import './RegisterPage.css'

function RegisterPage({ onBack }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
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

        <button className="register-submit-button">
            Зарегистрироваться
        </button>

      </div>

    </div>
  )
}

export default RegisterPage