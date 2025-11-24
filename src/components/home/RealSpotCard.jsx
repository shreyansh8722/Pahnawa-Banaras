import React, { memo } from 'react';
// --- REMOVED motion ---
import { Bookmark, MapPin, Star } from 'lucide-react';
import { LazyImage } from '../LazyImage';

export const RealSpotCard = memo(({ spot, isSaved, onToggleSave, onShowOnMap, onNavigate }) => {
  const imageSrc =
    spot.featuredImageUrl || spot.imageUrls?.[0] || 'https://placehold.co/400x300';

  const handleSaveClick = (e) => {
    e.stopPropagation(); // Prevent card navigation
    onToggleSave(spot.id);
  };

  const handleMapClick = (e) => {
    e.stopPropagation(); // Prevent card navigation
    onShowOnMap();
  };

  return (
    <div // --- REMOVED motion.div ---
      className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex gap-4 dark:bg-gray-800 dark:border-gray-700 relative cursor-pointer"
      onClick={() => onNavigate(spot.id)} // Main click handler
    >
      <button
        onClick={handleSaveClick}
        className="absolute top-3 right-3 z-10 p-2"
        aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Bookmark
          size={24}
          className={`transition-all duration-200 ${
            isSaved
              ? 'text-blue-600 fill-blue-600'
              : 'text-gray-800 fill-none stroke-[2px] dark:text-white dark:drop-shadow-md'
          }`}
        />
      </button>

      <div className="w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden pointer-events-none">
        <LazyImage
          src={imageSrc}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow pointer-events-none">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
          {spot.name || 'Unnamed Spot'}
        </h3>

        <div className="flex items-center gap-2 mt-1 mb-3">
          {spot.averageRating != null && ( // Use != null to check for 0
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{spot.averageRating.toFixed(1)}</span>
              <span className="text-gray-400">({spot.reviewCount || 0})</span>
            </div>
          )}
        </div>

        <button
          onClick={handleMapClick} // Map button
          className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-semibold pointer-events-auto"
        >
          <MapPin size={14} />
          Show on Map
        </button>
      </div>
    </div>
  );
});

export default RealSpotCard;