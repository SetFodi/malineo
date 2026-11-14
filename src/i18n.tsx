import { createContext, useContext } from 'react';

export type Lang = 'ka' | 'en';

/** A piece of text in both languages. */
export type L = { en: string; ka: string };

export const LangContext = createContext<Lang>('ka');
export const useLang = (): Lang => useContext(LangContext);

/** Returns a picker for the current language: t(english, georgian). */
export function useT(): (en: string, ka: string) => string {
  const lang = useLang();
  return (en, ka) => (lang === 'ka' ? ka : en);
}

const STORE_KEY = 'meet-your-mac:lang';

export function loadLang(): Lang {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved === 'ka' || saved === 'en') return saved;
  } catch {
    /* storage can be unavailable when the page is opened as a file */
  }
  return 'ka';
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(STORE_KEY, lang);
  } catch {
    /* fine: the choice just won't be remembered */
  }
}

const LETTER_KEY = 'meet-your-mac:letter';

export function letterSeen(): boolean {
  try {
    return localStorage.getItem(LETTER_KEY) === 'seen';
  } catch {
    return false;
  }
}

export function markLetterSeen() {
  try {
    localStorage.setItem(LETTER_KEY, 'seen');
  } catch {
    /* fine: the intro will simply play again next time */
  }
}
