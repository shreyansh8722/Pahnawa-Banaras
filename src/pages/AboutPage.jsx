import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { SEO } from '@/components/SEO';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';

export default function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'about'));
        if (snap.exists()) {
          setData(snap.data());
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <AppSkeleton />;

  const title = data?.title || "Reviving the Golden Age of Banarasi Craftsmanship";
  const content = data?.content || "Nestled in the narrow lanes of Varanasi...";
  const image = data?.imageUrl || "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-white text-brand-dark font-sans">
      <SEO title="Our Heritage & Story" description="Discover the legacy of Pahnawa Banaras." />
      <Navbar cartCount={0} onOpenCart={() => {}} />

      {/* Header Image */}
      <div className="relative w-full h-[45vh] bg-gray-100 overflow-hidden">
        <img src={image} alt="Varanasi Heritage" className="w-full h-full object-cover opacity-90"/>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-white font-serif text-5xl md:text-7xl tracking-wide text-center drop-shadow-xl">Our Heritage</h1>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center md:text-left">
        <span className="text-[#B08D55] text-xs font-bold uppercase tracking-[0.3em] mb-6 block text-center">The Pahnawa Story</span>
        <h2 className="font-serif text-3xl md:text-5xl mb-10 text-center leading-tight text-gray-900">{title}</h2>
        
        <div className="space-y-8 text-gray-600 text-lg leading-loose font-light text-justify md:text-center whitespace-pre-line">
          {content}
        </div>
      </div>

      {/* Values Grid (Static) */}
      <div className="bg-[#FFFCF7] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 bg-[#B08D55]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🧵</div>
            <h3 className="font-serif text-2xl mb-3">Pure Handloom</h3>
            <p className="text-gray-500 text-sm">Certified authentic weaves.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-[#B08D55]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🤝</div>
            <h3 className="font-serif text-2xl mb-3">Fair Trade</h3>
            <p className="text-gray-500 text-sm">Empowering artisans.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-[#B08D55]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✨</div>
            <h3 className="font-serif text-2xl mb-3">Global Legacy</h3>
            <p className="text-gray-500 text-sm">Taking Banaras to the world.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}