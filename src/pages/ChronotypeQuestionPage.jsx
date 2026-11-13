
import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestionPage({ onForward }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [selectedAnswerError, setSelectedAnswerError] = useState('')

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
        <p className="chronotype-progress">
          Вопрос 1 из 5
        </p>

        <h1 className="chronotype-title">
          Во сколько вы обычно просыпаетесь?
        </h1>

        <div className="chronotype-options">
          {[
            'До 6:00',
            '6:00–7:00',
            '7:00–8:00',
            '8:00–9:00',
            'После 9:00',
          ].map((answer) => (
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

export default ChronotypeQuestionPage
