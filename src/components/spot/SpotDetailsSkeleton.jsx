import React, { memo } from "react";

// --- Skeletons (Dark Theme) ---
const AmbassadorSkeleton = memo(() => (
    <div className="mt-6 flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 animate-pulse">
        <div className="w-10 h-10 bg-gray-800/40 rounded-full" />
        <div className="flex-1 space-y-2"><div className="h-3 bg-gray-800/40 rounded w-1/4" /><div className="h-4 bg-gray-800/40 rounded w-1/2" /></div>
    </div>
));

const ReviewPreviewSkeleton = memo(() => (
    <div className="mt-4 space-y-4">
        {[1, 2].map((i) => (
        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 animate-pulse list-none">
            <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-800/40 rounded-full" /><div className="h-4 bg-gray-800/40 rounded w-24" /></div><div className="h-4 bg-gray-800/40 rounded w-16" /></div>
            <div className="h-3 bg-gray-800/40 rounded w-full mt-3" /><div className="h-3 bg-gray-800/40 rounded w-5/6 mt-1.5" />
        </div>
        ))}
    </div>
));

export const SpotDetailsSkeleton = memo(() => (
  <div className="animate-pulse bg-gradient-to-b from-[#0b0b0c] via-[#111214] to-[#0a0a0a] min-h-screen">
    {/* Image Carousel Skeleton */}
    <div className="w-full h-[400px] bg-gray-800/40 relative">
        {/* Header Buttons Skeletons */}
        <div className="absolute top-6 left-5 w-9 h-9 bg-black/40 rounded-full"/>
        <div className="absolute top-6 right-5 flex gap-3">
            <div className="w-9 h-9 bg-black/40 rounded-full"/>
            <div className="w-9 h-9 bg-black/40 rounded-full"/>
        </div>
    </div>
    {/* Content Area Skeleton */}
    <div className="relative z-10 mt-[-32px] bg-gradient-to-b from-[#111214] to-[#0a0a0a] rounded-t-[32px] shadow-lg pb-28">
        <div className="px-6 pt-8 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1 mr-4">
                <div className="h-6 bg-gray-800/40 rounded w-3/4" />
                <div className="h-4 bg-gray-800/40 rounded w-1/2" />
            </div>
            <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                <div className="h-6 bg-gray-800/40 rounded-full w-16" />
                <div className="h-3 bg-gray-800/40 rounded w-12" />
            </div>
          </div>
          <div className="h-4 bg-gray-800/40 rounded w-full" />
          <div className="h-4 bg-gray-800/40 rounded w-5/6" />
          
          {/* Ambassador Skeleton */}
          <AmbassadorSkeleton />
          
          {/* Reviews Title Skeleton */}
          <div className="h-6 bg-gray-800/40 rounded w-1/3 pt-8" />
          
          {/* Reviews Preview Skeleton */}
          <ReviewPreviewSkeleton />
        </div>
    </div>
    {/* Bottom Button Skeleton */}
     <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-20">
        <div className="h-14 bg-gray-800/40 rounded-full w-full"/>
     </div>
  </div>
));

// Attach sub-skeletons for lazy loading fallbacks
SpotDetailsSkeleton.Ambassador = AmbassadorSkeleton;
SpotDetailsSkeleton.Reviews = ReviewPreviewSkeleton;
