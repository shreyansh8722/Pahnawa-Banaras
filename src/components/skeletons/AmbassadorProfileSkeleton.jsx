import React, { memo } from 'react';
import ListSkeleton from './ListSkeleton';

export const AmbassadorProfileSkeleton = memo(() => (
  <div className="animate-pulse min-h-screen">
    {/* Image Carousel Skeleton (Fixed) */}
    <div className="fixed top-0 left-0 right-0 w-full h-72 bg-gray-200 dark:bg-gray-800 z-0"></div>

    {/* Content Area Skeleton (Scrolling) */}
    <div className="relative z-10 mt-[272px] rounded-t-[32px] bg-gray-50 dark:bg-gray-900 shadow-lg min-h-[calc(100vh-272px)]">
      <div className="p-5 max-w-md mx-auto space-y-4">
        {/* Profile Info Skeleton */}
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 border-4 border-gray-50 dark:border-gray-900 -mt-12" />
          <div className="flex-1 mb-2 space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2" />

        {/* Spots List Skeleton */}
        <div className="pt-8">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
          <ListSkeleton itemCount={2} />
        </div>
      </div>
    </div>
  </div>
));