import React, { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

export const ResultRow = memo(({ spot, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }} // Added subtle slide-in
    animate={{ opacity: 1, y: 0 }}
    whileTap={{ scale: 0.99, backgroundColor: "#f3f4f6" }} // Use gray-100 for tap feedback
    onClick={() => navigate(`/spot/${spot.id}`)}
    className="flex items-center gap-4 p-3 -m-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors" // Slightly more padding
  >
    <img
      src={spot.featuredImageUrl || spot.imageUrls?.[0] || "https://placehold.co/100x100"}
      alt={spot.name}
      loading="lazy"
      className="w-16 h-16 rounded-xl object-cover flex-shrink-0" // Slightly smaller image
    />
    <div className="flex-1 overflow-hidden"> {/* Added overflow-hidden */}
      <h3 className="text-base font-semibold text-gray-900 truncate">{spot.name}</h3> {/* Added truncate */}
      <p className="text-sm text-gray-500 capitalize truncate"> {/* Added truncate */}
        {spot.category || "Spot"}
      </p>
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600"> {/* Smaller text */}
        <MapPin className="w-3 h-3 flex-shrink-0" /> {/* Added flex-shrink-0 */}
        <span className="truncate">{spot.city || "Jaipur"}</span>
        {spot.averageRating && ( // Only show divider and rating if rating exists
          <>
            <span className="text-gray-300 mx-1">|</span>
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" /> {/* Added fill */}
            <span>{spot.averageRating}</span>
          </>
        )}
      </div>
    </div>
  </motion.div>
));