import React, { useState } from "react";

export const LazyImage = ({ src, alt, className, isPriority = false }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full">
      {!loaded && <div className="absolute inset-0 bg-gray-800/30 animate-pulse rounded-2xl" />}
      <img
        src={src}
        alt={alt}
        loading={isPriority ? "eager" : "lazy"}
        fetchpriority={isPriority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};