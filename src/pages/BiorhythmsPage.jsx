
import { useEffect, useMemo, useState } from 'react'
import { getBiorhythm } from '../api'
import './BiorhythmsPage.css'

const CYCLES = [
  { id: 'physical', name: 'Физический', period: 23, color: '#078b91' },
  { id: 'emotional', name: 'Эмоциональный', period: 28, color: '#e76591' },
  { id: 'intellectual', name: 'Интеллектуальный', period: 33, color: '#6046ed' },
]

function shiftDate(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function dateToISO(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function dateLabel(date, options = { day: 'numeric', month: 'long' }) {
  return new Intl.DateTimeFormat('ru-RU', options).format(date)
}

function getRange(anchor, period) {
  if (period === 'day') return [new Date(anchor), new Date(anchor)]

  if (period === 'week') {
    const start = new Date(anchor)
    const weekday = (start.getDay() + 6) % 7
    start.setDate(start.getDate() - weekday)

    const end = shiftDate(start, 6)
    return [start, end]
  }

  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)

  return [start, end]
}

function buildPath(cycle, start, count, width, height, dataByDate) {
  const left = 18
  const right = width - 18
  const top = 14
  const bottom = height - 18

  const points = Array.from({ length: count }, (_, index) => {
    const date = shiftDate(start, index)
    const data = dataByDate[dateToISO(date)]
    const value = data?.[cycle.id] ?? 0

    const x = count === 1
      ? (left + right) / 2
      : left + (index / (count - 1)) * (right - left)

    const y = top + ((100 - value) / 200) * (bottom - top)

    return `${x},${y}`
  })

  return points.join(' ')
}

function BiorhythmsPage({ user, onOpenHome, onOpenProfile }) {
  const [period, setPeriod] = useState('week')
  const [anchor, setAnchor] = useState(() => new Date())
  const [selectedCycle, setSelectedCycle] = useState('all')

  const [dataByDate, setDataByDate] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [start, end] = getRange(anchor, period)

  const count = period === 'day'
    ? 1
    : Math.round((end - start) / 86400000) + 1

  // Загружаем биоритмы с backend для всех дат периода
  useEffect(() => {
    let cancelled = false

    async function loadBiorhythms() {
      setLoading(true)
      setError('')

      try {
        const dates = Array.from({ length: count }, (_, index) => {
          return shiftDate(start, index)
        })

        const results = await Promise.all(
          dates.map(async (date) => {
            const dateString = dateToISO(date)
            const data = await getBiorhythm(dateString)

            return [dateString, data]
          })
        )

        if (!cancelled) {
          setDataByDate(Object.fromEntries(results))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Не удалось загрузить биоритмы')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadBiorhythms()

    return () => {
      cancelled = true
    }
  }, [period, anchor, count, start.getTime()])

  const currentValues = CYCLES.map((cycle) => ({
    ...cycle,
    value: dataByDate[dateToISO(anchor)]?.[cycle.id] ?? 0,
  }))

  // Критические дни получаем непосредственно из backend
  const criticalDays = useMemo(() => {
    const found = []

    for (let index = 0; index < count; index++) {
      const date = shiftDate(start, index)
      const data = dataByDate[dateToISO(date)]

      if (!data?.critical_cycles?.length) continue

      const crossed = CYCLES.filter((cycle) =>
        data.critical_cycles.includes(cycle.id)
      )

      if (crossed.length) {
        found.push({ date, crossed })
      }
    }

    return found
  }, [dataByDate, start.getTime(), count])

  const rangeText = period === 'day'
    ? dateLabel(anchor, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : period === 'week'
      ? `${dateLabel(start)} – ${dateLabel(end)}`
      : new Intl.DateTimeFormat('ru-RU', {
          month: 'long',
          year: 'numeric',
        }).format(anchor)

  function moveRange(direction) {
    if (period === 'day') {
      setAnchor((date) => shiftDate(date, direction))
    }

    if (period === 'week') {
      setAnchor((date) => shiftDate(date, direction * 7))
    }

    if (period === 'month') {
      setAnchor((date) =>
        new Date(date.getFullYear(), date.getMonth() + direction, 1)
      )
    }
  }

  const chartStart = period === 'day' ? anchor : start
  const chartCount = period === 'day' ? 1 : count

  const visibleCycles = selectedCycle === 'all'
    ? CYCLES
    : CYCLES.filter((cycle) => cycle.id === selectedCycle)

  return (
    <main className="biorhythm-page">
      <div className="biorhythm-content">
        <header className="biorhythm-header">
          <div>
            <p className="biorhythm-eyebrow">ТВОИ РИТМЫ</p>
            <h1>Биоритмы</h1>
            <p>Узнай, как меняются твои расчётные показатели.</p>
          </div>

          <button
            className="biorhythm-avatar"
            onClick={onOpenProfile}
            aria-label="Открыть профиль"
          >
            {(user?.username || 'П')[0]}
          </button>
        </header>

        <section className="biorhythm-panel">
          <div className="biorhythm-tabs" role="tablist" aria-label="Период прогноза">
            {[['day', 'День'], ['week', 'Неделя'], ['month', 'Месяц']].map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={period === id}
                className={period === id ? 'active' : ''}
                onClick={() => setPeriod(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="biorhythm-range">
            <button onClick={() => moveRange(-1)} aria-label="Предыдущий период">‹</button>
            <strong>{rangeText}</strong>
            <button onClick={() => moveRange(1)} aria-label="Следующий период">›</button>
          </div>

          <div className="biorhythm-chart-heading">
            <span>УРОВЕНЬ БИОРИТМОВ</span>
            <span>−100% / +100%</span>
          </div>

          <div className={`biorhythm-chart-wrap ${period === 'day' ? 'is-day' : ''}`}>
            {period === 'day' ? (
              <div className="biorhythm-day-values" role="list" aria-label="Показатели биоритмов за выбранный день">
                {currentValues
                  .filter((cycle) => selectedCycle === 'all' || selectedCycle === cycle.id)
                  .map((cycle) => (
                    <div className="biorhythm-day-row" role="listitem" key={cycle.id}>
                      <div className="biorhythm-day-row-heading">
                        <span>
                          <i style={{ background: cycle.color }} />
                          {cycle.name}
                        </span>

                        <strong style={{ color: cycle.color }}>
                          {cycle.value > 0 ? '+' : ''}{cycle.value}%
                        </strong>
                      </div>

                      <div className="biorhythm-day-track">
                        <span className="biorhythm-day-zero" />
                        <span
                          className="biorhythm-day-fill"
                          style={{
                            background: cycle.color,
                            left: cycle.value < 0
                              ? `${50 + cycle.value / 2}%`
                              : '50%',
                            width: `${Math.abs(cycle.value) / 2}%`,
                          }}
                        />
                      </div>

                      <small>
                        {cycle.value >= 50
                          ? 'Высокое значение'
                          : cycle.value <= -50
                            ? 'Низкое значение'
                            : 'Умеренное значение'}
                      </small>
                    </div>
                  ))}
              </div>
            ) : (
              <>
                <svg
                  className="biorhythm-chart"
                  viewBox="0 0 720 300"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`График биоритмов: ${rangeText}`}
                >
                  {[30, 90, 150, 210, 270].map((y, index) => (
                    <g key={y}>
                      <line
                        x1="18"
                        x2="702"
                        y1={y}
                        y2={y}
                        className={index === 2 ? 'zero-line' : 'grid-line'}
                      />
                      <text x="2" y={y + 4} className="axis-label">
                        {['+100%', '+50%', '0%', '−50%', '−100%'][index]}
                      </text>
                    </g>
                  ))}

                  {visibleCycles.map((cycle) => (
                    <polyline
                      key={cycle.id}
                      points={buildPath(
                        cycle,
                        chartStart,
                        chartCount,
                        720,
                        300,
                        dataByDate
                      )}
                      fill="none"
                      stroke={cycle.color}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}

                  <line
                    x1={18 + (
                      (
                        Math.max(
                          0,
                          Math.min(
                            count - 1,
                            Math.floor((anchor - start) / 86400000)
                          )
                        ) / Math.max(1, count - 1)
                      ) * 684
                    )}
                    x2={18 + (
                      (
                        Math.max(
                          0,
                          Math.min(
                            count - 1,
                            Math.floor((anchor - start) / 86400000)
                          )
                        ) / Math.max(1, count - 1)
                      ) * 684
                    )}
                    y1="12"
                    y2="282"
                    className="selected-day-line"
                  />
                </svg>

                <div className="biorhythm-x-labels">
                  {period === 'week'
                    ? Array.from({ length: 7 }, (_, i) => (
                        <span
                          key={i}
                          className={
                            shiftDate(start, i).toDateString() === anchor.toDateString()
                              ? 'is-selected'
                              : ''
                          }
                        >
                          <b>{dateLabel(shiftDate(start, i), { weekday: 'short' })}</b>
                          <small>{dateLabel(shiftDate(start, i), { day: 'numeric' })}</small>
                        </span>
                      ))
                    : [1, 5, 10, 15, 20, 25, count]
                        .filter((value, index, array) =>
                          array.indexOf(value) === index && value <= count
                        )
                        .map((value) => (
                          <span
                            key={value}
                            className={value === anchor.getDate() ? 'is-selected' : ''}
                          >
                            {value}
                          </span>
                        ))}
                </div>
              </>
            )}
          </div>

          <div className="biorhythm-legend">
            <button
              className={selectedCycle === 'all' ? 'selected' : ''}
              onClick={() => setSelectedCycle('all')}
            >
              Все ритмы
            </button>

            {CYCLES.map((cycle) => (
              <button
                key={cycle.id}
                className={selectedCycle === cycle.id ? 'selected' : ''}
                onClick={() => setSelectedCycle(cycle.id)}
              >
                <i style={{ background: cycle.color }} />
                {cycle.name}
              </button>
            ))}
          </div>

          <p className="biorhythm-note">
            {loading
              ? 'Загрузка данных с сервера...'
              : error
                ? `Ошибка загрузки: ${error}`
                : 'Значения получены с сервера на основе синусоидальной модели. Это не медицинский прогноз.'}
          </p>
        </section>

        <section className="biorhythm-values-grid">
          {currentValues.map((cycle) => (
            <article className="biorhythm-value-card" key={cycle.id}>
              <p>{cycle.name}</p>

              <strong style={{ color: cycle.color }}>
                {loading ? '...' : `${cycle.value > 0 ? '+' : ''}${cycle.value}%`}
              </strong>

              <span>
                {cycle.value >= 50
                  ? 'Высокое значение'
                  : cycle.value <= -50
                    ? 'Низкое значение'
                    : 'Умеренное значение'}
              </span>
            </article>
          ))}
        </section>

        <section className="biorhythm-panel biorhythm-critical">
          <div className="biorhythm-section-title">
            <div>
              <p className="biorhythm-eyebrow">КАЛЕНДАРЬ</p>
              <h2>Критические дни</h2>
            </div>

            <span>{criticalDays.length} в периоде</span>
          </div>

          {loading ? (
            <p className="biorhythm-empty">Загрузка критических дней...</p>
          ) : error ? (
            <p className="biorhythm-empty">Не удалось загрузить критические дни.</p>
          ) : criticalDays.length ? (
            <div className="biorhythm-critical-list">
              {criticalDays.map((item) => (
                <article key={dateToISO(item.date)}>
                  <div className="biorhythm-critical-date">
                    {dateLabel(item.date, { day: 'numeric', month: 'short' })}
                  </div>

                  <div>
                    <strong>
                      {item.crossed.length > 1
                        ? 'Совпадение нескольких циклов'
                        : `Пересечение: ${item.crossed[0].name.toLowerCase()}`}
                    </strong>

                    <p>{item.crossed.map((cycle) => cycle.name).join(', ')}</p>
                  </div>

                  <span className={item.crossed.length > 1 ? 'multiple' : ''}>
                    {item.crossed.length > 1 ? 'Совпадение' : 'Критический'}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <p className="biorhythm-empty">
              В выбранном периоде критических дней не найдено.
            </p>
          )}
        </section>
      </div>

      <nav className="biorhythm-navigation">
        <button onClick={onOpenHome}>
          <span>⌂</span>
          Главная
        </button>

        <button className="active">
          <span>⌁</span>
          Биоритмы
        </button>

        <button onClick={onOpenProfile}>
          <span>♙</span>
          Профиль
        </button>
      </nav>
    </main>
  )
}

export default BiorhythmsPage
