import './AppNavigation.css'

const NAV_ITEMS = [
  { id: 'home', label: 'Главная', icon: '⌂' },
  { id: 'biorhythms', label: 'Биоритмы', icon: '⌁' },
  { id: 'tasks', label: 'Задачи', icon: '✓' },
  { id: 'schedule', label: 'Расписание', icon: '◷' },
  { id: 'profile', label: 'Профиль', icon: '♙' },
  { id: 'settings', label: 'Настройки', icon: '⚙' },
]

function AppNavigation({ activePage, onNavigate }) {
  return (
    <nav className="app-navigation" aria-label="Основная навигация">
      {NAV_ITEMS.map((item) => {
        const isActive = activePage === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={`app-navigation-item${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <span className="app-navigation-icon" aria-hidden="true">{item.icon}</span>
            <span className="app-navigation-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default AppNavigation
