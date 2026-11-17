
import { useState } from 'react'
import './ProfilePage.css'

function ProfilePage({ onOpenHome }) {
  const [profile, setProfile] = useState({
    name: 'Александра',
    email: 'alexandra@example.com',
    birthDate: '2007-05-15',
    chronotype: 'Голубь',
  })

  const [editingField, setEditingField] = useState(null)
  const [draftValue, setDraftValue] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  function startEditing(field) {
    setEditingField(field)
    setDraftValue(profile[field])
  }

  function saveChanges() {
    setProfile({
      ...profile,
      [editingField]: draftValue,
    })

    setEditingField(null)
  }

  function cancelEditing() {
    setEditingField(null)
    setDraftValue('')
  }

  function renderProfileField(field, label, type = 'text') {
    return (
      <div className="profile-field" key={field}>
        <span className="profile-label">{label}</span>

        {editingField === field ? (
          <div className="profile-edit-form">
            <input
              className="profile-input"
              type={type}
              value={draftValue}
              onChange={(event) => setDraftValue(event.target.value)}
            />

            <div className="profile-edit-buttons">
              <button
                className="profile-save-button"
                onClick={saveChanges}
              >
                Сохранить
              </button>

              <button
                className="profile-cancel-button"
                onClick={cancelEditing}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-field-value">
            <span>
              {field === 'birthDate'
                ? profile[field].split('-').reverse().join('.')
                : profile[field]}
            </span>

            <button
              className="profile-edit-button"
              aria-label={`Изменить: ${label}`}
              onClick={() => startEditing(field)}
            >
              ✎
            </button>
          </div>
        )}
      </div>
    )
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

          {renderProfileField('name', 'Имя')}
          {renderProfileField('email', 'Email', 'email')}
          {renderProfileField('birthDate', 'Дата рождения', 'date')}
          {renderProfileField('chronotype', 'Хронотип')}

          
          <div className="profile-notifications">
            <div>
              <h3 className="profile-notifications-title">Уведомления</h3>
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
              <span className="profile-toggle-circle"></span>
            </button>
          </div>
        </section>
         <button
          className="profile-logout-button"
          onClick={() => {
            const confirmed = window.confirm('Вы действительно хотите выйти?')

            if (confirmed) {
              window.location.href = '/'
            }
          }}
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