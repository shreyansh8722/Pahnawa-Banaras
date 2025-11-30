import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-heritage-charcoal text-white pt-24 pb-12 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* TOP SECTION: Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
          
          {/* Brand Promise */}
          <div className="lg:w-1/3">
            <Link to="/" className="inline-block mb-8">
               {/* Use text or img logo here */}
               <h2 className="font-serif text-3xl italic tracking-wide">Pahnawa Banaras</h2>
            </Link>
            <p className="text-white/60 font-light leading-loose mb-8 max-w-sm">
              Custodians of the Banarasi weave. We bring you the finest handloom silks directly from the master weavers of Kashi, bridging the gap between heritage and your wardrobe.
            </p>
            <div className="flex gap-6">
              <SocialIcon icon={<Instagram size={20} />} href="#" />
              <SocialIcon icon={<Facebook size={20} />} href="#" />
              <SocialIcon icon={<Youtube size={20} />} href="#" />
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:w-1/3 lg:ml-auto">
            <h3 className="font-serif text-2xl mb-6 italic">Join our Family</h3>
            <p className="text-white/60 font-light text-sm mb-6">
              Subscribe to receive updates on new arrivals, special offers, and stories from the loom.
            </p>
            <form className="flex border-b border-white/30 pb-2 focus-within:border-heritage-gold transition-colors">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="bg-transparent w-full outline-none text-white placeholder-white/40 font-light text-sm"
              />
              <button className="text-[10px] uppercase tracking-widest hover:text-heritage-gold transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* MIDDLE SECTION: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-16 pb-16">
          
          {/* Column 1 */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-heritage-gold">Shop</h4>
            <ul className="space-y-4">
              <FooterLink to="/shop?category=Sarees">Banarasi Sarees</FooterLink>
              <FooterLink to="/shop?category=Lehengas">Bridal Lehengas</FooterLink>
              <FooterLink to="/shop?category=Suits">Unstitched Suits</FooterLink>
              <FooterLink to="/shop?category=Dupattas">Dupattas</FooterLink>
              <FooterLink to="/shop">View All</FooterLink>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-heritage-gold">Company</h4>
            <ul className="space-y-4">
              <FooterLink to="/about">Our Story</FooterLink>
              <FooterLink to="/weavers">The Weavers</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/blog">Journal</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-heritage-gold">Support</h4>
            <ul className="space-y-4">
              <FooterLink to="/track-order">Track Order</FooterLink>
              <FooterLink to="/shipping">Shipping & Delivery</FooterLink>
              <FooterLink to="/returns">Returns & Exchange</FooterLink>
              <FooterLink to="/custom-orders">Custom Orders</FooterLink>
              <FooterLink to="/faqs">FAQs</FooterLink>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-heritage-gold">Get in Touch</h4>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start text-white/70 font-light text-sm">
                <MapPin size={18} className="shrink-0 mt-1" />
                <span>
                  Bhelupur, Varanasi,<br/>
                  Uttar Pradesh, India - 221010
                </span>
              </li>
              <li className="flex gap-4 items-center text-white/70 font-light text-sm">
                <Phone size={18} className="shrink-0" />
                <span>+91 93054 91919</span>
              </li>
              <li className="flex gap-4 items-center text-white/70 font-light text-sm">
                <Mail size={18} className="shrink-0" />
                <span>hello@pahnawabanaras.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Legal */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-xs tracking-wide">
            © {new Date().getFullYear()} Pahnawa Banaras. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-white/40 text-xs hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-white/40 text-xs hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper Components for clean code
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer"
    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-heritage-charcoal hover:bg-white hover:border-white transition-all duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="text-white/70 hover:text-white text-sm font-light tracking-wide transition-colors flex items-center gap-2 group"
    >
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-heritage-gold transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
  </li>
);