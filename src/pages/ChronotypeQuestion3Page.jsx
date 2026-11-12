import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestion3Page ({ onForward, onBack}) {
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
          Вопрос 3 из 5
        </p>

        <h1 className="chronotype-title">
          В какое время суток вы чувствуете себя наиболее бодрым и продуктивным?
        </h1>

        <div className="chronotype-options">
          <button
            className={`chronotype-option ${selectedAnswer === '05:00 – 08:00' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('05:00 – 08:00')}
          >
            05:00 – 08:00
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === '08:00 – 10:00' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('08:00 – 10:00')}
          >
            08:00 – 10:00
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === '10:00 – 17:00' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('10:00 – 17:00')}
          >
            10:00 – 17:00
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === '17:00 – 22:00' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('17:00 – 22:00')}
          >
           17:00 – 22:00
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === '22:00 и позже' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('22:00 и позже')}
          >
            22:00 и позже
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

export default ChronotypeQuestion3Page
