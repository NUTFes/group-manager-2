import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nextI18NextConfig from '../next-i18next.config.js';
import commonEn from '../public/locales/en/common.json';
import commonJa from '../public/locales/ja/common.json';

const resources = {
  ja: {
    common: commonJa,
  },
  en: {
    common: commonEn,
  },
} as const;

const { defaultLocale, locales } = nextI18NextConfig.i18n;

export const initStorybookI18n = () => {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: defaultLocale,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      ns: ['common'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      initImmediate: false,
    });
  }

  return i18n;
};

export default initStorybookI18n();
