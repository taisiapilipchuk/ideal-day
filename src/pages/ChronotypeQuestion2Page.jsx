
import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestion2Page({ onForward, onBack }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [selectedAnswerError, setSelectedAnswerError] = useState('')

  const answers = [
    'До 21:00',
    '21:00–22:00',
    '22:00–23:00',
    '23:00–00:00',
    'После 00:00',
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
          Вопрос 2 из 5
        </p>

        <h1 className="chronotype-title">
          Во сколько вы обычно ложитесь спать?
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

export default ChronotypeQuestion2Page
