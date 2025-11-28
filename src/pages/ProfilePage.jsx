import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs, orderBy, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { LogOut, Package, MapPin, User, ChevronRight, ShoppingBag, Clock, Shield, Plus, Trash2, Check, XCircle, Edit2, X, ExternalLink, Printer } from 'lucide-react';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';
import { formatPrice } from '@/lib/utils';
import { printInvoice } from '@/lib/invoice'; // Invoice Helper
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_EMAIL = "shreyanshtripathi71@gmail.com"; 

// --- VISUAL TRACKER COMPONENT ---
const OrderTimeline = ({ status }) => {
  const steps = ['Pending', 'Shipped', 'Delivered'];
  const currentStep = steps.indexOf(status);
  const isCancelled = status === 'Cancelled';

  if (isCancelled) {
    return <div className="mt-4 bg-red-50 text-red-600 p-2 text-xs font-bold rounded-sm text-center border border-red-100">ORDER CANCELLED</div>;
  }

  return (
    <div className="mt-6 flex items-center justify-between relative">
      {/* Track Line Background */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
      
      {/* Track Line Filled */}
      <div className="absolute top-1/2 left-0 h-0.5 bg-green-500 -z-10 -translate-y-1/2 transition-all duration-500" 
           style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
      
      {steps.map((step, idx) => {
        const isCompleted = idx <= currentStep;
        return (
          <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 transition-colors ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
              {isCompleted ? <Check size={12} /> : idx + 1}
            </div>
            <span className={`text-[10px] font-bold uppercase ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); 
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', state: '', pincode: '', phone: '' });
  
  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login', { replace: true }); return; }

    setEditName(user.displayName || '');
    setEditPhoto(user.photoURL || '');

    // Real-time Orders
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(q, (snap) => {
       setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
       setLoadingOrders(false);
    });

    // Real-time Addresses
    const unsubAddress = onSnapshot(collection(db, `users/${user.uid}/addresses`), (snapshot) => {
        setAddresses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubOrders(); unsubAddress(); };
  }, [user, loading, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user, { displayName: editName, photoURL: editPhoto });
      await updateDoc(doc(db, 'users', user.uid), { displayName: editName, photoURL: editPhoto });
      setIsEditingProfile(false);
      alert("Profile Updated!");
    } catch (err) { console.error(err); alert("Failed to update profile."); }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
       try { await updateDoc(doc(db, 'orders', orderId), { status: 'Cancelled' }); } 
       catch (err) { alert("Failed to cancel."); }
    }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  const handleAdminClick = () => { navigate('/admin'); };

  const saveAddress = async (e) => {
      e.preventDefault();
      try {
          const addressId = Date.now().toString();
          await setDoc(doc(db, `users/${user.uid}/addresses`, addressId), newAddress);
          setIsAddingAddress(false);
          setNewAddress({ name: '', street: '', city: '', state: '', pincode: '', phone: '' });
      } catch (err) { alert("Failed to save address"); }
  };

  const deleteAddress = async (id) => {
      if(window.confirm("Delete?")) await deleteDoc(doc(db, `users/${user.uid}/addresses`, id));
  };

  if (loading) return <AppSkeleton />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-brand-dark flex flex-col">
      <Navbar cartCount={0} onOpenCart={() => {}} />

      <div className="flex-grow max-w-6xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 text-center relative group">
              <button onClick={() => setIsEditingProfile(true)} className="absolute top-2 right-2 text-gray-400 hover:text-[#B08D55] p-2 rounded-full hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><Edit2 size={16} /></button>
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400 border-2 border-white shadow-md overflow-hidden">
                {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <User size={32} />}
              </div>
              <h2 className="font-serif text-xl font-bold">{user.displayName || 'Valued Customer'}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
              {user.email === ADMIN_EMAIL && <span className="inline-block mt-2 px-2 py-0.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm">Admin</span>}
            </div>
            
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden flex flex-col">
               {user.email === ADMIN_EMAIL && (
                <button onClick={handleAdminClick} className="w-full flex items-center justify-between p-4 text-sm font-bold text-white bg-[#1A1A1A] hover:bg-black transition-colors cursor-pointer z-10 relative mb-1">
                  <div className="flex items-center gap-3 pointer-events-none"><Shield size={18} /> Admin Dashboard</div><ChevronRight size={16} className="pointer-events-none"/>
                </button>
              )}
              <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between p-4 text-sm font-medium border-b border-gray-50 transition-colors ${activeTab === 'orders' ? 'bg-[#B08D55]/10 text-[#B08D55]' : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3"><ShoppingBag size={18} /> My Orders</div><ChevronRight size={16} />
              </button>
              <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center justify-between p-4 text-sm font-medium border-b border-gray-50 transition-colors ${activeTab === 'settings' ? 'bg-[#B08D55]/10 text-[#B08D55]' : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3"><MapPin size={18} /> Addresses</div><ChevronRight size={16} />
              </button>
              <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-3"><LogOut size={18} /> Logout</div>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-brand-dark mb-4">Order History</h3>
                {loadingOrders ? <div className="text-center py-20 text-gray-400">Loading orders...</div> : orders.length === 0 ? (
                  <div className="bg-white p-12 rounded-sm shadow-sm border border-gray-100 text-center">
                    <Package size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-500 font-medium mb-4">No orders placed yet.</p>
                    <button onClick={() => navigate('/shop')} className="text-[#B08D55] text-xs font-bold uppercase tracking-widest hover:underline">Start Shopping</button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                      <div className="flex flex-wrap justify-between items-start mb-4 pb-4 border-b border-gray-50">
                        <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID</p><p className="font-mono text-sm font-medium text-brand-dark">#{order.id.slice(0,8)}</p></div>
                        <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p><p className="text-sm text-gray-600 flex items-center gap-1"><Clock size={12} />{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}</p></div>
                        <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total</p><p className="text-sm font-bold text-[#B08D55]">₹{formatPrice(order.totalAmount)}</p></div>
                        
                        {/* Invoice Button & Status */}
                        <div className="flex flex-col items-end gap-2">
                           <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {order.status || 'Pending'}
                           </span>
                           <button onClick={() => printInvoice(order)} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#B08D55] transition-colors border border-gray-200 px-3 py-1 rounded-sm bg-gray-50 hover:bg-white">
                             <Printer size={12} /> Invoice
                           </button>
                        </div>
                      </div>

                      {order.status === 'Shipped' && order.tracking && (
                        <div className="mb-4 bg-blue-50 p-3 rounded-sm border border-blue-100 flex justify-between items-center">
                           <div className="text-sm text-blue-800"><span className="font-bold">{order.tracking.courier}</span> Tracking: <span className="font-mono">{order.tracking.trackingId}</span></div>
                           {order.tracking.url && <a href={order.tracking.url} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase text-blue-600 flex items-center gap-1 hover:underline">Track <ExternalLink size={12}/></a>}
                        </div>
                      )}

                      <div className="space-y-3">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex gap-4 items-center">
                            <div className="w-12 h-16 bg-gray-100 rounded-sm overflow-hidden border border-gray-100"><img src={item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" /></div>
                            <div><h4 className="text-sm font-medium text-brand-dark">{item.name}</h4><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div>
                          </div>
                        ))}
                      </div>
                      <OrderTimeline status={order.status || 'Pending'} />
                      {order.status === 'Pending' && <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end"><button onClick={() => handleCancelOrder(order.id)} className="text-xs font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-sm border border-red-100 transition-colors flex items-center gap-2"><XCircle size={14} /> Cancel Order</button></div>}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                      <h3 className="font-serif text-2xl text-brand-dark">Saved Addresses</h3>
                      <button onClick={() => setIsAddingAddress(true)} className="bg-[#B08D55] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 rounded-sm"><Plus size={16} /> Add New</button>
                  </div>
                  {isAddingAddress && (
                      <form onSubmit={saveAddress} className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 mb-6 animate-in fade-in slide-in-from-top-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <input required placeholder="Full Name" className="border p-2 text-sm rounded-sm" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
                              <input required placeholder="Phone Number" className="border p-2 text-sm rounded-sm" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                              <input required placeholder="Street Address" className="border p-2 text-sm rounded-sm md:col-span-2" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                              <input required placeholder="City" className="border p-2 text-sm rounded-sm" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                              <input required placeholder="State" className="border p-2 text-sm rounded-sm" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                              <input required placeholder="Pincode" className="border p-2 text-sm rounded-sm" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
                          </div>
                          <div className="flex gap-2">
                              <button type="submit" className="bg-black text-white px-6 py-2 text-xs font-bold uppercase rounded-sm">Save Address</button>
                              <button type="button" onClick={() => setIsAddingAddress(false)} className="border border-gray-300 px-4 py-2 text-xs font-bold uppercase rounded-sm">Cancel</button>
                          </div>
                      </form>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.length === 0 && !isAddingAddress && <div className="col-span-2 text-center py-10 text-gray-400 bg-white border border-dashed border-gray-200 rounded-sm">No addresses saved.</div>}
                      {addresses.map(addr => (
                          <div key={addr.id} className="bg-white p-5 rounded-sm border border-gray-200 relative group">
                              <button onClick={() => deleteAddress(addr.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                              <p className="font-bold text-sm">{addr.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{addr.street}</p>
                              <p className="text-xs text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                              <p className="text-xs text-gray-800 mt-3 font-medium">Phone: {addr.phone}</p>
                          </div>
                      ))}
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditingProfile(false)} />
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-sm rounded-sm shadow-xl relative z-10 p-6">
                <h3 className="font-serif text-xl mb-4">Edit Profile</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Full Name</label>
                      <input className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:border-[#B08D55] outline-none" value={editName} onChange={e => setEditName(e.target.value)} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Photo URL</label>
                      <input className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:border-[#B08D55] outline-none" placeholder="https://..." value={editPhoto} onChange={e => setEditPhoto(e.target.value)} />
                   </div>
                   <button type="submit" className="w-full bg-[#B08D55] text-white py-3 font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-[#8c6a40]">Save Changes</button>
                </form>
                <button onClick={() => setIsEditingProfile(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20}/></button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}