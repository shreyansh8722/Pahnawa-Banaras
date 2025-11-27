import React, { useState, useEffect } from "react";

export const LazyImage = ({ src, alt, className, isPriority = false }) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (isPriority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(true);
    }
  }, [src, isPriority]);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Skeleton Loader while image loads */}
      <div 
        className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
        aria-hidden="true"
      />
      
      <img
        src={src}
        alt={alt || "Pahnawa Banaras Product"} // Fallback for Accessibility
        loading={isPriority ? "eager" : "lazy"}
        decoding={isPriority ? "sync" : "async"}
        fetchPriority={isPriority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};