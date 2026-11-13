
import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestion4Page({ onForward, onBack }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [selectedAnswerError, setSelectedAnswerError] = useState('')

  const answers = [
    'Очень легко, я сразу бодр',
    'Довольно легко',
    'Нейтрально / по-разному',
    'Довольно тяжело, чувствую разбитость',
    'Очень тяжело, требуется много времени на "раскачку"',
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
          Вопрос 4 из 5
        </p>

        <h1 className="chronotype-title">
          Насколько легко вам просыпаться и чувствовать себя отдохнувшим в первые 30 минут после подъема?
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

export default ChronotypeQuestion4Page
