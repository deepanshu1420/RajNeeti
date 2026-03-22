import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home as HomeIcon, Github } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ darkMode, setDarkMode, language, setLanguage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // We can define the shared hover classes here to ensure they always match perfectly
  const sharedHoverEffects = "transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]";

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-800/70 dark:bg-black/60 backdrop-blur-xl border-b border-zinc-600/50 dark:border-white/10 shadow-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-xs sm:text-base md:text-xl font-extrabold text-zinc-100 dark:text-blue-400 tracking-tight drop-shadow-sm leading-tight max-w-[55%] sm:max-w-full"
        >
          RajNeeti samjho, desh ko pehchano.
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* ONLY HOME BUTTON */}
          {!isHome && (
            <>
              <button
                onClick={() => navigate('/')}
                className={`flex items-center justify-center p-2 rounded-full bg-zinc-700/50 dark:bg-black/40 text-zinc-200 hover:bg-zinc-600/80 hover:text-white border border-zinc-500/50 dark:border-white/10 shadow-sm ${sharedHoverEffects}`}
              >
                <HomeIcon size={20} />
              </button>

              <div className="h-6 w-px bg-zinc-600/50 dark:bg-gray-700 mx-1"></div>
            </>
          )}

          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            title={language === 'en' ? 'Translate to Hindi' : 'Translate to English'}
            className={`flex items-center justify-center px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm bg-zinc-700/50 dark:bg-black/40 text-zinc-200 hover:text-white hover:bg-zinc-600/80 border border-zinc-500/50 dark:border-white/10 shadow-sm ${sharedHoverEffects}`}
          >
            {language === 'en' ? 'EN' : 'HI'}
          </button>
          
          {/* Theme Toggle */}
          <div className={`bg-zinc-700/50 dark:bg-black/40 text-zinc-200 rounded-full border border-zinc-500/50 dark:border-white/10 shadow-sm hover:bg-zinc-600/80 hover:text-white flex items-center justify-center ${sharedHoverEffects}`}>
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>

          {/* GitHub */}
          <a 
            href="https://github.com/deepanshu1420/RajNeeti.git"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center p-2.5 rounded-full bg-zinc-700/50 dark:bg-black/40 text-zinc-200 hover:text-white hover:bg-zinc-600/80 border border-zinc-500/50 dark:border-white/10 shadow-sm ${sharedHoverEffects}`}
            aria-label="GitHub Repository"
          >
            <Github size={20} />
          </a>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;