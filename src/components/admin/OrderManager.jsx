import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { Truck, CheckCircle, XCircle, Clock, ChevronDown, Search } from 'lucide-react';

export const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status });
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
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">{order.createdAt?.toDate().toLocaleDateString()}</p>
                <p className="text-xl font-bold text-gray-900">₹{order.totalAmount}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
               {order.items?.map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3">
                    <span className="font-bold text-gray-500 text-xs">{item.quantity}x</span>
                    <span className="text-sm text-gray-800 flex-1">{item.name}</span>
                    <span className="text-sm text-gray-600">₹{item.price}</span>
                 </div>
               ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
               <button 
                 onClick={() => updateStatus(order.id, 'Shipped')}
                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold uppercase transition-colors"
               >
                 <Truck size={16} /> Mark Shipped
               </button>
               <button 
                 onClick={() => updateStatus(order.id, 'Delivered')}
                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-bold uppercase transition-colors"
               >
                 <CheckCircle size={16} /> Mark Delivered
               </button>
               <button 
                 onClick={() => updateStatus(order.id, 'Cancelled')}
                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold uppercase transition-colors ml-auto"
               >
                 <XCircle size={16} /> Cancel Order
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};