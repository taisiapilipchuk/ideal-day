import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestion5Page ({ onForward, onBack}) {
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
          Вопрос 5 из 5
        </p>

        <h1 className="chronotype-title">
          К какому типу людей вы себя относите?
        </h1>

        <div className="chronotype-options">
          <button
            className={`chronotype-option ${selectedAnswer === 'Определенно «жаворонок»' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Определенно «жаворонок»')}
          >
            Определенно «жаворонок»
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === 'Скорее «жаворонок», чем «сова»' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Скорее «жаворонок», чем «сова»')}
          >
            Скорее «жаворонок», чем «сова»
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === 'Ни то, ни другое (аритмик)' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Ни то, ни другое (аритмик)')}
          >
            Ни то, ни другое (аритмик)
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === 'Скорее «сова», чем «жаворонок»' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Скорее «сова», чем «жаворонок»')}
          >
           Скорее «сова», чем «жаворонок»
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === 'Определенно «сова»' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Определенно «сова»')}
          >
            Определенно «сова»
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

export default ChronotypeQuestion5Page
