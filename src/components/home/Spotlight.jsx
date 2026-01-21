import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Spotlight = ({ data }) => {
  if (!data || data.length === 0) return null;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-24 bg-royal-cream">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          {/* Text Content */}
          <div className="w-full md:w-1/3 space-y-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-royal-grey">In The Spotlight</span>
            <h2 className="font-display text-4xl text-royal-charcoal">Curated Selections</h2>
            
            {/* Tabs */}
            <div className="space-y-4 border-l border-royal-border/50">
              {data.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`block w-full text-left text-xl font-serif py-2 px-6 transition-all duration-300 ${
                    activeTab === index 
                      ? 'text-royal-maroon italic scale-105 origin-left font-medium border-l-2 border-royal-maroon -ml-[2px]' 
                      : 'text-royal-grey/60 hover:text-royal-charcoal'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <Link 
                to={data[activeTab]?.link || '/shop'} 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-royal-gold hover:text-royal-maroon transition-colors duration-200 mt-4"
            >
              Explore Collection <ArrowRight size={16} />
            </Link>
          </div>

          {/* Image Display */}
          <div className="w-full md:w-2/3 h-[500px] relative overflow-hidden bg-royal-sand border border-royal-gold/20 rounded-sm">
            <AnimatePresence mode='wait'>
              <motion.img
                key={activeTab}
                src={data[activeTab]?.image}
                alt={data[activeTab]?.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full">
                 <h3 className="text-white font-serif text-2xl mb-2">{data[activeTab]?.title}</h3>
                 <p className="text-white/90 font-sans font-light text-sm max-w-md leading-relaxed">
                    {data[activeTab]?.description}
                 </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};