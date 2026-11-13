import './BirthDatePage.css'
import { useState } from 'react'

function BirthDatePage({ onForward}) {
  const [birthDate, setBirthDate] = useState('')
  const [birthDateError, setBirthDateError] = useState('')

  function handleForward() {
    setBirthDateError('')
    if (birthDate === '') {
      setBirthDateError('Введите дату рождения')
    }
    else onForward(birthDate)
  }

  return (
    <div className="birth-date-page">
      <div className="birth-date-content">
        <h1 className="birth-date-title">
          Дата рождения
        </h1>

        <p className="birth-date-subtitle">
          Введите дату рождения, чтобы мы могли рассчитать ваши биоритмы
        </p>

        <label className="birth-date-label">
          Дата рождения
        </label>

        <input
          className="birth-date-input"
          type="date"
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
        />

        {birthDateError && (
          <p className="birth-date-error"> {birthDateError}</p>
        )}

        <button className="birth-date-button" 
                onClick={handleForward}>
          Продолжить
        </button>
      </div>
    </div>
  )
}

export default BirthDatePage