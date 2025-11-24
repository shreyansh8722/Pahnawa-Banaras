import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const orderId = state?.orderId || 'Unknown';

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar cartCount={0} onOpenCart={() => {}} />
      
      <div className="flex-grow flex items-center justify-center bg-[#F9F9F9] px-4 py-20">
        <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-sm shadow-xl text-center border-t-4 border-brand-primary">
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>

          <h1 className="font-serif text-3xl text-brand-dark mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-8">
            Thank you for shopping with Pahnawa Banaras. Your royal heritage piece is being prepared.
          </p>

          <div className="bg-gray-50 p-4 rounded-sm mb-8 text-left">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Order ID</p>
            <p className="font-mono text-brand-dark font-medium">{orderId}</p>
          </div>

          <div className="space-y-3">
            <Link 
              to="/shop" 
              className="block w-full bg-brand-dark text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/" 
              className="block w-full border border-gray-200 text-gray-600 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}