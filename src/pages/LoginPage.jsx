
import { useState } from 'react'
import { loginUser } from '../api'
import './LoginPage.css'

function LoginPage({ onBack, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoginError('')

    if (!email || !password) {
      setLoginError('Введите email и пароль')
      return
    }

    try {
      setLoading(true)

      const data = await loginUser(email, password)

      localStorage.setItem('access_token', data.access_token)

      await onLogin()
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <button className="login-back-button" onClick={onBack}>
        ← Назад
      </button>

      <div className="login-content">
        <h1 className="login-title">Вход</h1>

        <p className="login-subtitle">
          Войдите, чтобы продолжить планировать свой идеальный день
        </p>

        <div className="login-form">
          <label className="login-label">Email</label>

          <input
            className="login-input"
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="login-form">
          <label className="login-label">Пароль</label>

          <input
            className="login-input"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {loginError && (
          <p className="login-error">{loginError}</p>
        )}

        <button
          className="login-submit-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Входим...' : 'Войти'}
        </button>
      </div>
    </div>
  )
}

export default LoginPage
