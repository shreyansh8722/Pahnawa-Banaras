import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Package, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Download, Loader2, Truck, ExternalLink, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { generateInvoice } from '@/components/admin/InvoiceGenerator'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function MyOrders({ userId, limit }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // --- 1. DATA FETCHING (Your Logic) ---
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Using onSnapshot for real-time updates which is better for UX than getDocs
    let q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (limit) {
      q = query(q, firestoreLimit(limit));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
         const data = doc.data();
         return {
            id: doc.id,
            ...data,
            // Handle Timestamp to Date conversion safely
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now())
         };
      });
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, limit]);

  // --- 2. INVOICE GENERATOR ---
  const handleDownloadInvoice = async (e, order) => {
    e.stopPropagation();
    try {
      setDownloadingId(order.id);
      await generateInvoice(order);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Could not generate invoice");
    } finally {
      setDownloadingId(null);
    }
  };

  // --- 3. STATUS CONFIG ---
  const getStatusStyle = (status) => {
    const s = (status || 'processing').toLowerCase();
    if (s.includes('deliver') || s.includes('complet')) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 };
    if (s.includes('ship') || s.includes('dispatch')) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Truck };
    if (s.includes('cancel')) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle };
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="animate-spin text-[#B08D55]" size={32} />
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Loading Orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-stone-50 rounded-sm border border-stone-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-stone-300">
          <Package size={32} strokeWidth={1} />
        </div>
        <h3 className="text-xl font-serif text-stone-800 mb-2 italic">No Orders Yet</h3>
        <p className="text-sm text-stone-500 mb-6 max-w-xs font-sans">
          Your collection awaits its first masterpiece from Banaras.
        </p>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-[#1a1a1a] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#B08D55] transition-colors shadow-lg"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        // --- 4. DATA NORMALIZATION (Crucial Fix) ---
        // This makes sure both 'shippingAddress' (from checkout) and 'shippingDetails' (from your snippet) work.
        const rawAddr = order.shippingAddress || order.shippingDetails || order.address || {};
        const address = {
          name: rawAddr.fullName || rawAddr.firstName ? `${rawAddr.firstName} ${rawAddr.lastName}` : rawAddr.name || 'Valued Customer',
          line1: rawAddr.addressLine1 || rawAddr.address || '',
          city: rawAddr.city || '',
          state: rawAddr.state || '',
          pincode: rawAddr.pincode || rawAddr.zip || '',
          phone: rawAddr.phone || rawAddr.mobile || ''
        };

        const total = Number(order.total || order.totalAmount || order.finalPrice || 0);
        const itemCount = order.items?.length || 0;
        const statusConfig = getStatusStyle(order.status);
        const StatusIcon = statusConfig.icon;
        const isExpanded = expandedOrder === order.id;

        // Get first item image for preview
        const previewImage = order.items?.[0]?.featuredImageUrl || order.items?.[0]?.image || '/placeholder.jpg';

        return (
          <div 
            key={order.id} 
            className={`bg-white border rounded-lg overflow-hidden transition-all duration-300 ${isExpanded ? 'border-[#B08D55] shadow-md' : 'border-stone-200 hover:border-stone-300'}`}
          >
            {/* CARD HEADER */}
            <div 
              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              className="p-5 flex flex-col md:flex-row gap-6 cursor-pointer group"
            >
              {/* Image & Basic Info */}
              <div className="flex gap-5 flex-1">
                 <div className="w-16 h-20 md:w-20 md:h-24 bg-stone-100 rounded-sm overflow-hidden border border-stone-200 shrink-0">
                    <img src={previewImage} alt="Order Preview" className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-serif text-lg text-stone-900">Order #{order.id.slice(-6).toUpperCase()}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                          <StatusIcon size={10} /> {order.status || 'Processing'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-sans flex items-center gap-2">
                        <Clock size={12}/> Placed on {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    
                    <div className="md:hidden pt-2">
                       <span className="font-bold text-stone-900">₹{formatPrice(total)}</span>
                       <span className="text-xs text-stone-500"> • {itemCount} Item(s)</span>
                    </div>
                 </div>
              </div>

              {/* Actions & Price (Desktop) */}
              <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                 <div className="hidden md:block text-right">
                    <p className="text-xl font-serif text-stone-900">₹{formatPrice(total)}</p>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">{itemCount} Item(s)</p>
                 </div>

                 <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => handleDownloadInvoice(e, order)}
                      disabled={downloadingId === order.id}
                      className="flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all"
                    >
                      {downloadingId === order.id ? <Loader2 size={14} className="animate-spin"/> : <Download size={14}/>}
                      <span className="hidden sm:inline">Invoice</span>
                    </button>
                    
                    <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-[#B08D55] text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200'}`}>
                      {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                 </div>
              </div>
            </div>

            {/* EXPANDED DETAILS */}
            {isExpanded && (
              <div className="border-t border-stone-100 bg-[#FAF9F6] p-6 animate-fade-in">
                
                {/* 1. Address & Payment Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                   <div className="bg-white p-5 rounded-sm border border-stone-200/60 shadow-sm">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3 flex items-center gap-2">
                        <Truck size={12}/> Shipping Details
                      </h4>
                      {address.line1 ? (
                        <div className="text-sm text-stone-600 space-y-1 font-sans">
                          <p className="font-bold text-stone-900">{address.name}</p>
                          <p>{address.line1}</p>
                          <p>{address.city}, {address.state} - {address.pincode}</p>
                          <p className="text-xs mt-2 pt-2 border-t border-stone-100 text-stone-500">Phone: {address.phone}</p>
                        </div>
                      ) : (
                         <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-3 rounded">
                            <AlertCircle size={14}/> Address data incomplete
                         </div>
                      )}
                   </div>

                   <div className="bg-white p-5 rounded-sm border border-stone-200/60 shadow-sm flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3 flex items-center gap-2">
                          <Package size={12}/> Order Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-stone-500">
                             <span>Payment Method</span>
                             <span className="font-medium text-stone-900 uppercase">{order.paymentMethod || 'COD'}</span>
                          </div>
                          <div className="flex justify-between text-stone-500">
                             <span>Date</span>
                             <span className="font-medium text-stone-900">{order.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center">
                         <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Total Amount</span>
                         <span className="text-xl font-serif text-[#B08D55]">₹{formatPrice(total)}</span>
                      </div>
                   </div>
                </div>

                {/* 2. Items List */}
                <div className="bg-white rounded-sm border border-stone-200 overflow-hidden">
                   <div className="px-5 py-3 bg-stone-50 border-b border-stone-200">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Items in Order</h4>
                   </div>
                   <div className="divide-y divide-stone-100">
                     {order.items?.map((item, i) => (
                       <div key={i} className="flex gap-4 p-4 hover:bg-stone-50/50 transition-colors">
                          <img 
                            src={item.featuredImageUrl || item.image || '/placeholder.jpg'} 
                            alt={item.name} 
                            className="w-16 h-20 object-cover rounded-sm bg-stone-200"
                          />
                          <div className="flex-1">
                             <h5 className="font-serif text-stone-900">{item.name}</h5>
                             
                             {/* Handle Options: Check both 'selectedOptions' formats */}
                             {(item.selectedOptions && Object.keys(item.selectedOptions).length > 0) && (
                               <div className="flex flex-wrap gap-2 mt-1">
                                 {Object.entries(item.selectedOptions)
                                   .filter(([_, val]) => val) // Only show true/truthy options
                                   .map(([key, val]) => (
                                     <span key={key} className="text-[10px] px-1.5 py-0.5 bg-[#B08D55]/10 text-[#B08D55] rounded-sm uppercase tracking-wide">
                                       {typeof val === 'boolean' ? key : `${key}: ${val}`}
                                     </span>
                                 ))}
                               </div>
                             )}
                             
                             <div className="mt-2 text-xs text-stone-400">
                                Size: <span className="text-stone-600 font-medium">{item.selectedSize || 'Standard'}</span>
                                <span className="mx-2">•</span>
                                Qty: <span className="text-stone-600 font-medium">{item.quantity}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-stone-900 text-sm">₹{formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* 3. Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button 
                    onClick={() => navigate('/track-order')}
                    className="flex-1 bg-[#1a1a1a] text-white py-3 px-6 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B08D55] transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md"
                  >
                    <Truck size={14}/> Track Shipment
                  </button>
                  <button 
                    onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                    className="flex-1 bg-white border border-stone-300 text-stone-700 py-3 px-6 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-50 hover:border-stone-400 transition-colors flex items-center justify-center gap-2 rounded-sm"
                  >
                    <ExternalLink size={14}/> Need Help?
                  </button>
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}