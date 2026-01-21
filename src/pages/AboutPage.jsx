import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, HeartHandshake, Award, Users, Gem } from 'lucide-react';
import { SEO } from '@/components/SEO';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2424] font-sans selection:bg-[#C5A059] selection:text-white">
      <SEO title="Our Story - Pahnawa Banaras" description="Preserving the heritage of Banarasi Handloom since 1945." />
      
      {/* NAVBAR REMOVED - Handled by Layout */}

      {/* --- HERO SECTION --- */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2D2424]">
           <img 
             src="https://images.unsplash.com/photo-1610189012906-47833d772097?auto=format&fit=crop&q=80" 
             alt="Banarasi Loom" 
             className="w-full h-full object-cover opacity-50 sepia-[0.3]"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center text-white px-4 max-w-4xl"
        >
           <span className="block text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-6">Since 1945</span>
           <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight drop-shadow-lg">
             The Soul of <br/> <span className="italic font-serif text-[#C5A059]">Banaras</span>
           </h1>
           <p className="font-serif italic text-lg md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto font-light">
             "We don't just weave sarees; we weave stories that span generations."
           </p>
        </motion.div>
      </div>

      {/* --- OUR MISSION --- */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
         <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="w-full lg:w-1/2"
            >
               <span className="text-[#701a1a] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Our Mission</span>
               <h2 className="font-display text-4xl md:text-5xl text-[#2D2424] mb-8 leading-tight">
                 Preserving a <br/> <span className="text-[#C5A059]">Timeless Legacy</span>
               </h2>
               <div className="space-y-6 text-[#6B6060] font-serif text-lg md:text-xl leading-relaxed">
                  <p>
                    Pahnawa Banaras was born from a desire to protect the authenticity of the Banarasi weave in an era of mass-produced imitations. We are not just a brand; we are custodians of a legacy that dates back centuries.
                  </p>
                  <p>
                    Every saree in our collection is handpicked directly from the master weavers of Varanasi, ensuring fair wages for the artisans and certified purity for you.
                  </p>
               </div>
               
               <div className="mt-10 flex gap-8">
                  <div>
                     <h4 className="font-display text-4xl text-[#701a1a]">500+</h4>
                     <p className="text-xs uppercase tracking-widest text-[#6B6060] mt-1">Artisans Supported</p>
                  </div>
                  <div>
                     <h4 className="font-display text-4xl text-[#701a1a]">10k+</h4>
                     <p className="text-xs uppercase tracking-widest text-[#6B6060] mt-1">Happy Patrons</p>
                  </div>
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="w-full lg:w-1/2 relative"
            >
               <div className="relative z-10 grid grid-cols-2 gap-4">
                   <img src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=600" className="w-full h-80 object-cover rounded-t-[100px] border border-[#C5A059]/30 shadow-xl" alt="Weaver" />
                   <img src="https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=600" className="w-full h-80 object-cover rounded-b-[100px] border border-[#C5A059]/30 shadow-xl mt-12" alt="Silk" />
               </div>
               {/* Decorative Circle */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-[#C5A059]/20 rounded-full -z-0" />
            </motion.div>

         </div>
      </section>

      {/* --- VALUES GRID --- */}
      <section className="py-24 bg-[#0F4C5C] text-white relative overflow-hidden">
         {/* Pattern Overlay */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
         <div className="relative z-10 max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-16">
               <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.2em]">Why Choose Us</span>
               <h2 className="font-display text-4xl md:text-5xl mt-4">The Pahnawa Promise</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 text-center">
                <div className="group p-8 border border-white/10 rounded-sm hover:bg-white/5 transition-all duration-300">
                   <div className="w-16 h-16 mx-auto rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] mb-6 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={32} strokeWidth={1.5} />
                   </div>
                   <h3 className="font-serif text-2xl mb-4 text-[#C5A059]">Silk Mark Certified</h3>
                   <p className="text-sm text-white/80 leading-relaxed font-light">
                      Authenticity is our currency. Every product comes with a Silk Mark certification, guaranteeing 100% pure silk and authentic zari work.
                   </p>
                </div>

                <div className="group p-8 border border-white/10 rounded-sm hover:bg-white/5 transition-all duration-300">
                   <div className="w-16 h-16 mx-auto rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] mb-6 group-hover:scale-110 transition-transform">
                      <HeartHandshake size={32} strokeWidth={1.5} />
                   </div>
                   <h3 className="font-serif text-2xl mb-4 text-[#C5A059]">Direct from Weavers</h3>
                   <p className="text-sm text-white/80 leading-relaxed font-light">
                      We cut out the middlemen. Working directly with artisan families ensures they receive fair value and recognition for their master craftsmanship.
                   </p>
                </div>

                <div className="group p-8 border border-white/10 rounded-sm hover:bg-white/5 transition-all duration-300">
                   <div className="w-16 h-16 mx-auto rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] mb-6 group-hover:scale-110 transition-transform">
                      <Gem size={32} strokeWidth={1.5} />
                   </div>
                   <h3 className="font-serif text-2xl mb-4 text-[#C5A059]">Heirloom Quality</h3>
                   <p className="text-sm text-white/80 leading-relaxed font-light">
                      Our sarees are not just garments; they are investments. With proper care, a Pahnawa Banaras saree can be passed down as a family heirloom.
                   </p>
                </div>
            </div>
         </div>
      </section>

      {/* --- FOUNDER NOTE --- */}
      <section className="py-24 bg-[#F4F1EA]/30 border-t border-[#E6DCCA]">
         <div className="max-w-[800px] mx-auto px-6 text-center">
            <div className="mb-8">
               <Award size={40} className="text-[#C5A059] mx-auto mb-4" strokeWidth={1} />
               <h3 className="font-display text-3xl text-[#2D2424]">A Note from the Founder</h3>
            </div>
            <p className="font-serif text-xl italic text-[#2D2424]/80 leading-loose mb-8">
               "In a world of fast fashion, Pahnawa Banaras is a pause. A reminder of the patience, skill, and soul that goes into creating something truly beautiful. When you wear our saree, you carry a piece of history."
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#701a1a] mt-4">Shreyansh Singh</p>
            <p className="text-[10px] text-[#6B6060] uppercase tracking-widest">Founder, Pahnawa Banaras</p>
         </div>
      </section>

      {/* FOOTER REMOVED - Handled by Layout */}
    </div>
  );
}