import React from 'react';
import { motion } from 'framer-motion';
// --- REMOVED NAVBAR & FOOTER IMPORTS (Handled by Layout) ---
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { SEO } from '@/components/SEO';

// --- COMPONENTS ---
import { Hero } from '@/components/home/Hero'; 
import { CategoryArchGrid } from '@/components/home/CategoryArchGrid'; 
import { NewArrivals } from '@/components/home/NewArrivals';
import { BridalEdit } from '@/components/home/BridalEdit';
import { CraftSection } from '@/components/home/CraftSection';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { Spotlight } from '@/components/home/Spotlight';
import { FabricEdit } from '@/components/home/FabricEdit';
import { MuseSection } from '@/components/home/MuseSection';

import { useStorefront } from '@/hooks/useStorefront';

const DEFAULT_SPOTLIGHT = [
  { title: "Katan Silk", description: "Pure silk woven with twisted yarns for durability and luster.", image: "https://images.unsplash.com/photo-1610189012906-47833d772097?q=80&w=800", link: "/shop?cat=sarees" },
  { title: "Georgette", description: "Lightweight, crinkled fabric with a bouncy drape.", image: "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=800", link: "/shop?cat=lehengas" },
  { title: "Organza", description: "Sheer, crisp fabric for a structured, modern look.", image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=800", link: "/shop?cat=suits" }
];

const DEFAULT_FABRICS = [
  "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=400",
  "https://images.unsplash.com/photo-1621623194266-4b3664963684?q=80&w=400",
  "https://images.unsplash.com/photo-1610189012906-47833d772097?q=80&w=400",
  "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=400"
];

const DEFAULT_MUSE = [
  "https://images.unsplash.com/photo-1621623194266-4b3664963684?q=80&w=400",
  "https://images.unsplash.com/photo-1610189012906-47833d772097?q=80&w=400",
  "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=400",
  "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=400",
  "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=400"
];

export default function HomePage() {
  const { spotlight, muse, fabrics } = useStorefront();

  const displaySpotlight = spotlight && spotlight.length > 0 ? spotlight : DEFAULT_SPOTLIGHT;
  const displayFabrics = fabrics && fabrics.length > 0 ? fabrics : DEFAULT_FABRICS;
  const displayMuse = muse && muse.length > 0 ? muse : DEFAULT_MUSE;

  return (
    // FIX: Removed 'pt-32' or 'pt-20'. The Layout handles spacing now.
    <div className="min-h-screen bg-royal-cream font-sans">
      <SEO title="Pehnawa Banaras" description="Heritage Handloom" />
      
      {/* NO NAVBAR HERE */}
      
      <motion.main 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.3 }}
      >
        <Hero />
        <CategoryArchGrid />
        <NewArrivals />
        <Spotlight data={displaySpotlight} />
        <FabricEdit images={displayFabrics} />
        <BridalEdit />
        <MuseSection images={displayMuse} />
        <CraftSection />
        <div className="mb-20">
           <TestimonialSlider />
        </div>
      </motion.main>

      <WhatsAppButton />
      
      {/* NO FOOTER HERE */}
    </div>
  );
}