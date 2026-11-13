
import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestion3Page({ onForward, onBack }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [selectedAnswerError, setSelectedAnswerError] = useState('')

  const answers = [
    '05:00 – 08:00',
    '08:00 – 10:00',
    '10:00 – 17:00',
    '17:00 – 22:00',
    '22:00 и позже',
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
          Вопрос 3 из 5
        </p>

        <h1 className="chronotype-title">
          В какое время суток вы чувствуете себя наиболее бодрым и продуктивным?
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

export default ChronotypeQuestion3Page
