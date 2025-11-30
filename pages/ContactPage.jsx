import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'; // Added doc, getDoc
import { db } from '@/lib/firebase';
import { SEO } from '@/components/SEO';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  
  // Dynamic Config
  const [config, setConfig] = useState({
    supportEmail: "hello@pahnawa.com",
    supportPhone: "+91 98765 43210",
    address: "B-21/128, Kamachha, Varanasi, India"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const snap = await getDoc(doc(db, 'settings', 'global'));
      if (snap.exists()) setConfig(prev => ({ ...prev, ...snap.data() }));
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) { setStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-white text-brand-dark font-sans">
      <SEO title="Contact Us" description="Get in touch with Pahnawa Banaras." />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Dynamic Contact Info */}
        <div>
          <span className="text-[#B08D55] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Get in Touch</span>
          <h1 className="font-serif text-4xl md:text-5xl mb-8">We'd Love to Hear From You</h1>
          <p className="text-gray-600 mb-12 font-light">
            Whether you have a question about our collections, need assistance with a custom bridal order, or just want to say hello, we are here to help.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FFFCF7] rounded-full text-[#B08D55]"><MapPin size={24} /></div>
              <div>
                <h4 className="font-serif text-xl mb-1">Visit Our Studio</h4>
                <p className="text-gray-500 text-sm whitespace-pre-line">{config.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FFFCF7] rounded-full text-[#B08D55]"><Mail size={24} /></div>
              <div>
                <h4 className="font-serif text-xl mb-1">Email Us</h4>
                <p className="text-gray-500 text-sm">{config.supportEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FFFCF7] rounded-full text-[#B08D55]"><Phone size={24} /></div>
              <div>
                <h4 className="font-serif text-xl mb-1">Call Us</h4>
                <p className="text-gray-500 text-sm">{config.supportPhone}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Mon - Sat, 10am - 7pm IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form (Same as before) */}
        <div className="bg-[#F9F9F9] p-8 md:p-12 rounded-sm relative overflow-hidden">
          {status === 'success' ? (
             <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600"><CheckCircle size={32} /></div>
                <h3 className="font-serif text-2xl mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We will get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-[#B08D55] text-xs font-bold uppercase tracking-widest hover:underline">Send Another</button>
             </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Name</label>
                    <input required type="text" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#B08D55]" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
                    <input required type="email" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#B08D55]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Your Email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Subject</label>
                  <input required type="text" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#B08D55]" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message</label>
                  <textarea required rows="4" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#B08D55]" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Write your message..."></textarea>
                </div>
                <button type="submit" disabled={status === 'loading'} className="w-full bg-[#B08D55] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#8C6A48] transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
                  {status === 'loading' ? <Loader2 className="animate-spin" size={18}/> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}