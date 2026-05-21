import { create } from 'zustand';

const storedTheme = localStorage.getItem('theme') || 'light';

const useThemeStore = create((set) => ({
  theme: storedTheme,
  toggleTheme: () => {
    const newTheme = storedTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  },
}));

// Apply initial theme
document.documentElement.classList.toggle('dark', storedTheme === 'dark');

export default useThemeStore;