import './StartPage.css'

function StartPage({ onRegister, onLogin }) {
  return (
    <div className="start-page">
      <div className="start-content">
        <h1 className="start-title">Идеальный День</h1>

        <div className="start-buttons">
          <button className="start-button start-button-primary" onClick={onRegister}>
            Зарегистрироваться
          </button>

          <button className="start-button start-button-secondary" onClick={onLogin}>
            Войти
          </button>
        </div>
      </div>
    </div>
  )
}

export default StartPage