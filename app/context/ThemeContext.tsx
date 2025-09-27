'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppearanceSettings } from '@/types';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  appearance: AppearanceSettings;
  updateAppearance: (settings: AppearanceSettings) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialAppearance = {}
}: {
  children: React.ReactNode;
  initialAppearance?: AppearanceSettings;
}) {
  // PERBAIKAN: Gunakan state terpisah untuk theme dan appearance
  const [theme, setThemeState] = useState('light');
  const [appearance, setAppearance] = useState<AppearanceSettings>(initialAppearance);
  const [isInitialized, setIsInitialized] = useState(false);

  // PERBAIKAN: Effect untuk initialize theme dari localStorage atau settings
  useEffect(() => {
    // Cek localStorage terlebih dahulu
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      // Jika ada di localStorage, gunakan itu
      setThemeState(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      // Jika tidak ada, cek dari initialAppearance (dari server)
      const themeFromSettings = initialAppearance.theme?.value || 'light';
      setThemeState(themeFromSettings);
      document.documentElement.classList.toggle('dark', themeFromSettings === 'dark');
      // Simpan ke localStorage untuk下次使用
      localStorage.setItem('theme', themeFromSettings);
    }
    
    setIsInitialized(true);
  }, [initialAppearance.theme?.value]);

  // PERBAIKAN: Effect untuk update CSS variables ketika appearance berubah
  useEffect(() => {
    if (!isInitialized) return;

    const root = document.documentElement;

    // Light mode variables
    if (appearance.primaryColor?.value) {
      root.style.setProperty('--color-primary', appearance.primaryColor.value);
    }
    if (appearance.secondaryColor?.value) {
      root.style.setProperty('--color-secondary', appearance.secondaryColor.value);
    }
    if (appearance.accentColor?.value) {
      root.style.setProperty('--color-accent', appearance.accentColor.value);
    }
    if (appearance.backgroundColor?.value) {
      root.style.setProperty('--color-background', appearance.backgroundColor.value);
    }
    if (appearance.textColor?.value) {
      root.style.setProperty('--color-text', appearance.textColor.value);
    }
    if (appearance.borderColor?.value) {
      root.style.setProperty('--color-border', appearance.borderColor.value);
    }

    // Dark mode variables
    if (appearance.primaryColorDark?.value) {
      root.style.setProperty('--color-primary-dark', appearance.primaryColorDark.value);
    }
    if (appearance.secondaryColorDark?.value) {
      root.style.setProperty('--color-secondary-dark', appearance.secondaryColorDark.value);
    }
    if (appearance.accentColorDark?.value) {
      root.style.setProperty('--color-accent-dark', appearance.accentColorDark.value);
    }
    if (appearance.backgroundColorDark?.value) {
      root.style.setProperty('--color-background-dark', appearance.backgroundColorDark.value);
    }
    if (appearance.textColorDark?.value) {
      root.style.setProperty('--color-text-dark', appearance.textColorDark.value);
    }
    if (appearance.borderColorDark?.value) {
      root.style.setProperty('--color-border-dark', appearance.borderColorDark.value);
    }
  }, [appearance, isInitialized]);

  // PERBAIKAN: Function untuk set theme yang benar
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const updateAppearance = (newSettings: AppearanceSettings) => {
    setAppearance(prev => ({ ...prev, ...newSettings }));
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    appearance,
    updateAppearance,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}