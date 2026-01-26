import { ref, watch } from 'vue'

const currentTheme = ref(localStorage.getItem('appTheme') || 'blue')
const themeUpdateTrigger = ref(0) // Trigger for component updates

const themeConfig = {
  blue: {
    primary: '#2563eb',
    secondary: '#1d4ed8',
    accent: '#60a5fa',
    light: '#93c5fd',
    name: 'Blue',
  },
  purple: {
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#d8b4fe',
    light: '#f5d0fe',
    name: 'Purple',
  },
  cyan: {
    primary: '#06b6d4',
    secondary: '#0891b2',
    accent: '#22d3ee',
    light: '#06ecff',
    name: 'Cyber Cyan',
  },
  teal: {
    primary: '#14b8a6',
    secondary: '#0d9488',
    accent: '#5eead4',
    light: '#99f6e4',
    name: 'Teal',
  },
  emerald: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#6ee7b7',
    light: '#a7f3d0',
    name: 'Emerald',
  },
  rose: {
    primary: '#f43f5e',
    secondary: '#e11d48',
    accent: '#fb7185',
    light: '#fda4af',
    name: 'Rose',
  },
  amber: {
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#fcd34d',
    light: '#fde68a',
    name: 'Amber',
  },
  slate: {
    primary: '#64748b',
    secondary: '#475569',
    accent: '#cbd5e1',
    light: '#e2e8f0',
    name: 'Dark',
  },
}

export const useTheme = () => {
  const applyThemeToApp = (themeName) => {
    const theme = themeConfig[themeName]
    if (!theme) return

    // Set CSS variables
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-secondary', theme.secondary)
    root.style.setProperty('--color-accent', theme.accent)
    root.style.setProperty('--color-light', theme.light)

    // Save to localStorage
    localStorage.setItem('appTheme', themeName)
    currentTheme.value = themeName

    // Trigger update for all components
    themeUpdateTrigger.value += 1

    // Update Tailwind config dynamically by applying classes
    applyTailwindTheme(themeName)
  }

  const applyTailwindTheme = (themeName) => {
    // Remove all theme-specific classes from body
    document.body.classList.remove(
      'theme-blue',
      'theme-purple',
      'theme-cyan',
      'theme-teal',
      'theme-emerald',
      'theme-rose',
      'theme-amber',
      'theme-slate',
    )
    // Add current theme class
    document.body.classList.add(`theme-${themeName}`)
  }

  // Initialize theme on composable creation
  const initializeTheme = () => {
    const saved = localStorage.getItem('appTheme') || 'blue'
    applyThemeToApp(saved)
  }

  return {
    currentTheme,
    themeUpdateTrigger,
    applyThemeToApp,
    themeConfig,
    initializeTheme,
  }
}
