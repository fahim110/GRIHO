import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEME_PRESETS = [
  {
    id: 'emerald',
    name: 'Emerald Oasis',
    subtitle: 'Verified Real Estate (Default)',
    icon: '🌿',
    badge: 'Original',
    colors: {
      primary: '#10b981',
      primaryHover: '#059669',
      primaryLight: '#34d399',
      primaryDark: '#022c22',
      secondary: '#14b8a6',
      secondaryHover: '#0d9488',
      bgMain: '#070b14',
      bgCard: 'rgba(15, 23, 42, 0.92)',
      bgCardHover: 'rgba(26, 38, 66, 0.95)',
      border: 'rgba(255, 255, 255, 0.12)',
      borderGlow: 'rgba(16, 185, 129, 0.45)',
      glowOrb1: 'rgba(16, 185, 129, 0.18)',
      glowOrb2: 'rgba(14, 165, 233, 0.15)',
      glowOrb3: 'rgba(99, 102, 241, 0.10)',
      textMain: '#f8fafc',
      textMuted: '#94a3b8',
    },
  },
  {
    id: 'terracotta',
    name: 'Sunset Terracotta',
    subtitle: 'Warm Clay & Cozy Home (Reference Art)',
    icon: '🌅',
    badge: 'Aesthetic',
    colors: {
      primary: '#f43f5e',
      primaryHover: '#e11d48',
      primaryLight: '#fb7185',
      primaryDark: '#4c0519',
      secondary: '#f97316',
      secondaryHover: '#ea580c',
      bgMain: '#0e0a0d',
      bgCard: 'rgba(28, 18, 24, 0.94)',
      bgCardHover: 'rgba(42, 26, 36, 0.96)',
      border: 'rgba(255, 255, 255, 0.12)',
      borderGlow: 'rgba(244, 63, 94, 0.45)',
      glowOrb1: 'rgba(244, 63, 94, 0.18)',
      glowOrb2: 'rgba(249, 115, 22, 0.16)',
      glowOrb3: 'rgba(217, 70, 239, 0.10)',
      textMain: '#fff1f2',
      textMuted: '#fda4af',
    },
  },
  {
    id: 'sapphire',
    name: 'Royal Sapphire',
    subtitle: 'High-Tech PropTech & Modern Trust',
    icon: '🌊',
    badge: 'Corporate',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      primaryLight: '#60a5fa',
      primaryDark: '#172554',
      secondary: '#06b6d4',
      secondaryHover: '#0891b2',
      bgMain: '#050a16',
      bgCard: 'rgba(12, 22, 45, 0.94)',
      bgCardHover: 'rgba(18, 34, 68, 0.96)',
      border: 'rgba(255, 255, 255, 0.12)',
      borderGlow: 'rgba(59, 130, 246, 0.45)',
      glowOrb1: 'rgba(59, 130, 246, 0.20)',
      glowOrb2: 'rgba(6, 182, 212, 0.16)',
      glowOrb3: 'rgba(99, 102, 241, 0.12)',
      textMain: '#f0f9ff',
      textMuted: '#93c5fd',
    },
  },
  {
    id: 'champagne',
    name: 'Champagne Luxury',
    subtitle: 'Penthouse & Prestigious Real Estate',
    icon: '✨',
    badge: 'Luxury',
    colors: {
      primary: '#f59e0b',
      primaryHover: '#d97706',
      primaryLight: '#fcd34d',
      primaryDark: '#451a03',
      secondary: '#eab308',
      secondaryHover: '#ca8a04',
      bgMain: '#0c0a07',
      bgCard: 'rgba(26, 21, 15, 0.94)',
      bgCardHover: 'rgba(38, 30, 20, 0.96)',
      border: 'rgba(255, 255, 255, 0.12)',
      borderGlow: 'rgba(245, 158, 11, 0.45)',
      glowOrb1: 'rgba(245, 158, 11, 0.18)',
      glowOrb2: 'rgba(234, 179, 8, 0.15)',
      glowOrb3: 'rgba(251, 191, 36, 0.10)',
      textMain: '#fefce8',
      textMuted: '#fde047',
    },
  },
  {
    id: 'amethyst',
    name: 'Cyber Amethyst',
    subtitle: 'Creative, Modern & Distinctive',
    icon: '🔮',
    badge: 'Vibrant',
    colors: {
      primary: '#a855f7',
      primaryHover: '#9333ea',
      primaryLight: '#c084fc',
      primaryDark: '#3b0764',
      secondary: '#ec4899',
      secondaryHover: '#db2777',
      bgMain: '#0a0612',
      bgCard: 'rgba(22, 14, 38, 0.94)',
      bgCardHover: 'rgba(35, 20, 58, 0.96)',
      border: 'rgba(255, 255, 255, 0.12)',
      borderGlow: 'rgba(168, 85, 247, 0.45)',
      glowOrb1: 'rgba(168, 85, 247, 0.18)',
      glowOrb2: 'rgba(236, 72, 153, 0.15)',
      glowOrb3: 'rgba(99, 102, 241, 0.10)',
      textMain: '#faf5ff',
      textMuted: '#d8b4fe',
    },
  },
  {
    id: 'nordic-light',
    name: 'Nordic Clean Light',
    subtitle: 'Airy, Crisp & Ultra-Readable Day Mode',
    icon: '☀️',
    badge: 'Light Mode',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      primaryLight: '#10b981',
      primaryDark: '#d1fae5',
      secondary: '#0284c7',
      secondaryHover: '#0369a1',
      bgMain: '#f1f5f9',
      bgCard: 'rgba(255, 255, 255, 0.97)',
      bgCardHover: 'rgba(248, 250, 252, 1)',
      border: 'rgba(15, 23, 42, 0.12)',
      borderGlow: 'rgba(5, 150, 105, 0.35)',
      glowOrb1: 'rgba(16, 185, 129, 0.12)',
      glowOrb2: 'rgba(14, 165, 233, 0.10)',
      glowOrb3: 'rgba(99, 102, 241, 0.06)',
      textMain: '#0f172a',
      textMuted: '#475569',
    },
  },
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [activeThemeId, setActiveThemeId] = useState(() => {
    return localStorage.getItem('griho_theme_id') || 'emerald';
  });

  const [customOverrides, setCustomOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem('griho_theme_overrides');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Calculate current active colors
  const currentPreset = THEME_PRESETS.find((t) => t.id === activeThemeId) || THEME_PRESETS[0];
  const activeColors = {
    ...currentPreset.colors,
    ...(customOverrides || {}),
  };

  // Apply CSS Variables to Document Root
  useEffect(() => {
    const root = document.documentElement;

    // Apply color values to root CSS custom properties
    root.style.setProperty('--color-bg-main', activeColors.bgMain);
    root.style.setProperty('--color-bg-card', activeColors.bgCard);
    root.style.setProperty('--color-bg-card-hover', activeColors.bgCardHover);
    root.style.setProperty('--color-border', activeColors.border);
    root.style.setProperty('--color-border-glow', activeColors.borderGlow);
    root.style.setProperty('--color-text-main', activeColors.textMain);
    root.style.setProperty('--color-text-muted', activeColors.textMuted);

    // Bind Tailwind theme properties dynamically
    root.style.setProperty('--emerald-300', activeColors.primaryLight);
    root.style.setProperty('--emerald-400', activeColors.primaryLight);
    root.style.setProperty('--emerald-500', activeColors.primary);
    root.style.setProperty('--emerald-600', activeColors.primaryHover);
    root.style.setProperty('--emerald-950', activeColors.primaryDark);

    root.style.setProperty('--teal-400', activeColors.secondary);
    root.style.setProperty('--teal-500', activeColors.secondary);
    root.style.setProperty('--teal-600', activeColors.secondaryHover);

    // Primary Brand Gradients & Shadows
    root.style.setProperty(
      '--brand-primary-gradient',
      `linear-gradient(135deg, ${activeColors.primary} 0%, ${activeColors.primaryHover} 100%)`
    );
    root.style.setProperty(
      '--brand-primary-gradient-hover',
      `linear-gradient(135deg, ${activeColors.primaryLight} 0%, ${activeColors.primaryHover} 100%)`
    );
    root.style.setProperty('--brand-shadow', activeColors.borderGlow);
    root.style.setProperty('--brand-shadow-hover', activeColors.borderGlow);

    // Dynamic Radial Glow Orbs
    root.style.setProperty('--bg-radial-1', activeColors.glowOrb1);
    root.style.setProperty('--bg-radial-2', activeColors.glowOrb2);
    root.style.setProperty('--bg-radial-3', activeColors.glowOrb3);

    // Set data-theme attribute
    root.setAttribute('data-theme', activeThemeId);
    if (activeThemeId === 'nordic-light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    }

    // Persist
    localStorage.setItem('griho_theme_id', activeThemeId);
    if (customOverrides) {
      localStorage.setItem('griho_theme_overrides', JSON.stringify(customOverrides));
    } else {
      localStorage.removeItem('griho_theme_overrides');
    }
  }, [activeThemeId, customOverrides, activeColors]);

  const selectPreset = (themeId) => {
    setActiveThemeId(themeId);
    setCustomOverrides(null);
  };

  const updateCustomColor = (key, value) => {
    setCustomOverrides((prev) => {
      const updated = { ...(prev || activeColors), [key]: value };
      return updated;
    });
  };

  const resetToDefault = () => {
    setActiveThemeId('emerald');
    setCustomOverrides(null);
    localStorage.removeItem('griho_theme_id');
    localStorage.removeItem('griho_theme_overrides');
  };

  const generateCssExport = () => {
    return `:root {
  --color-bg-main: ${activeColors.bgMain};
  --color-bg-card: ${activeColors.bgCard};
  --emerald-400: ${activeColors.primaryLight};
  --emerald-500: ${activeColors.primary};
  --emerald-600: ${activeColors.primaryHover};
  --teal-500: ${activeColors.secondary};
  --color-border-glow: ${activeColors.borderGlow};
}`;
  };

  return (
    <ThemeContext.Provider
      value={{
        activeThemeId,
        currentPreset,
        activeColors,
        customOverrides,
        presets: THEME_PRESETS,
        selectPreset,
        updateCustomColor,
        resetToDefault,
        generateCssExport,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
