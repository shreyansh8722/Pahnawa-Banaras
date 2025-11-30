import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, Heart, Search, X, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../assets/logo.png';
import { SearchPopup } from './SearchPopup';

// --- MENU DATA ---
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
  }
};

export const Navbar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const timeoutRef = useRef(null);
  const { cartCount, openCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  // --- SCROLL ENGINE ---
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    setActiveCategory(null);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = (category) => {
    if (scrolled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 100);
  };

  const handleNavigate = (cat, subCat) => {
    setActiveCategory(null);
    setMenuOpen(false);
    navigate(`/shop?cat=${cat.toLowerCase()}&sub=${subCat?.toLowerCase() || ''}`);
  };

  return (
    <>
      {/* 1. BACKDROP SCRIM */}
      <AnimatePresence>
        {(activeCategory || menuOpen) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => { setActiveCategory(null); setMenuOpen(false); }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[40]"
          />
        )}
      </AnimatePresence>

      {/* 2. NAVBAR CONTAINER */}
      <header className="fixed top-0 left-0 w-full z-[50] flex flex-col shadow-sm transition-all duration-300 bg-heritage-paper">
        
        {/* --- A. ANNOUNCEMENT BAR (Top) --- */}
        <AnimatePresence>
            {showAnnouncement && !scrolled && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full bg-[#43302b] text-white relative z-[61] overflow-hidden"
                >
                    <div className="w-full max-w-[1800px] mx-auto px-6 py-2.5 flex justify-center items-center relative">
                        <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-center truncate">
                            Free shipping in India | Free worldwide shipping above ₹25,000
                        </p>
                        <button 
                            onClick={() => setShowAnnouncement(false)} 
                            className="absolute right-6 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- B. LOGO & ICONS ROW (White Background) --- 
            FIXED: 
            1. Removed 'py-5' padding dependency.
            2. Added explicit height classes: 'h-[80px]' (unscrolled) vs 'h-[60px]' (scrolled).
            3. Logo is now ABSOLUTE centered.
        */}
        <div 
            className={`w-full bg-heritage-paper z-[60] relative transition-[height, border] duration-300 ease-in-out ${
                scrolled ? 'h-[60px] border-b border-[#E5E0D8]/40' : 'h-[80px]'
            }`}
        >
            <div className="w-full h-full px-6 md:px-12 max-w-[1800px] mx-auto flex items-center justify-between relative">
            
                {/* LEFT: Menu & Search */}
                <div className="flex items-center gap-6 z-20">
                    <button 
                        onClick={() => setMenuOpen(true)}
                        className={`flex items-center gap-3 group transition-all duration-300 ${
                            scrolled 
                            ? 'opacity-100 translate-x-0 pointer-events-auto' 
                            : 'opacity-0 -translate-x-4 pointer-events-none lg:hidden'
                        }`}
                    >
                        <Menu size={20} strokeWidth={1.5} className="text-heritage-charcoal group-hover:text-heritage-gold transition-colors" />
                        <span className="hidden lg:block text-[10px] uppercase tracking-[0.2em] font-medium text-heritage-charcoal">Menu</span>
                    </button>
                    <button onClick={() => setMenuOpen(true)} className={`lg:hidden -ml-6 ${scrolled ? 'hidden' : 'block'}`}>
                        <Menu size={24} strokeWidth={1.5} className="text-heritage-charcoal" />
                    </button>
                    <button onClick={() => setSearchOpen(true)} className="group flex items-center gap-2">
                        <Search size={18} strokeWidth={1.5} className="text-heritage-charcoal group-hover:text-heritage-gold transition-colors" />
                        <span className={`hidden lg:block text-[10px] uppercase tracking-[0.2em] text-heritage-charcoal/60 group-hover:text-heritage-charcoal transition-all duration-300 ${scrolled ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>Search</span>
                    </button>
                </div>

                {/* CENTER: LOGO - ABSOLUTE POSITIONED 
                    You can change 'h-24' to 'h-32' or 'h-40' and the navbar will NOT expand.
                */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <Link to="/" className="flex items-center justify-center">
                        <img 
                            src={Logo} 
                            alt="Pahnawa" 
                            className={`object-contain transition-all duration-300 ease-in-out ${
                                scrolled ? 'h-20' : 'h-24' 
                            }`} 
                        />
                    </Link>
                </div>

                {/* RIGHT: Icons */}
                <div className="flex justify-end items-center gap-6 text-heritage-charcoal z-20">
                    <Link to={user ? "/profile" : "/login"} className="hidden md:block hover:text-heritage-gold transition-colors">
                        <User size={20} strokeWidth={1.5} />
                    </Link>
                    <button onClick={() => navigate('/favorites')} className="hidden md:block hover:text-heritage-gold transition-colors">
                        <Heart size={20} strokeWidth={1.5} />
                    </button>
                    <button onClick={openCart} className="relative hover:text-heritage-gold transition-colors">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-heritage-gold text-white text-[9px] h-4 w-4 flex items-center justify-center rounded-full">
                            {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* --- C. MENU ROW (Beige Background) --- */}
        <div 
            className={`hidden lg:block w-full bg-[#f4f1ea] border-y border-[#E5E0D8]/60 transition-all duration-300 ease-in-out overflow-hidden ${
                scrolled ? 'max-h-0 opacity-0 border-none' : 'max-h-[52px] opacity-100'
            }`}
            onMouseLeave={handleMouseLeave}
        >
            <div className="w-full flex justify-center items-center h-[52px]">
                <div className="flex gap-16 items-center h-full">
                    {Object.keys(MENU_STRUCTURE).map((cat) => (
                    <div 
                        key={cat} 
                        onMouseEnter={() => handleMouseEnter(cat)}
                        className="relative group cursor-pointer h-full flex items-center"
                    >
                        <span 
                            onClick={() => handleNavigate(cat, '')}
                            className={`text-[12px] font-sans uppercase tracking-[0.2em] transition-colors duration-200 ${
                                activeCategory === cat ? 'text-heritage-gold' : 'text-heritage-charcoal group-hover:text-heritage-gold'
                            }`}
                        >
                            {cat}
                        </span>
                        
                        {/* Underline Bar */}
                        <span className={`absolute bottom-0 left-0 h-[2px] bg-heritage-gold transition-all duration-300 ${activeCategory === cat ? 'w-full' : 'w-0'}`}></span>
                    </div>
                    ))}
                    
                    <Link 
                        to="/about" 
                        onMouseEnter={() => setActiveCategory(null)}
                        className="text-[12px] font-sans uppercase tracking-[0.2em] text-heritage-charcoal group-hover:text-heritage-gold transition-colors"
                    >
                        Our Story
                    </Link>
                </div>
            </div>
        </div>

        {/* --- MEGA MENU DROPDOWN --- */}
        <AnimatePresence>
          {activeCategory && !scrolled && MENU_STRUCTURE[activeCategory] && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => handleMouseEnter(activeCategory)}
              onMouseLeave={handleMouseLeave}
              className="absolute top-full left-0 w-full bg-heritage-paper z-40 border-b border-heritage-border shadow-xl"
            >
              <div className="container mx-auto px-20 py-14 flex min-h-[380px]">
                <div className="flex-1 flex gap-24 border-r border-heritage-border/60 pr-20">
                  {Object.entries(MENU_STRUCTURE[activeCategory].sections).map(([subHeader, items]) => (
                    <div key={subHeader}>
                      <h4 className="font-serif italic text-xl text-heritage-gold mb-6">{subHeader}</h4>
                      <ul className="space-y-3">
                        {items.map(item => (
                          <li key={item}>
                             <button 
                               onClick={() => handleNavigate(activeCategory, item)}
                               className="text-[13px] font-light text-heritage-charcoal/80 hover:text-heritage-charcoal hover:translate-x-1 transition-all duration-200 block py-0.5"
                             >
                               {item}
                             </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="w-[350px] pl-20">
                   <div className="w-full h-full relative group overflow-hidden bg-heritage-sand">
                      <img 
                        src={MENU_STRUCTURE[activeCategory].image} 
                        alt="Featured" 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                      <div className="absolute bottom-8 left-8 text-white z-10">
                        <span className="block text-[10px] uppercase tracking-widest mb-3 opacity-90">Featured Collection</span>
                        <h3 className="font-serif italic text-3xl">{activeCategory}</h3>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. SIDE DRAWER (Mobile) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-[85%] md:w-[450px] bg-heritage-paper z-[150] shadow-2xl overflow-y-auto border-r border-heritage-border"
          >
             <div className="flex justify-between items-center p-8 sticky top-0 bg-heritage-paper/95 backdrop-blur z-10 border-b border-heritage-border">
                <span className="font-serif italic text-3xl text-heritage-charcoal">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="p-2 -mr-2 text-heritage-charcoal hover:rotate-90 transition-transform duration-300">
                  <X size={26} strokeWidth={1} />
                </button>
             </div>
             <div className="px-8 py-8 space-y-8">
                {Object.keys(MENU_STRUCTURE).map((cat, i) => (
                  <motion.div key={cat} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + (i * 0.05) }}>
                    <div onClick={() => { handleNavigate(cat, ''); }} className="group cursor-pointer">
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-3xl font-serif text-heritage-charcoal group-hover:text-heritage-gold group-hover:pl-4 transition-all duration-200">{cat}</span>
                        <ChevronRight size={18} className="text-heritage-grey opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide opacity-60">
                        {Object.values(MENU_STRUCTURE[cat].sections)[0].slice(0, 3).map(sub => (
                           <span key={sub} className="text-[10px] uppercase tracking-widest border border-heritage-charcoal/20 px-3 py-1 rounded-full">{sub}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="w-full h-[1px] bg-heritage-charcoal/10 my-6"></div>
                <div className="space-y-4">
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-heritage-charcoal hover:text-heritage-gold transition-colors font-medium"><User size={18} /> Account</Link>
                  <Link to="/favorites" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-heritage-charcoal hover:text-heritage-gold transition-colors font-medium"><Heart size={18} /> Wishlist</Link>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchPopup isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* 4. SPACER - CALCULATED 
          Unscrolled: Announcement (36px) + WhiteRow (80px) + MenuRow (52px) = 168px
          Scrolled: WhiteRow (60px)
      */}
      <div className={`transition-all duration-300 ease-in-out ${scrolled ? 'h-[60px]' : (showAnnouncement ? 'h-[168px]' : 'h-[132px]')}`}></div>
    </>
  );
};