import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle, ChevronRight } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { AddressSelector } from '@/components/checkout/AddressSelector';

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const cart = state?.cart || [];
  const subtotal = state?.subtotal || 0;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(true); // Default to true, toggle if addresses exist

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

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/shop');
    }
  }, [cart, navigate]);

  // Check if user has addresses to decide whether to show form initially
  // (Optional optimization: You could check this inside AddressSelector 
  // and lift state up, but for now we default form to open)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (addr) => {
    // Map the saved address format to our form format
    const [first, ...rest] = addr.name.split(' ');
    setFormData({
        firstName: first || '',
        lastName: rest.join(' ') || '',
        email: formData.email,
        phone: addr.phone,
        address: addr.street,
        city: addr.city,
        pincode: addr.pincode,
        state: addr.state
    });
    // Visual feedback handled by AddressSelector prop, but we can also auto-advance or just close form
    setShowAddressForm(false);
  };

  const validateShipping = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.address && formData.pincode && formData.phone) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("Please fill in all required shipping fields.");
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const functions = getFunctions();
      const createOrder = httpsCallable(functions, 'createOrder');
      
      const result = await createOrder({
        items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions
        })),
        shippingDetails: formData,
        paymentMethod: paymentMethod
      });

      const { orderId, success } = result.data;

      if (success) {
        if (clearCart) clearCart();
        navigate('/order-success', { state: { orderId: orderId } });
      }

    } catch (error) {
      console.error("Order failed:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-brand-dark">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => currentStep === 1 ? navigate(-1) : setCurrentStep(1)} 
            className="p-2 -ml-2 text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-serif text-2xl text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* --- STEP 1: SHIPPING --- */}
            <div className={`bg-white p-6 md:p-8 rounded-sm shadow-sm border transition-all duration-300 ${currentStep === 1 ? 'border-[#B08D55] ring-1 ring-[#B08D55]/20' : 'border-gray-100 opacity-60'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl flex items-center gap-3 text-gray-900">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep > 1 ? 'bg-green-600 text-white' : 'bg-[#B08D55] text-white'}`}>
                    {currentStep > 1 ? <CheckCircle size={14} /> : '1'}
                  </span>
                  Shipping Address
                </h2>
                {currentStep > 1 && (
                  <button onClick={() => setCurrentStep(1)} className="text-xs text-[#B08D55] font-bold uppercase hover:underline">
                    Edit
                  </button>
                )}
              </div>

              <AnimatePresence>
                {currentStep === 1 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                     {/* Address Selector */}
                     <AddressSelector 
                        selectedAddress={formData}
                        onSelect={handleAddressSelect}
                        onAddNew={() => {
                            setFormData(prev => ({...prev, firstName: '', address: '', pincode: ''})); // Clear basics
                            setShowAddressForm(true);
                        }}
                     />

                    {/* Manual Form */}
                    {showAddressForm ? (
                        <form id="shipping-form" onSubmit={validateShipping} className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <input required name="firstName" placeholder="First Name *" className="border border-gray-200 p-3 rounded-sm w-full text-sm focus:border-[#B08D55] outline-none bg-transparent" onChange={handleInputChange} value={formData.firstName} />
                            <input required name="lastName" placeholder="Last Name *" className="border border-gray-200 p-3 rounded-sm w-full text-sm focus:border-[#B08D55] outline-none bg-transparent" onChange={handleInputChange} value={formData.lastName} />
                            <input required name="email" type="email" placeholder="Email Address *" className="border border-gray-200 p-3 rounded-sm w-full text-sm focus:border-[#B08D55] outline-none bg-transparent md:col-span-2" value={formData.email} onChange={handleInputChange} />
                            <input required name="phone" type="tel" placeholder="Phone Number *" className="border border-gray-200 p-3 rounded-sm w-full text-sm focus:border-[#B08D55] outline-none bg-transparent md:col-span-2" onChange={handleInputChange} value={formData.phone} />
                            <input required name="address" placeholder="Address (House No, Building, Street) *" className="border border-gray-200 p-3 rounded-sm w-full text-sm focus:border-[#B08D55] outline-none bg-transparent md:col-span-2" onChange={handleInputChange} value={formData.address} />
                            <input required name="city" placeholder="City *" className="border border-gray-200 p-3 rounded-sm w-full text-sm focus:border-[#B08D55] outline-none bg-transparent" onChange={handleInputChange} value={formData.city} />
                            <input required name="pincode" placeholder="Pincode *" className="border border-gray-200 p-3 rounded-sm w-full text-sm focus:border-[#B08D55] outline-none bg-transparent" onChange={handleInputChange} value={formData.pincode} />
                            
                            <div className="md:col-span-2 mt-4">
                                <button type="submit" className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg rounded-sm flex justify-center items-center gap-2">
                                Continue to Payment <ChevronRight size={16} />
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Summary of selected address when form is hidden (but still in step 1)
                        <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm">
                            <p className="font-bold text-sm">{formData.firstName} {formData.lastName}</p>
                            <p className="text-xs text-gray-600">{formData.address}</p>
                            <p className="text-xs text-gray-600">{formData.city}, {formData.pincode}</p>
                            <button onClick={() => validateShipping({ preventDefault: () => {} })} className="w-full mt-4 bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all rounded-sm">
                                Continue with this Address
                            </button>
                        </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- STEP 2: PAYMENT --- */}
            <div className={`bg-white p-6 md:p-8 rounded-sm shadow-sm border transition-all duration-300 ${currentStep === 2 ? 'border-[#B08D55] ring-1 ring-[#B08D55]/20' : 'border-gray-100 opacity-60'}`}>
              <h2 className="font-serif text-xl mb-6 flex items-center gap-3 text-gray-900">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 2 ? 'bg-[#B08D55] text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
                Payment Method
              </h2>

              <AnimatePresence>
                {currentStep === 2 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    className="space-y-4 overflow-hidden"
                  >
                    <label className={`flex items-center p-4 border rounded-sm cursor-pointer transition-all group ${paymentMethod === 'online' ? 'border-[#B08D55] bg-[#B08D55]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-[#B08D55] w-4 h-4" />
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm text-gray-900">Pay Online</span>
                          <CreditCard size={20} className="text-gray-400"/>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">UPI, Cards, Netbanking (Secure)</p>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border rounded-sm cursor-pointer transition-all group ${paymentMethod === 'cod' ? 'border-[#B08D55] bg-[#B08D55]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-[#B08D55] w-4 h-4" />
                      <div className="ml-4">
                        <span className="font-bold text-sm text-gray-900">Cash on Delivery</span>
                        <p className="text-xs text-gray-500 mt-1">Pay in cash upon delivery</p>
                      </div>
                    </label>

                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full mt-6 bg-[#B08D55] text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#8c6a40] transition-all shadow-lg disabled:bg-gray-400 flex justify-center items-center gap-2 rounded-sm"
                    >
                      {isProcessing ? 'Processing...' : `Pay ₹${subtotal.toLocaleString('en-IN')}`}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider mt-4">
                      <ShieldCheck size={14} /> 100% Secure Payment
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN - ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm sticky top-24">
              <h3 className="font-serif text-lg mb-4 pb-4 border-b border-gray-100 text-gray-900">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.cartItemId || item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.featuredImageUrl || item.imageUrls?.[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">{item.name}</h4>
                      <div className="flex justify-between mt-2 items-end">
                        <div className="text-xs text-gray-500 space-y-0.5">
                            <p>Qty: {item.quantity}</p>
                            {item.selectedOptions?.fallPico && <p>+ Fall/Pico</p>}
                        </div>
                        <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-700 font-bold text-xs uppercase">Free</span></div>
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t border-gray-100 mt-2"><span>Total</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}