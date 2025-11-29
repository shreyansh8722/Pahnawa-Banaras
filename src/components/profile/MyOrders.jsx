import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const MyOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle size={14} />;
      case 'shipped': return <Truck size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading your royal history...</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package size={48} className="mx-auto text-gray-200 mb-4" />
        <h3 className="font-serif text-xl text-gray-900">No Orders Yet</h3>
        <p className="text-gray-500 text-sm mb-6">Your wardrobe is waiting for a masterpiece.</p>
        <a href="/shop" className="text-[#B08D55] font-bold text-xs uppercase hover:underline">Start Shopping</a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl mb-6">Order History</h2>
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-100 rounded-sm overflow-hidden transition-all hover:border-gray-300">
          
          {/* Header */}
          <div 
            className="p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer"
            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 text-[#B08D55]">
                <Package size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${getStatusColor(order.status || 'Processing')}`}>
                {getStatusIcon(order.status || 'Processing')} {order.status || 'Processing'}
              </span>
              {expandedOrder === order.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </div>
          </div>

          {/* Expanded Details */}
          {expandedOrder === order.id && (
            <div className="p-6 border-t border-gray-100 bg-white animation-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                 <div>
                   <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Shipping To</h4>
                   <p className="text-sm font-bold text-gray-900">{order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</p>
                   <p className="text-sm text-gray-600">{order.shippingDetails?.address}</p>
                   <p className="text-sm text-gray-600">{order.shippingDetails?.city}, {order.shippingDetails?.state} - {order.shippingDetails?.pincode}</p>
                   <p className="text-sm text-gray-600 mt-1">📞 {order.shippingDetails?.phone}</p>
                 </div>
                 <div>
                   <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Info</h4>
                   <p className="text-sm text-gray-900"><span className="font-bold">Method:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
                   <p className="text-sm text-gray-900"><span className="font-bold">Date:</span> {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                 </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Items</h4>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-10 h-14 object-cover rounded-sm bg-gray-100" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                         <p className="text-xs text-gray-500">
                           {Object.entries(item.selectedOptions).filter(([_, v]) => v).map(([k]) => k).join(', ')}
                         </p>
                      )}
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-gray-900">₹{item.price?.toLocaleString('en-IN')}</p>
                       <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};