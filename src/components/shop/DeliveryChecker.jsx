import React, { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const DeliveryChecker = () => {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const checkDelivery = (e) => {
    e.preventDefault();
    if (pincode.length !== 6) return;
    
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      // Mock logic: Serviceable if it starts with '2' (Varanasi/UP region) or generic success
      setStatus('success'); 
    }, 1000);
  };

  return (
    <div className="py-6 border-t border-gray-100">
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3 flex items-center gap-2">
        <MapPin size={14} /> Check Delivery
      </h4>
      <form onSubmit={checkDelivery} className="relative max-w-xs">
        <input
          type="text"
          placeholder="Enter Pincode"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            setStatus('idle');
          }}
          className="w-full border-b border-gray-300 py-2 pr-20 text-sm focus:outline-none focus:border-black bg-transparent"
        />
        <button 
          type="submit"
          disabled={pincode.length !== 6 || status === 'loading'}
          className="absolute right-0 top-2 text-xs font-bold text-[#B08D55] uppercase disabled:opacity-50 hover:text-[#8c6a40] transition-colors"
        >
          {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 'Check'}
        </button>
      </form>

      {status === 'success' && (
        <p className="mt-2 text-xs text-green-700 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <CheckCircle size={12} /> Delivery by <span className="font-bold">7-10 Days</span>
        </p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <XCircle size={12} /> Sorry, we do not deliver to this location yet.
        </p>
      )}
    </div>
  );
};