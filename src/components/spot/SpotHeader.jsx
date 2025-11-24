import React, { useState, useEffect } from 'react'; // --- NEW: Added hooks ---
import { motion, AnimatePresence } from 'framer-motion'; // --- KEPT for bookmark ---
import { ArrowLeft, Bookmark, Share2, Check } from 'lucide-react';
// --- REMOVED useScrollDirection ---
import { useNavigate } from 'react-router-dom';

export const SpotHeader = ({
  spotName,
  onBack,
  onToggleFavorite,
  isFav,
  onShare,
  copied,
}) => {
  const navigate = useNavigate();
  // --- NEW: Simple state for scroll ---
  const [scrolled, setScrolled] = useState(false);

  // --- NEW: Lightweight scroll listener ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between gap-4 p-4">
      {/* Background blur (fades in on scroll with CSS) */}
      <div
        className={`absolute inset-0 bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800 transition-opacity ${
          scrolled ? 'opacity-100' : 'opacity-0' // --- CSS transition ---
        }`}
      />

      {/* Back Button */}
      <button // --- REMOVED motion ---
        onClick={() => navigate(-1)}
        className={`z-10 w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          scrolled
            ? 'bg-white/80 text-gray-900 dark:bg-gray-900/80 dark:text-white'
            : 'bg-black/40 text-white backdrop-blur-md'
        }`}
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Page Title (appears on scroll with CSS) */}
      <h1
        className={`absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-900 dark:text-white transition-opacity ${
          scrolled ? 'opacity-100' : 'opacity-0' // --- CSS transition ---
        }`}
      >
        {spotName}
      </h1>

      {/* Action Buttons */}
      <div className="z-10 flex gap-3">
        {/* --- BOOKMARK BUTTON (KEPT motion) --- */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggleFavorite}
          className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all ${
            scrolled
              ? 'bg-white/80 text-gray-900 dark:bg-gray-900/80 dark:text-white'
              : 'bg-black/40 text-white backdrop-blur-md'
          }`}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isFav ? 'filled' : 'empty'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'inline-block' }}
            >
              <Bookmark
                size={22}
                fill={isFav ? 'currentColor' : 'none'}
                strokeWidth={isFav ? 2 : 2}
              />
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <button // --- REMOVED motion ---
          onClick={onShare}
          className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-colors ${
            scrolled
              ? 'bg-white/80 text-gray-900 dark:bg-gray-900/80 dark:text-white'
              : 'bg-black/40 text-white backdrop-blur-md'
          }`}
          aria-label="Share spot"
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
        </button>
      </div>
    </header>
  );
};