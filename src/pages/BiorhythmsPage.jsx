import { useState } from "react";
import "./BiorhythmsPage.css";

function BiorhythmsPage({ onOpenHome, onOpenProfile }) {
  const [period, setPeriod] = useState("День");
  const periodSettings = {
    День: { points: 25, span: 1 },
    Неделя: { points: 29, span: 7 },
    Месяц: { points: 31, span: 30 },
  };

  const currentPeriod = periodSettings[period];

  const periods = ["День", "Неделя", "Месяц"];

  return (
    <main className="biorhythms">
      <header className="biorhythms__header">
        <h1>Биоритмы</h1>
        <p>Изучите свои ритмы и планируйте день осознанно</p>
      </header>

      <div className="biorhythms__switcher">
        {periods.map((item) => (
          <button
            key={item}
            className={`biorhythms__tab ${
              period === item ? "biorhythms__tab--active" : ""
            }`}
            onClick={() => setPeriod(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="biorhythms__content">
        <section className="biorhythms__insight">
          <div className="biorhythms__insight-icon">✦</div>
          <div>
            <h3>Как читать график</h3>
            <p>
              Линии показывают изменения трёх ритмов. Используйте график как
              дополнительный ориентир при планировании своего дня.
            </p>
          </div>
        </section>
        <h2>{period}</h2>
        <p>
          {period === "День" && "Ваши биоритмы в течение дня"}
          {period === "Неделя" && "Ваши биоритмы в течение недели"}
          {period === "Месяц" && "Ваши биоритмы в течение месяца"}
        </p>

        <div className="biorhythms__placeholder">
          <svg
            viewBox="0 0 600 260"
            className="biorhythms__chart"
            role="img"
            aria-label="График физических, эмоциональных и интеллектуальных биоритмов"
          >
            {[50, 100, 150, 200].map((y) => (
              <line
                key={y}
                x1="40"
                y1={y}
                x2="580"
                y2={y}
                stroke="#e8e8e2"
                strokeWidth="1"
              />
            ))}

            <line
              x1="40"
              y1="130"
              x2="580"
              y2="130"
              stroke="#b8b8ad"
              strokeDasharray="4 4"
            />

            <text x="40" y="240" fill="#888" fontSize="12" textAnchor="start">
              Начало
            </text>
            <text x="310" y="240" fill="#888" fontSize="12" textAnchor="middle">
              {period === "День"
                ? "12:00"
                : period === "Неделя"
                  ? "Середина недели"
                  : "Середина месяца"}
            </text>
            <text x="580" y="240" fill="#888" fontSize="12" textAnchor="end">
              Конец
            </text>

            {[
              { name: "Физический", period: 23, color: "#6c8f71" },
              { name: "Эмоциональный", period: 28, color: "#d59b78" },
              { name: "Интеллектуальный", period: 33, color: "#8b83b9" },
            ].map((rhythm) => {
              const points = Array.from(
                { length: currentPeriod.points },
                (_, i) => {
                  const x = 40 + (i / (currentPeriod.points - 1)) * 540;
                  const angle =
                    (2 *
                      Math.PI *
                      (i / (currentPeriod.points - 1)) *
                      currentPeriod.span *
                      24) /
                    rhythm.period;
                  const y = 130 - Math.sin(angle) * 95;

                  return `${x},${y}`;
                },
              ).join(" ");

              return (
                <polyline
                  key={rhythm.name}
                  points={points}
                  fill="none"
                  stroke={rhythm.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </svg>

          <div className="biorhythms__legend">
            <span>
              <i className="legend-physical" /> Физический
            </span>
            <span>
              <i className="legend-emotional" /> Эмоциональный
            </span>
            <span>
              <i className="legend-intellectual" /> Интеллектуальный
            </span>
          </div>
        </div>
      </section>

      <nav className="biorhythms__nav">
        <button onClick={onOpenHome}>Главная</button>
        <button className="biorhythms__nav-active">Биоритмы</button>
        <button onClick={onOpenProfile}>Профиль</button>
      </nav>
    </main>
  );
}

export default BiorhythmsPage;
