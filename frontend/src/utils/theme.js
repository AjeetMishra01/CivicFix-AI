const THEME_KEY = 'civicfix-theme';

export const setTheme = (mode) => {
  const root = document.documentElement;
  const isDark = mode === 'dark';
  root.classList.toggle('dark', isDark);
  localStorage.setItem(THEME_KEY, mode);
};

export const initTheme = () => {
  if (typeof window === 'undefined' || !window.document) return 'light';

  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  setTheme(theme);
  return theme;
};

export const toggleTheme = () => {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
};
