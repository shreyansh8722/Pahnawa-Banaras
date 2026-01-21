import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, PackageX, ChevronRight, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-royal-gold gap-3">
         <Loader2 className="animate-spin" size={32} />
         <span className="text-[10px] uppercase tracking-widest">Loading Records...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-royal-border/60 rounded-sm bg-white text-center">
         <div className="w-16 h-16 rounded-full bg-royal-sand flex items-center justify-center mb-4">
            <PackageX size={32} className="text-royal-grey" strokeWidth={1.5} />
         </div>
         <h3 className="font-serif text-2xl text-royal-charcoal mb-2">No Past Orders</h3>
         <p className="text-sm text-royal-grey mb-8 max-w-md font-light">Your wardrobe is waiting for its first royal addition.</p>
         <Link to="/shop" className="bg-royal-maroon text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-royal-charcoal transition-colors shadow-lg">
            Start Shopping
         </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white border border-royal-border rounded-sm overflow-hidden hover:shadow-lg hover:border-royal-gold/30 transition-all duration-300">
           
           {/* ORDER HEADER */}
           <div className="bg-royal-sand/30 px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-royal-border/50">
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                 <div>
                    <span className="block text-[10px] uppercase tracking-widest text-royal-grey mb-0.5">Order ID</span>
                    <span className="font-mono text-xs text-royal-charcoal font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] uppercase tracking-widest text-royal-grey mb-0.5">Date</span>
                    <span className="font-serif text-royal-charcoal">
                       {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                    </span>
                 </div>
                 <div>
                    <span className="block text-[10px] uppercase tracking-widest text-royal-grey mb-0.5">Total</span>
                    <span className="font-serif text-royal-charcoal font-bold">₹{order.total?.toLocaleString()}</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm flex items-center gap-1.5 border ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-800 border-green-200' : 
                    order.status === 'shipped' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    'bg-yellow-50 text-yellow-800 border-yellow-200'
                 }`}>
                    {order.status === 'delivered' ? <CheckCircle size={12}/> : 
                     order.status === 'shipped' ? <Truck size={12}/> : 
                     <Clock size={12}/>}
                    {order.status || 'Processing'}
                 </span>
              </div>
           </div>

           {/* ORDER ITEMS */}
           <div className="p-6">
              {order.items?.map((item, idx) => (
                 <div key={idx} className="flex gap-4 mb-6 last:mb-0 items-center">
                    <div className="w-16 h-20 bg-royal-sand shrink-0 border border-royal-border rounded-sm overflow-hidden relative">
                       <img src={item.image || item.images?.[0] || item.featuredImageUrl} alt={item.name} className="w-full h-full object-cover" />
                       <span className="absolute bottom-0 right-0 bg-royal-charcoal text-white text-[9px] font-bold px-1.5 py-0.5">x{item.quantity}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <h4 className="font-serif text-lg text-royal-charcoal leading-tight mb-1 truncate">
                          <Link to={`/product/${item.id}`} className="hover:text-royal-maroon transition-colors">{item.name}</Link>
                       </h4>
                       <p className="text-xs text-royal-gold font-bold">₹{item.price?.toLocaleString()}</p>
                       {item.selectedOptions && Object.values(item.selectedOptions).some(Boolean) && (
                          <span className="inline-block mt-1 text-[9px] bg-royal-sand px-2 py-0.5 text-royal-grey rounded-sm">
                             Customized
                          </span>
                       )}
                    </div>
                    
                    <Link 
                        to={`/product/${item.id}`} 
                        className="hidden md:flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-royal-grey hover:text-royal-maroon border border-royal-border px-3 py-1.5 rounded-sm hover:border-royal-maroon transition-colors"
                    >
                       View Item
                    </Link>
                 </div>
              ))}
           </div>

           {/* ORDER ACTIONS */}
           <div className="px-6 py-3 bg-royal-cream border-t border-royal-border/50 flex justify-end gap-3">
              <button className="text-[10px] font-bold uppercase tracking-widest text-royal-charcoal hover:text-royal-gold transition-colors flex items-center gap-1">
                 <AlertCircle size={14} /> Need Help?
              </button>
           </div>

        </div>
      ))}
    </div>
  );
};