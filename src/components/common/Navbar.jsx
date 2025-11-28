import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User, Heart, X, ChevronRight, LogOut, Phone, HelpCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { SmartSearch } from '@/components/common/SmartSearch';
import Logo from '../../assets/logo.png';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { favorites } = useFavorites();
  const favCount = favorites ? favorites.length : 0;

  // Navigation Links
  const navLinks = [
    { name: 'Sarees', link: '/shop?cat=saree' },
    { name: 'Lehengas', link: '/shop?cat=lehenga' },
    { name: 'Suits', link: '/shop?cat=suit' },
    { name: 'Dupattas', link: '/shop?cat=dupatta' },
  ];

  // Helper: Lock scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Helper: Handle Account Click
  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-gray-100/50">
        
        {/* --- 1. INFINITE SLIDESHOW (Marquee) --- */}
        <div className="w-full bg-[#B08D55] text-white overflow-hidden py-2.5 relative flex items-center h-10">
           {/* STRATEGY: We render the content TWICE in a flex row.
              We animate from x: 0% to x: -50%.
              Because the two halves are identical, the moment it hits -50%, it snaps back to 0% 
              instantly and invisibly, creating a perfect infinite loop.
           */}
           <motion.div 
             className="flex whitespace-nowrap min-w-full"
             animate={{ x: ["0%", "-50%"] }}
             transition={{ duration: 25, ease: "linear", repeat: Infinity }}
           >
             {/* CONTENT BLOCK 1 */}
             <div className="flex items-center gap-8 px-4">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Free Shipping on All Prepaid Orders</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Worldwide Delivery Available</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Certified Silk Mark</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
             </div>

             {/* CONTENT BLOCK 2 (DUPLICATE) */}
             <div className="flex items-center gap-8 px-4">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Free Shipping on All Prepaid Orders</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Worldwide Delivery Available</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Certified Silk Mark</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
             </div>
           </motion.div>
        </div>

        {/* --- MAIN NAVBAR --- */}
        <div className="px-4 md:px-8 h-16 md:h-20 flex items-center justify-between relative">
          
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center gap-4 w-1/3">
              <button 
                className="md:hidden p-2 -ml-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors" 
                onClick={() => setMobileMenuOpen(true)}
              >
                  <Menu size={24} strokeWidth={1.5} />
              </button>
              <button 
                className="md:hidden p-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors" 
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                  <Search size={22} strokeWidth={1.5} />
              </button>

              {/* Desktop Search */}
              <div className="hidden md:block w-full max-w-xs">
                 <SmartSearch />
              </div>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="flex-1 flex justify-center items-center">
            <img 
              src={Logo} 
              alt="Pahnawa Banaras" 
              className="h-40 md:h-50 object-contain" 
            />
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-1 md:gap-4 w-1/3">
            
            {/* Desktop: Account */}
            <button 
              onClick={handleProfileClick}
              className="hidden md:flex flex-col items-center justify-center p-2 text-gray-800 hover:text-[#B08D55] transition-colors"
            >
              <User size={22} strokeWidth={1.5} />
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => navigate('/favorites')}
              className="p-2 text-gray-800 hover:text-[#B08D55] transition-colors relative"
            >
              <Heart size={22} strokeWidth={1.5} />
              {favCount > 0 && (
                <span className="absolute top-1 right-0.5 w-2 h-2 bg-[#B08D55] rounded-full border border-white" />
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={openCart}
              className="p-2 text-gray-800 hover:text-[#B08D55] transition-colors relative"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#B08D55] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex justify-center pb-4">
          <div className="flex gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className={`text-[11px] uppercase tracking-[0.2em] font-medium hover:text-[#B08D55] transition-colors ${
                  location.pathname + location.search === item.link ? 'text-[#B08D55]' : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
               <div className="p-4">
                 <SmartSearch mobile={true} onClose={() => setShowMobileSearch(false)} />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- 2. CLEAN & AESTHETIC MOBILE DRAWER --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed inset-y-0 left-0 z-[100] bg-white w-[85%] max-w-sm shadow-2xl flex flex-col"
            >
              {/* Header: CLEAN - Just the Close Button (Zara Style) */}
              <div className="p-5 flex justify-end items-center">
                 <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 bg-gray-50 rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-2 space-y-10">
                  
                  {/* Section 1: Categories */}
                  <div>
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Collection</h3>
                      <div className="flex flex-col space-y-5">
                        {navLinks.map((item) => (
                          <Link 
                            key={item.name}
                            to={item.link}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xl font-serif text-gray-900 flex justify-between items-center group"
                          >
                            {item.name} 
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#B08D55] transition-colors" />
                          </Link>
                        ))}
                      </div>
                  </div>

                  {/* Section 2: Account (Dynamic) */}
                  <div>
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">My Account</h3>
                      
                      {user ? (
                        // LOGGED IN VIEW
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                              <div className="w-8 h-8 bg-[#B08D55] text-white rounded-full flex items-center justify-center font-serif">
                                {user.displayName ? user.displayName[0] : 'U'}
                              </div>
                              <p className="text-sm font-medium text-gray-900">Hi, {user.displayName || 'There'}</p>
                           </div>

                           <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-black">
                              <User size={18} /> Profile & Orders
                           </Link>
                           <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-black">
                              <Heart size={18} /> Wishlist <span className="text-xs text-gray-400">({favCount})</span>
                           </Link>
                           <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-sm text-red-500 hover:text-red-600 pt-2">
                              <LogOut size={18} /> Logout
                           </button>
                        </div>
                      ) : (
                        // GUEST VIEW
                        <div className="space-y-4">
                           <Link 
                             to="/login"
                             onClick={() => setMobileMenuOpen(false)}
                             className="flex items-center gap-3 text-sm font-medium text-gray-900 hover:text-[#B08D55]"
                           >
                              <User size={18} /> Login / Register
                           </Link>
                           <Link 
                             to="/favorites"
                             onClick={() => setMobileMenuOpen(false)}
                             className="flex items-center gap-3 text-sm font-medium text-gray-900 hover:text-[#B08D55]"
                           >
                              <Heart size={18} /> Wishlist
                           </Link>
                        </div>
                      )}
                  </div>

                  {/* Section 3: Help & Contact */}
                  <div>
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Help & Contact</h3>
                      <div className="space-y-4">
                        <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-black">
                           <Phone size={18} /> Contact Us
                        </Link>
                        <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-black">
                           <HelpCircle size={18} /> FAQs
                        </Link>
                         <Link to="/shipping" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-black">
                           <Package size={18} /> Shipping & Returns
                        </Link>
                      </div>
                  </div>
              </div>

              {/* Footer: Simple & Clean */}
              <div className="p-6 text-center border-t border-gray-50">
                 <p className="text-[10px] text-gray-300 tracking-widest uppercase">© 2025 Pahnawa Banaras</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};