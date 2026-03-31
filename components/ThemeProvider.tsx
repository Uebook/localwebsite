'use client';

import { useEffect, createContext, useContext, useState, ReactNode } from 'react';
import { FESTIVAL_THEMES, getThemeCSS } from '@/lib/festivalThemes';

interface ThemeContextType {
  theme: string;
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState('default');

  useEffect(() => {
    // Load theme from database (global default first, then user-specific)
    const loadTheme = async () => {
      let themeToUse = localStorage.getItem('selectedFestivalTheme') || 'default';
      let activeThemeFromDB: any = null;

      // Step 1: Check for global default theme (set by admin)
      try {
        console.log('[Theme] Fetching global active theme...');
        const globalThemeRes = await fetch('/api/themes?active=true', { cache: 'no-store' });
        if (globalThemeRes.ok) {
          const globalThemes = await globalThemeRes.json();
          console.log('[Theme] Global themes found:', globalThemes);
          if (Array.isArray(globalThemes) && globalThemes.length > 0) {
            const activeTheme = globalThemes.find((t: any) => t.is_active);
            if (activeTheme && activeTheme.id) {
              console.log('[Theme] Applying global active theme:', activeTheme.id);
              themeToUse = activeTheme.id;
              activeThemeFromDB = activeTheme;
              // Sync localStorage with global default
              localStorage.setItem('selectedFestivalTheme', themeToUse);
            }
          }
        }
      } catch (error: any) {
        if (!error.message?.includes('fetch failed') && !error.message?.includes('ENOTFOUND')) {
          console.error('Error loading global default theme:', error);
        }
      }

      // Note: Admin's global default theme always takes precedence
      // When admin changes theme, all users' selected_theme is updated in the database
      // So we only need to check the global default theme

      // Apply the theme
      applyTheme(themeToUse, activeThemeFromDB);
    };

    loadTheme();
  }, []);

  const applyTheme = (themeId: string, customTheme: any = null) => {
    const festivalTheme = customTheme || FESTIVAL_THEMES[themeId as keyof typeof FESTIVAL_THEMES];

    if (themeId === 'default' || !festivalTheme) {
      // Remove theme styles if not default
      const styleElement = document.getElementById('festival-theme-style');
      if (styleElement) {
        styleElement.remove();
      }
      setThemeState('default');
      return;
    }

    // Apply theme CSS
    const styleId = 'festival-theme-style';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = getThemeCSS(themeId, festivalTheme);

    // Apply theme colors to root
    const root = document.documentElement;
    const colors = festivalTheme.colors;

    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-background', '#FFFFFF');
    root.style.setProperty('--theme-text', colors.text);
    root.style.setProperty('--theme-header-gradient', `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`);

    // Standard variables for Tailwind/Global
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--background', '#FFFFFF');

    setThemeState(themeId);
    localStorage.setItem('selectedFestivalTheme', themeId);
  };

  const setTheme = async (themeId: string) => {
    applyTheme(themeId);

    // Save to database if user is logged in
    const userId = localStorage.getItem('userId');
    const userPhone = localStorage.getItem('userPhone');
    const userEmail = localStorage.getItem('userEmail');

    if (userId || userPhone || userEmail) {
      try {
        const body: any = { theme: themeId };
        if (userId) body.userId = userId;
        else if (userPhone) body.phone = userPhone;
        else if (userEmail) body.email = userEmail;

        await fetch('/api/user/theme', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (error) {
        console.error('Error saving theme to database:', error);
        // Continue anyway - localStorage is already saved
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
