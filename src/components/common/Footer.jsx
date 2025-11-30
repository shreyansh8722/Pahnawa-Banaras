import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Twitter, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import Logo from '../../assets/logo.png'; // Ensure you have a white/light version of your logo if possible, or use filter

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-heritage-charcoal text-heritage-paper pt-24 pb-12 border-t border-heritage-gold/20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* TOP SECTION: Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
          
          {/* Brand Story */}
          <div className="lg:w-1/3">
            <Link to="/" className="inline-block mb-8">
              {/* Using a brightness filter to make the logo white for dark footer */}
              <img src={Logo} alt="Pahnawa Banaras" className="h-50 brightness-0 invert opacity-90" />
            </Link>
            <p className="text-heritage-paper/70 font-sans text-sm leading-relaxed mb-8 max-w-sm">
              Weaving the timeless tales of Varanasi into every yard of silk. Pahnawa Banaras is dedicated to preserving the ancient art of handloom, bringing you heirlooms that transcend generations.
            </p>
            <div className="flex gap-6">
              <SocialIcon icon={<Instagram size={20} />} href="#" />
              <SocialIcon icon={<Facebook size={20} />} href="#" />
              <SocialIcon icon={<Youtube size={20} />} href="#" />
              <SocialIcon icon={<Twitter size={20} />} href="#" />
            </div>
          </div>

          {/* Newsletter - The "Join the Club" feel */}
          <div className="lg:w-1/3 lg:ml-auto">
            <h4 className="font-serif italic text-2xl mb-6">Join the Circle</h4>
            <p className="text-heritage-paper/60 text-xs uppercase tracking-widest mb-6">
              Subscribe to receive updates on new arrivals, special offers, and weaver stories.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="w-full bg-transparent border-b border-heritage-paper/30 py-4 text-heritage-paper placeholder:text-heritage-paper/30 focus:outline-none focus:border-heritage-gold transition-colors"
              />
              <button className="absolute right-0 top-4 text-heritage-paper/50 hover:text-heritage-gold transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-heritage-paper/10 pt-16 mb-20">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <h5 className="font-serif text-lg italic text-heritage-gold">Shop</h5>
            <FooterLink to="/shop?cat=saree">Sarees</FooterLink>
            <FooterLink to="/shop?cat=lehenga">Lehengas</FooterLink>
            <FooterLink to="/shop?cat=suit">Unstitched Suits</FooterLink>
            <FooterLink to="/shop?cat=men">Men's Collection</FooterLink>
            <FooterLink to="/shop?sort=newest">New Arrivals</FooterLink>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <h5 className="font-serif text-lg italic text-heritage-gold">Company</h5>
            <FooterLink to="/about">Our Story</FooterLink>
            <FooterLink to="/weavers">The Weaver's Project</FooterLink>
            <FooterLink to="/sustainability">Sustainability</FooterLink>
            <FooterLink to="/careers">Careers</FooterLink>
            <FooterLink to="/press">Press</FooterLink>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <h5 className="font-serif text-lg italic text-heritage-gold">Assistance</h5>
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/shipping">Shipping & Delivery</FooterLink>
            <FooterLink to="/returns">Returns & Exchange</FooterLink>
            <FooterLink to="/care">Garment Care</FooterLink>
            <FooterLink to="/faqs">FAQs</FooterLink>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col gap-6">
            <h5 className="font-serif text-lg italic text-heritage-gold">Visit Us</h5>
            <div className="flex items-start gap-4 text-heritage-paper/70 text-sm">
              <MapPin size={18} className="shrink-0 mt-1" />
              <span>
                B 21/100, Kamachha Road,<br />
                Bhelupur, Varanasi,<br />
                Uttar Pradesh 221010
              </span>
            </div>
            <div className="flex items-center gap-4 text-heritage-paper/70 text-sm">
              <Phone size={18} />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-4 text-heritage-paper/70 text-sm">
              <Mail size={18} />
              <span>hello@pahnawabanaras.com</span>
            </div>
          </div>
        </div>

        {/* BOTTOM: Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-heritage-paper/10 gap-4">
          <div className="text-[10px] uppercase tracking-widest text-heritage-paper/40">
            © {currentYear} Pahnawa Banaras. All Rights Reserved.
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-heritage-paper/40">
            <Link to="/privacy" className="hover:text-heritage-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-heritage-gold transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper Components
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full border border-heritage-paper/20 flex items-center justify-center text-heritage-paper/60 hover:text-heritage-charcoal hover:bg-heritage-gold hover:border-heritage-gold transition-all duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-sm text-heritage-paper/70 hover:text-heritage-gold hover:translate-x-2 transition-all duration-300 font-sans"
  >
    {children}
  </Link>
);