import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, Check, Zap, ShieldCheck, Truck, RotateCcw, 
  ShoppingBag, Ruler, AlertCircle, XCircle, Share2 
} from 'lucide-react';
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
import { RecentlyViewed } from '@/components/shop/RecentlyViewed'; 
import { SizeChartModal } from '@/components/shop/SizeChartModal';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useLoginModal } from '@/context/LoginModalContext';
import { SEO } from '@/components/SEO';
import { AnimatePresence, motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { openLoginModal } = useLoginModal();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  
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

  useEffect(() => {
    if (product?.id) {
      const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
      const newViewed = [product.id, ...viewed.filter(id => id !== product.id)].slice(0, 10);
      localStorage.setItem('recently_viewed', JSON.stringify(newViewed));
    }
  }, [product]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    let price = Number(product.price) || 0;
    if (customizations.fallPico) price += 150;
    if (customizations.blouseStitching) price += 850;
    return price;
  }, [product, customizations]);

  const isOutOfStock = product?.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!user) { openLoginModal(); return; }
    if (!product) return;
    
    const cartItem = { ...product, price: finalPrice, selectedOptions: customizations, quantity: 1 };
    addToCart(cartItem);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (!user) { openLoginModal(); return; }
    if (!product) return;

    const cartItem = { ...product, price: finalPrice, selectedOptions: customizations, quantity: 1 };
    navigate('/checkout', { state: { cart: [cartItem], subtotal: finalPrice } });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} on Pahnawa Banaras`,
          url: window.location.href
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  const images = useMemo(() => {
    if (!product) return [];
    return product.imageUrls && product.imageUrls.length > 0 
      ? product.imageUrls 
      : [product.featuredImageUrl].filter(Boolean);
  }, [product]);

  if (loading) return <AppSkeleton />;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product Not Found</div>;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.featuredImageUrl,
    "description": product.fullDescription,
    "brand": { "@type": "Brand", "name": "Pahnawa Banaras" },
    "offers": { 
      "@type": "Offer", 
      "price": finalPrice, 
      "priceCurrency": "INR", 
      "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" 
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col relative">
      <SEO 
        title={product.name} 
        description={product.fullDescription?.slice(0, 150)} 
        image={product.featuredImageUrl} 
        schema={productSchema} 
      />
      <Navbar />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mb-10 px-0 md:px-8 pt-0 pb-12">
        
        {/* GALLERY */}
        <div className="md:col-span-7 w-full">
          <ProductGallery images={images} name={product.name} />
        </div>

        {/* DETAILS */}
        <div className="md:col-span-5 px-4 md:px-8">
          <div className="md:sticky md:top-28">
            
            {/* Header Section */}
            <div className="mb-6 mt-4 md:mt-0">
              <div className="flex justify-between items-start mb-2">
                  <h1 className="font-serif text-2xl md:text-4xl text-gray-900 leading-tight flex-1 pr-2">{product.name}</h1>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={handleShare} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600">
                        <Share2 size={20} />
                    </button>
                    <button onClick={() => toggleFavorite(product.id)} className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} className={isFavorite ? "text-red-500" : "text-gray-600"} />
                    </button>
                  </div>
              </div>
              
              {/* Stock & Price */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-sm font-bold">
                    {product.subCategory || 'Banarasi'}
                </span>
                {isOutOfStock ? (
                   <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-gray-900 px-2 py-1 rounded-sm">
                      <XCircle size={12} /> SOLD OUT
                   </span>
                ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-sm">
                        <Check size={12} /> In Stock
                    </span>
                )}
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">₹{formatPrice(finalPrice)}</span>
                {product.comparePrice > product.price && <span className="text-sm text-gray-400 line-through">MRP ₹{formatPrice(product.comparePrice)}</span>}
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold">Inclusive of taxes</span>
              </div>
            </div>

            <ProductOffers />

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-sm border border-gray-100">
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-1">Blouse Piece</p>
                    <p className="text-xs font-medium text-gray-900 flex items-center gap-1"><Check size={12} className="text-green-600"/> Included</p>
                </div>
                <button onClick={() => setShowSizeChart(true)} className="p-3 bg-white rounded-sm border border-gray-200 hover:border-[#B08D55] transition-colors text-left group">
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-1 group-hover:text-[#B08D55]">Size Guide</p>
                    <p className="text-xs font-medium text-gray-900 flex items-center gap-1"><Ruler size={12} /> View Chart</p>
                </button>
            </div>

            <ProductCustomization options={customizations} onOptionsChange={setCustomizations} />
            
            {/* --- ACTIONS (Unified for Mobile & Desktop) --- */}
            {/* Changed from hidden/fixed to standard flow */}
            <div className="flex gap-3 mb-8 mt-6 items-stretch">
              <button 
                onClick={handleAddToCart} 
                disabled={isOutOfStock}
                className="flex-1 bg-white border border-black text-black py-3.5 md:py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} /> {isOutOfStock ? "Sold Out" : "Add to Bag"}
              </button>
              <button 
                onClick={handleBuyNow} 
                disabled={isOutOfStock}
                className="flex-1 bg-[#B08D55] text-white py-3.5 md:py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#8c6a40] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={16} fill="currentColor"/> {isOutOfStock ? "Unavailable" : "Buy Now"}
              </button>
            </div>

            <DeliveryChecker />
            <ProductTabs 
              description={product.fullDescription} 
              material={product.material} 
              weave={product.subCategory} 
              sku={product.id.slice(0,8).toUpperCase()}
              productId={product.id} 
            />
            
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-gray-100 mt-8">
              <div className="text-center"><ShieldCheck size={20} className="mx-auto text-[#B08D55] mb-2"/><p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Silk Mark</p></div>
              <div className="text-center border-l border-r border-gray-100"><Truck size={20} className="mx-auto text-[#B08D55] mb-2"/><p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Free Shipping</p></div>
              <div className="text-center"><RotateCcw size={20} className="mx-auto text-[#B08D55] mb-2"/><p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">7 Day Return</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations - Fixed Alignment */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 w-full border-t border-gray-100 pt-10 pb-20">
          {/* Removed 'text-center' from here to fix misalignment if needed, but ProductRecommendations handles its own header */}
          <ProductRecommendations title="You May Also Like" category={product.subCategory || product.category} currentProductId={product.id} type="related" />
      </div>

      <RecentlyViewed currentProductId={product.id} />

      <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} category={product.subCategory} />
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }} 
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pointer-events-none whitespace-nowrap"
          >
            <Check size={16} className="text-green-400" /> <span className="text-sm font-medium">Added to Bag</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}