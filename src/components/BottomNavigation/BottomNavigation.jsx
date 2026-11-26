function BottomNavigation({ activeTab, onOpenHome, onOpenBiorhythms, onOpenProfile }) {
  const navigationItems = [
    {
      id: 'home',
      name: 'Главная',
      icon: '/icons/nav-home.svg',
      onClick: onOpenHome
    },
    {
      id: 'biorhythms',
      name: 'Биоритмы',
      icon: '/icons/nav-biorhythms.svg',
      onClick: onOpenBiorhythms
    },
    {
      id: 'profile',
      name: 'Профиль',
      icon: '/icons/nav-profile.svg',
      onClick: onOpenProfile
    }
  ]

  return (
    <nav className="bottom-navigation">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          className={`bottom-navigation-item ${activeTab === item.id ? 'is-active' : ''}`}
          type="button"
          onClick={item.onClick}
        >
          <span
            className="bottom-navigation-icon"
            style={{
              maskImage: `url(${item.icon})`,
              WebkitMaskImage: `url(${item.icon})`
            }}
          />

          <span className="bottom-navigation-label">
            {item.name}
          </span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNavigation
import './BottomNavigation.css'