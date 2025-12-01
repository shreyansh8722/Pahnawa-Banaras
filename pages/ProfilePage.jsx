import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { 
  LogOut, Package, MapPin, User as UserIcon, ChevronRight, Truck, 
  Heart, Shield, Settings, CreditCard, Bell, HelpCircle, Gift,
  Crown, Star, Calendar, ShoppingBag, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MyOrders } from '@/components/profile/MyOrders';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ADMIN_EMAIL = "shreyanshtripathi71@gmail.com";

// --- STYLED COMPONENTS ---

const QuickActionCard = ({ icon: Icon, label, value, onClick, highlight }) => (
  <button 
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center p-6 rounded-sm border transition-all duration-300 group
      ${highlight 
        ? 'bg-[#B08D55] border-[#B08D55] shadow-lg shadow-[#B08D55]/20' 
        : 'bg-white border-stone-200 hover:border-[#B08D55] hover:shadow-md'
      }
    `}
  >
    <div className={`
      p-3 rounded-full mb-3 transition-colors 
      ${highlight 
        ? 'bg-white/20 text-white' 
        : 'bg-stone-50 text-stone-400 group-hover:bg-[#B08D55]/10 group-hover:text-[#B08D55]'
      }
    `}>
      <Icon size={20} strokeWidth={1.5} />
    </div>
    {value !== undefined && (
      <span className={`text-2xl font-serif font-medium mb-1 ${highlight ? 'text-white' : 'text-stone-900'}`}>
        {value}
      </span>
    )}
    <span className={`text-[10px] uppercase tracking-[0.15em] font-bold ${highlight ? 'text-white/90' : 'text-stone-500'}`}>
      {label}
    </span>
  </button>
);

const MenuSection = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-4 px-1">{title}</h3>
    <div className="bg-white rounded-sm border border-stone-200 overflow-hidden divide-y divide-stone-100">
      {children}
    </div>
  </div>
);

const MenuItem = ({ icon: Icon, label, subtitle, onClick, badge, danger, highlight }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-5 p-5 transition-all duration-200 group
      ${highlight 
        ? 'bg-[#B08D55]/5 hover:bg-[#B08D55]/10' 
        : danger 
          ? 'hover:bg-red-50' 
          : 'hover:bg-stone-50'
      }
    `}
  >
    <div className={`
      p-2.5 rounded-full transition-colors 
      ${highlight 
        ? 'bg-[#B08D55] text-white' 
        : danger 
          ? 'bg-red-100 text-red-600' 
          : 'bg-stone-100 text-stone-400 group-hover:text-[#B08D55]'
      }
    `}>
      <Icon size={18} strokeWidth={1.5} />
    </div>
    <div className="flex-1 text-left">
      <span className={`block text-sm font-medium font-serif ${danger ? 'text-red-700' : 'text-stone-800'}`}>
        {label}
      </span>
      {subtitle && <span className="text-xs text-stone-500 font-sans mt-0.5">{subtitle}</span>}
    </div>
    <div className="flex items-center gap-3">
      {badge && (
        <span className="px-2.5 py-0.5 bg-[#B08D55] text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
          {badge}
        </span>
      )}
      <ChevronRight size={16} className="text-stone-300 group-hover:text-[#B08D55] group-hover:translate-x-1 transition-all" />
    </div>
  </button>
);

const TabContent = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="h-full"
  >
    {children}
  </motion.div>
);

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check email case-insensitively just in case
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid) return;
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        setOrderCount(snap.size);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user?.uid]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
  };

  const memberSince = user.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'New Member';

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-stone-900 selection:bg-[#B08D55] selection:text-white">
      <Navbar />
      
      <div className="pt-28 sm:pt-36 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* --- LEFT SIDEBAR (PROFILE CARD) --- */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-sm border border-stone-200 overflow-hidden sticky top-32 shadow-sm">
                
                {/* Profile Header */}
                <div className="bg-[#1a1a1a] p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #B08D55 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
                  
                  <div className="relative z-10">
                    <div className="relative inline-block">
                        {user.photoURL ? (
                        <img 
                            src={user.photoURL} 
                            alt={user.displayName} 
                            className="w-24 h-24 rounded-full mx-auto border-4 border-[#B08D55] shadow-xl object-cover"
                        />
                        ) : (
                        <div className="w-24 h-24 rounded-full mx-auto bg-stone-800 flex items-center justify-center text-[#B08D55] text-3xl font-serif border-4 border-[#B08D55] shadow-xl">
                            {getInitials(user.displayName)}
                        </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-[#B08D55] text-white p-1.5 rounded-full border-2 border-[#1a1a1a]">
                            <Crown size={12} fill="white" />
                        </div>
                    </div>
                    
                    <h2 className="text-white text-xl font-serif italic mt-4 mb-1 tracking-wide">
                      {user.displayName || 'Welcome Guest'}
                    </h2>
                    <p className="text-stone-400 text-xs font-sans tracking-wide uppercase">
                      {user.email}
                    </p>
                    
                    <div className="flex items-center justify-center gap-1 mt-4 text-stone-500 text-[10px] uppercase tracking-widest">
                      <Calendar size={10} />
                      <span>Member Since {memberSince}</span>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Menu */}
                <div className="p-2 space-y-1 bg-white">
                  {isAdmin && (
                    <MenuItem 
                      icon={Shield} 
                      label="Admin Dashboard" 
                      subtitle="Manage store & orders"
                      onClick={() => navigate('/admin')} 
                      badge="Admin"
                      highlight
                    />
                  )}
                  
                  <MenuItem 
                    icon={Package} 
                    label="My Orders" 
                    subtitle={`${orderCount} orders placed`}
                    onClick={() => setActiveTab('orders')} 
                  />
                  
                  <MenuItem 
                    icon={Truck} 
                    label="Track Order" 
                    subtitle="Live shipment status"
                    onClick={() => navigate('/track-order')} 
                  />
                  
                  <MenuItem 
                    icon={Heart} 
                    label="My Wishlist" 
                    subtitle="Saved masterpieces"
                    onClick={() => navigate('/favorites')} 
                  />
                  
                  <MenuItem 
                    icon={MapPin} 
                    label="Saved Addresses" 
                    subtitle="Manage shipping info"
                    onClick={() => setActiveTab('addresses')} 
                  />
                  
                  <MenuItem 
                    icon={Settings} 
                    label="Account Settings" 
                    subtitle="Password & details"
                    onClick={() => setActiveTab('settings')} 
                  />
                  
                  <div className="pt-2 mt-2 border-t border-stone-100">
                    <MenuItem 
                      icon={LogOut} 
                      label="Sign Out" 
                      onClick={handleLogout} 
                      danger
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* --- RIGHT CONTENT AREA --- */}
            <div className="lg:col-span-8 xl:col-span-9">
              <AnimatePresence mode='wait'>
                
                {activeTab === 'overview' && (
                  <TabContent key="overview">
                    
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                      <QuickActionCard 
                        icon={ShoppingBag} 
                        label="Total Orders" 
                        value={loading ? '...' : orderCount}
                        onClick={() => setActiveTab('orders')}
                      />
                      <QuickActionCard 
                        icon={Heart} 
                        label="Wishlist" 
                        onClick={() => navigate('/favorites')}
                      />
                      <QuickActionCard 
                        icon={Gift} 
                        label="Rewards" 
                        onClick={() => {}}
                        highlight
                      />
                      <QuickActionCard 
                        icon={HelpCircle} 
                        label="Support" 
                        onClick={() => navigate('/contact')}
                      />
                    </div>
                    
                    <MenuSection title="Recent Activity">
                      <div className="p-0">
                        <MyOrders userId={user.uid} limit={2} />
                      </div>
                    </MenuSection>

                    <MenuSection title="Quick Actions">
                      <MenuItem 
                        icon={Truck} 
                        label="Track Your Order" 
                        subtitle="See real-time delivery updates"
                        onClick={() => navigate('/track-order')} 
                      />
                      <MenuItem 
                        icon={CreditCard} 
                        label="Payment Methods" 
                        subtitle="Manage saved cards & UPI"
                        onClick={() => setActiveTab('settings')} 
                      />
                      <MenuItem 
                        icon={Bell} 
                        label="Notifications" 
                        subtitle="Order updates & offers"
                        onClick={() => setActiveTab('settings')} 
                      />
                    </MenuSection>
                    
                    {/* Promo Banner */}
                    <div className="bg-[#1a1a1a] rounded-sm p-8 border border-stone-800 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-[#B08D55] rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                            <div className="p-4 bg-white/10 rounded-full text-[#B08D55]">
                                <Star size={24} fill="#B08D55" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-serif text-xl text-white mb-2 italic">Premium Member Benefits</h3>
                                <p className="text-sm text-stone-400 font-light leading-relaxed max-w-md">
                                    As a valued member, enjoy complimentary shipping on all orders above ₹10,000 and exclusive early access to our Heritage Collection.
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/shop')}
                                className="w-full sm:w-auto px-8 py-3 bg-[#B08D55] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#967642] transition-colors shadow-lg"
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                  </TabContent>
                )}
                
                {activeTab === 'orders' && (
                  <TabContent key="orders">
                    <div className="mb-8 flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-6">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 block mb-2">History</span>
                            <h2 className="text-3xl font-serif text-stone-900 italic">Order History</h2>
                        </div>
                        <button 
                          onClick={() => setActiveTab('overview')} 
                          className="text-xs uppercase font-bold tracking-widest text-[#B08D55] hover:text-stone-900 transition-colors flex items-center gap-2 group"
                        >
                          <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </button>
                    </div>
                    <MyOrders userId={user.uid} />
                  </TabContent>
                )}
                
                {activeTab === 'addresses' && (
                  <TabContent key="addresses">
                    <div className="bg-white rounded-sm border border-stone-200 overflow-hidden">
                      <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                        <h2 className="text-xl font-serif text-stone-900 italic">Saved Addresses</h2>
                        <button onClick={() => setActiveTab('overview')} className="text-stone-400 hover:text-stone-900 transition-colors"><ChevronRight className="rotate-180"/></button>
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <button className="h-48 border-2 border-dashed border-stone-200 rounded-sm flex flex-col items-center justify-center gap-4 hover:border-[#B08D55] hover:bg-[#FAF9F6] transition-all group">
                            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#B08D55] group-hover:text-white transition-colors">
                              <MapPin size={20} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-[#B08D55]">
                              Add New Address
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </TabContent>
                )}
                
                {activeTab === 'settings' && (
                  <TabContent key="settings">
                    <div className="bg-white rounded-sm border border-stone-200 overflow-hidden">
                      <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                        <h2 className="text-xl font-serif text-stone-900 italic">Account Settings</h2>
                        <button onClick={() => setActiveTab('overview')} className="text-stone-400 hover:text-stone-900 transition-colors"><ChevronRight className="rotate-180"/></button>
                      </div>
                      <div className="p-8">
                        <form className="space-y-8 max-w-2xl">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">First Name</label>
                              <input 
                                type="text" 
                                defaultValue={user.displayName?.split(' ')[0]} 
                                className="w-full border-b border-stone-200 py-3 text-stone-900 focus:border-[#B08D55] outline-none transition-colors bg-transparent font-serif" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Last Name</label>
                              <input 
                                type="text" 
                                defaultValue={user.displayName?.split(' ')[1]} 
                                className="w-full border-b border-stone-200 py-3 text-stone-900 focus:border-[#B08D55] outline-none transition-colors bg-transparent font-serif" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Email Address</label>
                            <input 
                              type="email" 
                              defaultValue={user.email} 
                              disabled 
                              className="w-full border-b border-stone-200 py-3 text-stone-400 cursor-not-allowed bg-transparent font-sans" 
                            />
                            <p className="text-[10px] text-stone-400 italic mt-1">* Email cannot be changed for security reasons.</p>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Phone Number</label>
                            <input 
                              type="tel" 
                              placeholder="+91"
                              className="w-full border-b border-stone-200 py-3 text-stone-900 focus:border-[#B08D55] outline-none transition-colors bg-transparent font-sans" 
                            />
                          </div>
                          
                          <div className="pt-6">
                            <button 
                              type="button"
                              className="w-full sm:w-auto px-10 py-4 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#B08D55] transition-colors shadow-lg"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </TabContent>
                )}
                
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}