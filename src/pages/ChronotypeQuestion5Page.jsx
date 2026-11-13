
import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestion5Page({ onForward, onBack }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [selectedAnswerError, setSelectedAnswerError] = useState('')

  const answers = [
    'Определенно «жаворонок»',
    'Скорее «жаворонок», чем «сова»',
    'Ни то, ни другое (аритмик)',
    'Скорее «сова», чем «жаворонок»',
    'Определенно «сова»',
  ]

  function handleForward() {
    setSelectedAnswerError('')

    if (selectedAnswer === '') {
      setSelectedAnswerError('Выберите вариант ответа')
      return
    }

    onForward(selectedAnswer)
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

        <div className="chronotype-options">
          {answers.map((answer) => (
            <button
              key={answer}
              className={`chronotype-option ${
                selectedAnswer === answer ? 'selected' : ''
              }`}
              onClick={() => setSelectedAnswer(answer)}
            >
              {answer}
            </button>
          ))}
        </div>

        <button
          className="chronotype-next-button"
          onClick={handleForward}
        >
          Продолжить
        </button>

        {selectedAnswerError && (
          <p className="chronotype-error">
            {selectedAnswerError}
          </p>
        )}
      </div>
    </div>
  )
}

export default ChronotypeQuestion5Page
