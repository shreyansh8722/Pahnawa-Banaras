import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone, Loader2, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'; 
import { db } from '@/lib/firebase';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  
  // Dynamic Settings State
  const [config, setConfig] = useState({
    supportEmail: "hello@pahnawa.com",
    supportPhone: "+91 98765 43210",
    address: "Assi Ghat, Varanasi, 221005",
    instagram: "#",
    facebook: "#",
    twitter: "#"
  });

  // Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'global'));
        if (snap.exists()) {
          setConfig(prev => ({ ...prev, ...snap.data() }));
        }
      } catch (err) { console.error(err); }
    };
    fetchSettings();
  }, []);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        joinedAt: serverTimestamp(),
        source: 'footer'
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-white py-16 px-6 md:px-12 text-center md:text-left mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          <Link to="/" className="mb-6 group">
             <h2 className="font-serif text-3xl text-[#B08D55] group-hover:text-white transition-colors">Pahnawa</h2>
             <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-1">Banaras</p>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed font-light mb-6">
            Bridging the gap between heritage and you. We bring the finest handwoven Banarasi silk directly from the master weavers of Varanasi to your wardrobe.
          </p>
          <div className="flex gap-4 text-gray-400">
            <a href={config.instagram} target="_blank" rel="noreferrer" className="hover:text-white hover:scale-110 transition-all"><Instagram size={20} /></a>
            <a href={config.facebook} target="_blank" rel="noreferrer" className="hover:text-white hover:scale-110 transition-all"><Facebook size={20} /></a>
            <a href={config.twitter} target="_blank" rel="noreferrer" className="hover:text-white hover:scale-110 transition-all"><Twitter size={20} /></a>
          </div>
        </div>
        
        {/* Links Column */}
        <div>
          <h4 className="uppercase tracking-[0.2em] text-xs font-bold mb-6 text-[#B08D55]">Explore</h4>
          <ul className="space-y-3 text-sm text-gray-300 font-light">
            <li><Link to="/about" className="hover:text-[#B08D55] transition">Our Story</Link></li>
            <li><Link to="/shop?cat=saree" className="hover:text-[#B08D55] transition">Banarasi Sarees</Link></li>
            <li><Link to="/shop?cat=lehenga" className="hover:text-[#B08D55] transition">Bridal Lehengas</Link></li>
            <li><Link to="/journal" className="hover:text-[#B08D55] transition">The Journal</Link></li>
            <li><Link to="/faq" className="hover:text-[#B08D55] transition">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-[#B08D55] transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Column - DYNAMIC */}
        <div>
          <h4 className="uppercase tracking-[0.2em] text-xs font-bold mb-6 text-[#B08D55]">Contact</h4>
          <ul className="space-y-4 text-sm text-gray-300 font-light">
            <li className="flex items-start justify-center md:justify-start gap-3">
              <MapPin size={16} className="mt-1 text-[#B08D55] shrink-0" />
              <span className="whitespace-pre-line text-left">{config.address}</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <Phone size={16} className="text-[#B08D55] shrink-0" />
              <span>{config.supportPhone}</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <Mail size={16} className="text-[#B08D55] shrink-0" />
              <span>{config.supportEmail}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="uppercase tracking-[0.2em] text-xs font-bold mb-6 text-[#B08D55]">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4 font-light">Subscribe for exclusive updates.</p>
          
          {status === 'success' ? (
            <div className="bg-green-900/30 border border-green-800 p-3 rounded text-green-400 text-sm flex items-center gap-2 animate-in fade-in">
              <Check size={16} /> Subscribed!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex border-b border-gray-700 pb-2 focus-within:border-[#B08D55] transition-colors">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="bg-transparent w-full outline-none text-sm placeholder-gray-600 text-white font-light" 
                />
                <button onClick={handleSubscribe} className="text-xs font-bold uppercase text-[#B08D55] hover:text-white transition">
                  {status === 'loading' ? <Loader2 size={16} className="animate-spin"/> : 'Join'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2025 Pahnawa Banaras. All Rights Reserved.</p>
        <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[#B08D55] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#B08D55] transition-colors">Terms of Service</Link>
            <Link to="/returns" className="hover:text-[#B08D55] transition-colors">Return Policy</Link>
        </div>
      </div>
    </footer>
  );
};