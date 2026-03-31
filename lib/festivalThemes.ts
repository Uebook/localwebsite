// Festival Themes Configuration
// Shared from Admin Panel
export const FESTIVAL_THEMES = {
  diwali: {
    id: 'diwali',
    name: 'Diwali',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFD700',
      background: '#FFFBF0',
      text: '#1A1A1A'
    },
    icon: '🪔',
    description: 'Festival of Lights - Bright and vibrant colors'
  },
  holi: {
    id: 'holi',
    name: 'Holi',
    colors: {
      primary: '#FF1744',
      secondary: '#E91E63',
      accent: '#9C27B0',
      background: '#FFF5F9',
      text: '#1A1A1A'
    },
    icon: '🎨',
    description: 'Festival of Colors - Vibrant and playful'
  },
  eid: {
    id: 'eid',
    name: 'Eid',
    colors: {
      primary: '#2E7D32',
      secondary: '#4CAF50',
      accent: '#8BC34A',
      background: '#F0FDF4',
      text: '#1A1A1A'
    },
    icon: '🌙',
    description: 'Eid Celebration - Green and peaceful'
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas',
    colors: {
      primary: '#C62828',
      secondary: '#2E7D32',
      accent: '#FFD700',
      background: '#FEF2F2',
      text: '#1A1A1A'
    },
    icon: '🎄',
    description: 'Christmas - Red, green and gold'
  },
  newYear: {
    id: 'newYear',
    name: 'New Year',
    colors: {
      primary: '#1976D2',
      secondary: '#42A5F5',
      accent: '#FFD700',
      background: '#F0F9FF',
      text: '#1A1A1A'
    },
    icon: '🎊',
    description: 'New Year - Blue and gold celebration'
  }
};

export const getThemeCSS = (themeId: string, customTheme: any = null) => {
  const theme = customTheme || FESTIVAL_THEMES[themeId as keyof typeof FESTIVAL_THEMES];
  if (!theme) return '';

  const colors = theme.colors;

  return `
    :root {
      /* Theme-specific variables */
      --theme-primary: ${colors.primary};
      --theme-secondary: ${colors.secondary};
      --theme-accent: ${colors.accent};
      --theme-background: ${colors.background};
      --theme-text: ${colors.text};
      --theme-header-gradient: linear-gradient(to right, ${colors.primary}, ${colors.secondary});
      
      /* Standard variables used by Tailwind and global styles */
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --accent: ${colors.accent};
      --background: ${colors.background};
    }
    .gradient-primary {
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
    }
    .header-gradient {
      background: var(--theme-header-gradient) !important;
    }
    .text-gradient {
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `;
};
