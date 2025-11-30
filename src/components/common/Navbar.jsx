import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, Heart, Search, X, ChevronRight, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../assets/logo.png';
import { SearchPopup } from './SearchPopup';

// --- 1. LUXURY DATA STRUCTURE ---
const MENU_STRUCTURE = {
  "Sarees": {
    image: "https://images.unsplash.com/photo-1610189012906-47833d772097?auto=format&fit=crop&q=80",
    sections: {
      "By Fabric": ["Katan Silk", "Georgette", "Organza", "Tussar", "Munga Silk", "Tissue"],
      "By Technique": ["Kadhua", "Fekwa", "Tanchoi", "Jangla", "Meenakari", "Rangkaat"],
      "Occasion": ["Bridal", "Festive", "Cocktail", "Workwear", "Trousseau"]
    }
  },
  "Lehengas": {
    image: "https://images.unsplash.com/photo-1583391726247-e29237d8612f?auto=format&fit=crop&q=80",
    sections: {
      "Collections": ["Bridal Handloom", "Contemporary", "Vintage Revival", "Light Lehengas"],
      "Fabric": ["Silk Brocade", "Organza", "Tissue", "Georgette"],
      "Color": ["Red & Maroon", "Pastels", "Gold & Silver", "Midnight Blue"]
    }
  },
  "Suits": {
    image: "https://images.unsplash.com/photo-1621623194266-4b3664963684?auto=format&fit=crop&q=80",
    sections: {
      "Type": ["Unstitched Sets", "Ready to Wear", "Kurta Fabrics", "Dupatta Sets"],
      "Fabric": ["Katan Silk", "Chanderi", "Cotton Silk", "Mongia"]
    }
  },
  "Dupattas": {
    image: "https://images.unsplash.com/photo-1596230529625-7eeeff6f1a8c?auto=format&fit=crop&q=80",
    sections: {
      "Style": ["Heavy Zari", "Light Border", "Butidar", "Jangla"],
      "Fabric": ["Silk", "Georgette", "Net", "Organza"]
    }
  },
  "Men": {
    image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80",
    sections: {
      "Wear": ["Sherwani Fabrics", "Kurta Fabrics", "Stoles & Shawls", "Jackets"],
      "Occasion": ["Groom", "Groomsmen", "Festive"]
    }
  }
};

// --- 2. TYPEWRITER SEARCH ---
const TypewriterSearch = ({ onClick }) => {
  const phrases = ["Search for Katan Silk...", "Search for Bridal Lehenga...", "Search for Handloom..."];
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 50 : 100;
    const timeout = setTimeout(() => {
      if (!isDeleting && text !== currentPhrase) setText(currentPhrase.slice(0, text.length + 1));
      else if (!isDeleting && text === currentPhrase) setTimeout(() => setIsDeleting(true), 2000);
      else if (isDeleting && text !== '') setText(currentPhrase.slice(0, text.length - 1));
      else if (isDeleting && text === '') { setIsDeleting(false); setPhraseIndex((prev) => (prev + 1) % phrases.length); }
    }, typeSpeed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  return (
    <button onClick={onClick} className="group relative flex items-center gap-3 bg-transparent border-b border-heritage-charcoal/20 py-2 w-56 lg:w-64 hover:border-heritage-charcoal transition-all duration-300">
      <Search size={16} className="text-heritage-charcoal opacity-70 group-hover:opacity-100" strokeWidth={1} />
      <span className="text-xs font-serif text-heritage-charcoal/80 tracking-widest whitespace-nowrap overflow-hidden flex-1 text-left">
        {text}<span className="animate-pulse ml-0.5 text-heritage-gold">|</span>
      </span>
    </button>
  );
};

export const Navbar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const timeoutRef = useRef(null);
  const { cartCount, openCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setActiveCategory(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Robust Hover Handlers
  const handleMouseEnter = (category) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
  };

  const handleNavigate = (cat, subCat) => {
    setActiveCategory(null);
    navigate(`/shop?cat=${cat.toLowerCase()}&sub=${subCat?.toLowerCase() || ''}`);
  };

  return (
    <>
      {/* SPACER: Pushes content down so Fixed Header doesn't cover it.
        Mobile Height: ~120px (Marquee + TopRow)
        Desktop Height: ~180px (Marquee + TopRow + BottomRow)
      */}
      <div className="h-[120px] md:h-[180px] w-full bg-heritage-paper"></div>

      {/* --- FIXED NAVBAR --- */}
      <header 
        className={`fixed top-0 left-0 w-full z-[100] bg-heritage-paper transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
        onMouseLeave={handleMouseLeave}
      >
        {/* 1. TOP MARQUEE */}
        <div className="bg-heritage-charcoal text-heritage-paper text-[9px] uppercase tracking-[0.25em] py-2.5 text-center relative z-[60]">
           <span className="animate-pulse">Complimentary Shipping on all Domestic Orders</span>
        </div>

        {/* 2. MAIN NAV CONTAINER */}
        <div className="flex flex-col w-full relative bg-heritage-paper">
          
          {/* UPPER ROW: Logo & Icons */}
          <div className="px-6 md:px-12 h-20 md:h-24 flex items-center justify-between border-b border-transparent">
            
            {/* Left: Mobile Menu & Search */}
            <div className="w-1/3 flex justify-start items-center gap-4">
               <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-1 -ml-1">
                 <Menu size={24} strokeWidth={1} className="text-heritage-charcoal" />
               </button>
               
               {/* Desktop Search */}
               <div className="hidden md:block">
                 <TypewriterSearch onClick={() => setSearchOpen(true)} />
               </div>
               
               {/* Mobile Search Icon */}
               <button onClick={() => setSearchOpen(true)} className="md:hidden">
                 <Search size={22} strokeWidth={1} className="text-heritage-charcoal" />
               </button>
            </div>

            {/* Center: Logo */}
            <Link to="/" className="w-1/3 flex justify-center">
              <img 
                src={Logo} 
                alt="Pahnawa Banaras" 
                className="h-60 md:h-60 object-contain transition-opacity hover:opacity-80" 
              />
            </Link>

            {/* Right: Icons */}
            <div className="flex w-1/3 justify-end items-center gap-4 md:gap-6 text-heritage-charcoal">
              <Link to={user ? "/profile" : "/login"} className="hidden md:block text-[10px] uppercase tracking-lux hover:text-heritage-gold transition-colors">
                {user ? "Account" : "Login"}
              </Link>
              <button onClick={() => navigate('/favorites')} className="hidden md:block hover:text-heritage-gold transition-colors">
                <Heart size={20} strokeWidth={1} />
              </button>
              <button onClick={openCart} className="relative hover:text-heritage-gold transition-colors flex items-center gap-2">
                <ShoppingBag size={22} strokeWidth={1} />
                <span className="hidden lg:inline text-[10px] uppercase tracking-lux">Bag ({cartCount})</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-heritage-gold md:hidden"></span>}
              </button>
            </div>
          </div>

          {/* LOWER ROW: Categories (Desktop Only) */}
          <div className="hidden md:flex justify-center items-center h-12 relative border-t border-heritage-border/30 bg-heritage-paper">
            <div className="flex gap-12 lg:gap-16 h-full items-center">
              {Object.keys(MENU_STRUCTURE).map((cat) => (
                <div 
                  key={cat} 
                  onMouseEnter={() => handleMouseEnter(cat)}
                  className="h-full flex items-center cursor-pointer relative group px-2"
                >
                   <span 
                     onClick={() => handleNavigate(cat, '')}
                     className={`text-[11px] font-serif uppercase tracking-[0.2em] transition-colors duration-300 ${
                       activeCategory === cat ? 'text-heritage-gold' : 'text-heritage-charcoal group-hover:text-heritage-gold'
                     }`}
                   >
                     {cat}
                   </span>
                   {/* Underline */}
                   <span className={`absolute bottom-0 left-0 h-[2px] bg-heritage-gold transition-all duration-300 ${activeCategory === cat ? 'w-full' : 'w-0'}`}></span>
                </div>
              ))}
              
              <div className="h-full flex items-center cursor-pointer relative group px-2">
                <Link 
                  to="/about" 
                  className="text-[11px] font-serif uppercase tracking-[0.2em] text-heritage-charcoal group-hover:text-heritage-gold transition-colors"
                >
                  Our Story
                </Link>
                <span className="absolute bottom-0 left-0 h-[2px] bg-heritage-gold transition-all duration-300 w-0 group-hover:w-full"></span>
              </div>
            </div>
          </div>

          {/* 3. MEGA MENU DROPDOWN */}
          <AnimatePresence>
            {activeCategory && MENU_STRUCTURE[activeCategory] && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => handleMouseEnter(activeCategory)}
                onMouseLeave={handleMouseLeave}
                className="absolute top-full left-0 w-full bg-heritage-paper border-t border-heritage-border shadow-xl z-50"
              >
                <div className="container mx-auto px-8 py-10 flex h-[400px]">
                  {/* Columns */}
                  <div className="flex-1 flex gap-16 border-r border-heritage-border/50 pr-8">
                    {Object.entries(MENU_STRUCTURE[activeCategory].sections).map(([subHeader, items]) => (
                      <div key={subHeader} className="flex flex-col gap-4">
                        <h4 className="font-serif italic text-lg text-heritage-gold mb-2">{subHeader}</h4>
                        <ul className="space-y-2">
                          {items.map(item => (
                            <li key={item}>
                               <button 
                                 onClick={() => handleNavigate(activeCategory, item)}
                                 className="text-sm font-light text-heritage-charcoal hover:text-heritage-gold hover:translate-x-1 transition-all text-left flex items-center gap-2 group"
                               >
                                 <span className="opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={10} /></span>
                                 {item}
                               </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {/* Featured Image */}
                  <div className="w-1/3 pl-12 h-full">
                     <div className="w-full h-full relative group overflow-hidden bg-heritage-sand">
                        <img 
                          src={MENU_STRUCTURE[activeCategory].image} 
                          alt="Featured" 
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                        <div className="absolute bottom-6 left-6 text-white">
                           <span className="block text-[10px] uppercase tracking-widest mb-1">Featured</span>
                           <h3 className="font-serif italic text-2xl">{activeCategory} Edit</h3>
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </header>

      {/* --- 4. MOBILE MENU OVERLAY (Updated with Profile/Wishlist) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-heritage-paper h-screen overflow-y-auto"
          >
             <div className="flex justify-between items-center p-6 border-b border-heritage-border bg-heritage-paper sticky top-0 z-10">
                <span className="font-serif italic text-2xl text-heritage-charcoal">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 text-heritage-charcoal">
                  <X size={28} strokeWidth={1} />
                </button>
             </div>
             
             <div className="p-8 space-y-6">
                {/* Categories */}
                {Object.keys(MENU_STRUCTURE).map(cat => (
                  <div 
                    key={cat} 
                    onClick={() => { handleNavigate(cat, ''); setMobileMenuOpen(false); }} 
                    className="flex justify-between items-center text-3xl font-serif italic text-heritage-charcoal cursor-pointer active:text-heritage-gold transition-colors"
                  >
                    {cat}
                    <ChevronRight size={20} className="text-heritage-border" />
                  </div>
                ))}
                
                <div className="w-16 h-[1px] bg-heritage-border my-8"></div>

                {/* Profile & Wishlist (Now Visible on Mobile) */}
                <div className="space-y-4">
                  <Link 
                    to={user ? "/profile" : "/login"} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 text-sm uppercase tracking-widest text-heritage-charcoal font-medium py-2"
                  >
                    <User size={18} />
                    {user ? "My Profile" : "Login / Register"}
                  </Link>
                  <Link 
                    to="/favorites" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 text-sm uppercase tracking-widest text-heritage-charcoal font-medium py-2"
                  >
                    <Heart size={18} />
                    Wishlist
                  </Link>
                </div>
             </div>

             <div className="bg-heritage-sand/30 p-8 mt-8">
                <div className="flex gap-6 opacity-60">
                  <a href="#" className="text-xs uppercase tracking-widest">Instagram</a>
                  <a href="#" className="text-xs uppercase tracking-widest">Facebook</a>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchPopup isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};