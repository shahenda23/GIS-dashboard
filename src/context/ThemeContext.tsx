import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'en' | 'ar'

interface ThemeContextType {
  lang: Lang
  toggleLang: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  function toggleLang() {
    const next = lang === 'en' ? 'ar' : 'en'
    setLang(next)
    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', next)
  }

  return (
    <ThemeContext.Provider value={{ lang, toggleLang }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}