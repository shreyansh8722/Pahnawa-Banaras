import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, 
  Settings, LogOut, Menu, X, Shield, MessageSquare, 
  Ticket, LayoutTemplate, Globe, FolderOpen 
} from 'lucide-react';

// Admin Components
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { OrderManager } from '@/components/admin/OrderManager';
import { ProductManager } from '@/components/admin/ProductManager';
import { InventoryManager } from '@/components/admin/InventoryManager';
import { MessageInbox } from '@/components/admin/MessageInbox';
import { CouponManager } from '@/components/admin/CouponManager';
import { StorefrontManager } from '@/components/admin/StorefrontManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { SubscriberManager } from '@/components/admin/SubscriberManager';
import { ContentManager } from '@/components/admin/ContentManager'; // NEW

// --- UPDATE THIS TO YOUR ADMIN EMAIL ---
const ADMIN_EMAIL = "shreyanshtripathi71@gmail.com"; 

export default function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true); 

  // Security Check
  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading || !user) return (
    <div className="h-screen flex items-center justify-center text-[#B08D55] bg-white font-serif text-xl">
        Loading Pahnawa Admin...
    </div>
  );

  // Unauthorized Access Block
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <Shield size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Access Denied</h1>
        <p className="text-gray-500 mb-6">You do not have permission to view this page.</p>
        <button onClick={() => navigate('/')} className="text-[#B08D55] underline hover:text-black transition-colors">
            Return to Store
        </button>
      </div>
    );
  }

  // Content Router
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'orders': return <OrderManager />;
      case 'products': return <ProductManager />;
      case 'inventory': return <InventoryManager />;
      case 'coupons': return <CouponManager />;
      case 'storefront': return <StorefrontManager />;
      case 'settings': return <SettingsManager />;
      case 'subscribers': return <SubscriberManager />;
      case 'messages': return <MessageInbox />;
      case 'content': return <ContentManager />; // NEW
      default: return <AdminDashboard />;
    }
  };

  // Navigation Item Component
  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { 
        setActiveTab(id); 
        if(window.innerWidth < 768) setSidebarOpen(false); 
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        activeTab === id 
          ? 'bg-[#B08D55] text-white shadow-md transform scale-105' 
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
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A1A1A] z-40 flex items-center px-4 justify-between text-white shadow-md">
         <div className="font-serif font-bold text-xl text-[#B08D55]">Pahnawa Admin</div>
         <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
             {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] text-white transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl text-[#B08D55] tracking-wide">Pahnawa</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">Management</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-white">
             <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-hide">
          <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-2">Overview</p>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="messages" icon={MessageSquare} label="Inbox" />
          <NavItem id="subscribers" icon={Users} label="Subscribers" />
          
          <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-6">Commerce</p>
          <NavItem id="orders" icon={ShoppingBag} label="Orders" />
          <NavItem id="products" icon={Package} label="Products" />
          <NavItem id="inventory" icon={Settings} label="Inventory" />
          
          <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-6">Marketing & CMS</p>
          <NavItem id="coupons" icon={Ticket} label="Coupons" />
          <NavItem id="storefront" icon={LayoutTemplate} label="Storefront" />
          <NavItem id="content" icon={FolderOpen} label="Content (FAQ/Reviews)" />
          
          <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 mt-6">System</p>
          <NavItem id="settings" icon={Globe} label="Global Settings" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-[#1A1A1A]">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors">
            <LogOut size={18} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          
          {/* Header */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <h2 className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
                   {activeTab}
                   <span className="text-sm font-normal text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                      {new Date().toLocaleDateString()}
                   </span>
               </h2>
             </div>
             
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm border border-gray-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                    <span className="font-medium text-gray-600">System Online</span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                    {user.email[0].toUpperCase()}
                </div>
             </div>
          </header>

          {/* Content Render */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {renderContent()}
          </div>
          
        </div>
      </main>
    </div>
  );
}