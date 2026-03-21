import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStates = states.filter((state) => 
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      <div className="text-center mt-6 mb-10 px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-zinc-100 drop-shadow-2xl flex flex-wrap justify-center items-baseline gap-3">
          RajNeeti 
          <span className="text-lg md:text-xl font-bold text-zinc-300 tracking-wide opacity-90">
            (राजनीति🏛️)
          </span>
        </h1>
        <p className="text-lg max-w-3xl mx-auto text-zinc-200 font-bold drop-shadow-lg">
          Understand India, State by State. AI-powered civic intelligence bringing you real-time insights into politics, developments, and current affairs.⚖️
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-12 px-4 relative z-20">
        <div className="relative flex items-center w-full h-14 rounded-full bg-zinc-800/70 dark:bg-black/60 backdrop-blur-xl border border-zinc-600/50 dark:border-white/10 shadow-2xl transition-all duration-300 overflow-hidden group focus-within:border-zinc-300 focus-within:shadow-[0_0_25px_rgba(255,255,255,0.25)] dark:focus-within:shadow-[0_0_20px_rgba(255,255,255,0.15)] focus-within:-translate-y-1">
          <div className="pl-5 text-zinc-400 group-focus-within:text-zinc-100 transition-colors duration-300">
            <Search size={22} strokeWidth={2.5} />
          </div>
          <input 
            type="text"
            placeholder="Search for a state (e.g., Haryana)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none px-4 text-zinc-100 placeholder-zinc-400 text-lg font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
        <AnimatePresence>
          {filteredStates.length > 0 ? (
            filteredStates.map((state) => (
              /* 1. THE WRAPPER: Handles the grid sorting layout */
              <motion.div
                key={state}
                layout 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex"
              >
                {/* 2. THE BUTTON: Upgraded to motion.button for snappy Spring physics hover */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={() => navigate(`/state/${state}`)}
                  
                  /* CSS now ONLY handles colors and shadows (duration-200 for speed) */
                  className="will-change-transform w-full relative px-8 py-3.5 rounded-full bg-zinc-800/60 dark:bg-black/50 backdrop-blur-md border border-zinc-600/50 dark:border-white/10 text-zinc-100 font-extrabold text-lg sm:text-xl transition-colors transition-shadow duration-200 hover:z-20 hover:bg-zinc-700/80 dark:hover:bg-black/70 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  {state}
                </motion.button>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center mt-10">
              <p className="text-2xl font-bold text-zinc-200 drop-shadow-md">
                No states found matching "{searchQuery}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Home;