import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Share2, Check, Zap, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { ProductTabs } from '@/components/shop/ProductTabs';
import { ProductCustomization } from '@/components/shop/ProductCustomization';
import { ProductOffers } from '@/components/shop/ProductOffers';
import { DeliveryChecker } from '@/components/shop/DeliveryChecker';
import { ProductRecommendations } from '@/components/shop/ProductRecommendations';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  
  const isFavorite = favorites.includes(productId);

  const [customizations, setCustomizations] = useState({
    fallPico: false,
    blouseStitching: false
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!productId) return;
        const snap = await getDoc(doc(db, 'products', productId));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setProduct(null);
        }
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    if (customizations.fallPico) price += 150;
    if (customizations.blouseStitching) price += 850;
    return price;
  }, [product, customizations]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = { 
      ...product, 
      price: finalPrice, 
      selectedOptions: customizations,
      quantity: 1
    };
    
    addToCart(cartItem);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const cartItem = { 
      ...product, 
      price: finalPrice, 
      selectedOptions: customizations,
      quantity: 1
    };
    navigate('/checkout', { state: { cart: [cartItem], subtotal: finalPrice } });
  };

  const images = useMemo(() => {
    if (!product) return [];
    return product.imageUrls && product.imageUrls.length > 0 
      ? product.imageUrls 
      : [product.featuredImageUrl].filter(Boolean);
  }, [product]);

  if (loading) return <AppSkeleton />;

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
      <h2 className="text-2xl font-serif text-gray-900 mb-2">Product Not Found</h2>
      <p className="text-gray-500 mb-6">This item may have been removed.</p>
      <button onClick={() => navigate('/shop')} className="bg-[#B08D55] text-white px-6 py-3 uppercase text-xs font-bold tracking-widest rounded-sm">
        Back to Shop
      </button>
    </div>
  );

  return (
    // Added substantial padding-bottom (pb-32) on mobile to ensure content clears the fixed bar
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col pb-32 md:pb-0 relative">
      <Navbar />

      {/* Breadcrumb (Desktop) */}
      <div className="w-full border-b border-gray-100 bg-white hidden md:block">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-3 text-[10px] md:text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <span className="cursor-pointer hover:text-black" onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={10} />
            <span className="cursor-pointer hover:text-black" onClick={() => navigate('/shop')}>Shop</span>
            <ChevronRight size={10} />
            <span className="text-black font-bold truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mb-10 px-0 md:px-8 pt-0 md:pt-6">
        
        {/* --- GALLERY --- */}
        <div className="md:col-span-7 w-full">
          <ProductGallery images={images} name={product.name} />
        </div>

        {/* --- DETAILS --- */}
        <div className="md:col-span-5 px-4 md:px-8">
          <div className="md:sticky md:top-28">
            
            {/* Header */}
            <div className="mb-6 mt-4 md:mt-0">
              <div className="flex justify-between items-start mb-2">
                  <h1 className="font-serif text-2xl md:text-4xl text-gray-900 leading-tight max-w-md">
                    {product.name}
                  </h1>
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2 rounded-full bg-gray-50 md:bg-transparent hover:bg-gray-100 transition-colors"
                  >
                      <Heart 
                        size={24} 
                        fill={isFavorite ? "#ef4444" : "none"} 
                        className={isFavorite ? "text-red-500" : "text-gray-500"} 
                      />
                  </button>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                {product.subCategory || 'Banarasi Handloom'}
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-[#B08D55] font-bold">In Stock</span>
              </p>
              
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                {product.comparePrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      MRP ₹{product.comparePrice?.toLocaleString('en-IN')}
                    </span>
                )}
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-sm uppercase tracking-wide">
                  Inclusive of Taxes
                </span>
              </div>
            </div>

            <ProductOffers />
            
            <ProductCustomization 
              options={customizations} 
              onOptionsChange={setCustomizations} 
            />

            {/* Desktop Actions - ONLY Visible on Desktop (hidden md:flex) */}
            <div className="hidden md:flex gap-4 mb-8 mt-8 items-stretch">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
              >
                Add to Bag
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-[#B08D55] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#8c6a40] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                 <Zap size={16} fill="currentColor"/> Buy Now
              </button>
            </div>

            <DeliveryChecker />

            <ProductTabs 
               description={product.fullDescription} 
               material={product.material} 
               weave={product.subCategory}
               sku={product.id.toUpperCase().slice(0,8)}
            />
            
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-gray-100 mt-8">
              <div className="text-center">
                <ShieldCheck size={20} className="mx-auto text-[#B08D55] mb-2"/>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Silk Mark</p>
              </div>
              <div className="text-center border-l border-r border-gray-100">
                <Truck size={20} className="mx-auto text-[#B08D55] mb-2"/>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="mx-auto text-[#B08D55] mb-2"/>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">7 Day Returns</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- RECOMMENDATIONS & BESTSELLERS --- */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 w-full border-t border-gray-100 pt-10 pb-20">
          <ProductRecommendations 
             title="You May Also Like" 
             category={product.category} 
             currentProductId={product.id} 
             type="related"
          />
          <ProductRecommendations 
             title="Our Bestsellers" 
             type="bestseller"
             currentProductId={product.id} 
          />
      </div>

      {/* --- MOBILE STICKY ACTION BAR --- */}
      {/* Explicit 'flex' and high Z-index to ensure visibility */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 z-[100] flex md:hidden gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe">
         <button 
            className="flex-1 border border-gray-200 rounded-sm py-3 flex items-center justify-center text-gray-900 active:bg-gray-50" 
            onClick={() => toggleFavorite(product.id)}
         >
            <Heart 
              size={20} 
              fill={isFavorite ? "#ef4444" : "none"} 
              className={isFavorite ? "text-red-500" : "text-gray-600"} 
            />
         </button>
         <button 
            onClick={handleAddToCart}
            className="flex-[2] bg-[#B08D55] text-white font-bold uppercase tracking-widest text-[10px] rounded-sm py-3 shadow-lg active:scale-95 transition-transform"
         >
            Add to Bag
         </button>
         <button 
            onClick={handleBuyNow}
            className="flex-[2] bg-black text-white font-bold uppercase tracking-widest text-[10px] rounded-sm py-3 shadow-lg flex items-center justify-center gap-1 active:scale-95 transition-transform"
         >
            <Zap size={14} fill="currentColor" /> Buy Now
         </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            // Moved up on mobile (bottom-24) to clear the sticky bar
            className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pointer-events-none"
          >
            <div className="bg-green-500 rounded-full p-1">
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="text-sm font-medium">Added to Bag</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}