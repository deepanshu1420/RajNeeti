import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center justify-center p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
};

export default ThemeToggle;