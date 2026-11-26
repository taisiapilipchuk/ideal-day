
import { useState } from 'react'
import './ChronotypePage.css'

function ChronotypePage( {onOpenTest}) {
  const [chronotype, setChronotype] = useState('')

  return (
    <main>
      <div className="chronotype-intro">
        <span className="auth-logo">
          идеальный день
        </span>

        <h1 className="auth-title title-chronotype">
          Какой у тебя хронотип?
        </h1>

        <p className="chronotype-subtitle">
          Выбери свой тип, чтобы мы могли подстроить расписание под твои естественные ритмы.
        </p>
      </div>

      <div className="chronotype-selection">
        <div className="chronotype-buttons">

          {/* Жаворонок */}
          <button
            className={`chronotype-option ${chronotype === 'lark' ? 'selected' : ''}`}
            type="button"
            onClick={() => setChronotype('lark')}
          >
            <span className="chronotype-icon">
              <img src="/icons/lark.svg" alt="" />
            </span>

            <span className="chronotype-info">
              <span className="chronotype-name">
                Жаворонок
              </span>
              <span className="chronotype-description">
                Лучше чувствую себя утром
              </span>
            </span>

            <span className={`chronotype-radio ${chronotype === 'lark' ? 'selected' : ''}`}>
              {chronotype === 'lark' && (
                <span className="chronotype-radio-selected" />
              )}
            </span>
          </button>

          {/* Голубь */}
          <button
            className={`chronotype-option ${chronotype === 'pigeon' ? 'selected' : ''}`}
            type="button"
            onClick={() => setChronotype('pigeon')}
          >
            <span className="chronotype-icon">
              <img src="/icons/pigeon.svg" alt="" />
            </span>

            <span className="chronotype-info">
              <span className="chronotype-name">
                Голубь
              </span>
              <span className="chronotype-description">
                Мой пик активности — днём
              </span>
            </span>

            <span className={`chronotype-radio ${chronotype === 'pigeon' ? 'selected' : ''}`}>
              {chronotype === 'pigeon' && (
                <span className="chronotype-radio-selected" />
              )}
            </span>
          </button>

          {/* Сова */}
          <button
            className={`chronotype-option ${chronotype === 'owl' ? 'selected' : ''}`}
            type="button"
            onClick={() => setChronotype('owl')}
          >
            <span className="chronotype-icon">
              <img src="/icons/owl.svg" alt="" />
            </span>

            <span className="chronotype-info">
              <span className="chronotype-name">
                Сова
              </span>
              <span className="chronotype-description">
                Раскрываю энергию вечером
              </span>
            </span>

            <span className={`chronotype-radio ${chronotype === 'owl' ? 'selected' : ''}`}>
              {chronotype === 'owl' && (
                <span className="chronotype-radio-selected" />
              )}
            </span>
          </button>

        </div>

        <button
          className="chronotype-test"
          type="button"
          onClick={onOpenTest}
        >
          Не знаю свой хронотип
        </button>
      </div>

      <button
        className="auth-submit-button chronotype-button"
        type="button"
        disabled={!chronotype}
      >
        Продолжить
      </button>
    </main>
  )
}

export default ChronotypePage
