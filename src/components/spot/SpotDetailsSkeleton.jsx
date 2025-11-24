import React, { memo } from 'react';

// --- Skeletons (Light/Dark Theme) ---
const AmbassadorSkeleton = memo(() => (
  <div className="mt-6 flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  </div>
));

const ReviewPreviewSkeleton = memo(() => (
  <div className="mt-4 px-6 space-y-4">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 animate-pulse list-none"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mt-3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-1.5" />
      </div>
    ))}
  </div>
));

export const SpotDetailsSkeleton = memo(() => (
  <div className="animate-pulse bg-gray-50 dark:bg-gray-900 min-h-screen">
    {/* Image Carousel Skeleton (Fixed) */}
    <div className="fixed top-0 left-0 right-0 w-full h-72 bg-gray-200 dark:bg-gray-800 z-0"></div>

    {/* --- REMOVED Corner Fix Div --- */}

    {/* Content Area Skeleton (Scrolling) */}
    <div className="relative z-10 mt-[272px] rounded-t-[32px] bg-gray-50 dark:bg-gray-900 shadow-lg min-h-[calc(100vh-272px)]">
      <div className="p-5 max-w-md mx-auto space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1 mr-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
          <div className="flex flex-col items-end space-y-1 flex-shrink-0">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
          </div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />

        {/* Ambassador Skeleton */}
        <AmbassadorSkeleton />

        {/* Reviews Title Skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 pt-8" />

        {/* Reviews Preview Skeleton */}
        <ReviewPreviewSkeleton />
      </div>
    </div>

    {/* Bottom Button Skeleton (Fixed) */}
    <div className="fixed bottom-0 left-0 right-0 w-full p-4 bg-gradient-to-t from-white via-white/90 to-white/0 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900/0 z-20">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-full max-w-md mx-auto" />
    </div>
  </div>
));

// Attach sub-skeletons for lazy loading fallbacks
SpotDetailsSkeleton.Ambassador = AmbassadorSkeleton;
SpotDetailsSkeleton.Reviews = ReviewPreviewSkeleton;