import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, memo } from 'react';
import Home from './pages/Home';
import StateDetail from './pages/StateDetail';
import Navbar from './components/Navbar';
import bg1 from './assets/bg1.jpg';
import bg2 from './assets/bg2.jpg';
import bg3 from './assets/bg3.jpg';
import bg4 from './assets/bg4.jpg';

const bgImages = [bg1, bg2, bg3, bg4];

const BackgroundSlider = memo(({ darkMode }) => {
  // State to check if the screen is mobile sized (under 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Set the default image to bg2 (index 1) for mobile, and bg1 (index 0) for larger screens
  const [bgIndex, setBgIndex] = useState(isMobile ? 1 : 0);

  // Effect to handle window resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // If it's a mobile screen, lock to index 1 (bg2) and don't set the interval
    if (isMobile) {
      setBgIndex(1);
      return;
    }

    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [isMobile]); // Re-run this effect if the screen size crosses the mobile breakpoint

  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      {bgImages.map((imgSrc, index) => (
        <img
          key={index}
          src={imgSrc}
          className={`absolute inset-0 w-full h-full object-cover blur-sm scale-105 transition-opacity duration-[2500ms] ease-in-out ${
            bgIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
          alt="Government Background"
        />
      ))}
      <div className={`absolute inset-0 transition-colors duration-700 ${darkMode ? 'bg-black/80' : 'bg-black/40 backdrop-blur-[2px]'}`} />
    </div>
  );
});

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // NEW: State for Language
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden text-zinc-100 flex flex-col">
      <BackgroundSlider darkMode={darkMode} />
      <Router>
        {/* Passed language props down to Navbar */}
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          language={language} 
          setLanguage={setLanguage} 
        />
        <main className="container mx-auto px-4 py-8 relative z-10 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Passed language prop down to StateDetail */}
            <Route path="/state/:stateName" element={<StateDetail language={language} />} />
          </Routes>
        </main>
        <footer className="relative z-10 w-full py-5 text-center bg-transparent mt-auto">
          <p className="text-zinc-300 dark:text-gray-400 font-medium text-sm tracking-wide">
            Developed by{' '}
            <a 
             href="https://github.com/deepanshu1420" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white transition-colors duration-300 font-bold"
            >
             Deepanshu Sharma
            </a>
          </p>
        </footer>
      </Router>
    </div>
  );
}

export default App;