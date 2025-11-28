import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- NEW: Global Price Formatter ---
export const formatPrice = (amount) => {
  const price = Number(amount) || 0; // Force convert to Number
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(price);
};

// --- Image Compression Helper ---
export const compressImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        const width = (scaleSize < 1) ? MAX_WIDTH : img.width;
        const height = (scaleSize < 1) ? img.height * scaleSize : img.height;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: "image/webp",
            lastModified: Date.now(),
          });
          resolve(newFile);
        }, 'image/webp', 0.75); 
      };
    };
    reader.onerror = (error) => reject(error);
  });
};