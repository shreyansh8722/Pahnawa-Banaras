import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { LogOut, Package, MapPin, User as UserIcon, ChevronRight, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MyOrders } from '@/components/profile/MyOrders';

// --- TAB BUTTON COMPONENT ---
const TabButton = ({ active, onClick, icon: Icon, label, subtitle }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-6 transition-all duration-300 group border-b border-gray-50 last:border-0 ${
      active 
      ? 'bg-[#F7F5F2]' 
      : 'bg-white hover:bg-[#FDFBF9]'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-full ${active ? 'bg-heritage-charcoal text-white' : 'bg-gray-50 text-gray-400 group-hover:text-heritage-charcoal'} transition-colors`}>
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="text-left">
        <span className={`block text-xs font-bold uppercase tracking-widest ${active ? 'text-heritage-charcoal' : 'text-gray-500 group-hover:text-heritage-charcoal'}`}>
          {label}
        </span>
        {subtitle && <span className="text-[10px] text-gray-400 font-sans">{subtitle}</span>}
      </div>
    </div>
    {active && <ChevronRight size={14} className="text-heritage-charcoal" />}
  </button>
);

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white font-serif text-heritage-charcoal selection:bg-heritage-gold/20">
      <Navbar />
      
      {/* HEADER SECTION */}
      <div className="bg-[#F7F5F2] pt-32 pb-16 px-6 md:px-12 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-heritage-grey mb-3 block font-sans font-bold">
              My Account
            </span>
            <h1 className="text-4xl md:text-5xl italic font-light text-heritage-charcoal mb-2">
              Hello, {user.displayName?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-heritage-grey font-sans text-xs tracking-wide">
              {user.email}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-900/60 hover:text-red-800 transition-colors border-b border-transparent hover:border-red-800 pb-0.5"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* LEFT: NAVIGATION MENU */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden sticky top-32">
              <TabButton 
                active={activeTab === 'orders'} 
                onClick={() => setActiveTab('orders')} 
                icon={Package} 
                label="My Orders"
                subtitle="View & Manage Orders"
              />
              <TabButton 
                active={activeTab === 'track'} 
                onClick={() => navigate('/track-order')} 
                icon={Truck} 
                label="Track Order"
                subtitle="Live Shipment Status"
              />
              <TabButton 
                active={activeTab === 'addresses'} 
                onClick={() => setActiveTab('addresses')} 
                icon={MapPin} 
                label="Addresses"
                subtitle="Manage Shipping Info"
              />
              <TabButton 
                active={activeTab === 'account'} 
                onClick={() => setActiveTab('account')} 
                icon={UserIcon} 
                label="Settings"
                subtitle="Password & Details"
              />
            </div>
          </div>

          {/* RIGHT: DYNAMIC CONTENT */}
          <div className="lg:col-span-3 min-h-[500px]">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                
                {/* --- ORDERS TAB --- */}
                {activeTab === 'orders' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                      <h2 className="text-3xl font-serif italic text-heritage-charcoal">Order History</h2>
                      <button onClick={() => navigate('/shop')} className="text-xs uppercase font-bold tracking-widest text-heritage-gold hover:text-heritage-charcoal transition-colors">
                        Start Shopping
                      </button>
                    </div>
                    <MyOrders /> 
                  </div>
                )}

                {/* --- ADDRESSES TAB --- */}
                {activeTab === 'addresses' && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-serif italic text-heritage-charcoal border-b border-gray-100 pb-4">
                      Saved Addresses
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button className="h-48 border border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center gap-4 hover:border-heritage-gold hover:bg-[#FAF9F6] transition-all group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-heritage-gold transition-colors shadow-sm">
                          <MapPin size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-heritage-charcoal">
                          Add New Address
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* --- ACCOUNT TAB --- */}
                {activeTab === 'account' && (
                  <div className="max-w-xl">
                    <h2 className="text-3xl font-serif italic text-heritage-charcoal border-b border-gray-100 pb-4 mb-8">
                      Account Settings
                    </h2>
                    
                    <form className="space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">First Name</label>
                          <input type="text" defaultValue={user.displayName?.split(' ')[0]} className="w-full border-b border-gray-200 py-3 font-sans text-sm focus:border-heritage-gold outline-none bg-transparent" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Last Name</label>
                          <input type="text" defaultValue={user.displayName?.split(' ')[1]} className="w-full border-b border-gray-200 py-3 font-sans text-sm focus:border-heritage-gold outline-none bg-transparent" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                        <input type="email" defaultValue={user.email} disabled className="w-full border-b border-gray-200 py-3 font-sans text-sm text-gray-400 bg-transparent cursor-not-allowed" />
                      </div>

                      <div className="pt-4">
                        <button className="bg-heritage-charcoal text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-heritage-gold transition-all duration-300 shadow-md">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}