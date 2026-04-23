'use client';

import { useRootContext } from '@/contexts/RootContext';
import React, { createContext, useContext, useEffect, useState } from 'react';

declare global {
  interface Window {
    localStorage: Storage;
  }
}

export const THEME_ID = 'theme' as const;
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

const { LIGHT, DARK } = Theme;

const getStoredTheme = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(THEME_ID) as Theme;
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const initialContext: ThemeContextType = {
  theme: getStoredTheme() || DARK,
  toggleTheme: () => { },
  setTheme: () => { },
};

const ThemeContext = createContext<ThemeContextType>(initialContext);

const getSavedTheme = (): Theme => {
  if (typeof window !== "undefined") {
    // Checking the saved theme in localStorage
    const savedTheme = getStoredTheme();

    // If the theme is not saved, check the system settings
    // TODO: uncomment when LIGHT theme will be completed
    // if (!savedTheme) {
    //   return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;
    // }

    return savedTheme || DARK;
  }

  return DARK;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);

  const { initialData } = useRootContext();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === DARK ? LIGHT : DARK));
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  useEffect(() => {
    window?.localStorage.setItem(THEME_ID, theme);

    if (theme === DARK) {
      document.documentElement.classList.add(DARK);
    } else {
      document.documentElement.classList.remove(DARK);
    }
  }, [theme]);

  // Listening to system theme changes
  useEffect(() => {
    if (!initialData.themeEnabled) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? DARK : LIGHT);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!initialData.themeEnabled) {
      setTheme(LIGHT);
    }
  }, []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
