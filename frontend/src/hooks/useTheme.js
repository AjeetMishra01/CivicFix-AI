import { useEffect, useState } from 'react';
import { initTheme, toggleTheme } from '../utils/theme';

const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(initTheme());
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return { theme, toggleTheme: handleToggle };
};

export default useTheme;
