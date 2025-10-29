import React, { memo } from "react";
import { motion } from "framer-motion";

export const TrendingCard = memo(({ spot, navigate }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={() => navigate(`/spot/${spot.id}`)}
    className="w-64 h-64 flex-shrink-0 relative cursor-pointer rounded-2xl overflow-hidden shadow-lg group" // Added group for potential hover effects
  >
    <img
      src={spot.featuredImageUrl || spot.imageUrls?.[0] || "https://placehold.co/400x400"}
      alt={spot.name}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Subtle zoom on hover
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" /> {/* Stronger gradient */}
    <div className="absolute bottom-4 left-4 right-4">
      <h3 className="text-white font-semibold text-lg drop-shadow-md">
        {spot.name}
      </h3>
      <p className="text-white/90 text-sm drop-shadow-md capitalize"> {/* Added capitalize */}
        {spot.city || spot.category}
      </p>
    </div>
  </motion.div>
));