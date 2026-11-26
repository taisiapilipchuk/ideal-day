
import { useState } from 'react'
import './BirthDate.css'

function BirthDatePage({ onBack, onContinue }) {
  const [birthDate, setBirthDate] = useState('')

  function handleNext() {
    if (!birthDate) return
    onContinue()
  }

  return (
    <main className="birth-date-page">
      
      <div className='birth-date-header'> 
        <div className="page-intro">
        <button
          className="back"
          type="button"
          onClick={onBack}
        >
          <img src="/icons/back.svg" alt="" />
          <span className="test-back-text">Назад</span>
        </button>

        <span className="intro-info">ПОСЛЕДНИЙ ШАГ</span>
      </div>

      <div className="birth-date-header">
        <h1 className="birth-date-title">
          Когда ты родился?
        </h1>

        <p className="birth-date-description">
          Укажи дату рождения, чтобы мы могли рассчитать твои биоритмы.
        </p>
      </div>

      </div>

      <div className="birth-date-content">
        <label className="birth-date-label" htmlFor="birth-date">
          Дата рождения
        </label>

        <div className="birth-date-input-wrapper">
          <input
            className="birth-date-input"
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />

          <span className="birth-date-icon" aria-hidden="true" />
        </div>

        <p className="birth-date-note">
          Мы используем дату только для расчёта твоих биоритмов.
        </p>
      </div>

      <button
        className="auth-submit-button chronotype-button"
        type="button"
        disabled={!birthDate}
        onClick={handleNext}
      >
        Продолжить
      </button>
    </main>
  )
}

export default BirthDatePage
