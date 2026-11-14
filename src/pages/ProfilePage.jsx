
import { useState } from 'react'
import './ProfilePage.css'

function formatBirthDate(birthDate) {
  if (!birthDate) return 'Не указана'

  const [year, month, day] = birthDate.split('-')
  return `${day}.${month}.${year}`
}

function ProfilePage({ onOpenHome, user }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const chronotypeNames = {
    lark: 'Жаворонок',
    pigeon: 'Голубь',
    owl: 'Сова',
  }

  function handleLogout() {
    const confirmed = window.confirm('Вы действительно хотите выйти?')

    if (confirmed) {
      localStorage.removeItem('access_token')
      window.location.reload()
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <h1 className="profile-title">Профиль</h1>
        <p className="profile-subtitle">
          Управляйте своими данными и настройками
        </p>

        <section className="profile-section">
          <h2 className="profile-section-title">Личные данные</h2>

          <div className="profile-field">
            <span className="profile-label">Имя</span>
            <div className="profile-field-value">
              <span>{user?.username || 'Не указано'}</span>
            </div>
          </div>

          <div className="profile-field">
            <span className="profile-label">Email</span>
            <div className="profile-field-value">
              <span>{user?.email || 'Не указан'}</span>
            </div>
          </div>

          <div className="profile-field">
            <span className="profile-label">Дата рождения</span>
            <div className="profile-field-value">
              <span>{formatBirthDate(user?.birth_date)}</span>
            </div>
          </div>

          <div className="profile-field">
            <span className="profile-label">Хронотип</span>
            <div className="profile-field-value">
              <span>
                {chronotypeNames[user?.chronotype] || 'Не указан'}
              </span>
            </div>
          </div>

          <div className="profile-notifications">
            <div>
              <h3 className="profile-notifications-title">
                Уведомления
              </h3>
              <p className="profile-notifications-description">
                Получать напоминания и рекомендации
              </p>
            </div>

            <button
              className={`profile-toggle ${notificationsEnabled ? 'is-active' : ''}`}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              role="switch"
              aria-checked={notificationsEnabled}
              aria-label="Уведомления"
            >
              <span className="profile-toggle-circle" />
            </button>
          </div>
        </section>

        <button
          className="profile-logout-button"
          onClick={handleLogout}
        >
          Выйти из аккаунта
        </button>

        <button
          className="profile-home-button"
          onClick={onOpenHome}
        >
          ← На главную
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
