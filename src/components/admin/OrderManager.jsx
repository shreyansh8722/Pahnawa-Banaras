import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, query, orderBy, limit, startAfter, getDocs, 
  where, updateDoc, doc, serverTimestamp, getDoc 
} from 'firebase/firestore';
import { Truck, CheckCircle, XCircle, Clock, Search, ChevronDown, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shipping Modal
  const [shippingModal, setShippingModal] = useState({ open: false, orderId: null });
  const [trackingInfo, setTrackingInfo] = useState({ courier: '', trackingId: '', url: '' });

  // Initial Load
  useEffect(() => {
    fetchOrders(true);
  }, []);

  const fetchOrders = async (isInitial = false) => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      let q;

      if (searchQuery.trim()) {
        // SEARCH MODE: exact match for Order ID
        // Note: For advanced search (name/email), you'd need a third-party service like Algolia
        // or ensure you store searchable keywords in Firestore.
        // Here we try to find by Order ID directly first.
        
        try {
            const docRef = doc(db, 'orders', searchQuery.trim());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setOrders([{ id: docSnap.id, ...docSnap.data() }]);
            } else {
                setOrders([]);
            }
            setHasMore(false);
            setLoading(false);
            return;
        } catch (e) {
            console.log("Not a valid doc ID search");
        }
      }

      // STANDARD LIST MODE
      if (isInitial) {
        q = query(ordersRef, orderBy('createdAt', 'desc'), limit(15));
      } else if (lastDoc) {
        q = query(ordersRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(15));
      } else {
        setLoading(false);
        return;
      }

      const snap = await getDocs(q);
      
      if (snap.empty) {
        setHasMore(false);
        if (isInitial) setOrders([]);
      } else {
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLastDoc(snap.docs[snap.docs.length - 1]);
        if (isInitial) setOrders(fetched);
        else setOrders(prev => [...prev, ...fetched]);
      }

    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    // We need to wait for state update, but better to just trigger reload logic manually
    // Since set state is async, we pass empty string logic directly or use useEffect on searchQuery
    window.location.reload(); // Simplest reset for admin panel to ensure fresh state
  };

  const updateStatus = async (id, status) => {
    if (window.confirm(`Mark order as ${status}?`)) {
      await updateDoc(doc(db, 'orders', id), { status });
      // Update local state to reflect change immediately
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
  };

  const handleShipOrder = async (e) => {
    e.preventDefault();
    if (!shippingModal.orderId) return;

    await updateDoc(doc(db, 'orders', shippingModal.orderId), {
      status: 'Shipped',
      tracking: trackingInfo,
      shippedAt: serverTimestamp()
    });

    setOrders(prev => prev.map(o => o.id === shippingModal.orderId ? { 
        ...o, 
        status: 'Shipped', 
        tracking: trackingInfo 
    } : o));

    setShippingModal({ open: false, orderId: null });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      Delivered: 'bg-green-100 text-green-800 border-green-200',
      Cancelled: 'bg-red-50 text-red-800 border-red-100'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div>
            <h2 className="font-serif text-2xl text-gray-900">Orders</h2>
            <p className="text-xs text-gray-500">Manage customer orders and shipments</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search Order ID..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#B08D55] outline-none"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Search</button>
            {searchQuery && (
                <button type="button" onClick={clearSearch} className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200">
                    <X size={16} />
                </button>
            )}
        </form>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">#{order.id}</span>
                   <StatusBadge status={order.status} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</h3>
                <p className="text-sm text-gray-500">{order.shippingDetails?.city}, {order.shippingDetails?.state}</p>
                <p className="text-sm text-gray-500">Ph: {order.shippingDetails?.phone}</p>
                
                {/* Tracking Info Display */}
                {order.tracking && (
                  <div className="mt-3 text-xs bg-blue-50 text-blue-700 p-2 rounded border border-blue-100 inline-block">
                    <span className="font-bold block text-[10px] uppercase text-blue-400 mb-1">Shipment Details</span>
                    {order.tracking.courier} — <span className="font-mono">{order.tracking.trackingId}</span>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <Clock size={14}/> {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                </p>
                <p className="text-xl font-bold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1 border border-gray-200 px-2 py-0.5 rounded-full inline-block">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100 space-y-3">
               {order.items?.map((item, idx) => (
                 <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                            {item.options?.fallPico && <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">Fall/Pico</span>}
                            {item.options?.blouseStitching && <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">Blouse Stitch</span>}
                        </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
               {order.status === 'Pending' && (
                 <button 
                   onClick={() => {
                       setTrackingInfo({ courier: '', trackingId: '', url: '' });
                       setShippingModal({ open: true, orderId: order.id });
                   }}
                   className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-gray-900 text-white hover:bg-black text-xs font-bold uppercase tracking-wider transition-all"
                 >
                   <Truck size={14} /> Ship Order
                 </button>
               )}
               
               {order.status === 'Shipped' && (
                 <button 
                   onClick={() => updateStatus(order.id, 'Delivered')}
                   className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-green-600 text-white hover:bg-green-700 text-xs font-bold uppercase tracking-wider transition-all"
                 >
                   <CheckCircle size={14} /> Mark Delivered
                 </button>
               )}
               
               {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                 <button 
                   onClick={() => updateStatus(order.id, 'Cancelled')}
                   className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-all ml-auto"
                 >
                   <XCircle size={14} /> Cancel
                 </button>
               )}
            </div>
          </div>
        ))}

        {/* Load More */}
        {hasMore && !searchQuery && (
          <button 
            onClick={() => fetchOrders(false)}
            disabled={loading}
            className="w-full py-4 text-sm font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-lg border border-dashed border-gray-300 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin mx-auto" /> : 'Load Older Orders'}
          </button>
        )}
      </div>

      {/* Shipping Modal */}
      <AnimatePresence>
        {shippingModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setShippingModal({ open: false, orderId: null })} 
             />
             <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-md rounded-lg shadow-2xl relative z-10 p-8"
             >
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-serif text-xl text-gray-900">Ship Order</h3>
                   <button onClick={() => setShippingModal({ open: false, orderId: null })} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleShipOrder} className="space-y-5">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Courier Service</label>
                      <input 
                        required 
                        placeholder="e.g. Delhivery, BlueDart, DTDC" 
                        className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:border-[#B08D55] outline-none transition-colors"
                        value={trackingInfo.courier}
                        onChange={e => setTrackingInfo({...trackingInfo, courier: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Tracking / AWB Number</label>
                      <input 
                        required 
                        placeholder="e.g. 123456789" 
                        className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:border-[#B08D55] outline-none transition-colors font-mono"
                        value={trackingInfo.trackingId}
                        onChange={e => setTrackingInfo({...trackingInfo, trackingId: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Tracking Link (Optional)</label>
                      <input 
                        type="url"
                        placeholder="https://..." 
                        className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:border-[#B08D55] outline-none transition-colors"
                        value={trackingInfo.url}
                        onChange={e => setTrackingInfo({...trackingInfo, url: e.target.value})}
                      />
                   </div>
                   
                   <button type="submit" className="w-full bg-[#B08D55] text-white py-4 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-[#8c6a40] transition-colors shadow-lg mt-4">
                      Confirm Shipment
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};