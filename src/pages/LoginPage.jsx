import './LoginPage.css'

function LoginPage({onBack}) {
  return (
    <div>
      <h1>Вход</h1>
      <p>Здесь будет форма входа</p>

      <button onClick={onBack}>
        Назад
      </button>
    </div>
  )
}

export default LoginPage