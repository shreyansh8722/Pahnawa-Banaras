import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, User, Heart, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import Logo from '../../assets/logo.png'; 
import { CartModal } from '@/components/shop/CartModal';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Contexts
  const { cartCount, openCart } = useCart();
  const { favorites } = useFavorites();
  const favCount = favorites ? favorites.length : 0;

  const navLinks = [
    { name: 'HOME', link: '/' },
    { name: 'SAREES', link: '/shop?cat=sarees' },
    { name: 'LEHENGAS', link: '/shop?cat=lehengas' },
    { name: 'DUPATTAS', link: '/shop?cat=dupatta' },
    { name: 'SUITS', link: '/shop?cat=suits' },
    { name: 'FABRICS', link: '/shop?cat=fabrics' },
    { name: 'OUR COLLECTIONS', link: '/shop?cat=all' },
  ];

  const metaLinks = [
    { name: 'OUR STORY', link: '/about' },
    { name: 'CONTACT US', link: '/contact' },
  ];

  const tapAnimation = { scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 17 } };

  return (
    <>
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      
      <div className="w-full bg-[#B08D55] text-white text-center py-1.5 md:py-2.5 px-4 text-[9px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]">
        Welcome to Pahnawa Banaras • Tradition Woven in Silk
      </div>

      <div className="px-4 py-2 md:px-8 flex items-center justify-between h-16 md:h-20 border-b border-gray-100">
        
        <div className="flex items-center gap-3 md:gap-8 w-auto md:w-1/3">
            <motion.button whileTap={tapAnimation} className="md:hidden text-gray-800 p-1" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
            </motion.button>
            
            <motion.button whileTap={tapAnimation} className="text-gray-800 p-1" onClick={() => navigate('/search')}>
                <Search size={22} />
            </motion.button>
            
            <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-[#B08D55] transition text-xs font-bold uppercase tracking-wider">
                <span>INR</span> <ChevronDown size={12} />
            </div>
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
          {navLinks.filter(l => l.name !== 'HOME' && l.name !== 'OUR COLLECTIONS').map((item) => (
            <Link key={item.name} to={item.link} className="text-xs uppercase tracking-[0.15em] font-bold text-gray-500 hover:text-[#B08D55] transition-all duration-300 border-b-2 border-transparent hover:border-[#B08D55] pb-1">
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed inset-0 z-[100] bg-white md:hidden flex flex-col h-screen shadow-2xl">
            <div className="p-4 flex justify-between items-center border-b border-gray-100 h-16">
              <img src={Logo} alt="Logo" className="h-35 object-contain" />
              <motion.button whileTap={tapAnimation} onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                <X size={20} className="text-gray-500" />
              </motion.button>
            </div>
            <div className="flex-grow flex flex-col overflow-y-auto pb-20">
              {navLinks.map((item) => (
                <motion.div key={item.name} whileTap={{ backgroundColor: "#f3f4f6" }}>
                  <Link to={item.link} onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-gray-900 py-4 px-6 border-b border-gray-100 flex justify-between items-center">
                    {item.name}
                    <ChevronDown size={18} className="text-gray-400" />
                  </Link>
                </motion.div>
              ))}
              <div className="flex flex-col mt-4">
                {metaLinks.map((item) => (
                  <motion.div key={item.name} whileTap={{ backgroundColor: "#f3f4f6" }}>
                    <Link to={item.link} onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-gray-900 py-4 px-6 border-b border-gray-100 flex justify-between items-center">
                      {item.name}
                      <ChevronDown size={18} className="text-gray-400" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    {/* IMPORTANT: Global Cart Modal Mount */}
    <CartModal />
    </>
  );
};