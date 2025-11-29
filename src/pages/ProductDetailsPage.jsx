import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductCustomization } from '@/components/shop/ProductCustomization';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';
import toast from 'react-hot-toast';
import { SEO } from '@/components/SEO';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customizations, setCustomizations] = useState({ fallPico: false, blouseStitching: false });

  // 1. Fetch Logic (Preserved)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'products', productId), (doc) => {
      setProduct(doc.exists() ? { id: doc.id, ...doc.data() } : null);
      setLoading(false);
    });
    return () => unsub();
  }, [productId]);

  const images = useMemo(() => {
     if (!product) return [];
     return product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.featuredImageUrl];
  }, [product]);

  const finalPrice = product ? Number(product.price) + (customizations.fallPico ? 150 : 0) : 0;

  // 2. Cart Logic (Preserved)
  const handleAddToCart = () => {
    addToCart({ ...product, price: finalPrice, selectedOptions: customizations, quantity: 1 });
    toast.success("Added to your collection");
  };

  if (loading) return <AppSkeleton />;
  if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-heritage-paper font-serif text-heritage-charcoal">
      <SEO title={product.name} image={product.featuredImageUrl} />
      <Navbar />

      {/* --- NEW SPLIT LAYOUT --- */}
      <div className="lg:flex">
        
        {/* LEFT: Scrollable Gallery (60%) */}
        <div className="w-full lg:w-[60%] bg-heritage-sand">
          <div className="flex flex-col gap-1">
             {images.map((img, i) => (
               <img key={i} src={img} alt={`${product.name} view ${i}`} className="w-full h-auto object-cover" />
             ))}
          </div>
        </div>

        {/* RIGHT: Sticky Story & Actions (40%) */}
        <div className="w-full lg:w-[40%] px-6 md:px-12 py-12 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto scrollbar-hide flex flex-col justify-center bg-heritage-paper">
          
          <div className="text-[9px] uppercase tracking-lux text-heritage-grey mb-8">
            Home / Handloom / {product.subCategory}
          </div>

          <h1 className="text-4xl md:text-5xl font-light italic mb-4 leading-none text-heritage-charcoal">
            {product.name}
          </h1>
          <div className="text-xl font-sans text-heritage-grey mb-8">
            ₹{formatPrice(finalPrice)}
          </div>

          {/* THE ARTISAN STORY */}
          <div className="border-t border-b border-heritage-border py-8 mb-8">
            <span className="text-[10px] uppercase tracking-lux text-heritage-gold block mb-3">The Craftsmanship</span>
            <p className="text-sm font-sans text-heritage-grey leading-relaxed">
              {product.fullDescription || "A masterpiece of the Kadhua technique. This saree features complex jangla patterns woven entirely by hand. It takes a master weaver approximately 120 hours to complete this piece."}
            </p>
            <div className="flex gap-6 mt-6 opacity-70">
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full border border-heritage-charcoal flex items-center justify-center text-[8px]">S</div>
                 <span className="text-[9px] uppercase tracking-lux">Silk Mark</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full border border-heritage-charcoal flex items-center justify-center text-[8px]">H</div>
                 <span className="text-[9px] uppercase tracking-lux">Handloom</span>
               </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            <ProductCustomization options={customizations} onOptionsChange={setCustomizations} />
            
            <button 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-heritage-charcoal text-heritage-paper py-5 hover:bg-heritage-gold transition-colors duration-500 disabled:opacity-50"
            >
              {product.stock <= 0 ? "Currently Unavailable" : "Add to Collection"}
            </button>
            
            <p className="text-center text-[9px] uppercase tracking-lux text-heritage-grey mt-4">
              Complimentary Shipping & 7-Day Exchange
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}