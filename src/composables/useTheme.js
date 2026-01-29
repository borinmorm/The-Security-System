import { ref, watch } from 'vue'

const currentTheme = ref(localStorage.getItem('appTheme') || 'blue')
const themeUpdateTrigger = ref(0) // Trigger for component updates

const themeConfig = {
  blue: {
    primary: '#1a3a5c',
    secondary: '#0f2741',
    accent: '#4a7a9e',
    light: '#e8ecf1',
    name: 'Banking Blue',
  },
  purple: {
    primary: '#4c3d5c',
    secondary: '#3a2d48',
    accent: '#7a6a8e',
    light: '#e8e4f0',
    name: 'Banking Purple',
  },
  cyan: {
    primary: '#2d5a6f',
    secondary: '#1f3f52',
    accent: '#5a7a8e',
    light: '#e0ecf1',
    name: 'Banking Teal',
  },
  teal: {
    primary: '#3d5a52',
    secondary: '#2f4a42',
    accent: '#6a8a7e',
    light: '#e4ede8',
    name: 'Banking Green',
  },
  emerald: {
    primary: '#3d5a4a',
    secondary: '#2f473c',
    accent: '#6a8a78',
    light: '#e4ede8',
    name: 'Professional Green',
  },
  rose: {
    primary: '#5a3d45',
    secondary: '#47303a',
    accent: '#8a6a7a',
    light: '#f0e4e8',
    name: 'Muted Rose',
  },
  amber: {
    primary: '#5a4d3d',
    secondary: '#47413a',
    accent: '#8a7a6a',
    light: '#f0ede4',
    name: 'Banking Gold',
  },
  slate: {
    primary: '#3d5a6f',
    secondary: '#2f4a5f',
    accent: '#6a8a9e',
    light: '#e0ecf0',
    name: 'Corporate Slate',
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
