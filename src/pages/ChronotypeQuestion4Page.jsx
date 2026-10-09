import { useState } from 'react'
import './ChronotypeQuestionPage.css'

function ChronotypeQuestion4Page ({ onForward, onBack}) {
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
          Вопрос 4 из 5
        </p>

        <h1 className="chronotype-title">
          Насколько легко вам просыпаться и чувствовать себя отдохнувшим в первые 30 минут после подъема?
        </h1>

        <div className="chronotype-options">
          <button
            className={`chronotype-option ${selectedAnswer === 'Очень легко, я сразу бодр' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Очень легко, я сразу бодр')}
          >
            Очень легко, я сразу бодр
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === 'Довольно легко' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Довольно легко')}
          >
            Довольно легко
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === 'Нейтрально / по-разному' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Нейтрально / по-разному')}
          >
            Нейтрально / по-разному
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === 'Довольно тяжело, чувствую разбитость' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Довольно тяжело, чувствую разбитость')}
          >
           Довольно тяжело, чувствую разбитость
          </button>

          <button
            className={`chronotype-option ${selectedAnswer === 'Очень тяжело, требуется много времени на "раскачку"' ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer('Очень тяжело, требуется много времени на "раскачку"')}
          >
            Очень тяжело, требуется много времени на "раскачку"
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

export default ChronotypeQuestion4Page

