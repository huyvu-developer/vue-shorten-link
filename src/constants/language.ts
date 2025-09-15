export const LANGUAGE: Record<string, { name: string; code: string; image: string }> = {
  vi: {
    name: 'language.vietnamese',
    code: 'vi',
    image: '/images/locales/vi.png',
  },
  en: {
    name: 'language.english',
    code: 'en',
    image: '/images/locales/en.png',
  },
} as const
