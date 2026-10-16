
import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestion5Page({ onForward, onBack }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [selectedAnswerError, setSelectedAnswerError] = useState('')

  function chooseAnswer(answer) {
    setSelectedAnswer(answer)
    setSelectedAnswerError('')
  }

  function handleForward() {
    setSelectedAnswerError('')

    if (selectedAnswer === '') {
      setSelectedAnswerError('Выберите вариант ответа')
      return
    }

    onForward()
  }

  return (
    <div className="chronotype-page">
      <div className="chronotype-content">
        <button
          className="chronotype-back-button"
          onClick={onBack}
        >
          ← Назад
        </button>

        <p className="chronotype-progress">
          Вопрос 5 из 5
        </p>

        <h1 className="chronotype-title">
          К какому типу людей вы себя относите?
        </h1>

        <p className="chronotype-hint-intro">
          Если не знаете, кто вы — жаворонок или сова,
          вот небольшая подсказка
        </p>

        <div className="chronotype-hints">
          <div className="chronotype-hint-card">
            <span className="chronotype-hint-icon">🌅</span>
            <h3>Жаворонок</h3>
            <p>
              Легче просыпается утром, активнее в первой
              половине дня и обычно раньше ложится спать.
            </p>
          </div>

          <div className="chronotype-hint-card">
            <span className="chronotype-hint-icon">🌙</span>
            <h3>Сова</h3>
            <p>
              Легче включается в работу ближе к вечеру,
              предпочитает позднее ложиться и просыпаться.
            </p>
          </div>
        </div>

        <p className="chronotype-hint-note">
          Необязательно полностью соответствовать одному типу.
          Выбирайте тот, который больше похож на вас.
        </p>

        <div className="chronotype-options">
          <button
            className={`chronotype-option ${
              selectedAnswer === 'Определенно «жаворонок»' ? 'selected' : ''
            }`}
            onClick={() => chooseAnswer('Определенно «жаворонок»')}
          >
            Определенно «жаворонок»
          </button>

          <button
            className={`chronotype-option ${
              selectedAnswer === 'Скорее «жаворонок», чем «сова»' ? 'selected' : ''
            }`}
            onClick={() => chooseAnswer('Скорее «жаворонок», чем «сова»')}
          >
            Скорее «жаворонок», чем «сова»
          </button>

          <button
            className={`chronotype-option ${
              selectedAnswer === 'Ни то, ни другое (аритмик)' ? 'selected' : ''
            }`}
            onClick={() => chooseAnswer('Ни то, ни другое (аритмик)')}
          >
            Ни то, ни другое (аритмик)
          </button>

          <button
            className={`chronotype-option ${
              selectedAnswer === 'Скорее «сова», чем «жаворонок»' ? 'selected' : ''
            }`}
            onClick={() => chooseAnswer('Скорее «сова», чем «жаворонок»')}
          >
            Скорее «сова», чем «жаворонок»
          </button>

          <button
            className={`chronotype-option ${
              selectedAnswer === 'Определенно «сова»' ? 'selected' : ''
            }`}
            onClick={() => chooseAnswer('Определенно «сова»')}
          >
            Определенно «сова»
          </button>
        </div>

        {selectedAnswerError && (
          <p className="chronotype-error">
            {selectedAnswerError}
          </p>
        )}

        <button
          className="chronotype-next-button"
          onClick={handleForward}
        >
          Продолжить
        </button>
      </div>
    </div>
  )
}

export default ChronotypeQuestion5Page
