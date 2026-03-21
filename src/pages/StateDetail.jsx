import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchStateData } from '../services/gemini';
import SkeletonLoader from '../components/SkeletonLoader';
import ChatBot from '../components/ChatBot';

// ─── Theme watcher ────────────────────────────────────────────────────────────
function useIsDark() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const el  = document.documentElement;
    const obs = new MutationObserver(() =>
      setIsDark(el.classList.contains('dark'))
    );
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

// ─── Hardcoded Unsplash photo URLs per category ───────────────────────────────
const CATEGORY_IMAGES = {
  issues: [
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800&q=80',
  ],
  politics: [
    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
  ],
  crime: [
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508345228704-935cc84bf5e2?auto=format&fit=crop&w=800&q=80',
  ],
  positive: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541888054041-8631d54be8ed?auto=format&fit=crop&w=800&q=80',
  ],
};

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80';

// ─── Category colours (glow + bullet dots) ───────────────────────────────────
const CAT_COLORS = {
  issues:   { glow: 'rgba(239,68,68,0.75)',   ring: 'rgba(239,68,68,0.55)',   dot: '#f87171', txt: 'text-red-400'    },
  politics: { glow: 'rgba(99,102,241,0.75)',  ring: 'rgba(99,102,241,0.55)',  dot: '#818cf8', txt: 'text-indigo-400' },
  crime:    { glow: 'rgba(234,179,8,0.70)',   ring: 'rgba(234,179,8,0.50)',   dot: '#fbbf24', txt: 'text-yellow-400' },
  positive: { glow: 'rgba(34,197,94,0.70)',   ring: 'rgba(34,197,94,0.50)',   dot: '#4ade80', txt: 'text-green-400'  },
  default:  { glow: 'rgba(139,92,246,0.70)',  ring: 'rgba(139,92,246,0.50)',  dot: '#a78bfa', txt: 'text-purple-400' },
};

// ─── Bullet helper ────────────────────────────────────────────────────────────
function toBullets(item) {
  const arr = item.points ?? item.bullets ?? item.keyPoints ?? item.highlights ?? null;
  if (Array.isArray(arr) && arr.length > 0)
    return arr.map(String).filter(Boolean).slice(0, 3);
  const raw = (item.description ?? item.content ?? '').trim();
  let parts = raw.split(/\.\s+/).map(s => s.replace(/\.$/, '').trim()).filter(Boolean);
  if (parts.length < 2)
    parts = raw.split(/[,;]/).map(s => s.trim()).filter(Boolean);
  return parts.slice(0, 3);
}

// ─── Card ─────────────────────────────────────────────────────────────────────
const SectionCard = ({ item, category, index }) => {
  const [hovered, setHovered] = useState(false);

  const colors  = CAT_COLORS[category] ?? CAT_COLORS.default;
  const bullets = toBullets(item);

  const imgs   = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.issues;
  const imgSrc = imgs[index % imgs.length];

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
      whileHover={{ scale: 1.03, y: -10 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      style={{
        boxShadow: hovered
          ? `0 0 0 1.5px ${colors.ring}, 0 0 55px ${colors.glow}, 0 24px 60px rgba(0,0,0,0.40)`
          : '0 4px 24px rgba(0,0,0,0.22)',
        borderColor: hovered ? colors.ring : 'rgba(255,255,255,0.18)',
        transition: 'box-shadow 0.28s ease, border-color 0.28s ease',
      }}
      className="
        will-change-transform group
        flex flex-col rounded-[2rem] overflow-hidden
        bg-white/10 dark:bg-black/20
        backdrop-blur-2xl border
        hover:bg-white/20 dark:hover:bg-black/40
        cursor-default select-none
      "
    >
      <div className="h-52 w-full shrink-0 overflow-hidden relative rounded-t-[2rem]">
        <img
          src={imgSrc}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-110"
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-6 pt-0 flex flex-col z-10 -mt-6">
        <h3 className="font-extrabold text-2xl pt-9 mb-3 text-white tracking-tight drop-shadow-md leading-snug">
          {item.title}
        </h3>
        <div
          className="h-px w-16 mb-5 rounded-full opacity-70"
          style={{ background: colors.dot }}
        />
        <ul className="space-y-4 text-zinc-100 text-sm leading-relaxed font-medium pb-3">
          {bullets.map((pt, i) => pt ? (
            <li key={i} className="flex items-start gap-3">
              <span
                className={`text-xl ${colors.txt} mt-0.5 shrink-0 drop-shadow transition-all duration-200`}
                style={{ textShadow: hovered ? `0 0 10px ${colors.dot}` : 'none' }}
              >
                •
              </span>
              <span className="drop-shadow-sm">{pt}</span>
            </li>
          ) : null)}
        </ul>
      </div>
    </motion.div>
  );
};

// ─── Section block ────────────────────────────────────────────────────────────
const SectionBlock = ({ section }) => (
  <motion.div
    className="mb-20 w-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-center w-full">
      <h2 className="text-4xl font-extrabold mb-12 text-white drop-shadow-lg text-center tracking-tight">
        {section.title}
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
      {section.data.slice(0, 3).map((item, i) => (
        <SectionCard key={i} item={item} category={section.id} index={i} />
      ))}
    </div>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
// NEW: Accept 'language' as a prop
const StateDetail = ({ language }) => {
  const { stateName }         = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const isDark                = useIsDark();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        // NEW: Pass both stateName and language to the API
        const result = await fetchStateData(stateName, language);
        if (!cancelled) setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [stateName, language]); // NEW: Re-run if language changes!

  if (loading) return <div className="mt-8"><SkeletonLoader /></div>;
  if (!data)   return null;

  // NEW: Translate headers based on the language prop
  const sections = [
    { id: 'issues',   title: language === 'hi' ? '🚨 वर्तमान मुद्दे' : '🚨 Current Issues',        data: data.issues   ?? [] },
    { id: 'politics', title: language === 'hi' ? '🏛️ राजनीतिक अवलोकन' : '🏛️ Political Overview',    data: data.politics ?? [] },
    { id: 'crime',    title: language === 'hi' ? '⚖️ अपराध अंतर्दृष्टि' : '⚖️ Crime Insights',        data: data.crime    ?? [] },
    { id: 'positive', title: language === 'hi' ? '📈 सकारात्मक विकास' : '📈 Positive Developments', data: data.positive ?? [] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center px-4 md:px-10 pb-24"
    >
      <div className="mb-12 border-b border-white/20 pb-6 text-center w-full max-w-[1100px]">
       <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          // ADDED text-white to the end, removed the inline style tag!
          className="text-5xl font-extrabold tracking-tight drop-shadow-2xl text-white"
        >
          {data.title}
        </motion.h1>
      </div>

      <div className="w-full flex flex-col items-center">
        {sections.map(s =>
          s.data.length > 0 ? <SectionBlock key={s.id} section={s} /> : null
        )}
      </div>
      {/* ADD THE CHATBOT HERE */}
      <ChatBot stateName={data.title} language={language} />
    </motion.div>
  );
};

export default StateDetail;