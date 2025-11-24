import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';

export const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-2xl text-brand-dark">Orders Received</h3>
        <button onClick={fetchOrders} className="text-sm text-brand-primary hover:underline">Refresh List</button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-sm">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No orders yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between">
              
              {/* Order Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">#{order.id.slice(0,6)}</span>
                    <span className="text-xs text-gray-500">{order.createdAt?.toDate().toLocaleString()}</span>
                </div>
                <h4 className="font-bold text-brand-dark text-lg mb-1">₹{order.totalAmount}</h4>
                <p className="text-sm text-gray-600 mb-4">
                    Customer: <span className="font-medium">{order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</span> 
                    <br/><span className="text-xs text-gray-400">{order.shippingDetails?.phone}</span>
                </p>
                
                <div className="space-y-1">
                    {order.items?.map((item, i) => (
                        <div key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-gray-400">x{item.quantity}</span> {item.name}
                        </div>
                    ))}
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex flex-col gap-2 min-w-[150px]">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Update Status</p>
                <button 
                    onClick={() => updateStatus(order.id, 'Shipped')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-sm transition-colors ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                >
                    <Truck size={14} /> Shipped
                </button>
                <button 
                    onClick={() => updateStatus(order.id, 'Delivered')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-sm transition-colors ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                >
                    <CheckCircle size={14} /> Delivered
                </button>
                <div className="mt-2 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">Current: {order.status}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};