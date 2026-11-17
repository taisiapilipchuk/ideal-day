import { useState } from 'react'
import './ChronotypeTest.css'

const questions = [
  {
    question: 'Когда ты естественным образом просыпаешься?',
    subtitle: 'Представь, что тебе не нужно ставить будильник и никуда не спешить.',
    options: [
      { title: 'До 6:00', description: 'Очень рано, просыпаюсь с лёгкостью' },
      { title: '6:00–8:00', description: 'Утром чувствую себя хорошо' },
      { title: '8:00–10:00', description: 'Мне комфортнее просыпаться позже' },
      { title: 'После 10:00', description: 'Мой естественный подъём — ближе к полудню' },
    ],
  },
  {
    question: 'Когда ты обычно начинаешь хотеть спать?',
    subtitle: 'Представь, что на следующий день тебе не нужно рано вставать и ты можешь лечь в любое время',
    options: [
      { title: 'До 22:00', description: 'Обычно хочется спать довольно рано' },
      { title: '22:00–00:00', description: 'Комфортное время для отхода ко сну' },
      { title: '00:00–02:00', description: 'Вечером я ещё долго сохраняю активность' },
      { title: 'После 02:00', description: 'Мне сложно захотеть спать раньше' },
    ],
  },
  {
    question: 'Когда тебе легче всего сосредоточиться и решать сложные задачи?',
    subtitle: 'В какое время мысли становятся ясными, а работа идёт особенно легко?',
    options: [
      { title: 'Ранним утром', description: 'Лучше думаю сразу после пробуждения' },
      { title: 'В первой половине дня', description: 'Мой пик активности приходится на утро' },
      { title: 'После обеда', description: 'Лучше сосредотачиваюсь днём' },
      { title: 'Вечером или ночью', description: 'Самая высокая активность — вечером' },
    ],
  },
  {
    question: 'Когда тебе комфортнее всего быть физически активным?',
    subtitle: 'Когда у тебя больше всего сил и желания двигаться?',
    options: [
      { title: 'Ранним утром', description: 'С удовольствием двигаюсь с утра' },
      { title: 'В первой половине дня', description: 'Лучше всего чувствую себя днём' },
      { title: 'Во второй половине дня', description: 'К этому времени появляется энергия' },
      { title: 'Вечером', description: 'Активность даётся легче вечером' },
    ],
  },
  {
    question: 'Как ты чувствуешь себя, если можешь жить по своему режиму?',
    subtitle: 'Выбери вариант, который лучше всего описывает твоё естественное состояние.',
    options: [
      { title: 'Люблю ранние подъёмы', description: 'Утром чувствую себя бодро' },
      { title: 'Комфортен обычный режим', description: 'Легко подстраиваюсь под день' },
      { title: 'Мне нужно больше времени утром', description: 'Раскачиваюсь постепенно' },
      { title: 'Оживляюсь ближе к вечеру', description: 'Вечером чувствую прилив сил' },
    ],
  },
]

function ChronotypeTestPage({ onBack, onFinish }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})

  const question = questions[currentQuestion]
  const answer = answers[currentQuestion] || ''
  const progress = ((currentQuestion + 1) / questions.length) * 100

  function handleAnswer(value) {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    })
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
       onFinish()
    }
  }

  return (
    <main>
      <div className="test-header">

        <div className="page-intro">
          <button
            className="back"
            type="button"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1)
              } else {
                onBack()
              }
            }}
          >
            <img src="/src/assets/icons/back.svg" alt="" />
            <span className="test-back-text">Назад</span>
          </button>

          <span className="intro-info">ТЕСТ ХРОНОТИПА</span>
        </div>

        <div className="test-progress">
          <div className="test-progress-info">
            <span className="test-progress-question">
              Вопрос {currentQuestion + 1} из 5
            </span>

            <span className="test-progress-percent">
              {progress}%
            </span>
          </div>

          <div className="test-progress-bars">
            {questions.map((item, index) => (
              <span
                key={index}
                className={`test-progress-bar ${
                  index <= currentQuestion ? 'active' : ''
                }`}
              />
            ))}
          </div>
        </div>

        <h1 className="test-question">
          {question.question}
        </h1>

        <p className="chronotype-subtitle">
          {question.subtitle}
        </p>
      </div>

      <div className="test-buttons">
        {question.options.map((option) => (
          <button
            key={option.title}
            type="button"
            onClick={() => handleAnswer(option.title)}
            className={`test-answer ${
              answer === option.title ? 'selected' : ''
            }`}
          >
            <span className="chronotype-info">
              <span className="chronotype-name">
                {option.title}
              </span>

              <span className="chronotype-description">
                {option.description}
              </span>
            </span>

            <span className={`chronotype-radio ${
              answer === option.title ? 'selected' : ''
            }`}>
              {answer === option.title && (
                <span className="chronotype-radio-selected" />
              )}
            </span>
          </button>
        ))}
      </div>

      <button
        className="auth-submit-button chronotype-button"
        type="button"
        disabled={!answer}
        onClick={handleNext}
      >
        {currentQuestion === questions.length - 1
          ? 'Узнать результат'
          : 'Далее'}
      </button>
    </main>
  )
}

export default ChronotypeTestPage
