import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User, Heart, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import Logo from '../../assets/logo.png'; 

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { cartCount, openCart } = useCart();
  const { favorites } = useFavorites();
  const favCount = favorites ? favorites.length : 0;

  // Precise Active State Logic for Gold Strip
  const isActive = (link) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;

    if (link === '/') return currentPath === '/' && !currentSearch;

    if (link.includes('?')) {
      const [linkPath, linkQueryString] = link.split('?');
      const linkParams = new URLSearchParams(linkQueryString);
      const currentParams = new URLSearchParams(currentSearch);
      // Check if path matches AND category param matches
      return currentPath === linkPath && linkParams.get('cat') === currentParams.get('cat');
    }
    
    return currentPath === link;
  };

  const navLinks = [
    { name: 'HOME', link: '/' },
    { name: 'SAREES', link: '/shop?cat=sarees' },
    { name: 'LEHENGAS', link: '/shop?cat=lehengas' },
    { name: 'DUPATTAS', link: '/shop?cat=dupatta' },
    { name: 'SUITS', link: '/shop?cat=suits' },
    { name: 'FABRICS', link: '/shop?cat=fabrics' },
    { name: 'COLLECTIONS', link: '/shop?cat=all' },
  ];

  const metaLinks = [
    { name: 'OUR STORY', link: '/about' },
    { name: 'CONTACT US', link: '/contact' },
  ];

  const tapAnimation = { scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 17 } };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      
      <div className="w-full bg-[#B08D55] text-white text-center py-1.5 md:py-2.5 px-4 text-[9px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]">
        Welcome to Pahnawa Banaras • Tradition Woven in Silk
      </div>

      <div className="px-4 py-2 md:px-8 flex items-center justify-between h-16 md:h-20 border-b border-gray-100 relative">
        
        <div className="flex items-center gap-3 md:gap-8 w-auto md:w-1/3">
            <motion.button whileTap={tapAnimation} className="md:hidden text-gray-800 p-1" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
            </motion.button>
            
            <motion.button whileTap={tapAnimation} className="text-gray-800 p-1" onClick={() => navigate('/search')}>
                <Search size={22} />
            </motion.button>
        </div>

        <Link to="/" className="md:hidden absolute left-1/2 -translate-x-1/2 flex justify-center items-center z-50">
            <motion.img whileTap={tapAnimation} src={Logo} alt="Pahnawa Banaras" className="h-35 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
        </Link>
        <Link to="/" className="hidden md:flex flex-1 justify-center items-center z-50">
          <motion.img whileHover={{ scale: 1.02 }} src={Logo} alt="Pahnawa Banaras" className="h-50 object-contain transition-transform duration-500" onError={(e) => { e.target.style.display = 'none'; }} />
        </Link>

        <div className="flex items-center justify-end gap-3 md:gap-6 w-1/3">
          <motion.button whileTap={tapAnimation} className="text-gray-800 p-1 hover:text-[#B08D55] transition" onClick={() => navigate('/profile')}>
            <User size={22} />
          </motion.button>
          
          <motion.div whileTap={tapAnimation} className="hidden md:block relative cursor-pointer p-1" onClick={() => navigate('/favorites')}>
            <Heart size={22} className="text-gray-500 hover:text-[#B08D55] transition" />
            {favCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">{favCount}</span>}
          </motion.div>

          <motion.div whileTap={tapAnimation} className="relative cursor-pointer p-1" onClick={openCart}>
            <ShoppingBag size={22} className="hover:text-[#B08D55] text-gray-800 transition" />
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#B08D55] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
          </motion.div>
        </div>
      </div>

      <div className="hidden md:flex justify-center py-4 border-t border-gray-100">
        <div className="flex gap-12">
          {navLinks.filter(l => l.name !== 'HOME').map((item) => {
            const active = isActive(item.link);
            return (
              <div key={item.name} className="relative flex flex-col items-center">
                <Link 
                  to={item.link} 
                  className={`text-xs uppercase tracking-[0.15em] font-bold transition-colors duration-300 pb-2 ${active ? 'text-black' : 'text-gray-500 hover:text-[#B08D55]'}`}
                >
                  {item.name}
                </Link>
                {active && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 w-full h-0.5 bg-[#B08D55]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "tween", duration: 0.3 }} className="fixed inset-0 z-[100] bg-white md:hidden flex flex-col h-screen shadow-2xl">
            <div className="p-4 flex justify-between items-center border-b border-gray-100 h-16">
              <img src={Logo} alt="Logo" className="h-35 object-contain" />
              <motion.button whileTap={tapAnimation} onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                <X size={20} className="text-gray-500" />
              </motion.button>
            </div>
            <div className="flex-grow flex flex-col overflow-y-auto pb-20">
              {navLinks.map((item) => (
                <Link 
                  key={item.name}
                  to={item.link} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={`text-base font-medium py-5 px-6 border-b border-gray-100 flex justify-between items-center ${isActive(item.link) ? 'text-[#B08D55] bg-gray-50' : 'text-gray-900'}`}
                >
                  {item.name}
                  {isActive(item.link) && <ChevronDown size={18} className="text-[#B08D55]" />}
                </Link>
              ))}
              <div className="flex flex-col mt-4">
                {metaLinks.map((item) => (
                  <Link key={item.name} to={item.link} onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-gray-900 py-5 px-6 border-b border-gray-100 flex justify-between items-center">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};