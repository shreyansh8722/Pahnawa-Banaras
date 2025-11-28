import React, { useState, useEffect } from 'react';
import { Package, RefreshCcw, Star, ShieldCheck, AlertCircle, FileText, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { useLoginModal } from '@/context/LoginModalContext';

export const ProductTabs = ({ description, material, weave, sku, productId }) => {
  const [activeTab, setActiveTab] = useState('details');
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();

  // Review State
  const [reviews, setReviews] = useState([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Fetch Reviews Real-time
  useEffect(() => {
    if (!productId) return;
    const q = query(
      collection(db, 'reviews'), 
      where('spotId', '==', productId), // We use 'spotId' in your ReviewForm schema
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [productId]);

  const handleWriteReview = () => {
    if (!user) {
      openLoginModal();
    } else {
      setIsWritingReview(true);
    }
  };

  const tabs = [
    { id: 'details', label: 'Description' },
    { id: 'returns', label: 'Returns' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="mt-10 border-t border-gray-100">
      <div className="flex gap-8 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
          </button>
        ))}
      </div>

      <div className="py-8 min-h-[200px]">
        <AnimatePresence mode="wait">
          
          {activeTab === 'details' && (
            <motion.div 
              key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-6 text-sm text-gray-600 leading-relaxed font-light"
            >
              <p className="whitespace-pre-line text-base">{description || "Authentic Banarasi handloom crafted with precision."}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4">
                <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Material</span><span className="font-medium text-gray-900">{material}</span></div>
                <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Craft</span><span className="font-medium text-gray-900">{weave}</span></div>
                <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">SKU</span><span className="font-medium text-gray-900">{sku}</span></div>
              </div>
            </motion.div>
          )}

          {activeTab === 'returns' && (
            <motion.div 
              key="returns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-6 text-sm text-gray-600"
            >
              <div className="flex gap-4 items-start">
                 <div className="w-10 h-10 rounded-full bg-[#B08D55]/10 flex items-center justify-center text-[#B08D55] shrink-0"><RefreshCcw size={20} /></div>
                 <div><h4 className="font-bold text-gray-900 mb-1">7-Day Returns</h4><p>Returns accepted for unused items with tags within 7 days.</p></div>
              </div>
              <Link to="/returns" className="text-[#B08D55] font-bold text-xs uppercase tracking-wider hover:underline ml-14">Read Full Policy</Link>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
               {isWritingReview ? (
                 <ReviewForm 
                    spotId={productId} 
                    user={user} 
                    onPostSuccess={() => setIsWritingReview(false)}
                    isPosting={isPosting}
                    setIsPosting={setIsPosting}
                 />
               ) : (
                 <div className="space-y-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-xl text-gray-900">Customer Reviews</h3>
                      <button onClick={handleWriteReview} className="flex items-center gap-2 text-[#B08D55] font-bold text-xs uppercase tracking-widest hover:bg-[#B08D55]/10 px-4 py-2 rounded-sm transition-colors">
                         <PenTool size={14} /> Write a Review
                      </button>
                    </div>

                    {reviews.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-sm">
                         <div className="flex justify-center gap-1 text-gray-300 mb-2">{[1,2,3,4,5].map(i=><Star key={i} size={20} fill="currentColor"/>)}</div>
                         <p className="text-gray-500 text-sm">Be the first to review this masterpiece.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {reviews.map(review => (
                          <ReviewCard key={review.id} review={review} user={user} onDeleteReview={() => {}} onMarkHelpful={() => {}} />
                        ))}
                      </div>
                    )}
                 </div>
               )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};