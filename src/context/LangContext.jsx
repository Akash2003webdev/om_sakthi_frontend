import React from 'react'
import { createContext, useContext, useState } from 'react'
import { TRANSLATIONS } from '../data'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = TRANSLATIONS[lang]
  const toggle = () => setLang(l => l === 'en' ? 'ta' : 'en')
  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
