import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cart = state?.cart || [];
  const subtotal = state?.subtotal || 0;
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: auth.currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/shop');
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Construct Order Data
      const orderData = {
        userId: auth.currentUser?.uid || 'guest',
        items: cart,
        totalAmount: subtotal,
        shippingDetails: formData,
        paymentMethod: paymentMethod,
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      // 2. Save to Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // 3. Simulate Payment Processing (Replace this with Razorpay/Stripe logic later)
      setTimeout(() => {
        setIsProcessing(false);
        // Redirect to Success Page
        navigate('/order-success', { state: { orderId: docRef.id } });
      }, 2000);

    } catch (error) {
      console.error("Order failed:", error);
      setIsProcessing(false);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-brand-dark">
      <Navbar cartCount={cart.length} onOpenCart={() => {}} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-8"
        >
          <ArrowLeft size={16} /> Back to Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN - DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Shipping Section */}
            <section className="bg-white p-6 md:p-8 shadow-sm border border-gray-100 rounded-sm">
              <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-sans">1</span>
                Shipping Details
              </h2>
              
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="firstName" placeholder="First Name" className="border p-3 rounded-sm w-full text-sm focus:outline-none focus:border-brand-primary" onChange={handleInputChange} />
                <input required name="lastName" placeholder="Last Name" className="border p-3 rounded-sm w-full text-sm focus:outline-none focus:border-brand-primary" onChange={handleInputChange} />
                <input required name="email" type="email" placeholder="Email Address" className="border p-3 rounded-sm w-full text-sm focus:outline-none focus:border-brand-primary md:col-span-2" value={formData.email} onChange={handleInputChange} />
                <input required name="phone" type="tel" placeholder="Phone Number" className="border p-3 rounded-sm w-full text-sm focus:outline-none focus:border-brand-primary md:col-span-2" onChange={handleInputChange} />
                <input required name="address" placeholder="Street Address" className="border p-3 rounded-sm w-full text-sm focus:outline-none focus:border-brand-primary md:col-span-2" onChange={handleInputChange} />
                <input required name="city" placeholder="City" className="border p-3 rounded-sm w-full text-sm focus:outline-none focus:border-brand-primary" onChange={handleInputChange} />
                <input required name="pincode" placeholder="Pincode" className="border p-3 rounded-sm w-full text-sm focus:outline-none focus:border-brand-primary" onChange={handleInputChange} />
              </form>
            </section>

            {/* Payment Section */}
            <section className="bg-white p-6 md:p-8 shadow-sm border border-gray-100 rounded-sm">
              <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-sans">2</span>
                Payment Method
              </h2>

              <div className="space-y-4">
                {/* Online Payment Option */}
                <label className={`flex items-center p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="online" 
                    checked={paymentMethod === 'online'} 
                    onChange={() => setPaymentMethod('online')}
                    className="w-4 h-4 text-brand-primary accent-brand-primary"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">Credit/Debit Card, UPI, Netbanking</span>
                      <div className="flex gap-2">
                         {/* Simple SVG Icons for visuals */}
                         <div className="w-8 h-5 bg-gray-200 rounded"></div>
                         <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Secure payment via Razorpay</p>
                  </div>
                </label>

                {/* COD Option */}
                <label className={`flex items-center p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-brand-primary accent-brand-primary"
                  />
                  <div className="ml-4">
                    <span className="font-bold text-sm">Cash on Delivery</span>
                    <p className="text-xs text-gray-500 mt-1">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm sticky top-28">
              <h3 className="font-serif text-xl mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.featuredImageUrl || item.imageUrls?.[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-brand-dark line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-brand-primary mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-brand-dark pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                disabled={isProcessing}
                className="w-full mt-8 bg-brand-primary text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-brand-primaryDark transition-all shadow-lg disabled:bg-gray-400 flex justify-center items-center gap-2"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${subtotal}`}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider">
                <ShieldCheck size={14} />
                Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}