import { useEffect, useState } from 'react'
import './SettingsPage.css'

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="settings-toggle-row">
      <span className="settings-toggle-copy">
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <button
        type="button"
        className={`settings-switch ${checked ? 'is-on' : ''}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  )
}

function SettingsPage({
  settings,
  installPrompt,
  onInstallPromptClear,
  onSettingsChange,
  onOpenHome,
  onOpenTasks,
  onOpenSchedule,
  onOpenProfile,
}) {
  const [permission, setPermission] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  )
  const [installed, setInstalled] = useState(false)
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('info')
  const [offlineBusy, setOfflineBusy] = useState(false)

  useEffect(() => {
    const checkInstalled = () => setInstalled(
      window.matchMedia('(display-mode: standalone)').matches || Boolean(navigator.standalone),
    )
    checkInstalled()
    window.addEventListener('appinstalled', checkInstalled)

    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const handleControllerChange = () => setServiceWorkerReady(true)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        setServiceWorkerReady(Boolean(registration?.active || navigator.serviceWorker.controller))
      }).catch(() => setServiceWorkerReady(false))
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
    }

    return () => {
      window.removeEventListener('appinstalled', checkInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if ('serviceWorker' in navigator) navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  function updateSetting(key, value) {
    onSettingsChange({ ...settings, [key]: value })
  }

  async function toggleNotifications(enabled) {
    setNotice('')
    if (!enabled) {
      updateSetting('notificationsEnabled', false)
      setNotice('Напоминания отключены.')
      setNoticeType('info')
      return
    }

    if (typeof Notification === 'undefined') {
      setPermission('unsupported')
      setNotice('Этот браузер не поддерживает системные уведомления.')
      setNoticeType('error')
      return
    }

    let currentPermission = Notification.permission
    if (currentPermission === 'default') {
      try {
        currentPermission = await Notification.requestPermission()
      } catch {
        currentPermission = 'denied'
      }
    }
    setPermission(currentPermission)

    if (currentPermission === 'granted') {
      updateSetting('notificationsEnabled', true)
      setNotice('Напоминания включены. Они отправляются, пока приложение открыто в браузере.')
      setNoticeType('success')
    } else {
      updateSetting('notificationsEnabled', false)
      setNotice(currentPermission === 'denied'
        ? 'Браузер запретил уведомления. Разреши их в настройках сайта и попробуй снова.'
        : 'Разрешение на уведомления не получено.')
      setNoticeType('error')
    }
  }

  async function sendTestNotification() {
    if (typeof Notification === 'undefined') {
      setNotice('Этот браузер не поддерживает системные уведомления.')
      setNoticeType('error')
      return
    }
    let currentPermission = Notification.permission
    if (currentPermission === 'default') {
      try {
        currentPermission = await Notification.requestPermission()
      } catch {
        currentPermission = 'denied'
      }
      setPermission(currentPermission)
    }
    if (currentPermission !== 'granted') {
      setNotice('Сначала разреши уведомления в браузере.')
      setNoticeType('error')
      return
    }
    try {
      const registration = await navigator.serviceWorker?.getRegistration()
      if (registration?.active) {
        await registration.showNotification('Ideal Day', {
          body: 'Уведомления работают. Хорошего дня и продуктивного планирования!',
          icon: '/icons/pwa-192.png',
          badge: '/icons/pwa-192.png',
          tag: 'ideal-day-test',
        })
      } else {
        new Notification('Ideal Day', {
          body: 'Уведомления работают. Хорошего дня и продуктивного планирования!',
          icon: '/icons/pwa-192.png',
          tag: 'ideal-day-test',
        })
      }
      setPermission(currentPermission)
      setNotice('Тестовое уведомление отправлено.')
      setNoticeType('success')
    } catch {
      setNotice('Не удалось показать уведомление. Проверь разрешения браузера.')
      setNoticeType('error')
    }
  }

  async function installApplication() {
    if (!installPrompt) {
      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
      setNotice(installed
        ? 'Приложение уже установлено.'
        : isIos
          ? 'В Safari нажми «Поделиться», затем выбери «На экран Домой». '
          : 'Открой меню браузера и выбери «Установить Ideal Day» или «Создать ярлык».')
      setNoticeType('info')
      return
    }
    try {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      if (choice?.outcome === 'accepted') {
        setNotice('Запрос на установку принят браузером.')
        setNoticeType('success')
      } else {
        setNotice('Установка пока не выполнена. Её можно запустить позже из меню браузера.')
        setNoticeType('info')
      }
    } catch {
      setNotice('Браузер не смог запустить установку. Используй меню браузера.')
      setNoticeType('error')
    } finally {
      onInstallPromptClear?.()
    }
  }

  async function prepareOfflineAccess() {
    setNotice('')
    if (!('serviceWorker' in navigator)) {
      setNotice('Этот браузер не поддерживает офлайн-кэширование приложения.')
      setNoticeType('error')
      return
    }
    setOfflineBusy(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const worker = navigator.serviceWorker.controller || registration.active
      if (!worker) throw new Error('Service Worker ещё не активен')

      const urls = [...new Set(
        performance.getEntriesByType('resource')
          .map((entry) => {
            try {
              const url = new URL(entry.name, window.location.href)
              if (url.origin !== window.location.origin) return null
              if (!(/\.(js|css|svg|png|webp|jpg|woff2?)$/i.test(url.pathname))) return null
              if (/\/(sw\.js|@vite|node_modules)\b/.test(url.pathname)) return null
              return `${url.pathname}${url.search}`
            } catch {
              return null
            }
          })
          .filter(Boolean),
      )]

      const result = await new Promise((resolve, reject) => {
        const channel = new MessageChannel()
        const timeout = window.setTimeout(() => reject(new Error('Истекло время ожидания кэширования')), 12000)
        channel.port1.onmessage = (event) => {
          window.clearTimeout(timeout)
          resolve(event.data)
        }
        worker.postMessage({ type: 'PRECACHE_URLS', urls }, [channel.port2])
      })

      if (!result?.ok) throw new Error(result?.message || 'Не удалось сохранить ресурсы')
      setServiceWorkerReady(true)
      setNotice(`Офлайн-доступ подготовлен. Сохранено ресурсов: ${result.cached}. Открой приложение онлайн хотя бы один раз, затем можно отключить интернет для проверки.`)
      setNoticeType('success')
    } catch (error) {
      setNotice(`Не удалось подготовить офлайн-доступ: ${error.message}`)
      setNoticeType('error')
    } finally {
      setOfflineBusy(false)
    }
  }

  const permissionLabel = permission === 'granted'
    ? 'Разрешено'
    : permission === 'denied'
      ? 'Заблокировано в браузере'
      : permission === 'unsupported'
        ? 'Не поддерживается'
        : 'Ещё не запрашивалось'

  return (
    <main className="settings-page">
      <div className="settings-content">
        <header className="settings-header">
          <div>
            <p className="settings-eyebrow">ПЕРСОНАЛИЗАЦИЯ</p>
            <h1>Настройки</h1>
            <p>Настрой приложение под свой режим работы.</p>
          </div>
          <span className={`settings-online-pill ${online ? 'is-online' : 'is-offline'}`}>
            <i />{online ? 'В сети' : 'Нет подключения'}
          </span>
        </header>

        <div className="settings-grid">
          <section className="settings-card">
            <div className="settings-card-heading">
              <span className="settings-card-icon">♧</span>
              <div><h2>Уведомления</h2><p>Напоминания о планах и задачах</p></div>
            </div>
            <Toggle
              checked={settings.notificationsEnabled}
              onChange={toggleNotifications}
              label="Ежедневное напоминание"
              description="Показывать напоминание в выбранное время, пока приложение открыто."
            />
            <label className="settings-time-field">
              <span>Время напоминания</span>
              <input
                type="time"
                value={settings.reminderTime}
                disabled={!settings.notificationsEnabled}
                onChange={(event) => updateSetting('reminderTime', event.target.value)}
              />
            </label>
            <div className="settings-permission-row">
              <span>Разрешение браузера</span><strong>{permissionLabel}</strong>
            </div>
            <button className="settings-secondary-button" type="button" onClick={sendTestNotification}>
              Отправить тестовое уведомление
            </button>
          </section>

          <section className="settings-card">
            <div className="settings-card-heading">
              <span className="settings-card-icon">◐</span>
              <div><h2>Внешний вид</h2><p>Комфорт при ежедневном использовании</p></div>
            </div>
            <Toggle
              checked={settings.compactMode}
              onChange={(value) => updateSetting('compactMode', value)}
              label="Компактный интерфейс"
              description="Уменьшить внутренние отступы карточек и списков."
            />
            <Toggle
              checked={settings.reduceMotion}
              onChange={(value) => updateSetting('reduceMotion', value)}
              label="Уменьшить анимацию"
              description="Сократить длительность переходов и анимаций."
            />
            <p className="settings-inline-note">Настройки внешнего вида сохраняются на этом устройстве.</p>
          </section>

          <section className="settings-card settings-pwa-card">
            <div className="settings-card-heading">
              <span className="settings-card-icon">▣</span>
              <div><h2>Установка приложения</h2><p>Открывай Ideal Day в отдельном окне</p></div>
            </div>
            <div className="settings-status-row">
              <span>Статус</span>
              <strong className={installed ? 'settings-status-good' : ''}>{installed ? 'Установлено' : 'Доступно в браузере'}</strong>
            </div>
            <p className="settings-description">Ideal Day поддерживает установку как PWA: приложение запускается отдельно от вкладок браузера и использует собственный значок.</p>
            <button className="settings-primary-button" type="button" onClick={installApplication}>
              {installed ? 'Приложение установлено' : 'Установить Ideal Day'}
            </button>
          </section>

          <section className="settings-card settings-offline-card">
            <div className="settings-card-heading">
              <span className="settings-card-icon">⌁</span>
              <div><h2>Работа без сети</h2><p>Кэш приложения и локальные данные</p></div>
            </div>
            <div className="settings-status-row">
              <span>Service Worker</span>
              <strong className={serviceWorkerReady ? 'settings-status-good' : ''}>{serviceWorkerReady ? 'Активен' : 'Ожидает запуска'}</strong>
            </div>
            <p className="settings-description">После первой загрузки приложение сохраняет оболочку и открытые ресурсы. Задачи, профиль и настройки хранятся в localStorage этого браузера.</p>
            <button className="settings-secondary-button" type="button" onClick={prepareOfflineAccess} disabled={offlineBusy || !serviceWorkerReady}>
              {offlineBusy ? 'Сохраняем ресурсы…' : 'Подготовить офлайн-доступ'}
            </button>
            <p className="settings-inline-note">Синхронизации между устройствами и облачного резервного копирования пока нет.</p>
          </section>
        </div>

        {notice && <div className={`settings-notice is-${noticeType}`} role="status">{notice}</div>}

        <section className="settings-storage-note">
          <strong>Данные приложения</strong>
          <p>Профиль, задачи и предпочтения сохраняются локально в браузере. Очистка данных сайта может удалить эти сведения.</p>
        </section>

      </div>
    </main>
  )
}

export default SettingsPage
