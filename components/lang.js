'use client';
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';

const KEY = 'kpr-lang';
const LangCtx = createContext(null);

function readPreferred() {
  const root = document.documentElement;
  if (root.getAttribute('data-lang') === 'en') return 'en';
  try {
    const l = new URLSearchParams(location.search).get('lang') || localStorage.getItem(KEY);
    return l === 'en' ? 'en' : 'id';
  } catch {
    return 'id';
  }
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('id');

  useLayoutEffect(() => {
    const l = readPreferred();
    setLangState(l);
    const root = document.documentElement;
    root.setAttribute('data-lang', l);
    root.lang = l;
    root.classList.add('i18n-ready');
  }, []);

  const setLang = useCallback((l) => {
    setLangState(l);
    const root = document.documentElement;
    root.setAttribute('data-lang', l);
    root.lang = l;
    try { localStorage.setItem(KEY, l); } catch {}
  }, []);

  const value = useMemo(() => ({
    lang,
    setLang,
    t: (v) => (v && typeof v === 'object' ? (v[lang] != null ? v[lang] : v.id) : v),
    L: (id, en) => (lang === 'en' ? en : id),
  }), [lang, setLang]);

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

export function T({ id, en }) {
  const { lang } = useLang();
  return <>{lang === 'en' ? en : id}</>;
}

export function useDocTitle(id, en) {
  const { lang } = useLang();
  useLayoutEffect(() => { document.title = lang === 'en' ? en : id; }, [lang, id, en]);
}
