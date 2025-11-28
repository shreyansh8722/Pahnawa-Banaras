import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show after 5 seconds if not already seen
    const hasSeen = sessionStorage.getItem('newsletter_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('newsletter_seen', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await addDoc(collection(db, 'subscribers'), { email, createdAt: serverTimestamp() });
      setSubmitted(true);
      setTimeout(handleClose, 2000);
    } catch (err) { console.error(err); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md md:max-w-3xl rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row">
             <button onClick={handleClose} className="absolute top-4 right-4 z-20 bg-white/50 p-1 rounded-full hover:bg-white"><X size={20}/></button>
             
             {/* Image Side */}
             <div className="hidden md:block w-1/2 bg-[#F5F0EB]">
                <img src="https://images.unsplash.com/photo-1583391726247-e29237d8612f?w=600&fit=crop" className="w-full h-full object-cover" alt="Banarasi" />
             </div>

             {/* Content Side */}
             <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
                {submitted ? (
                   <div className="text-center py-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><Mail /></div>
                      <h3 className="text-xl font-serif font-bold">You're on the list!</h3>
                      <p className="text-gray-500 text-sm mt-2">Check your inbox for your welcome gift.</p>
                   </div>
                ) : (
                  <>
                    <p className="text-[#B08D55] text-xs font-bold uppercase tracking-widest mb-3">Join the Heritage</p>
                    <h2 className="font-serif text-3xl text-gray-900 mb-4">Unlock 10% Off</h2>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">Sign up for our newsletter to receive updates on new collections and a special welcome code.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-3">
                       <input 
                         type="email" 
                         placeholder="Enter your email" 
                         className="w-full border-b border-gray-300 py-2 text-center md:text-left outline-none focus:border-[#B08D55] transition-colors"
                         value={email}
                         onChange={e => setEmail(e.target.value)}
                         required
                       />
                       <button type="submit" className="w-full bg-[#1A1A1A] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B08D55] transition-colors mt-4">
                          Subscribe Now
                       </button>
                    </form>
                    <p className="text-[10px] text-gray-400 mt-4">By signing up, you agree to our Privacy Policy.</p>
                  </>
                )}
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};