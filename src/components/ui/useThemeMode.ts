'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'd48-theme';
const THEME_EVENT = 'd48-theme-change';

function getThemeSnapshot(): ThemeMode {
  if (typeof document === 'undefined') {
    return 'dark';
  }

  return document.documentElement.getAttribute('data-theme') === 'light'
    ? 'light'
    : 'dark';
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_EVENT, onStoreChange);
}

export function setThemeMode(nextTheme: ThemeMode) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function useThemeMode() {
  const theme = useSyncExternalStore<ThemeMode>(
    subscribe,
    getThemeSnapshot,
    () => 'dark',
  );

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeMode(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  return { theme, setTheme, toggleTheme };
}
