import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Truck, CheckCircle, XCircle, Clock, Package, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  
  // Modal State for Shipping
  const [shippingModal, setShippingModal] = useState({ open: false, orderId: null });
  const [trackingInfo, setTrackingInfo] = useState({ courier: '', trackingId: '', url: '' });

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // 1. Direct Status Update (for Delivered/Cancelled)
  const updateStatus = async (id, status) => {
    if (window.confirm(`Mark order as ${status}?`)) {
      await updateDoc(doc(db, 'orders', id), { status });
    }
  };

  // 2. Open Shipping Modal
  const openShipModal = (orderId) => {
    setShippingModal({ open: true, orderId });
    setTrackingInfo({ courier: '', trackingId: '', url: '' });
  };

  // 3. Submit Shipping Details
  const handleShipOrder = async (e) => {
    e.preventDefault();
    if (!shippingModal.orderId) return;

    await updateDoc(doc(db, 'orders', shippingModal.orderId), {
      status: 'Shipped',
      tracking: trackingInfo,
      shippedAt: serverTimestamp()
    });

    setShippingModal({ open: false, orderId: null });
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Shipped: 'bg-blue-100 text-blue-700',
      Delivered: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="font-mono text-sm text-gray-500">#{order.id.slice(0,8)}</span>
                   <StatusBadge status={order.status} />
                </div>
                <h3 className="font-medium text-gray-900">{order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</h3>
                <p className="text-sm text-gray-500">{order.shippingDetails?.city}, {order.shippingDetails?.state}</p>
                
                {/* Show Tracking info if Shipped */}
                {order.tracking && (
                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded inline-block">
                    <span className="font-bold">{order.tracking.courier}</span>: {order.tracking.trackingId}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <Clock size={14}/> {order.createdAt?.toDate().toLocaleDateString()}
                </p>
                <p className="text-xl font-bold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
               {order.items?.map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3">
                    <span className="font-bold text-gray-500 text-xs">{item.quantity}x</span>
                    <span className="text-sm text-gray-800 flex-1 line-clamp-1">{item.name}</span>
                    {item.selectedOptions?.fallPico && <span className="text-[10px] bg-white border border-gray-200 px-1 rounded">Fall/Pico</span>}
                    <span className="text-sm text-gray-600">₹{item.price}</span>
                 </div>
               ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
               {order.status === 'Pending' && (
                 <button 
                   onClick={() => openShipModal(order.id)}
                   className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold uppercase transition-colors shadow-sm"
                 >
                   <Truck size={16} /> Ship Order
                 </button>
               )}
               
               {order.status === 'Shipped' && (
                 <button 
                   onClick={() => updateStatus(order.id, 'Delivered')}
                   className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-xs font-bold uppercase transition-colors shadow-sm"
                 >
                   <CheckCircle size={16} /> Mark Delivered
                 </button>
               )}
               
               {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                 <button 
                   onClick={() => updateStatus(order.id, 'Cancelled')}
                   className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase transition-colors ml-auto"
                 >
                   <XCircle size={16} /> Cancel
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Modal */}
      <AnimatePresence>
        {shippingModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
                onClick={() => setShippingModal({ open: false, orderId: null })} 
             />
             <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 p-6"
             >
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-gray-900">Ship Order</h3>
                   <button onClick={() => setShippingModal({ open: false, orderId: null })}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleShipOrder} className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Courier Name</label>
                      <input 
                        required 
                        placeholder="e.g. Delhivery, BlueDart" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-[#B08D55] outline-none"
                        value={trackingInfo.courier}
                        onChange={e => setTrackingInfo({...trackingInfo, courier: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tracking Number</label>
                      <input 
                        required 
                        placeholder="e.g. 123456789" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-[#B08D55] outline-none"
                        value={trackingInfo.trackingId}
                        onChange={e => setTrackingInfo({...trackingInfo, trackingId: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tracking URL (Optional)</label>
                      <input 
                        placeholder="https://..." 
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-[#B08D55] outline-none"
                        value={trackingInfo.url}
                        onChange={e => setTrackingInfo({...trackingInfo, url: e.target.value})}
                      />
                   </div>
                   
                   <button type="submit" className="w-full bg-[#B08D55] text-white py-3 rounded-lg font-bold hover:bg-[#8c6a40] transition-colors">
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