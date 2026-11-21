export const DEFAULT_APP_SETTINGS = {
  notificationsEnabled: false,
  reminderTime: '09:00',
  compactMode: false,
  reduceMotion: false,
}

export function readAppSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('ideal-day-settings'))
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      return {
        ...DEFAULT_APP_SETTINGS,
        ...saved,
        notificationsEnabled: Boolean(saved.notificationsEnabled),
        compactMode: Boolean(saved.compactMode),
        reduceMotion: Boolean(saved.reduceMotion),
        reminderTime: /^([01]\d|2[0-3]):[0-5]\d$/.test(saved.reminderTime)
          ? saved.reminderTime
          : DEFAULT_APP_SETTINGS.reminderTime,
      }
    }
  } catch {
    // Invalid settings are replaced with safe defaults.
  }
  return DEFAULT_APP_SETTINGS
}
