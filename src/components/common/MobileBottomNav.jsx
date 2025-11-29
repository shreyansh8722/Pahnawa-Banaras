import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const MobileBottomNav = () => {
  const { cartCount } = useCart();

  // Helper to determine active class
  const navClass = ({ isActive }) => 
    `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
      isActive ? 'text-[#B08D55]' : 'text-gray-400 hover:text-gray-600'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 px-2 safe-area-pb">
      <div className="flex justify-between items-center h-full max-w-md mx-auto">
        
        <NavLink to="/" className={navClass}>
          <Home size={20} strokeWidth={1.5} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </NavLink>

        <NavLink to="/search" className={navClass}>
          <Search size={20} strokeWidth={1.5} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Search</span>
        </NavLink>

        {/* Center Cart Button (Floating Effect) */}
        <div className="relative -top-5">
            <NavLink 
              to="/checkout" // Direct to checkout/cart
              className={({ isActive }) => `flex items-center justify-center w-14 h-14 rounded-full shadow-xl border-4 border-gray-50 transition-transform active:scale-95 ${isActive ? 'bg-[#B08D55] text-white' : 'bg-gray-900 text-white'}`}
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border border-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </NavLink>
        </div>

        <NavLink to="/favorites" className={navClass}>
          <Heart size={20} strokeWidth={1.5} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Wishlist</span>
        </NavLink>

        <NavLink to="/profile" className={navClass}>
          <User size={20} strokeWidth={1.5} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Account</span>
        </NavLink>

      </div>
    </div>
  );
};