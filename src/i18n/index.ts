import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
export const resources = { ar: { translation: { home: 'الرئيسية', discover: 'استكشف', news: 'الأخبار', community: 'المجتمع', profile: 'الملف الشخصي' } }, en: { translation: { home: 'Home', discover: 'Discover', news: 'News', community: 'Community', profile: 'Profile' } } };
export const defaultLanguage = 'ar';
I18nManager.allowRTL(true); I18nManager.forceRTL(defaultLanguage === 'ar');
i18n.use(initReactI18next).init({ compatibilityJSON: 'v4', resources, lng: defaultLanguage, fallbackLng: 'en', interpolation: { escapeValue: false } });
export default i18n;
