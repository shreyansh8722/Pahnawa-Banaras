import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatPrice } from '@/lib/utils'; // Assuming you have this helper, or just use toLocaleString

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback ID from state or URL logic could be added here
  const orderId = state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/'); // Redirect to home if no ID
      return;
    }

    const fetchOrder = async () => {
      try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  // Calculate estimated delivery (7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 md:py-20">
        <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-sm shadow-xl border-t-4 border-[#B08D55]">
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3">Order Confirmed!</h1>
            <p className="text-gray-500 text-sm">
                Namaste, thank you for choosing Pahnawa Banaras.<br/>
                We have sent a confirmation email to <span className="font-bold text-gray-900">{order?.userEmail}</span>.
            </p>
          </div>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-300" /></div>
          ) : order ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Order Meta */}
                <div className="flex flex-col md:flex-row gap-4 justify-between bg-gray-50 p-6 rounded-sm border border-gray-100">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Order ID</p>
                        <p className="font-mono text-sm font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Total Amount</p>
                        <p className="font-serif text-lg font-bold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Estimated Delivery</p>
                        <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                           <Calendar size={14} /> {formattedDate}
                        </p>
                    </div>
                </div>

                {/* Items Summary (Compact) */}
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-100 pb-2">Items Ordered</h3>
                   <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="w-12 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                             <img src={item.image || item.featuredImageUrl} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-sm">
                   <MapPin className="text-[#B08D55] mt-1 shrink-0" size={18} />
                   <div>
                      <p className="text-sm font-bold text-gray-900">Shipping to:</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.shippingDetails?.address}, {order.shippingDetails?.city} - {order.shippingDetails?.pincode}
                      </p>
                   </div>
                </div>

            </div>
          ) : (
            <p className="text-center text-red-500">Order details could not be loaded.</p>
          )}

          <div className="space-y-3 mt-10">
            <Link 
              to="/shop" 
              className="block text-center w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-sm shadow-lg"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}