import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { 
  LogOut, Package, MapPin, User, ChevronRight, ShoppingBag, Clock, Shield 
} from 'lucide-react';

// --- MUST MATCH THE EMAIL IN AdminPage.jsx ---
const ADMIN_EMAIL = "shreyanshtripathi71@gmail.com"; 

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); 

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const orderData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };
  
  const handleAdminClick = () => {
      navigate('/admin');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-brand-dark flex flex-col">
      <Navbar cartCount={0} onOpenCart={() => {}} />

      <div className="flex-grow max-w-6xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400 border-2 border-white shadow-md overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} />
                )}
              </div>
              <h2 className="font-serif text-xl font-bold">{user.displayName || 'Valued Customer'}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
              
              {/* ADMIN BADGE */}
              {user.email === ADMIN_EMAIL && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm">
                  Admin
                </span>
              )}
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              
              {/* ADMIN LINK - Visible immediately */}
              {user.email === ADMIN_EMAIL && (
                <button 
                  type="button"
                  onClick={handleAdminClick}
                  className="w-full flex items-center justify-between p-4 text-sm font-bold text-white bg-gray-900 hover:bg-black transition-colors cursor-pointer z-10 relative mb-1"
                >
                  <div className="flex items-center gap-3 pointer-events-none">
                      <Shield size={18} /> Admin Dashboard
                  </div>
                  <ChevronRight size={16} className="pointer-events-none" />
                </button>
              )}

              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-4 text-sm font-medium border-b border-gray-50 transition-colors ${activeTab === 'orders' ? 'bg-[#B08D55]/10 text-[#B08D55]' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3"><ShoppingBag size={18} /> My Orders</div>
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between p-4 text-sm font-medium border-b border-gray-50 transition-colors ${activeTab === 'settings' ? 'bg-[#B08D55]/10 text-[#B08D55]' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3"><MapPin size={18} /> Addresses</div>
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3"><LogOut size={18} /> Logout</div>
              </button>
            </div>
          </div>

          {/* Main Content (Orders List) */}
          <div className="md:col-span-3">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-brand-dark mb-4">Order History</h3>
                
                {loadingOrders ? (
                  <div className="text-center py-20 text-gray-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="bg-white p-12 rounded-sm shadow-sm border border-gray-100 text-center">
                    <Package size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-500 font-medium mb-4">No orders placed yet.</p>
                    <button onClick={() => navigate('/shop')} className="text-[#B08D55] text-xs font-bold uppercase tracking-widest hover:underline">Start Shopping</button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                      <div className="flex flex-wrap justify-between items-start mb-4 pb-4 border-b border-gray-50">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                          <p className="font-mono text-sm font-medium text-brand-dark">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock size={12} />
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total</p>
                          <p className="text-sm font-bold text-[#B08D55]">₹{order.totalAmount}</p>
                        </div>
                        <div>
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex gap-4 items-center">
                            <div className="w-12 h-16 bg-gray-100 rounded-sm overflow-hidden border border-gray-100">
                              <img src={item.featuredImageUrl || item.imageUrls?.[0]} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-brand-dark">{item.name}</h4>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
             {activeTab === 'settings' && (
               <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 text-center py-20">
                 <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
                 <h3 className="font-serif text-xl mb-2">Saved Addresses</h3>
                 <p className="text-gray-500 text-sm mb-6">You haven't saved any addresses yet.</p>
                 <button className="bg-brand-dark text-white px-6 py-3 text-xs font-bold uppercase tracking-widest">Add New Address</button>
               </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}