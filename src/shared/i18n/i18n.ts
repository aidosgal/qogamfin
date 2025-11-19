import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ru from './locales/ru.json';
import kk from './locales/kk.json';

const LANG_KEY = 'user-language';

export async function initLanguage() {
  let savedLang = await AsyncStorage.getItem(LANG_KEY);
  
  // Migrate old 'kz' locale to 'kk'
  if (savedLang === 'kz') {
    savedLang = 'kk';
    await AsyncStorage.setItem(LANG_KEY, 'kk');
    console.log('🔄 Migrated locale from kz to kk');
  }
  
  const lng = savedLang || 'ru';
  console.log('🌍 Initializing i18n with locale:', lng);

  await i18n
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: 'ru',
      resources: {
        en: { translation: en },
        ru: { translation: ru },
        kk: { translation: kk },
      },
      interpolation: { escapeValue: false },
    });
}

export default i18n;
