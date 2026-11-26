
import './ChronotypeResult.css'
import chronotypeData from './chronotypeData'

function ChronotypeResultPage({ chronotype, onBack, onContinue }) {
  const result = chronotypeData[chronotype]

  return (
    <main className={`result-page result-page-${chronotype}`}>

      <div className="result-header">
        <div className="page-intro">
          <button
            className="back"
            type="button"
            onClick={onBack}
          >
            <img src="/icons/back.svg" alt="" />
            <span className="test-back-text">Назад</span>
          </button>

          <span className="intro-info">РЕЗУЛЬТАТ ТЕСТА</span>
        </div>

        <p className="result-eyebrow">
          ТВОЙ ЕСТЕСТВЕННЫЙ РИТМ
        </p>

        <h1 className="result-title">
          {result.title}
        </h1>

        <p className="result-description">
          {result.description}
        </p>
      </div>

      <div className="result-details">
        <img
          className="result-image"
          src={result.image}
          alt={result.imageAlt}
        />

        <section className="result-strength">
          <p className="result-eyebrow">
            {result.strengthTitle}
          </p>

          <p className="result-strength-description">
            {result.strengthDescription}
          </p>
        </section>

        <div className="result-cards">
          <div className="result-info-card">
            <img
              className="result-info-icon"
              src={result.wakeUpIcon}
              alt=""
            />

            <span className="result-info-label">
              ЕСТЕСТВЕННЫЙ ПОДЪЁМ
            </span>

            <span className="result-info-time">
              {result.wakeUpTime}
            </span>
          </div>

          <div className="result-info-card">
            <img
              className="result-info-icon"
              src={result.peakIcon}
              alt=""
            />

            <span className="result-info-label">
              ПИК АКТИВНОСТИ
            </span>

            <span className="result-info-time">
              {result.peakTime}
            </span>
          </div>
        </div>
      </div>

      <button
        className="auth-submit-button chronotype-button"
        type="button"
        onClick={onContinue}
      >
        Продолжить
      </button>

    </main>
  )
}

export default ChronotypeResultPage
