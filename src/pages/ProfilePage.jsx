import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MyOrders } from '@/components/profile/MyOrders'; 
import { LogOut, User, Package, MapPin, Heart, Settings, ChevronRight, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '@/components/SEO';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'addresses'

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const TabButton = ({ id, label, icon: Icon, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 text-sm font-medium transition-all duration-200 border-l-2 group ${
         activeTab === id 
         ? 'bg-[#701a1a] text-white border-[#701a1a] shadow-md' 
         : 'bg-white text-[#2D2424] border-transparent hover:bg-[#F4F1EA] hover:pl-7'
      }`}
    >
       <div className="flex items-center gap-3">
          <Icon size={18} className={activeTab === id ? "text-[#C5A059]" : "text-[#6B6060] group-hover:text-[#2D2424]"} />
          <span>{label}</span>
       </div>
       {activeTab === id && <ChevronRight size={14} className="text-[#C5A059]" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2424] font-sans selection:bg-[#C5A059] selection:text-white">
      <SEO title="My Account - Pahnawa Banaras" />

      {/* NAVBAR REMOVED - Handled by Layout */}

      <div className="pt-8 pb-20 px-4 md:px-12 max-w-[1400px] mx-auto animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-[#E6DCCA]/60 pb-8 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#F4F1EA] border-2 border-[#C5A059] flex items-center justify-center text-[#701a1a] text-3xl font-serif font-bold shadow-sm relative">
                 {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User size={32} />}
                 <div className="absolute bottom-0 right-0 bg-[#2D2424] p-1.5 rounded-full border border-white cursor-pointer hover:scale-110 transition-transform">
                    <Edit2 size={10} className="text-white" />
                 </div>
              </div>
              <div>
                 <h1 className="font-display text-3xl md:text-4xl text-[#2D2424] mb-1">
                    Hello, {user.displayName || 'Guest'}
                 </h1>
                 <p className="text-sm text-[#6B6060] font-serif italic">{user.email}</p>
                 <div className="flex gap-2 mt-2">
                    <span className="text-[9px] uppercase tracking-widest bg-[#C5A059]/10 text-[#701a1a] px-2 py-0.5 rounded-sm font-bold border border-[#C5A059]/20">
                        Royal Member
                    </span>
                 </div>
              </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-800 hover:bg-red-50 px-5 py-2.5 rounded-sm transition-colors border border-red-100/50 hover:border-red-200"
           >
             <LogOut size={16} /> Sign Out
           </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
           
           {/* SIDEBAR */}
           <div className="w-full lg:w-1/4">
              <div className="bg-white border border-[#E6DCCA]/60 rounded-sm overflow-hidden shadow-sm sticky top-32">
                 <div className="p-4 bg-[#F4F1EA]/30 border-b border-[#E6DCCA]/40 text-[10px] font-bold uppercase tracking-widest text-[#6B6060]">
                    Account Menu
                 </div>
                 <TabButton id="dashboard" label="Dashboard" icon={User} onClick={() => setActiveTab('dashboard')} />
                 <TabButton id="orders" label="My Orders" icon={Package} onClick={() => setActiveTab('orders')} />
                 <TabButton id="addresses" label="Addresses" icon={MapPin} onClick={() => setActiveTab('addresses')} />
                 
                 <div className="border-t border-[#E6DCCA]/40 my-1"></div>
                 
                 <Link to="/favorites" className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-[#2D2424] hover:bg-[#F4F1EA] transition-all hover:pl-7 group">
                    <div className="flex items-center gap-3">
                       <Heart size={18} className="text-[#6B6060] group-hover:text-[#701a1a]" />
                       <span>My Wishlist</span>
                    </div>
                 </Link>
              </div>
           </div>

           {/* CONTENT */}
           <div className="w-full lg:w-3/4 min-h-[500px]">
              <AnimatePresence mode='wait'>
                 
                 {/* 1. DASHBOARD */}
                 {activeTab === 'dashboard' && (
                    <motion.div 
                       key="dashboard"
                       initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                       transition={{ duration: 0.2 }}
                       className="space-y-8"
                    >
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-[#701a1a] p-8 rounded-sm text-white shadow-lg relative overflow-hidden group cursor-pointer border border-[#701a1a]" onClick={() => setActiveTab('orders')}>
                             <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                                <Package size={120} />
                             </div>
                             <h3 className="text-2xl font-serif mb-1">My Orders</h3>
                             <p className="text-white/80 text-sm mb-6 font-light">Track, return, or buy again.</p>
                             <span className="text-xs font-bold uppercase tracking-widest border-b border-[#C5A059] pb-1 text-[#C5A059]">View History</span>
                          </div>
                          
                          <div className="bg-[#0F4C5C] p-8 rounded-sm text-white shadow-lg relative overflow-hidden group cursor-pointer border border-[#0F4C5C]" onClick={() => window.location.href='/favorites'}>
                             <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                                <Heart size={120} />
                             </div>
                             <h3 className="text-2xl font-serif mb-1">My Collection</h3>
                             <p className="text-white/80 text-sm mb-6 font-light">Your saved masterpieces.</p>
                             <span className="text-xs font-bold uppercase tracking-widest border-b border-[#C5A059] pb-1 text-[#C5A059]">View Wishlist</span>
                          </div>
                       </div>

                       <div className="bg-white border border-[#E6DCCA] rounded-sm p-6 shadow-sm">
                          <h4 className="font-serif text-lg text-[#2D2424] mb-4 border-b border-[#E6DCCA] pb-2">Account Overview</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#6B6060]">
                             <div>
                                <span className="block text-[10px] uppercase tracking-widest mb-1 text-[#C5A059]">Email</span>
                                <span className="text-[#2D2424] font-medium font-serif">{user.email}</span>
                             </div>
                             <div>
                                <span className="block text-[10px] uppercase tracking-widest mb-1 text-[#C5A059]">Member Status</span>
                                <span className="text-[#2D2424] font-medium font-serif">Active</span>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {/* 2. ORDERS */}
                 {activeTab === 'orders' && (
                    <motion.div 
                       key="orders"
                       initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                       transition={{ duration: 0.2 }}
                    >
                       <h2 className="font-serif text-2xl text-[#2D2424] mb-6 flex items-center gap-2">
                          <Package className="text-[#C5A059]" size={24} /> Order History
                       </h2>
                       <MyOrders />
                    </motion.div>
                 )}

                 {/* 3. ADDRESSES */}
                 {activeTab === 'addresses' && (
                    <motion.div 
                       key="addresses"
                       initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                       transition={{ duration: 0.2 }}
                    >
                       <div className="flex justify-between items-center mb-6">
                          <h2 className="font-serif text-2xl text-[#2D2424] flex items-center gap-2">
                             <MapPin className="text-[#C5A059]" size={24} /> Saved Addresses
                          </h2>
                          <button className="text-[10px] font-bold uppercase tracking-widest bg-[#2D2424] text-white px-4 py-2 hover:bg-[#C5A059] transition-colors rounded-sm shadow-md">
                             + Add New
                          </button>
                       </div>
                       
                       <div className="p-12 border border-dashed border-[#E6DCCA] bg-[#F4F1EA]/20 rounded-sm text-center">
                          <div className="w-16 h-16 bg-[#F4F1EA] rounded-full flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
                             <MapPin size={24} />
                          </div>
                          <p className="text-[#6B6060] font-serif italic mb-4">You haven't saved any addresses yet.</p>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

        </div>
      </div>
      
      {/* FOOTER REMOVED - Handled by Layout */}
    </div>
  );
}