import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const BridalEdit = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80" 
          alt="Bridal" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
        >
            <span className="inline-block border border-white/30 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-royal-gold bg-black/20 backdrop-blur-sm">
                The Wedding Collective
            </span>
            <h2 className="font-display text-5xl md:text-7xl mb-8 leading-tight">
                Vows Woven in <br/> <span className="text-royal-gold italic font-serif">Pure Gold</span>
            </h2>
            <p className="font-sans font-light text-white/90 max-w-xl mx-auto mb-10 leading-relaxed">
                Handcrafted heirlooms for your special day. Each saree takes over 400 hours of intricate weaving, creating a legacy that lasts forever.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center">
                <Link to="/shop?cat=lehengas" className="bg-royal-gold text-royal-charcoal px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-200">
                    Shop Lehengas
                </Link>
                <Link to="/shop?cat=sarees&occ=bridal" className="border border-white text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-royal-charcoal transition-colors duration-200">
                    Shop Bridal Sarees
                </Link>
            </div>
        </motion.div>
      </div>
    </section>
  );
};