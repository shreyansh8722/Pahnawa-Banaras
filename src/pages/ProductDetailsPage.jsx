import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, MessageCircle, ShieldCheck, Truck, Share2, Heart, Ruler, 
  ChevronLeft, Copy, Info, Star, AlertCircle, ShoppingBag, 
  Plus, Minus, Video, CreditCard 
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- NO NAVBAR/FOOTER IMPORTS HERE (Handled by Layout) ---
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';
import { formatPrice } from '@/lib/utils';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';
import { SEO } from '@/components/SEO';
import { SizeChartModal } from '@/components/shop/SizeChartModal';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductReviews } from '@/components/shop/ProductReviews';
import { ImageZoomModal } from '@/components/shop/ImageZoomModal';
import { CartModal } from '@/components/shop/CartModal';
import { DeliveryChecker } from '@/components/shop/DeliveryChecker';

// --- SUB-COMPONENTS (Keep these as they were) ---
const WishlistToast = ({ product, visible }) => (
  <div className={`${visible ? 'animate-enter' : 'animate-leave'} fixed bottom-4 left-4 bg-white border border-[#C5A059]/30 p-4 shadow-2xl rounded-sm flex gap-4 z-[100] max-w-[320px]`}>
    <img src={product.featuredImageUrl} alt="" className="w-12 h-16 object-cover rounded-sm border border-[#E6DCCA]" />
    <div className="flex flex-col justify-center">
       <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-1">Saved to Collection</p>
       <p className="font-serif text-sm text-[#2D2424] line-clamp-2 leading-tight">{product.name}</p>
    </div>
  </div>
);

const AddonOption = ({ label, price, isChecked, onChange, description }) => (
  <label className={`flex items-start gap-3 cursor-pointer group p-4 border rounded-sm transition-all duration-300 bg-white ${isChecked ? 'border-[#C5A059] bg-[#C5A059]/5 shadow-sm' : 'border-[#E6DCCA]/50 hover:border-[#C5A059]/50'}`}>
    <div className="pt-0.5">
      <input type="checkbox" className="accent-[#701a1a] w-4 h-4 cursor-pointer" checked={isChecked} onChange={onChange} />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-[#701a1a]' : 'text-[#2D2424]'}`}>{label}</span>
        <span className="text-sm font-bold text-[#2D2424]">+ ₹{formatPrice(price)}</span>
      </div>
      {description && <p className="text-xs text-[#6B6060] leading-relaxed font-light">{description}</p>}
    </div>
  </label>
);

const ImageMagnifier = ({ src, alt }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;
    let xPerc = (x / width) * 100;
    let yPerc = (y / height) * 100;
    if (xPerc > 100) xPerc = 100; if (xPerc < 0) xPerc = 0;
    if (yPerc > 100) yPerc = 100; if (yPerc < 0) yPerc = 0;
    setPosition({ x: xPerc, y: yPerc });
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-[#F4F1EA] cursor-crosshair group rounded-sm"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <img ref={imgRef} src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500" />
      <div 
        className="absolute inset-0 pointer-events-none hidden lg:block z-20 shadow-inner"
        style={{
          display: showMagnifier ? 'block' : 'none',
          backgroundImage: `url('${src}')`,
          backgroundPosition: `${position.x}% ${position.y}%`,
          backgroundSize: '250%',
        }}
      />
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-[#2D2424] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Hover to Zoom
      </div>
    </div>
  );
};

const ProductGallery = ({ images, productName, onOpenZoom }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="lg:hidden relative w-full aspect-[3/4] bg-[#F4F1EA] overflow-hidden">
         <img src={images[activeIndex]} alt={productName} className="w-full h-full object-cover" />
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/10 backdrop-blur-sm rounded-full">
            {images.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
            ))}
         </div>
      </div>

      <div className="hidden lg:flex flex-row gap-6 items-start">
        <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide w-24 shrink-0 max-h-[600px]">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-24 shrink-0 overflow-hidden border rounded-sm transition-all duration-300 ${
                activeIndex === i ? 'border-[#701a1a] opacity-100 ring-1 ring-[#701a1a]' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex-1 relative w-full aspect-[3/4] shadow-lg border border-[#E6DCCA]/30 rounded-sm">
          <ImageMagnifier src={images[activeIndex]} alt={productName} />
          <button onClick={() => onOpenZoom(activeIndex)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-[#C5A059] hover:text-white transition-colors shadow-sm z-30">
             <Share2 size={18} /> 
          </button>
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ title, children, isOpen, onClick, icon: Icon }) => (
  <div className="border-b border-[#E6DCCA]/40">
    <button onClick={onClick} className="w-full flex justify-between items-center py-5 group text-left">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={18} className="text-[#C5A059]" />}
        <span className={`font-serif text-lg tracking-wide transition-colors ${isOpen ? 'text-[#701a1a]' : 'text-[#2D2424] group-hover:text-[#C5A059]'}`}>
            {title}
        </span>
      </div>
      <ChevronDown size={16} className={`text-[#6B6060] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#701a1a]' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
      <div className="text-sm font-sans text-[#6B6060] leading-loose pl-2 border-l-2 border-[#F4F1EA] ml-2">
        {children}
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id || params.productId;
  const navigate = useNavigate();
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('care'); 
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [selectedAddons, setSelectedAddons] = useState({ 
    fallPico: false, 
    blouseStitching: false,
    tassels: false
  });
  
  const [showSizeChart, setShowSizeChart] = useState(false);
  const isWishlisted = product ? isFavorite(product.id) : false;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [productId]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    const unsub = onSnapshot(doc(db, 'products', productId), (docSnap) => {
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProduct(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        let targetCategory = product.subCategory || product.category;
        if (!targetCategory) return;
        const q = query(
          collection(db, 'products'), 
          where('subCategory', '==', targetCategory), 
          limit(5)
        );
        const snap = await getDocs(q);
        setRelatedProducts(snap.docs.map(d => ({id: d.id, ...d.data()})).filter(p => p.id !== product.id).slice(0, 4));
      } catch (e) { console.error(e); }
    };
    fetchRelated();
  }, [product]);

  // FIX: displayCategory is defined
  const displayCategory = useMemo(() => {
    if (!product) return 'Collection';
    if (product.category === 'artifact' && product.subCategory) return product.subCategory;
    return product.category || product.subCategory || 'Collection';
  }, [product]);

  const images = useMemo(() => {
     if (!product) return [];
     return product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.featuredImageUrl].filter(Boolean);
  }, [product]);

  const productSchema = useMemo(() => {
    if (!product) return null;
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": images,
      "description": product.description,
      "sku": product.sku || product.id,
      "brand": { "@type": "Brand", "name": "Pahnawa Banaras" },
      "offers": { "@type": "Offer", "priceCurrency": "INR", "price": product.price, "availability": "https://schema.org/InStock" }
    };
  }, [product, images]);

  const basePrice = product ? Number(product.price) : 0;
  let addonTotal = 0;
  if (selectedAddons.fallPico) addonTotal += 150;
  if (selectedAddons.blouseStitching) addonTotal += 1200;
  if (selectedAddons.tassels) addonTotal += 250;
  const finalPrice = basePrice + addonTotal;

  const isLowStock = product && product.stock < 5 && product.stock > 0;
  const hasSizeChart = product && ['suit', 'blouse', 'lehenga', 'kurta', 'jacket'].some(c => product.subCategory?.toLowerCase().includes(c));
  const isSaree = product?.subCategory?.toLowerCase().includes('saree');

  const handleAddToCart = () => {
    addToCart({ ...product, price: finalPrice, selectedOptions: selectedAddons, quantity });
    setCartOpen(true);
    toast.success("Added to your Royal Wardrobe", { icon: '🛍️', style: { background: '#2D2424', color: '#fff', border: '1px solid #C5A059' } });
  };

  const handleWishlistToggle = () => {
    toggleFavorite(product.id);
    if (!isWishlisted) toast.custom((t) => <WishlistToast product={product} visible={t.visible} />, { duration: 3000 });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text: `Explore this: ${product.name}`, url: window.location.href }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied", { icon: <Copy size={16}/> });
    }
  };

  const handleVideoCall = () => {
    window.open(`https://wa.me/919876543210?text=I want to see ${product.name} (SKU: ${product.sku || product.id}) on a video call.`, '_blank');
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        {/* Adjusted padding: Layout Navbar takes up ~120px, so we add minimal top padding */}
        <div className="pt-8 px-6 max-w-[1200px] mx-auto"><AppSkeleton /></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] text-[#2D2424] font-sans selection:bg-[#C5A059] selection:text-white min-h-screen">
      <SEO 
        title={product.name} 
        description={product.fullDescription?.substring(0, 160) || product.description}
        image={product.featuredImageUrl}
        schema={productSchema}
      />

      {/* Main Content: Padding-top 8 ensures it doesn't hide behind the Layout's sticky navbar */}
      <div className="pb-24 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto animate-fade-in pt-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 py-6 border-b border-[#E6DCCA]/40 text-[10px] uppercase tracking-[0.15em] text-[#6B6060] font-medium">
             <div className="flex gap-2 items-center flex-wrap">
               <Link to="/" className="hover:text-[#701a1a] transition-colors">Home</Link> 
               <span className="text-[#E6DCCA]">/</span> 
               <Link to={`/shop?cat=${displayCategory.toLowerCase()}`} className="hover:text-[#701a1a] transition-colors">{displayCategory}</Link>
               <span className="text-[#E6DCCA]">/</span>
               <span className="text-[#2D2424] truncate max-w-[200px] font-bold">{product.name}</span>
             </div>
             <div className="flex gap-6 mt-4 md:mt-0">
               <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-[#701a1a] transition-colors group">
                 <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back
               </button>
             </div>
          </div>

          <main className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            
            <div className="w-full lg:w-[58%] sticky top-28">
               <ProductGallery 
                 images={images} 
                 productName={product.name} 
                 onOpenZoom={(idx) => {
                    setZoomIndex(idx);
                    setIsZoomOpen(true);
                 }}
               />
               
               <div className="hidden lg:flex justify-around items-center border-t border-[#E6DCCA]/40 mt-8 py-6 opacity-80">
                  <div className="flex items-center gap-3"><ShieldCheck size={24} className="text-[#C5A059]" strokeWidth={1}/><div className="flex flex-col"><span className="text-xs font-bold uppercase tracking-widest">Authentic</span><span className="text-[10px] text-[#6B6060]">Silk Mark Certified</span></div></div>
                  <div className="flex items-center gap-3"><Truck size={24} className="text-[#C5A059]" strokeWidth={1}/><div className="flex flex-col"><span className="text-xs font-bold uppercase tracking-widest">Global Ship</span><span className="text-[10px] text-[#6B6060]">Insured Delivery</span></div></div>
               </div>
            </div>

            <div className="w-full lg:w-[42%] flex flex-col">
              <div className="mb-8 border-b border-[#E6DCCA]/40 pb-6">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex-1 pr-4">
                     <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.2em] mb-3 block">{displayCategory}</span>
                     <h1 className="font-serif text-2xl md:text-3xl lg:text-3xl font-medium text-[#2D2424] leading-snug mb-3">{product.name}</h1>
                     <div className="flex items-center gap-3">
                        <div className="flex text-[#C5A059]">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <Star key={i} size={14} className={i < Math.round(product.averageRating || 5) ? 'fill-current' : 'text-gray-200'} />
                           ))}
                        </div>
                        <span className="text-xs text-[#6B6060] border-l border-[#E6DCCA] pl-3">
                           SKU: {product.sku || product.id.substring(0, 8).toUpperCase()}
                        </span>
                     </div>
                   </div>
                   
                   <div className="flex gap-2">
                     <button onClick={handleWishlistToggle} className="p-3 bg-[#F4F1EA] hover:bg-[#C5A059] hover:text-white transition-all rounded-full group">
                       <Heart size={20} fill={isWishlisted ? "#701a1a" : "none"} className={isWishlisted ? "text-[#701a1a]" : "currentColor"} />
                     </button>
                     <button onClick={handleShare} className="p-3 bg-[#F4F1EA] hover:bg-[#C5A059] hover:text-white transition-all rounded-full">
                       <Share2 size={20} />
                     </button>
                   </div>
                 </div>

                 <div className="bg-[#F4F1EA]/30 p-4 rounded-sm border border-[#C5A059]/10">
                   <div className="flex items-end gap-3 mb-2">
                     <span className="text-3xl font-serif text-[#701a1a] font-medium">₹{formatPrice(basePrice)}</span>
                     {product.originalPrice && product.originalPrice > product.price && (
                        <div className="mb-1 flex gap-2 items-center">
                            <span className="text-sm text-[#6B6060] line-through">₹{formatPrice(product.originalPrice)}</span>
                            <span className="text-[10px] text-green-800 bg-green-100 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wide">
                                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                        </div>
                     )}
                   </div>
                   <div className="flex items-center gap-2 text-[10px] text-[#6B6060] uppercase tracking-wider font-medium">
                      <CreditCard size={12} /> EMI starts at ₹{Math.round(basePrice/3)}/mo
                   </div>
                   {isLowStock && (
                     <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-widest mt-3 animate-pulse">
                        <AlertCircle size={14} /> Only {product.stock} left in stock
                     </div>
                   )}
                 </div>

                 <DeliveryChecker />
              </div>

              <div className="mb-8">
                 <div className="prose prose-sm text-[#2D2424]/80 font-sans font-light leading-relaxed mb-6 line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                   {product.description || product.fullDescription}
                 </div>
                 
                 <div className="bg-white border border-[#E6DCCA] p-5 rounded-sm shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-4 flex items-center gap-2"><Info size={14}/> Artifact Details</h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div><span className="block text-[10px] uppercase tracking-widest text-[#6B6060] mb-1">Technique</span><span className="font-serif text-[#2D2424]">{product.technique || 'Handwoven Kadhua'}</span></div>
                        <div><span className="block text-[10px] uppercase tracking-widest text-[#6B6060] mb-1">Fabric</span><span className="font-serif text-[#2D2424]">{product.fabric || 'Pure Katan Silk'}</span></div>
                        <div><span className="block text-[10px] uppercase tracking-widest text-[#6B6060] mb-1">Color</span><span className="font-serif text-[#2D2424]">{product.color || 'Multi'}</span></div>
                        <div><span className="block text-[10px] uppercase tracking-widest text-[#6B6060] mb-1">Zari</span><span className="font-serif text-[#2D2424]">{product.zariType || 'Gold & Silver Zari'}</span></div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6 mb-10">
                 {hasSizeChart && (
                   <div className="flex justify-between items-center pb-2">
                     <span className="text-sm font-bold text-[#2D2424] uppercase tracking-widest">Select Size</span>
                     <button onClick={() => setShowSizeChart(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#C5A059] hover:text-[#701a1a] transition-colors group">
                       <Ruler size={14} /> <span className="border-b border-[#C5A059] group-hover:border-[#701a1a]">Size Guide</span>
                     </button>
                   </div>
                 )}
                 
                 <div className="space-y-3">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-[#2D2424] flex items-center gap-2">
                       Personalize Your Weave <span className="text-[9px] bg-[#C5A059] text-white px-2 rounded-full">Optional</span>
                   </h3>
                   <AddonOption label="Add Fall & Pico" price={150} isChecked={selectedAddons.fallPico} onChange={() => setSelectedAddons(p => ({...p, fallPico: !p.fallPico}))} description="Essential finish for sarees. Adds 1-2 days." />
                   {isSaree && (
                     <>
                       <AddonOption label="Premium Tassels" price={250} isChecked={selectedAddons.tassels} onChange={() => setSelectedAddons(p => ({...p, tassels: !p.tassels}))} description="Handcrafted tassels added to the pallu." />
                       <AddonOption label="Custom Blouse Stitching" price={1200} isChecked={selectedAddons.blouseStitching} onChange={() => setSelectedAddons(p => ({...p, blouseStitching: !p.blouseStitching}))} description="Our stylist will contact you. Adds 5-7 days." />
                     </>
                   )}
                 </div>
              </div>

              <div className="space-y-4 mb-10 p-6 bg-[#F4F1EA]/20 border border-[#E6DCCA] rounded-sm">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#2D2424]">Quantity</span>
                    <div className="flex items-center border border-[#2D2424] bg-white h-8 w-24">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center hover:bg-[#F4F1EA] transition-colors"><Minus size={12}/></button>
                        <span className="flex-1 text-center text-xs font-bold">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-full flex items-center justify-center hover:bg-[#F4F1EA] transition-colors"><Plus size={12}/></button>
                    </div>
                 </div>

                 <button onClick={handleAddToCart} className="w-full bg-[#701a1a] text-white h-14 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#2D2424] transition-all duration-300 shadow-lg flex items-center justify-center gap-3">
                    <ShoppingBag size={18} />
                    <span>{addonTotal > 0 ? `Add to Cart • ₹${formatPrice(finalPrice)}` : 'Add to Cart'}</span>
                 </button>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleVideoCall} className="w-full border border-[#C5A059] text-[#C5A059] h-12 uppercase tracking-[0.15em] text-[10px] font-bold hover:bg-[#C5A059] hover:text-white transition-all flex items-center justify-center gap-2">
                       <Video size={16} /> See it Live
                    </button>
                    <button onClick={() => window.open(`https://wa.me/919876543210?text=Enquiry: ${product.name}`, '_blank')} className="w-full border border-[#2D2424] text-[#2D2424] h-12 uppercase tracking-[0.15em] text-[10px] font-bold hover:bg-[#2D2424] hover:text-white transition-all flex items-center justify-center gap-2">
                       <MessageCircle size={16} /> WhatsApp
                    </button>
                 </div>
              </div>

              <div className="mb-12">
                <Accordion title="Material & Care" isOpen={activeSection === 'care'} onClick={() => setActiveSection(activeSection === 'care' ? '' : 'care')} icon={Info}>
                  <div className="space-y-4 pt-2">
                     <p>This is a certified handloom product.</p>
                     <ul className="list-disc pl-5 space-y-2 marker:text-[#C5A059]">
                       <li>Dry Clean Only.</li>
                       <li>Wrap in muslin cloth.</li>
                     </ul>
                  </div>
                </Accordion>
                <Accordion title="Shipping & Returns" isOpen={activeSection === 'shipping'} onClick={() => setActiveSection(activeSection === 'shipping' ? '' : 'shipping')} icon={Truck}>
                   <div className="space-y-3 pt-2">
                      <p><strong>Dispatch:</strong> 24-48 Hours.</p>
                      <p><strong>Returns:</strong> 7-day return policy.</p>
                   </div>
                </Accordion>
              </div>
            </div>
          </main>

          <div className="mt-12"><ProductReviews productId={product.id} /></div>

          <section className="mt-24 border-t border-[#E6DCCA]/40 pt-16">
             <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">Curated For You</span>
                <h2 className="font-display text-3xl md:text-4xl text-[#2D2424] mt-2">Complete The Look</h2>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
               {relatedProducts.length > 0 ? (
                 relatedProducts.map(item => <ProductCard key={item.id} item={item} />)
               ) : (
                 <div className="col-span-full text-center text-[#6B6060] text-sm italic py-10">Explore our collection for more treasures.</div>
               )}
             </div>
          </section>

      </div>

      <AnimatePresence>
        {!loading && product && isScrolled && (
          <motion.div 
             initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
             className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#C5A059]/30 p-4 z-50 flex gap-4 items-center shadow-[0_-5px_20px_rgba(0,0,0,0.1)]"
          >
             <div className="flex-1">
               <p className="text-xs font-serif text-[#2D2424] truncate mb-0.5">{product.name}</p>
               <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#701a1a]">₹{formatPrice(finalPrice)}</p>
               </div>
             </div>
             <button onClick={handleAddToCart} className="bg-[#701a1a] text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold shadow-md rounded-sm">
               Add to Bag
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageZoomModal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} images={images} initialIndex={zoomIndex} />
      <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} category={product.category} />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}