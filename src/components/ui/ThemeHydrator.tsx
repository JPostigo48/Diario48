'use client';

import { useEffect } from 'react';
import { setThemeMode } from '@/components/ui/useThemeMode';

export default function ThemeHydrator() {
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('d48-theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setThemeMode(storedTheme);
      }
    } catch {
      // Ignorar errores de acceso a storage.
    }
  }, []);

  return null;
}
