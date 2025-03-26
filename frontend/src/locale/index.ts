import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en, vn } from './resources'

const resources = {
  en: { translation: { ...en } },
  vn: { translation: { ...vn } }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
