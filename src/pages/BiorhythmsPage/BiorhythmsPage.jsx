import { useState } from 'react'

import './BiorhythmsPage.css'
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation.jsx'

function BiorhythmsPage({ onOpenHome, onOpenProfile }) {
  const [period, setPeriod] = useState('week')

  return (
    <>
      <main className="biorhythms-page">

        {/* Заголовок */}
        <header className="biorhythms-header">
          <h1 className="biorhythms-header-title">
            Твои ритмы
          </h1>

          {/* Профиль */}
          <button
            className="biorhythms-profile-button"
            type="button"
            onClick={onOpenProfile}
          >
            <img
              src="/icons/nav-profile-biorhytms.svg"
              alt="Профиль"
            />
          </button>
        </header>


        {/* Вводный блок */}
        <section className="biorhythms-intro">

          <h2 className="biorhythms-intro-title">
            Биоритмы
          </h2>

          <p className="biorhythms-intro-description">
            Узнай, как меняется твоя энергия
          </p>

        </section>


        {/* Переключение периода */}
        <div className="biorhythms-period-switch">

          <button
            className={`biorhythms-period-button ${
              period === 'day' ? 'is-active' : ''
            }`}
            type="button"
            onClick={() => setPeriod('day')}
          >
            День
          </button>

          <button
            className={`biorhythms-period-button ${
              period === 'week' ? 'is-active' : ''
            }`}
            type="button"
            onClick={() => setPeriod('week')}
          >
            Неделя
          </button>

          <button
            className={`biorhythms-period-button ${
              period === 'month' ? 'is-active' : ''
            }`}
            type="button"
            onClick={() => setPeriod('month')}
          >
            Месяц
          </button>

        </div>


        {/* Переключение недель */}
        <div className="biorhythms-date-navigation">

          <button
            className="biorhythms-date-navigation-button"
            type="button"
            aria-label="Предыдущая неделя"
          >
            <img
              src="/icons/arrow-left.svg"
              alt=""
            />
          </button>

          <span className="biorhythms-date-navigation-title">
            23 – 29 ноября
          </span>

          <button
            className="biorhythms-date-navigation-button"
            type="button"
            aria-label="Следующая неделя"
          >
            <img
              src="/icons/arrow-right.svg"
              alt=""
            />
          </button>

        </div>


        {/* График биоритмов */}
        <section className="biorhythms-chart-section">

          <div className="biorhythms-chart">

            {/* Здесь будет график */}

          </div>

        </section>


        {/* Информация о циклах */}
        <section className="biorhythms-cycle-info">

          <div className="biorhythms-cycle-item biorhythms-cycle-item--physical">
            <span className="biorhythms-cycle-name">
              Физический
            </span>

            <span className="biorhythms-cycle-duration">
              23 дня
            </span>
          </div>

          <div className="biorhythms-cycle-item biorhythms-cycle-item--emotional">
            <span className="biorhythms-cycle-name">
              Эмоциональный
            </span>

            <span className="biorhythms-cycle-duration">
              28 дней
            </span>
          </div>

          <div className="biorhythms-cycle-item biorhythms-cycle-item--intellectual">
            <span className="biorhythms-cycle-name">
              Интеллектуальный
            </span>

            <span className="biorhythms-cycle-duration">
              33 дня
            </span>
          </div>

        </section>


        {/* Текущие показатели биоритмов */}
        <section className="biorhythms-values">

          {/* Физический */}
          <article className="biorhythms-value-card biorhythms-value-card--physical">

            <span className="biorhythms-value-name">
              Физический
            </span>

            <span className="biorhythms-value-percent">
              78%
            </span>

            <span className="biorhythms-value-level">
              Высокая
            </span>

          </article>


          {/* Эмоциональный */}
          <article className="biorhythms-value-card biorhythms-value-card--emotional">

            <span className="biorhythms-value-name">
              Эмоциональный
            </span>

            <span className="biorhythms-value-percent">
              64%
            </span>

            <span className="biorhythms-value-level">
              Средняя
            </span>

          </article>


          {/* Интеллектуальный */}
          <article className="biorhythms-value-card biorhythms-value-card--intellectual">

            <span className="biorhythms-value-name">
              Интеллектуальный
            </span>

            <span className="biorhythms-value-percent">
              92%
            </span>

            <span className="biorhythms-value-level">
              Высокая
            </span>

          </article>

        </section>

      </main>


      {/* Нижняя навигация */}
      <BottomNavigation
        activeTab="biorhythms"
        onOpenHome={onOpenHome}
        onOpenBiorhythms={() => {}}
        onOpenProfile={onOpenProfile}
      />

    </>
  )
}

export default BiorhythmsPage