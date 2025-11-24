import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- NEW: Image Compression Helper ---
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
        
        // Resize logic: Max width 1200px (good for web)
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        const width = (scaleSize < 1) ? MAX_WIDTH : img.width;
        const height = (scaleSize < 1) ? img.height * scaleSize : img.height;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP at 75% quality
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