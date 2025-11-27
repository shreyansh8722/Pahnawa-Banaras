import React, { useState } from 'react';
import { Package, RefreshCcw, Star, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductTabs = ({ description, material, weave, sku }) => {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Description' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="mt-10 border-t border-gray-200">
      {/* Clean Tab Headers */}
      <div className="flex gap-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id 
                ? 'text-black' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8 min-h-[200px]">
        <AnimatePresence mode="wait">
          
          {activeTab === 'details' && (
            <motion.div 
              key="details"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-6 text-sm text-gray-600 leading-relaxed font-light"
            >
              <p className="whitespace-pre-line text-base">{description || "Authentic Banarasi handloom crafted with precision."}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                   <span className="text-gray-500">Material</span>
                   <span className="font-medium text-gray-900">{material || "Pure Katan Silk"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                   <span className="text-gray-500">Craft</span>
                   <span className="font-medium text-gray-900">{weave || "Kadwa Handloom"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                   <span className="text-gray-500">SKU</span>
                   <span className="font-medium text-gray-900">{sku || "PB-VAR-001"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                   <span className="text-gray-500">Weight</span>
                   <span className="font-medium text-gray-900">~600g</span>
                </div>
              </div>

              {/* The Reference Site's "Note" Section */}
              <div className="bg-gray-50 p-4 rounded-sm flex gap-3 mt-6">
                 <AlertCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
                 <div className="text-xs text-gray-500">
                    <span className="font-bold text-gray-700 uppercase block mb-1">Handcrafted Note</span>
                    This is a handwoven product. Slight irregularities in the weave or pattern are natural and testify to the authenticity of the craft, adding to its unique charm.
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'shipping' && (
            <motion.div 
              key="shipping"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-6 text-sm text-gray-600"
            >
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#B08D55]/10 flex items-center justify-center text-[#B08D55] shrink-0">
                    <Package size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 mb-1">Dispatch Time</h4>
                    <p>Ready to ship. Dispatched within 24-48 hours.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#B08D55]/10 flex items-center justify-center text-[#B08D55] shrink-0">
                    <RefreshCcw size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 mb-1">Easy Returns</h4>
                    <p>Returns accepted within 7 days of delivery. Product must be unused with tags intact.</p>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-8"
            >
               <h3 className="font-serif text-xl text-gray-900 mb-2">Customer Reviews</h3>
               <div className="flex justify-center gap-1 text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#e5e7eb" className="text-gray-200" />)}
               </div>
               <p className="text-gray-500 text-sm mb-6">No reviews yet. Be the first to share your experience!</p>
               <button className="text-[#B08D55] font-bold text-xs uppercase tracking-widest border-b border-[#B08D55] pb-0.5 hover:text-[#8c6a40] hover:border-[#8c6a40] transition-colors">
                  Write a Review
               </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};