'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      supportedLngs: ['en', 'ru'],
      debug: process.env.NODE_ENV === 'development',
      backend: {
        loadPath: '/locales/{{lng}}/translation.json',
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
