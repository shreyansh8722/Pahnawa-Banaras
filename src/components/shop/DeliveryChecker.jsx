import React, { useState } from 'react';
import { Truck, CheckCircle, XCircle, MapPin } from 'lucide-react';

export const DeliveryChecker = () => {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState(null); // 'available', 'invalid', 'loading'

  const checkDelivery = () => {
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setStatus('invalid');
      return;
    }
    
    // Simulate API call
    setStatus('loading');
    setTimeout(() => {
      setStatus('available');
    }, 600);
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5); // Add 5 days
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="py-5 border-t border-royal-border/40 mt-6">
       <h4 className="text-[10px] font-bold uppercase tracking-widest text-royal-grey mb-3 flex items-center gap-2">
         <Truck size={14} className="text-royal-gold" /> Check Delivery
       </h4>
       
       <div className="flex gap-2 mb-3 relative">
         <div className="relative flex-1">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-royal-grey/60" />
            <input 
                type="text" 
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => {
                    if (e.target.value.length <= 6 && /^\d*$/.test(e.target.value)) {
                        setPincode(e.target.value);
                        setStatus(null);
                    }
                }}
                className="w-full border border-royal-border rounded-sm pl-9 pr-3 py-2 text-sm text-royal-charcoal focus:outline-none focus:border-royal-gold focus:ring-1 focus:ring-royal-gold/20 transition-all placeholder:text-royal-grey/40 font-sans"
                maxLength={6}
            />
         </div>
         <button 
            onClick={checkDelivery}
            disabled={pincode.length !== 6}
            className="text-xs font-bold uppercase tracking-widest text-royal-maroon border border-royal-maroon/20 px-4 py-2 hover:bg-royal-maroon hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
         >
            Check
         </button>
       </div>
       
       {/* Status Messages */}
       {status === 'loading' && (
         <p className="text-xs text-royal-grey animate-pulse flex items-center gap-2">
            Checking availability...
         </p>
       )}

       {status === 'available' && (
         <div className="bg-green-50 border border-green-200 p-3 rounded-sm flex items-start gap-2 animate-fade-in">
            <CheckCircle size={14} className="text-green-700 mt-0.5 shrink-0" />
            <div>
                <p className="text-xs font-bold text-green-800 mb-0.5">Delivery Available</p>
                <p className="text-[11px] text-green-700">
                    Expected by <span className="font-bold">{getDeliveryDate()}</span>
                </p>
            </div>
         </div>
       )}

       {status === 'invalid' && (
         <div className="flex items-center gap-2 text-xs text-red-600 animate-fade-in mt-1">
            <XCircle size={14} />
            <span>Please enter a valid 6-digit pincode.</span>
         </div>
       )}
    </div>
  );
};