import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, User, Heart, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png'; 

export const Navbar = ({ cartCount, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', link: '/' },
    { name: 'Sarees', link: '/shop?cat=sarees' },
    { name: 'Lehengas', link: '/shop?cat=lehengas' },
    { name: 'Suits', link: '/shop?cat=suits' },
    { name: 'Dupattas', link: '/shop?cat=dupatta' },
    { name: 'Fabrics', link: '/shop?cat=fabrics' },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      
      {/* Top Bar - Smaller text on mobile */}
      <div className="w-full bg-[#B08D55] text-white text-center py-1.5 md:py-2.5 px-4 text-[9px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]">
        Welcome to Pahnawa Banaras • Tradition Woven in Silk
      </div>

      {/* Main Navbar - Responsive Height */}
      <div className="px-4 py-2 md:px-8 flex items-center justify-between h-16 md:h-24 relative">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-800 w-12 flex justify-start"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Desktop Left Actions */}
        <div className="hidden md:flex items-center gap-8 text-gray-500 w-1/3 pl-4">
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#B08D55] transition text-xs font-bold uppercase tracking-wider">
            <span>INR</span> <ChevronDown size={12} />
          </div>
          <Search 
            size={22} 
            className="cursor-pointer hover:text-[#B08D55] transition" 
            onClick={() => navigate('/search')}
          />
        </div>

        {/* Logo - Centered and properly sized */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:w-1/3 flex justify-center items-center z-50">
          <img 
            src={Logo} 
            alt="Pahnawa Banaras" 
            // CHANGED: Much smaller height on mobile (h-12) vs desktop (h-32)
            className="h-12 md:h-32 object-contain transition-transform duration-500 hover:scale-105 drop-shadow-md"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-4 md:gap-6 text-gray-500 w-auto md:w-1/3 md:pr-4">
           {/* Search visible on mobile too */}
           <Search 
            size={20} 
            className="md:hidden cursor-pointer text-gray-800" 
            onClick={() => navigate('/search')}
          />

          <User 
            size={22} 
            className="hidden md:block cursor-pointer hover:text-[#B08D55] transition" 
            onClick={() => navigate('/profile')} 
          />
          
          <Heart 
            size={22} 
            className="hidden md:block cursor-pointer hover:text-[#B08D55] transition" 
            onClick={() => navigate('/favorites')} 
          />
          
          <div className="relative cursor-pointer" onClick={onOpenCart}>
            <ShoppingBag size={22} className="hover:text-[#B08D55] text-gray-800 md:text-gray-500 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 md:w-5 md:h-5 bg-[#B08D55] text-white text-[9px] md:text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex justify-center py-4 border-t border-gray-100">
        <div className="flex gap-12">
          {navLinks.map((item) => (
            <Link 
              key={item.name} 
              to={item.link}
              className="text-xs uppercase tracking-[0.15em] font-bold text-gray-500 hover:text-[#B08D55] transition-all duration-300 border-b-2 border-transparent hover:border-[#B08D55] pb-1"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col h-screen shadow-2xl"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-100 h-16">
              <img src={Logo} alt="Logo" className="h-10 object-contain" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-20">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-serif text-gray-900 border-b border-gray-50 pb-3 flex justify-between items-center"
                >
                  {item.name}
                  <ChevronDown size={16} className="-rotate-90 text-gray-300" />
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-base font-serif text-gray-600 flex items-center gap-2"><User size={18}/> My Account</Link>
                <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="text-base font-serif text-gray-600 flex items-center gap-2"><Heart size={18}/> Wishlist</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};