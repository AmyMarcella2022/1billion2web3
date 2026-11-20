// Light / dark theme: saved choice → otherwise the device setting. Applied on <html data-theme>.
import { useEffect, useState } from 'react';

const KEY = 'theme';
const EVT = 'themechange';

export const systemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

export const storedTheme = () => {
  try {
    const t = localStorage.getItem(KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch (e) {
    return null;
  }
};

export const currentTheme = () => document.documentElement.getAttribute('data-theme') || storedTheme() || systemTheme();

export const applyTheme = (t) => {
  const r = document.documentElement;
  r.setAttribute('data-theme', t);
  r.style.colorScheme = t;
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', t === 'dark' ? '#0b1220' : '#ffffff');
  window.dispatchEvent(new Event(EVT));
};

export const initTheme = () => applyTheme(storedTheme() || systemTheme());

export const setTheme = (t) => {
  try {
    localStorage.setItem(KEY, t);
  } catch (e) {
    /* private mode: still applies for this visit */
  }
  applyTheme(t);
};

export function useTheme() {
  const [theme, set] = useState(currentTheme);
  useEffect(() => {
    const sync = () => set(currentTheme());
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    // follow the device setting live, unless the user picked a theme explicitly
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const onSys = () => { if (!storedTheme()) applyTheme(systemTheme()); };
    if (mq && mq.addEventListener) mq.addEventListener('change', onSys);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener('storage', sync);
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onSys);
    };
  }, []);
  return [theme, (t) => setTheme(t), () => setTheme(theme === 'dark' ? 'light' : 'dark')];
}
