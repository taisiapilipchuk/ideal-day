import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestion2Page( {onForward, onBack} ) {
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
        <button className="chronotype-back-button"
                onClick={onBack}>
            ← Назад
        </button>
        <p className="chronotype-progress">
          Вопрос 2 из 5
        </p>

        <h1 className="chronotype-title">
          Во сколько вы обычно ложитесь спать?
        </h1>

        <div className="chronotype-options">
          <button
            className={`chronotype-option ${selectedAnswer === 'До 21:00' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('До 21:00')}
          >
            До 21:00
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === '21:00–22:00' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('21:00–22:00')}
          >
            21:00–22:00
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === '22:00–23:00' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('22:00–23:00')}
          >
            22:00–23:00
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === '23:00–00:00' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('23:00–00:00')}
          >
            23:00–00:00
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === 'После 00:00' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('После 00:00')}
          >
            После 00:00
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

export default ChronotypeQuestion2Page
