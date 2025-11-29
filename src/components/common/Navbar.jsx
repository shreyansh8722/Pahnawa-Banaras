import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Heart, Search, X, Instagram, Facebook, Youtube } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { SearchPopup } from './SearchPopup';
import Logo from '../../assets/logo.png';

// --- TYPEWRITER SEARCH ---
const TypewriterSearch = ({ onClick }) => {
  const phrases = ["Search for Banarasi Saree...", "Search for Bridal Lehenga...", "Search for Silk Suits...", "Search for Heritage..."];
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 50 : 100; 
    const timeout = setTimeout(() => {
      if (!isDeleting && text !== currentPhrase) { setText(currentPhrase.slice(0, text.length + 1)); }
      else if (!isDeleting && text === currentPhrase) { setTimeout(() => setIsDeleting(true), 2000); }
      else if (isDeleting && text !== '') { setText(currentPhrase.slice(0, text.length - 1)); }
      else if (isDeleting && text === '') { setIsDeleting(false); setPhraseIndex((prev) => (prev + 1) % phrases.length); }
    }, typeSpeed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  return (
    <button onClick={onClick} className="group relative flex items-center gap-3 bg-transparent border-b border-heritage-charcoal/30 py-2 w-64 lg:w-72 hover:border-heritage-charcoal transition-all duration-300 overflow-hidden">
      <Search size={18} className="text-heritage-charcoal group-hover:scale-110 transition-transform duration-300 shrink-0" strokeWidth={1} />
      <span className="text-sm font-serif text-heritage-charcoal/80 tracking-wide whitespace-nowrap overflow-hidden flex-1 text-left">
        {text}<span className="animate-pulse ml-0.5 text-heritage-gold">|</span>
      </span>
    </button>
  );
};

// --- CATEGORY NAV ---
const CategoryNav = () => {
  const links = [
    { name: "Saree", path: "/shop?cat=saree" },
    { name: "Lehenga", path: "/shop?cat=lehenga" },
    { name: "Suit", path: "/shop?cat=suit" },
    { name: "Dupatta", path: "/shop?cat=dupatta" },
    { name: "Men", path: "/shop?cat=men" },
  ];
  return (
    <div className="hidden md:flex justify-center items-center gap-8 py-4 border-t border-heritage-border bg-heritage-paper">
      {links.map((link) => (
        <Link key={link.name} to={link.path} className="text-[11px] uppercase tracking-[0.2em] font-medium text-heritage-charcoal hover:text-heritage-gold transition-colors duration-300 relative group">
          {link.name}
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-heritage-gold transition-all duration-300 group-hover:w-full" />
        </Link>
      ))}
    </div>
  );
};

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount, openCart } = useCart();
  const { user } = useAuth();
  const { favorites } = useFavorites();

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* --- STICKY NAVBAR (Fixes White Gap) --- */}
      <div className="sticky top-0 z-50 bg-heritage-paper border-b border-heritage-border shadow-sm transition-all duration-300">
        
        {/* Marquee */}
        <div className="w-full bg-heritage-charcoal text-heritage-paper text-[9px] uppercase tracking-lux py-2 text-center relative z-10">
           <span>Complimentary Shipping on all Domestic Orders</span>
        </div>

        {/* Header Content */}
        <div className="px-6 md:px-12 h-20 md:h-24 flex items-center justify-between relative bg-heritage-paper z-50">
          <div className="flex w-1/3 justify-start items-center">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 hover:bg-heritage-sand rounded-full transition-colors">
              <Menu size={24} strokeWidth={1} className="text-heritage-charcoal" />
            </button>
            <div className="hidden md:block"><TypewriterSearch onClick={() => setSearchOpen(true)} /></div>
            <button className="md:hidden ml-4" onClick={() => setSearchOpen(true)}><Search size={22} strokeWidth={1} /></button>
          </div>

          <Link to="/" className="w-1/3 flex justify-center items-center">
            <img src={Logo} alt="Pahnawa" className="h-35 md:h-50 object-contain hover:opacity-80 transition-opacity" />
          </Link>

          <div className="flex w-1/3 justify-end items-center gap-6">
            <Link to={user ? "/profile" : "/login"} className="hidden md:block text-[10px] uppercase tracking-lux hover:underline decoration-1 underline-offset-4 text-heritage-charcoal">{user ? "Account" : "Login"}</Link>
            <button onClick={() => navigate('/favorites')} className="hidden md:block group">
               <Heart size={20} strokeWidth={1} className={favorites?.length > 0 ? "fill-heritage-charcoal text-heritage-charcoal" : "text-heritage-charcoal group-hover:fill-heritage-charcoal/20"} />
            </button>
            <button onClick={openCart} className="relative group flex items-center gap-2 text-heritage-charcoal">
              <ShoppingBag size={20} strokeWidth={1} />
              <span className="text-[10px] uppercase tracking-lux hidden md:inline group-hover:underline decoration-1 underline-offset-4">Bag ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <CategoryNav />
        
        {/* Search Popup */}
        <SearchPopup isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>

      {/* --- NO MORE SPACER DIV NEEDED --- */}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-heritage-paper flex flex-col"
          >
             <div className="flex justify-between items-center p-6 border-b border-heritage-border">
                <span className="text-xl font-serif italic text-heritage-charcoal">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-heritage-sand rounded-full transition-colors">
                  <X size={28} strokeWidth={1} className="text-heritage-charcoal" />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto py-12 px-8 flex flex-col gap-8 items-start">
                {['New Arrivals', 'Best Sellers'].map(item => (
                  <Link key={item} to={`/shop?sort=newest`} onClick={() => setMobileMenuOpen(false)} className="text-3xl md:text-4xl font-serif italic text-heritage-charcoal hover:text-heritage-gold transition-colors">
                    {item}
                  </Link>
                ))}
                <div className="w-12 h-[1px] bg-heritage-border my-2"></div>
                {['Saree', 'Lehenga', 'Suit', 'Dupatta', 'Men'].map(item => (
                  <Link key={item} to={`/shop?cat=${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-4xl md:text-5xl font-serif italic text-heritage-charcoal hover:text-heritage-gold transition-colors">
                    {item}
                  </Link>
                ))}
             </div>

             <div className="border-t border-heritage-border p-8 bg-heritage-sand/30">
                <div className="flex flex-col gap-4 mb-8">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs uppercase tracking-lux text-heritage-grey hover:text-heritage-charcoal">Login / Register</Link>
                  <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="text-xs uppercase tracking-lux text-heritage-grey hover:text-heritage-charcoal">Wishlist</Link>
                </div>
                <div className="flex gap-6 text-heritage-charcoal/60">
                  <a href="#" className="hover:text-heritage-charcoal transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
                  <a href="#" className="hover:text-heritage-charcoal transition-colors"><Facebook size={20} strokeWidth={1.5} /></a>
                  <a href="#" className="hover:text-heritage-charcoal transition-colors"><Youtube size={24} strokeWidth={1.5} /></a>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};