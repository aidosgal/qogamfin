import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ru from './locales/ru.json';
import kz from './locales/kz.json';

const LANG_KEY = 'user-language';

export async function initLanguage() {
  const savedLang = await AsyncStorage.getItem(LANG_KEY);
  const lng = savedLang || 'ru';

  await i18n
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: 'ru',
      resources: {
        en: { translation: en },
        ru: { translation: ru },
        kz: { translation: kz },
      },
      interpolation: { escapeValue: false },
    });
}

export default i18n;
