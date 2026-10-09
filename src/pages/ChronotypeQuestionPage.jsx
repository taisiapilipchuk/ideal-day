import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestionPage( {onForward} ) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [selectedAnswerError, setSelectedAnsweError] = useState('')

  function handleForward() {
    setSelectedAnsweError('')
    if (selectedAnswer === '') {
      setSelectedAnsweError('Выберите вариант ответа')
    }
    else onForward()
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
          <button className={`chronotype-option ${selectedAnswer === 'До 6:00' ? 'selected' : ''}`}
                  onClick={() => setSelectedAnswer('До 6:00')}>
            До 6:00
          </button>

          <button className={`chronotype-option ${selectedAnswer === '6:00–7:00' ? 'selected' : ''}`}
                  onClick={() => setSelectedAnswer('6:00–7:00')}>
            6:00–7:00
          </button>

          <button className={`chronotype-option ${selectedAnswer === '7:00–8:00' ? 'selected' : ''}`}
                  onClick={() => setSelectedAnswer('7:00–8:00')}>
            7:00–8:00
          </button>

          <button className={`chronotype-option ${selectedAnswer === '8:00–9:00' ? 'selected' : ''}`}
                  onClick={() => setSelectedAnswer('8:00–9:00')}>
            8:00–9:00
          </button>

          <button className={`chronotype-option ${selectedAnswer === 'После 9:00' ? 'selected' : ''}`}
                  onClick={() => setSelectedAnswer('После 9:00')}>
            После 9:00
          </button>
        </div>
        <button className="chronotype-next-button"
                 onClick={handleForward}>
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