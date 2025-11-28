import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User, Heart, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from '@/lib/firebase';
import { SmartSearch } from '@/components/common/SmartSearch'; 
import Logo from '../../assets/logo.png'; 

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const { cartCount, openCart } = useCart();
  const { favorites } = useFavorites();
  const favCount = favorites ? favorites.length : 0;

  const [announcement, setAnnouncement] = useState("Free Shipping on All Prepaid Orders • Worldwide Delivery Available");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'storefront'), (doc) => {
      if (doc.exists() && doc.data().announcement) {
        setAnnouncement(doc.data().announcement);
      }
    });
    return unsub;
  }, []);

  const isLinkActive = (link) => {
    return location.pathname + location.search === link;
  };

  const navLinks = [
    { name: 'SAREES', link: '/shop?cat=saree' },
    { name: 'LEHENGAS', link: '/shop?cat=lehenga' },
    { name: 'SUITS', link: '/shop?cat=suit' },
    { name: 'DUPATTAS', link: '/shop?cat=dupatta' },
    { name: 'FABRICS', link: '/shop?cat=fabric' },
  ];

  useEffect(() => {
    if (mobileMenuOpen) { document.body.style.overflow = 'hidden'; } 
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      
      {/* Top Strip */}
      <div className="w-full bg-[#B08D55] text-white text-center py-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.1em] truncate">
        {announcement}
      </div>

      {/* Main Bar */}
      <div className="px-4 md:px-8 flex items-center justify-between h-14 md:h-20 border-b border-gray-100 relative">
        
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-2 w-1/3">
            {/* Mobile Buttons */}
            <button className="md:hidden text-gray-800 p-1" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
            </button>
            <button className="md:hidden text-gray-800 p-1" onClick={() => setShowMobileSearch(!showMobileSearch)}>
                <Search size={22} strokeWidth={1.5} />
            </button>

            {/* Desktop Search */}
            <div className="hidden md:block w-full max-w-xs lg:max-w-md">
               <SmartSearch />
            </div>
        </div>

        {/* Center: Logo */}
        <Link to="/" className="flex-1 flex justify-center items-center z-50">
          <img 
            src={Logo} 
            alt="Pahnawa Banaras" 
            className="h-38 md:h-50 object-contain hover:scale-105 transition-transform duration-500" 
          />
        </Link>

        {/* Right: Actions (Profile, Wishlist, Cart) */}
        <div className="flex items-center justify-end gap-2 md:gap-6 w-1/3">
          
          
          
          {/* WISHLIST - Visible on Mobile now */}
          <button 
            className="relative text-gray-800 p-1 hover:text-[#B08D55] transition" 
            onClick={() => navigate('/favorites')}
          >
            <Heart size={22} strokeWidth={1.5} />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
                {favCount}
              </span>
            )}
          </button>

          {/* CART */}
          <button 
            className="relative text-gray-800 p-1 hover:text-[#B08D55] transition" 
            onClick={openCart}
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-gray-100 overflow-hidden bg-white absolute top-full left-0 w-full z-30"
          >
             <div className="p-4">
               <SmartSearch mobile={true} onClose={() => setShowMobileSearch(false)} />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Links */}
      <div className="hidden md:flex justify-center py-3.5 border-t border-gray-50 bg-white">
        <div className="flex gap-8 lg:gap-12">
          {navLinks.map((item) => {
            const active = isLinkActive(item.link);
            return (
              <Link
                key={item.name}
                to={item.link}
                className={`text-[11px] uppercase tracking-[0.15em] font-bold transition-all duration-300 border-b-2 pb-1 ${
                  active 
                    ? 'text-black border-black' 
                    : 'text-gray-500 border-transparent hover:text-[#B08D55] hover:border-[#B08D55]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
           <Link 
              to="/shop?cat=all" 
              className={`text-[11px] uppercase tracking-[0.15em] font-bold transition-all duration-300 border-b-2 pb-1 ${
                isLinkActive('/shop?cat=all') 
                  ? 'text-black border-black' 
                  : 'text-gray-500 border-transparent hover:text-[#B08D55]'
              }`}
            >
             View All
           </Link>
        </div>
      </div>
    </div>

    {/* Mobile Menu Drawer */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }} 
            transition={{ type: "tween", duration: 0.3 }} 
            className="fixed inset-y-0 left-0 z-[100] bg-white w-[85%] max-w-sm shadow-2xl flex flex-col h-full"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
              <img src={Logo} alt="Logo" className="h-35 object-contain" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto py-4">
              <div className="px-6 mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shop By Category</p>
                  <div className="space-y-1">
                    {navLinks.map((item) => {
                      const active = isLinkActive(item.link);
                      return (
                        <Link 
                          key={item.name}
                          to={item.link}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between py-3 text-sm font-medium border-b border-gray-50 ${active ? 'text-[#B08D55] font-bold' : 'text-gray-900'}`}
                        >
                          {item.name} <ChevronRight size={16} className="text-gray-300" />
                        </Link>
                      );
                    })}
                  </div>
              </div>
              
              <div className="px-6 pt-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account</p>
                  {/* Optional: You can keep these in the drawer as well for easier access */}
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md px-2 -mx-2">
                    <User size={18} /> My Profile
                  </Link>
                  
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md px-2 -mx-2">
                    <ShoppingBag size={18} /> Contact Us
                  </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};