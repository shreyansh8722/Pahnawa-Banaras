import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { SEO } from '@/components/SEO';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2424] font-sans selection:bg-[#C5A059] selection:text-white">
      <SEO title="Contact Us - Pahnawa Banaras" description="Visit our boutique in Varanasi or get in touch." />

      {/* NAVBAR REMOVED - Handled by Layout */}

      <div className="pt-8 pb-24 px-4 md:px-12 max-w-[1200px] mx-auto animate-fade-in">
         
         {/* HEADER */}
         <div className="text-center mb-16 border-b border-[#E6DCCA]/60 pb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">Get in Touch</span>
            <h1 className="font-display text-4xl md:text-6xl mt-4 text-[#2D2424]">We'd Love to Hear from You</h1>
            <p className="mt-4 text-[#6B6060] font-serif italic max-w-xl mx-auto">
               Whether you have a question about a weave, need styling advice, or simply want to say hello.
            </p>
         </div>

         <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* LEFT: INFO */}
            <div className="space-y-12">
               {/* Address */}
               <div>
                  <h3 className="font-serif text-2xl italic mb-6 text-[#2D2424] flex items-center gap-3">
                     <MapPin className="text-[#C5A059]" size={24} /> Visit Our Boutique
                  </h3>
                  <div className="pl-9 text-[#6B6060] space-y-2 leading-relaxed">
                     <p>Bhelupur, Varanasi,</p>
                     <p>Uttar Pradesh, India - 221010</p>
                     <a 
                        href="https://maps.google.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-block mt-2 text-xs font-bold uppercase tracking-widest text-[#701a1a] border-b border-[#701a1a] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                     >
                        Get Directions
                     </a>
                  </div>
               </div>

               {/* Contact Info */}
               <div>
                  <h3 className="font-serif text-2xl italic mb-6 text-[#2D2424]">Contact Details</h3>
                  <div className="pl-9 space-y-6">
                     <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-[#F4F1EA] flex items-center justify-center text-[#701a1a] group-hover:bg-[#701a1a] group-hover:text-white transition-colors">
                           <Phone size={18} />
                        </div>
                        <div>
                           <span className="block text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Phone</span>
                           <span className="text-[#2D2424] font-serif text-lg">+91 93054 91919</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-[#F4F1EA] flex items-center justify-center text-[#701a1a] group-hover:bg-[#701a1a] group-hover:text-white transition-colors">
                           <Mail size={18} />
                        </div>
                        <div>
                           <span className="block text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Email</span>
                           <span className="text-[#2D2424] font-serif text-lg">hello@pahnawabanaras.com</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Hours */}
               <div className="bg-[#F4F1EA]/50 p-6 rounded-sm border border-[#E6DCCA]">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2D2424] mb-4">
                     <Clock size={16} className="text-[#C5A059]" /> Opening Hours
                  </h4>
                  <div className="space-y-2 text-sm text-[#6B6060]">
                     <div className="flex justify-between"><span>Monday - Saturday</span> <span>10:00 AM - 8:00 PM</span></div>
                     <div className="flex justify-between"><span>Sunday</span> <span>By Appointment</span></div>
                  </div>
               </div>
            </div>

            {/* RIGHT: FORM */}
            <form className="bg-white p-8 md:p-10 border border-[#E6DCCA] shadow-xl rounded-sm space-y-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C5A059] to-[#701a1a]" />
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6060]">Your Name</label>
                     <input type="text" className="w-full border-b border-[#E6DCCA] py-3 focus:outline-none focus:border-[#701a1a] transition-colors bg-transparent text-[#2D2424] font-serif placeholder-[#E6DCCA]" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6060]">Email Address</label>
                     <input type="email" className="w-full border-b border-[#E6DCCA] py-3 focus:outline-none focus:border-[#701a1a] transition-colors bg-transparent text-[#2D2424] font-serif placeholder-[#E6DCCA]" placeholder="name@example.com" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6060]">Subject</label>
                     <select className="w-full border-b border-[#E6DCCA] py-3 focus:outline-none focus:border-[#701a1a] transition-colors bg-transparent text-[#2D2424] font-serif">
                        <option>General Enquiry</option>
                        <option>Order Status</option>
                        <option>Customization Request</option>
                        <option>Wholesale / Bulk</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[#6B6060]">Message</label>
                     <textarea rows="4" className="w-full border-b border-[#E6DCCA] py-3 focus:outline-none focus:border-[#701a1a] transition-colors bg-transparent resize-none text-[#2D2424] font-serif placeholder-[#E6DCCA]" placeholder="How can we help you?" />
                  </div>
               </div>

               <button className="w-full bg-[#2D2424] text-white h-14 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#701a1a] transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group">
                  Send Message <Send size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </form>

         </div>
      </div>
      
      {/* FOOTER REMOVED - Handled by Layout */}
    </div>
  );
}