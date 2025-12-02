import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { SEO } from '@/components/SEO';

// --- HOME COMPONENTS ---
import { Hero } from '@/components/home/Hero';
import { Narrative } from '@/components/home/Narrative';
import { CategoryGrid } from '@/components/home/CategoryGrid'; 
import { NewArrivals } from '@/components/home/NewArrivals';
import { HeritageStrip } from '@/components/home/HeritageStrip'; 
import { BridalEdit } from '@/components/home/BridalEdit'; 
import { TechniqueShowcase } from '@/components/home/TechniqueShowcase';
import { Journal } from '@/components/home/Journal';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { LegacyOfTheLoom } from '@/components/home/LegacyOfTheLoom';
import { PromiseStrip } from '@/components/home/PromiseStrip';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#B08D55] selection:text-white">
      <SEO 
        title="Pehnawa Banaras | Luxury Handloom" 
        description="Discover the timeless elegance of Banarasi silk. Authentic sarees, suits, and lehengas directly from the weavers of Varanasi." 
      />
      <Navbar />
      
      <main className="overflow-x-hidden">
        {/* 1. Full Screen Hero */}
        <Hero />

        {/* 2. Brand Intro */}
        <Narrative />

        {/* 3. Visual Categories (Tall Images like Ekaya) */}
        {/* Make sure you created CategoryGrid.jsx from the previous response! */}
        <CategoryGrid />

        {/* 4. New Arrivals (Horizontal Slider) */}
        <NewArrivals />

        {/* 5. Process/Heritage (Video Section like Tilfi) */}
        {/* Make sure you created HeritageStrip.jsx from the previous response! */}
        <HeritageStrip />

        {/* 6. Bridal Parallax */}
        <BridalEdit />

        {/* 7. Educational Content */}
        <TechniqueShowcase />
        
        {/* 8. Social Proof & Content */}
        <TestimonialSlider />
        <Journal />
        
        {/* 9. Final Trust Signals */}
        <LegacyOfTheLoom />
        <PromiseStrip />
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}