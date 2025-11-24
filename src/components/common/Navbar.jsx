import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, User, Heart, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

// Import Logo
import Logo from '../../assets/logo.png'; 

export const Navbar = ({ cartCount, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize hook

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
      
      <div className="w-full bg-[#B08D55] text-white text-center py-2.5 px-4 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em]">
        Welcome to Pahnawa Banaras • Tradition Woven in Silk
      </div>

      <div className="px-4 py-2 md:px-8 flex items-center justify-between h-24 relative">
        
        <button 
          className="md:hidden text-gray-800 w-1/3 flex justify-start"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        <div className="hidden md:flex items-center gap-8 text-gray-500 w-1/3 pl-4">
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#B08D55] transition text-xs font-bold uppercase tracking-wider">
            <span>INR</span> <ChevronDown size={12} />
          </div>
          {/* Link Search Icon */}
          <Search 
            size={22} 
            className="cursor-pointer hover:text-[#B08D55] transition" 
            onClick={() => navigate('/search')}
          />
        </div>

        <Link to="/" className="w-1/3 flex justify-center items-center h-full z-50 overflow-visible">
          <img 
            src={Logo} 
            alt="Pahnawa Banaras" 
            className="h-32 md:h-48 object-contain transition-transform duration-500 hover:scale-105 drop-shadow-lg -mt-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="hidden text-center" style={{display: 'none'}}>
             <h1 className="font-serif text-4xl font-bold text-[#B08D55] tracking-tight">Pahnawa</h1>
             <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mt-1">Banaras</p>
          </div>
        </Link>

        <div className="flex items-center justify-end gap-6 text-gray-500 w-1/3 pr-4">
          {/* --- UPDATED USER ICON --- */}
          <User 
            size={22} 
            className="hidden md:block cursor-pointer hover:text-[#B08D55] transition" 
            onClick={() => navigate('/profile')} 
          />
          
          {/* --- UPDATED HEART ICON --- */}
          <Heart 
            size={22} 
            className="hidden md:block cursor-pointer hover:text-[#B08D55] transition" 
            onClick={() => navigate('/favorites')} 
          />
          
          <div className="relative cursor-pointer" onClick={onOpenCart}>
            <ShoppingBag size={22} className="hover:text-[#B08D55] transition" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#B08D55] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col h-screen shadow-2xl"
          >
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <img src={Logo} alt="Logo" className="h-16 object-contain" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            <div className="p-8 flex flex-col gap-8 overflow-y-auto">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-serif text-gray-900 border-b border-gray-50 pb-3 flex justify-between items-center"
                >
                  {item.name}
                  <ChevronDown size={18} className="-rotate-90 text-gray-300" />
                </Link>
              ))}
              {/* Mobile Profile Links */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif text-gray-600">My Account</Link>
                <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif text-gray-600">Wishlist</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};