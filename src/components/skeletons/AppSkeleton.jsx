import React from 'react';

export const AppSkeleton = () => {
  return (
    <div className="min-h-screen bg-white animate-pulse font-sans overflow-hidden">
      
      {/* 1. Navbar Skeleton */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
         {/* Announcement Bar */}
         <div className="h-8 bg-gray-100 w-full"></div>
         
         {/* Main Header */}
         <div className="px-4 py-3 md:px-8 flex items-center justify-between h-16 md:h-20">
            {/* Left Actions */}
            <div className="flex gap-4 w-1/3">
               <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
               <div className="w-8 h-8 bg-gray-200 rounded-full hidden md:block"></div>
            </div>
            
            {/* Logo Placeholder */}
            <div className="w-1/3 flex justify-center">
               <div className="w-32 h-10 bg-gray-200 rounded-sm"></div>
            </div>
            
            {/* Right Actions */}
            <div className="flex gap-4 w-1/3 justify-end">
               <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
               <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
         </div>
      </div>

      {/* 2. Hero Section Skeleton */}
      <div className="relative w-full h-[65vh] md:h-[90vh] bg-gray-100 flex items-center justify-center">
         <div className="text-center space-y-4 p-4 w-full max-w-lg">
            <div className="h-4 bg-gray-200 w-1/2 mx-auto rounded"></div>
            <div className="h-16 md:h-24 bg-gray-200 w-3/4 mx-auto rounded-sm"></div>
            <div className="h-12 w-40 bg-gray-200 mx-auto rounded-sm mt-8"></div>
         </div>
      </div>

      {/* 3. Categories Strip Skeleton */}
      <div className="py-10 px-4">
         <div className="h-6 w-48 bg-gray-100 mx-auto mb-8 rounded"></div>
         <div className="flex gap-6 overflow-hidden justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="flex flex-col items-center gap-3 shrink-0">
                  <div className="w-20 h-20 md:w-36 md:h-36 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-3 bg-gray-100 rounded"></div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};