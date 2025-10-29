// src/components/SpotCard.jsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { LazyImage } from "./LazyImage";

export const SpotCard = memo(
  ({ spot, idx, activeIdx, navigate, isPriority = false }) => {
    const imageSrc = spot.featuredImageUrl || spot.imageUrls?.[0] || "https://placehold.co/600x400";
    const isActive = idx === activeIdx;

    return (
      <motion.div
        data-idx={idx}
        layout
        whileTap={{ scale: 0.97 }}
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        /* 💡 THE FIX: 
          REMOVED 'mx-1'. 
          The 'gap-4' in CategoryRow will now handle all spacing.
        */
        className="relative flex-shrink-0 rounded-3xl overflow-hidden shadow-lg w-[160px] h-[220px] cursor-pointer snap-start bg-white/5 border border-white/6"
        onClick={() => navigate(`/spot/${encodeURIComponent(spot.id)}`)}
      >
        {/* Your LazyImage (Unchanged) */}
        <LazyImage
          src={imageSrc}
          alt={spot.name}
          className="w-full h-full object-cover rounded-3xl"
          isPriority={isPriority}
        />
        {/* Your Gradients (Unchanged) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent rounded-3xl" />

        {/* Your Icon (Unchanged) */}
        <div className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm">
          <ArrowUpRight size={16} className="text-white" />
        </div>
        
        {/* Your Text (Unchanged) */}
        <div className="absolute bottom-3 left-3 right-3">
          {spot.averageRating && (
            <div className="flex items-center gap-1 text-white/90 text-sm mb-1 backdrop-blur-sm bg-black/20 px-1.5 py-0.5 rounded-full w-fit">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{spot.averageRating}</span>
              <span className="text-white/70">({spot.reviewCount || 0})</span>
            </div>
          )}
          <h3 className="text-white text-base font-bold line-clamp-2 leading-tight drop-shadow-xl">
            {spot.name}
          </h3>
        </div>
      </motion.div>
    );
  }
);

