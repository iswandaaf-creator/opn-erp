import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import id from './locales/id.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import ms from './locales/ms.json';
import th from './locales/th.json';

const resources = {
    en: { translation: en },
    id: { translation: id },
    ja: { translation: ja },
    zh: { translation: zh },
    ms: { translation: ms },
    th: { translation: th },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'id',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'app-language',
            caches: ['localStorage'],
        },
    });

export default i18n;
