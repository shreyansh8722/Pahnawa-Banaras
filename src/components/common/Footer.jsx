import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white py-16 px-6 md:px-12 text-center md:text-left mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          <Link to="/" className="mb-6">
             <h2 className="font-serif text-3xl text-[#B08D55]">Pahnawa</h2>
             <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-1">Banaras</p>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed font-light mb-6">
            Bridging the gap between heritage and you. We bring the finest handwoven Banarasi silk directly from the master weavers of Varanasi to your wardrobe.
          </p>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white transition"><Twitter size={20} /></a>
          </div>
        </div>
        
        {/* Links Column */}
        <div>
          <h4 className="uppercase tracking-[0.2em] text-xs font-bold mb-6 text-[#B08D55]">Explore</h4>
          <ul className="space-y-3 text-sm text-gray-300 font-light">
            <li><Link to="/about" className="hover:text-[#B08D55] transition">Our Story</Link></li>
            <li><Link to="/shop?cat=sarees" className="hover:text-[#B08D55] transition">Banarasi Sarees</Link></li>
            <li><Link to="/shop?cat=lehengas" className="hover:text-[#B08D55] transition">Bridal Lehengas</Link></li>
            <li><Link to="/contact" className="hover:text-[#B08D55] transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="uppercase tracking-[0.2em] text-xs font-bold mb-6 text-[#B08D55]">Contact</h4>
          <ul className="space-y-4 text-sm text-gray-300 font-light">
            <li className="flex items-start justify-center md:justify-start gap-3">
              <MapPin size={16} className="mt-1 text-[#B08D55]" />
              <span>Assi Ghat, Varanasi,<br/>Uttar Pradesh, 221005</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <Phone size={16} className="text-[#B08D55]" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <Mail size={16} className="text-[#B08D55]" />
              <span>hello@pahnawa.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="uppercase tracking-[0.2em] text-xs font-bold mb-6 text-[#B08D55]">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4 font-light">Subscribe for exclusive updates and heritage stories.</p>
          <div className="flex border-b border-gray-700 pb-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent w-full outline-none text-sm placeholder-gray-600 text-white font-light" 
            />
            <button className="text-xs font-bold uppercase text-[#B08D55] hover:text-white transition">Join</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2025 Pahnawa Banaras. All Rights Reserved.</p>
        <div className="flex gap-6">
            <a href="#" className="hover:text-[#B08D55]">Privacy Policy</a>
            <a href="#" className="hover:text-[#B08D55]">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};