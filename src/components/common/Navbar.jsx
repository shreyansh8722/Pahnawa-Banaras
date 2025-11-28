import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User, Heart, X, ChevronRight, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Corrected Relative Imports
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { SmartSearch } from './SmartSearch';
import Logo from '../../assets/logo.png';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { favorites } = useFavorites();
  const favCount = favorites ? favorites.length : 0;

  // --- MEGA MENU CONFIGURATION ---
  const NAV_ITEMS = [
    { 
      name: 'Sarees', 
      link: '/shop?cat=saree',
      subCategories: [
        { name: 'Banarasi Silk', link: '/shop?cat=saree&type=silk' },
        { name: 'Katan Silk', link: '/shop?cat=saree&type=katan' },
        { name: 'Georgette', link: '/shop?cat=saree&type=georgette' },
        { name: 'Organza', link: '/shop?cat=saree&type=organza' },
      ],
      image: 'https://images.unsplash.com/photo-1610189012906-47833d772097?w=500&q=80'
    },
    { 
      name: 'Lehengas', 
      link: '/shop?cat=lehenga',
      subCategories: [
        { name: 'Bridal', link: '/shop?cat=lehenga&type=bridal' },
        { name: 'Party Wear', link: '/shop?cat=lehenga&type=party' },
        { name: 'Traditional', link: '/shop?cat=lehenga&type=traditional' },
      ],
      image: 'https://images.unsplash.com/photo-1583391726247-e29237d8612f?w=500&q=80'
    },
    { 
      name: 'Suits', 
      link: '/shop?cat=suit',
      subCategories: [
        { name: 'Unstitched Suits', link: '/shop?cat=suit&type=unstitched' },
        { name: 'Ready to Wear', link: '/shop?cat=suit&type=ready' },
        { name: 'Silk Suits', link: '/shop?cat=suit&type=silk' },
      ],
      image: 'https://images.unsplash.com/photo-1605902394263-66869c466503?w=500&q=80'
    },
    { 
      name: 'Dupattas', 
      link: '/shop?cat=dupatta',
      subCategories: [
        { name: 'Banarasi Dupatta', link: '/shop?cat=dupatta&type=banarasi' },
        { name: 'Silk Dupatta', link: '/shop?cat=dupatta&type=silk' },
        { name: 'Bridal Odhani', link: '/shop?cat=dupatta&type=bridal' },
      ],
      image: 'https://images.unsplash.com/photo-1621623194266-4b3664963684?w=500&q=80'
    },
  ];

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleProfileClick = () => {
    if (user) navigate('/profile');
    else navigate('/login');
    setMobileMenuOpen(false);
  };

  // Helper to safely set active menu
  const handleMouseEnter = (item) => {
    if (item.subCategories) {
      setActiveMegaMenu(item.name);
    } else {
      setActiveMegaMenu(null); // Close menu if hovering an item without dropdown
    }
  };

  return (
    <>
      <div 
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-gray-100/50" 
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        
        {/* Infinite Marquee */}
        <div className="w-full bg-[#B08D55] text-white overflow-hidden py-2.5 relative flex items-center h-10">
           <motion.div 
             className="flex whitespace-nowrap min-w-full"
             animate={{ x: ["0%", "-50%"] }}
             transition={{ duration: 25, ease: "linear", repeat: Infinity }}
           >
             {[1, 2].map((key) => (
               <div key={key} className="flex items-center gap-8 px-4">
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Free Shipping on Prepaid</span>
                  <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Worldwide Delivery</span>
                  <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Silk Mark Certified</span>
                  <span className="w-1 h-1 bg-white/50 rounded-full"></span>
               </div>
             ))}
           </motion.div>
        </div>

        {/* Main Bar */}
        <div className="px-4 md:px-8 h-16 md:h-20 flex items-center justify-between relative">
          <div className="flex items-center gap-4 w-1/3">
              <button className="md:hidden p-2 -ml-2 text-gray-800" onClick={() => setMobileMenuOpen(true)}>
                  <Menu size={24} strokeWidth={1.5} />
              </button>
              <button className="md:hidden p-2 text-gray-800" onClick={() => setShowMobileSearch(!showMobileSearch)}>
                  <Search size={22} strokeWidth={1.5} />
              </button>
              <div className="hidden md:block w-full max-w-xs"><SmartSearch /></div>
          </div>

          <Link to="/" className="flex-1 flex justify-center items-center">
            <img src={Logo} alt="Pahnawa Banaras" className="h-40 md:h-50 object-contain" />
          </Link>

          <div className="flex items-center justify-end gap-1 md:gap-4 w-1/3">
            <button onClick={handleProfileClick} className="hidden md:flex flex-col items-center justify-center p-2 text-gray-800 hover:text-[#B08D55] transition-colors">
              <User size={22} strokeWidth={1.5} />
            </button>
            <button onClick={() => navigate('/favorites')} className="p-2 text-gray-800 hover:text-[#B08D55] transition-colors relative">
              <Heart size={22} strokeWidth={1.5} />
              {favCount > 0 && <span className="absolute top-1 right-0.5 w-2 h-2 bg-[#B08D55] rounded-full border border-white" />}
            </button>
            <button onClick={openCart} className="p-2 text-gray-800 hover:text-[#B08D55] transition-colors relative">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-[#B08D55] text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Navigation */}
        <div className="hidden md:flex justify-center pb-0 relative">
          <div className="flex gap-10">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item.name} 
                className="py-4" 
                onMouseEnter={() => handleMouseEnter(item)}
              >
                <Link
                  to={item.link}
                  className={`text-[11px] uppercase tracking-[0.2em] font-medium hover:text-[#B08D55] transition-colors pb-4 border-b-2 border-transparent hover:border-[#B08D55] ${
                    (location.pathname + location.search === item.link) || (activeMegaMenu === item.name) 
                    ? 'text-[#B08D55] border-[#B08D55]' 
                    : 'text-gray-600'
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl z-30 py-8 px-12 flex justify-center"
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              {NAV_ITEMS.map(item => item.name === activeMegaMenu && item.subCategories && (
                <div key={item.name} className="flex max-w-5xl w-full justify-between gap-12">
                   {/* Left: Links */}
                   <div className="flex-1">
                      <h4 className="font-serif text-2xl mb-6 text-gray-900">{item.name} Collection</h4>
                      <ul className="space-y-3">
                         {item.subCategories.map(sub => (
                           <li key={sub.name}>
                             <Link 
                               to={sub.link} 
                               onClick={() => setActiveMegaMenu(null)}
                               className="text-sm text-gray-500 hover:text-[#B08D55] hover:pl-2 transition-all block"
                             >
                               {sub.name}
                             </Link>
                           </li>
                         ))}
                         <li className="mt-6 pt-4 border-t border-gray-100">
                           <Link 
                             to={item.link} 
                             onClick={() => setActiveMegaMenu(null)}
                             className="text-xs font-bold uppercase tracking-widest text-[#B08D55] flex items-center gap-2 hover:gap-3 transition-all"
                           >
                             View All {item.name} <ArrowRightIcon size={14}/>
                           </Link>
                         </li>
                      </ul>
                   </div>
                   
                   {/* Right: Featured Image */}
                   <div className="w-80 h-56 rounded-sm overflow-hidden relative group">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                        Featured
                      </div>
                   </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
               <div className="p-4"><SmartSearch mobile={true} onClose={() => setShowMobileSearch(false)} /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-y-0 left-0 z-[100] bg-white w-[85%] max-w-sm shadow-2xl flex flex-col">
              <div className="p-5 flex justify-end items-center"><button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-800"><X size={20} /></button></div>
              <div className="flex-1 overflow-y-auto px-6 py-2 space-y-10">
                  <div>
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Collection</h3>
                      <div className="flex flex-col space-y-5">
                        {NAV_ITEMS.map((item) => (
                          <div key={item.name}>
                             <Link to={item.link} onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif text-gray-900 flex justify-between items-center group">
                                {item.name} <ChevronRight size={16} className="text-gray-300" />
                             </Link>
                          </div>
                        ))}
                      </div>
                  </div>
                  <div>
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">My Account</h3>
                      {user ? (
                        <div className="space-y-4">
                           <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-gray-600"><User size={18} /> Profile</Link>
                           <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-sm text-red-500 pt-2"><LogOut size={18} /> Logout</button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                           <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-900"><User size={18} /> Login / Register</Link>
                        </div>
                      )}
                  </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Simple Arrow Icon Component
const ArrowRightIcon = ({size}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;