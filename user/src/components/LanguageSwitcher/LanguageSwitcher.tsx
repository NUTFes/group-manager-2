import { useRouter } from 'next/router';
import { useLanguageSwitcherTexts } from './hooks';

const locales = ['ja', 'en'] as const;
type Locale = (typeof locales)[number];

const LanguageSwitcher = () => {
  const router = useRouter();
  const { label, languages } = useLanguageSwitcherTexts();
  const currentLocale = (router.locale as Locale) ?? 'ja';

  const switchLocale = (locale: Locale) => {
    router.push(router.asPath, router.asPath, { locale });
  };

  return (
    <div
      className="flex items-center gap-2 text-sm text-white"
      aria-label={label}
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchLocale(locale)}
          disabled={currentLocale === locale}
          className={`rounded-full border border-white px-3 py-1 transition hover:bg-white hover:text-main ${
            currentLocale === locale ? 'bg-white text-main' : 'bg-transparent'
          }`}
        >
          {locale === 'ja' ? languages.ja : languages.en}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
