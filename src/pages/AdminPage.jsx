import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, 
  Settings, LogOut, Menu, X, Shield 
} from 'lucide-react';

// Components
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { OrderManager } from '@/components/admin/OrderManager';
import { ProductManager } from '@/components/admin/ProductManager';
import { InventoryManager } from '@/components/admin/InventoryManager';

// --- REPLACE WITH YOUR EMAIL ---
const ADMIN_EMAIL = "shreyanshtripathi71@gmail.com"; 

export default function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="h-screen flex items-center justify-center text-[#B08D55]">Loading Admin Panel...</div>;

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <Shield size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <button onClick={() => navigate('/')} className="text-[#B08D55] underline">Return Home</button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'orders': return <OrderManager />;
      case 'products': return <ProductManager />;
      case 'inventory': return <InventoryManager />;
      default: return <AdminDashboard />;
    }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); if(window.innerWidth < 768) setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-[#B08D55] text-white shadow-md' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A1A1A] z-40 flex items-center px-4 justify-between text-white">
         <div className="font-serif font-bold text-xl">Admin</div>
         <button onClick={() => setSidebarOpen(!isSidebarOpen)}><Menu /></button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl text-[#B08D55]">Pahnawa</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500"><X /></button>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="orders" icon={ShoppingBag} label="Orders" />
          <NavItem id="products" icon={Package} label="Products" />
          <NavItem id="inventory" icon={Settings} label="Inventory" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut size={18} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
             <div>
               <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
               <p className="text-sm text-gray-500">Overview and management</p>
             </div>
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                Live
             </div>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}