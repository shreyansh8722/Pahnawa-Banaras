import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProductManager } from '../components/admin/ProductManager';
import { OrderManager } from '../components/admin/OrderManager';
import { LayoutDashboard, ShoppingBag, Lock, LogOut } from 'lucide-react';

// --- REPLACE THIS WITH YOUR EMAIL ---
const ADMIN_EMAIL = "shreyanshtripathi71@gmail.com"; 

export default function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Security Check
  if (!loading && user && user.email !== ADMIN_EMAIL) {
      return (
          <div className="h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 text-[#1A1A1A]">
              <div className="bg-white p-8 rounded-sm shadow-lg border border-gray-200 max-w-md w-full">
                <Lock size={48} className="text-red-500 mb-4 mx-auto" />
                <h1 className="text-2xl font-serif font-bold mb-2">Access Denied</h1>
                <p className="text-gray-500 text-sm mb-6">
                  You are logged in as <b>{user.email}</b>.<br/>
                  This area is restricted to administrators.
                </p>
                <button 
                  onClick={() => navigate('/')} 
                  className="w-full bg-[#1A1A1A] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                >
                  Return to Store
                </button>
              </div>
          </div>
      );
  }

  if (loading || !user) return <div className="h-screen flex items-center justify-center text-[#B08D55]">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-[#1A1A1A] flex flex-col">
      
      {/* --- Admin Navbar (HARDCODED BLACK BG) --- */}
      <div className="w-full px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50" style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-[#B08D55] rounded-sm flex items-center justify-center font-serif font-bold text-white">P</div>
           <div>
             <h1 className="font-serif text-xl tracking-wide text-[#B08D55] leading-none">Pahnawa Admin</h1>
             <span className="text-[10px] text-gray-400 uppercase tracking-wider">Store Management</span>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">{user.email}</span>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-white px-3 py-1.5 rounded-sm"
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-grow max-w-7xl mx-auto w-full p-6">
        
        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-200">
            <button 
                onClick={() => setActiveTab('products')}
                className={`pb-4 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'products' ? 'text-[#B08D55] border-[#B08D55]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
                <LayoutDashboard size={18} /> Inventory
            </button>
            <button 
                onClick={() => setActiveTab('orders')}
                className={`pb-4 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'orders' ? 'text-[#B08D55] border-[#B08D55]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
                <ShoppingBag size={18} /> Orders
            </button>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in duration-500">
          {activeTab === 'products' ? <ProductManager /> : <OrderManager />}
        </div>

      </div>
    </div>
  );
}