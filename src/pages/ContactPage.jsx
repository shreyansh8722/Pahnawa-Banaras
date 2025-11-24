import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-brand-dark font-sans">
      <Navbar cartCount={0} onOpenCart={() => {}} />

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div>
          <span className="text-[#B08D55] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Get in Touch</span>
          <h1 className="font-serif text-4xl md:text-5xl mb-8">We'd Love to Hear From You</h1>
          <p className="text-gray-600 mb-12 font-light">
            Whether you have a question about our collections, need assistance with a custom bridal order, or just want to say hello, we are here to help.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FFFCF7] rounded-full text-[#B08D55]">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-serif text-xl mb-1">Visit Our Studio</h4>
                <p className="text-gray-500 text-sm">B-21/128, Kamachha, Varanasi, India</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FFFCF7] rounded-full text-[#B08D55]">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-serif text-xl mb-1">Email Us</h4>
                <p className="text-gray-500 text-sm">hello@pahnawa.com</p>
                <p className="text-gray-500 text-sm">support@pahnawa.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FFFCF7] rounded-full text-[#B08D55]">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-serif text-xl mb-1">Call Us</h4>
                <p className="text-gray-500 text-sm">+91 98765 43210</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Mon - Sat, 10am - 7pm IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#F9F9F9] p-8 md:p-12 rounded-sm">
          <h3 className="font-serif text-2xl mb-6">Send a Message</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Name</label>
                <input type="text" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#B08D55]" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
                <input type="email" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#B08D55]" placeholder="Your Email" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Subject</label>
              <input type="text" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#B08D55]" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message</label>
              <textarea rows="4" className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#B08D55]" placeholder="Write your message..."></textarea>
            </div>
            <button className="w-full bg-[#B08D55] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#8C6A48] transition-colors">
              Send Message
            </button>
          </form>
        </div>

      </div>

      <Footer />
    </div>
  );
}