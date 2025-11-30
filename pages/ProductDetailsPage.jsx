import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { AppSkeleton } from '@/components/skeletons/AppSkeleton';
import toast from 'react-hot-toast';
import { SEO } from '@/components/SEO';
import { SizeChartModal } from '@/components/shop/SizeChartModal';
import { ProductCard } from '@/components/shop/ProductCard';
import { 
  ChevronDown, MessageCircle, ShieldCheck, Truck, 
  Share2, Heart, Ruler, CheckCircle2, Lock, ChevronLeft, ChevronRight, Copy, Info
} from 'lucide-react';

// --- 1. HELPER: WISHLIST POPUP ---
const WishlistToast = ({ product, visible }) => (
  <div className={`${visible ? 'animate-enter' : 'animate-leave'} fixed bottom-4 left-4 bg-white border border-heritage-gold/30 p-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-sm flex gap-3 z-[100] max-w-[280px]`}>
    <img src={product.featuredImageUrl} alt="" className="w-12 h-16 object-cover rounded-sm" />
    <div className="flex flex-col justify-center">
       <p className="text-[11px] uppercase tracking-widest text-heritage-gold font-medium mb-1">Added to Wishlist</p>
       <p className="font-serif text-sm text-heritage-charcoal line-clamp-2 leading-tight">{product.name}</p>
    </div>
  </div>
);

// --- 2. HELPER: CUSTOMIZATION OPTION ROW ---
const AddonOption = ({ label, price, isChecked, onChange, description }) => (
  <label className={`flex items-start gap-3 cursor-pointer group p-4 border rounded-sm transition-all duration-300 bg-white ${isChecked ? 'border-heritage-gold bg-heritage-gold/5' : 'border-heritage-border/60 hover:border-heritage-charcoal'}`}>
    <div className="pt-0.5">
      <input type="checkbox" className="accent-heritage-charcoal w-4 h-4" checked={isChecked} onChange={onChange} />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-sm font-medium text-heritage-charcoal">{label}</span>
        <span className="text-sm text-heritage-charcoal">+ ₹{formatPrice(price)}</span>
      </div>
      {description && <p className="text-xs text-heritage-grey leading-relaxed">{description}</p>}
    </div>
  </label>
);

// --- 3. LUXURY MAGNIFIER COMPONENT ---
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
      className="relative w-full h-full overflow-hidden bg-heritage-sand/20 cursor-pointer group rounded-sm"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <img ref={imgRef} src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500" />
      <div 
        className="absolute inset-0 pointer-events-none hidden lg:block z-20"
        style={{
          display: showMagnifier ? 'block' : 'none',
          backgroundImage: `url('${src}')`,
          backgroundPosition: `${position.x}% ${position.y}%`,
          backgroundSize: '250%',
        }}
      />
    </div>
  );
};

// --- 4. GALLERY COMPONENT ---
const ProductGallery = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 items-start">
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto scrollbar-hide lg:w-24 shrink-0 hide-scrollbar py-1 px-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative w-20 h-24 lg:w-full lg:h-32 shrink-0 overflow-hidden border rounded-sm transition-all duration-300 ${
              activeIndex === i ? 'border-heritage-gold opacity-100 ring-1 ring-heritage-gold shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <div className="flex-1 relative w-full aspect-[3/4] lg:aspect-[3/4] shadow-sm border border-heritage-border/20 rounded-sm">
        <ImageMagnifier src={images[activeIndex]} alt={productName} />
      </div>
    </div>
  );
};

// --- 5. ACCORDION COMPONENT ---
const Accordion = ({ title, children, isOpen, onClick }) => (
  <div className="border-b border-heritage-border/60">
    <button onClick={onClick} className="w-full flex justify-between items-center py-5 group text-left">
      <span className="font-serif text-lg text-heritage-charcoal group-hover:text-heritage-gold transition-colors">
        {title}
      </span>
      <ChevronDown size={16} className={`text-heritage-charcoal transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[1200px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
      <div className="text-sm font-sans text-heritage-grey leading-loose font-light">
        {children}
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('care'); 
  const [pincode, setPincode] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const [selectedAddons, setSelectedAddons] = useState({ 
    fallPico: false, 
    blouseStitching: false,
    tassels: false
  });
  
  const [showSizeChart, setShowSizeChart] = useState(false);

  // FIX: Force Scroll to Top whenever Loading state changes or ProductID changes
  useLayoutEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [loading, productId]);

  // Fetch Main Product
  useEffect(() => {
    // Note: We don't scroll here anymore to avoid race conditions. 
    // The useLayoutEffect above handles it more reliably.
    setLoading(true);
    const unsub = onSnapshot(doc(db, 'products', productId), (doc) => {
      if (doc.exists()) {
        setProduct({ id: doc.id, ...doc.data() });
      } else {
        setProduct(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [productId]);

  // Fetch Related Products
  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        const qCategory = query(
          collection(db, 'products'), 
          where('category', '==', product.category),
          limit(5) 
        );
        let querySnapshot = await getDocs(qCategory);
        
        if (querySnapshot.size <= 1) {
           const qAll = query(collection(db, 'products'), limit(5));
           querySnapshot = await getDocs(qAll);
        }

        let related = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== product.id) {
            related.push({ id: doc.id, ...doc.data() });
          }
        });
        setRelatedProducts(related.slice(0, 4));
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
    fetchRelated();
  }, [product]);

  const images = useMemo(() => {
     if (!product) return [];
     return product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.featuredImageUrl];
  }, [product]);

  const hasSizeChart = product && ['suit', 'blouse', 'lehenga', 'kurta', 'jacket'].some(c => product.subCategory?.toLowerCase().includes(c));
  const isSaree = product?.subCategory?.toLowerCase().includes('saree');
  
  const basePrice = product ? Number(product.price) : 0;
  let addonTotal = 0;
  if (selectedAddons.fallPico) addonTotal += 150;
  if (selectedAddons.blouseStitching) addonTotal += 1200;
  if (selectedAddons.tassels) addonTotal += 250;
  const finalPrice = basePrice + addonTotal;

  const handleAddToCart = () => {
    addToCart({ ...product, price: finalPrice, selectedOptions: selectedAddons, quantity: 1 });
    toast.success("Added to Bag", { position: 'bottom-center' });
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.custom((t) => <WishlistToast product={product} visible={t.visible} />, {
        position: 'bottom-left',
        duration: 3000,
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this beautiful ${product.name} on Pahnawa Banaras.`,
          url: window.location.href,
        });
      } catch (error) { console.log('Error sharing:', error); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard", { icon: <Copy size={18}/> });
    }
  };

  const handleConsult = () => {
    window.open(`https://wa.me/919876543210?text=I am interested in ${product.name} (SKU: ${product.sku || product.id.substring(0, 8)})`, '_blank');
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-heritage-paper text-heritage-charcoal font-sans">
      <SEO title={product ? product.name : 'Loading...'} />
      <Navbar />

      {/* LAYOUT FIX: 
        Navbar is always rendered above. 
        If loading, we show Skeleton but KEEP the Navbar. 
        This prevents layout shifts that mess up scroll position.
      */}
      
      {loading || !product ? (
        <div className="pt-4 px-6">
           <AppSkeleton />
        </div>
      ) : (
        <div className="pt-4 pb-24 px-6 md:px-8 lg:px-12 max-w-[1400px] mx-auto animate-fade-in">
          
          {/* --- TOP NAVIGATION BAR --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-heritage-border/40 text-[10px] uppercase tracking-[0.15em] text-heritage-grey font-medium">
             <div className="flex gap-2 items-center flex-wrap">
               <Link to="/" className="hover:text-heritage-gold transition-colors">Home</Link> 
               <span className="text-heritage-border">/</span> 
               <Link to={`/shop?cat=${product.subCategory?.toLowerCase()}`} className="hover:text-heritage-gold transition-colors">{product.subCategory}</Link>
               <span className="text-heritage-border">/</span>
               <span className="text-heritage-charcoal truncate max-w-[200px]">{product.name}</span>
             </div>
             <div className="flex gap-6 mt-4 md:mt-0">
               <Link to="#" className="flex items-center gap-1 hover:text-heritage-gold transition-colors group"><ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform"/> Previous</Link>
               <span className="text-heritage-border opacity-50">|</span>
               <Link to="#" className="flex items-center gap-1 hover:text-heritage-gold transition-colors group">Next <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform"/></Link>
             </div>
          </div>

          {/* --- MAIN PRODUCT LAYOUT --- */}
          <main className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            
            {/* LEFT: GALLERY */}
            <div className="w-full lg:w-[58%]">
               <ProductGallery images={images} productName={product.name} />
            </div>

            {/* RIGHT: DETAILS */}
            <div className="w-full lg:w-[42%] flex flex-col">
              
              {/* Header Section */}
              <div className="mb-6">
                 <div className="flex justify-between items-start mb-4">
                   <h1 className="font-serif text-3xl lg:text-4xl font-light text-heritage-charcoal leading-tight max-w-md">
                     {product.name}
                   </h1>
                   <div className="flex gap-5 text-heritage-charcoal/70 pt-2">
                     <button onClick={handleWishlistToggle} className="hover:text-heritage-gold transition-colors group relative">
                       <Heart size={24} fill={isWishlisted ? "#9D8461" : "none"} stroke={isWishlisted ? "#9D8461" : "currentColor"} strokeWidth={1.2} className="group-active:scale-90 transition-transform" />
                     </button>
                     <button onClick={handleShare} className="hover:text-heritage-gold transition-colors">
                       <Share2 size={24} strokeWidth={1.2} />
                     </button>
                   </div>
                 </div>

                 <div className="flex flex-col gap-2 mb-6 border-b border-heritage-border/50 pb-6">
                   <div className="flex items-center gap-4">
                     <span className="text-3xl font-light tracking-wide text-heritage-charcoal">₹{formatPrice(basePrice)}</span>
                     <span className="text-[9px] text-green-700 px-2 py-0.5 uppercase tracking-widest border border-green-200 bg-green-50 rounded-sm">
                       In Stock
                     </span>
                   </div>
                   <p className="text-xs text-heritage-grey">Inclusive of all taxes</p>
                   <p className="text-[10px] uppercase tracking-widest text-heritage-grey mt-2 font-medium">
                     SKU: <span className="text-heritage-charcoal">{product.sku || product.id.substring(0, 8).toUpperCase()}</span>
                   </p>
                 </div>
              </div>

              {/* --- DESCRIPTION & HIGHLIGHTS --- */}
              <div className="mb-8">
                 <p className="font-sans text-sm text-heritage-charcoal/80 leading-relaxed mb-6 font-light">
                   {product.description || product.fullDescription}
                 </p>
                 
                 <div className="bg-heritage-paper border border-heritage-border/60 p-5 rounded-sm">
                    <h3 className="text-xs font-serif italic text-heritage-gold mb-3 flex items-center gap-2"><Info size={14}/> Product Highlights</h3>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                        <div><span className="block text-[10px] uppercase tracking-widest text-heritage-grey mb-0.5">Technique</span><span className="font-medium text-heritage-charcoal">{product.technique || 'Handwoven Kadhua'}</span></div>
                        <div><span className="block text-[10px] uppercase tracking-widest text-heritage-grey mb-0.5">Fabric</span><span className="font-medium text-heritage-charcoal">{product.fabric || 'Pure Katan Silk'}</span></div>
                        <div><span className="block text-[10px] uppercase tracking-widest text-heritage-grey mb-0.5">Origin</span><span className="font-medium text-heritage-charcoal">{product.origin || 'Varanasi, India'}</span></div>
                        <div><span className="block text-[10px] uppercase tracking-widest text-heritage-grey mb-0.5">Zari</span><span className="font-medium text-heritage-charcoal">{product.zariType || 'Fine Zari'}</span></div>
                    </div>
                 </div>
              </div>

              {/* Customizations */}
              <div className="space-y-8 mb-10">
                 {hasSizeChart && (
                   <div className="flex justify-between items-center border-b border-heritage-border/40 pb-2">
                     <span className="text-sm font-medium font-serif italic text-heritage-charcoal">Select Size</span>
                     <button 
                       onClick={() => setShowSizeChart(true)}
                       className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-heritage-gold hover:text-heritage-charcoal transition-colors group"
                     >
                       <Ruler size={14} /> <span className="border-b border-heritage-gold group-hover:border-heritage-charcoal">Size Guide</span>
                     </button>
                   </div>
                 )}

                 <div className="space-y-4">
                   <h3 className="text-sm font-medium font-serif italic text-heritage-charcoal">Customization Services</h3>
                   <AddonOption 
                     label="Add Fall & Pico" 
                     price={150} 
                     isChecked={selectedAddons.fallPico}
                     onChange={() => setSelectedAddons(p => ({...p, fallPico: !p.fallPico}))}
                     description="Essential finish for sarees. Adds 1-2 days to delivery."
                   />
                   {isSaree && (
                     <>
                       <AddonOption 
                         label="Premium Tassels / Kuchu" 
                         price={250} 
                         isChecked={selectedAddons.tassels}
                         onChange={() => setSelectedAddons(p => ({...p, tassels: !p.tassels}))}
                         description="Handcrafted tassels added to the pallu."
                       />
                       <AddonOption 
                         label="Tailored Blouse Stitching" 
                         price={1200} 
                         isChecked={selectedAddons.blouseStitching}
                         onChange={() => setSelectedAddons(p => ({...p, blouseStitching: !p.blouseStitching}))}
                         description="Our stylist will contact you for measurements. Adds 5-7 days."
                       />
                     </>
                   )}
                 </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 mb-6">
                 <button 
                   onClick={handleAddToCart}
                   className="w-full bg-heritage-charcoal text-white h-14 uppercase tracking-[0.2em] text-[11px] font-medium hover:bg-heritage-gold transition-all duration-500 shadow-sm hover:shadow-md rounded-sm flex items-center justify-center gap-3"
                 >
                   <span>{addonTotal > 0 ? `Add to Cart • ₹${formatPrice(finalPrice)}` : 'Add to Cart'}</span>
                 </button>
                 <button 
                   onClick={handleConsult}
                   className="w-full border border-heritage-charcoal/40 text-heritage-charcoal h-12 uppercase tracking-[0.2em] text-[10px] font-medium hover:border-heritage-charcoal hover:bg-heritage-sand/30 flex items-center justify-center gap-3 transition-all duration-300 rounded-sm"
                 >
                   <MessageCircle size={16} strokeWidth={1} /> Enquire on WhatsApp
                 </button>
              </div>

              {/* Delivery Checker */}
              <div className="bg-gray-50/50 p-5 rounded-sm mb-12 border border-gray-200">
                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Truck size={14}/> Check Delivery</h4>
                 <div className="flex border-b border-gray-300 pb-2 relative">
                   <input 
                     type="text" 
                     placeholder="Enter Pincode" 
                     value={pincode}
                     onChange={(e) => setPincode(e.target.value)}
                     className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400 font-sans pl-1"
                     maxLength={6}
                   />
                   <button className="text-[10px] font-bold text-heritage-gold uppercase tracking-widest hover:text-heritage-charcoal transition-colors absolute right-0 bottom-2">Check</button>
                 </div>
              </div>

              {/* Remaining Accordions (Material/Care/Shipping) */}
              <div className="mb-12">
                <Accordion title="Material & Care" isOpen={activeSection === 'care'} onClick={() => setActiveSection(activeSection === 'care' ? '' : 'care')}>
                  <div className="space-y-4">
                     <div className="flex gap-4">
                        <div className="w-1/2">
                           <span className="block text-[10px] uppercase tracking-widest text-heritage-grey mb-1">Warp</span>
                           <span className="text-sm font-medium">{product.warpMaterial || 'Pure Silk'}</span>
                        </div>
                        <div className="w-1/2">
                           <span className="block text-[10px] uppercase tracking-widest text-heritage-grey mb-1">Weft</span>
                           <span className="text-sm font-medium">{product.weftMaterial || 'Pure Silk'}</span>
                        </div>
                     </div>
                     <div className="pt-4 border-t border-heritage-border/30">
                        <ul className="list-disc pl-5 space-y-2 text-sm text-heritage-charcoal/80 marker:text-heritage-gold">
                          <li>{product.care || "Dry Clean Only. Do not handwash."}</li>
                          <li>Always store in a muslin cloth or a pure cotton bag to allow the fabric to breathe.</li>
                          <li>Avoid direct contact with perfumes, sprays, or moisture.</li>
                        </ul>
                     </div>
                  </div>
                </Accordion>

                <Accordion title="Shipping & Returns" isOpen={activeSection === 'shipping'} onClick={() => setActiveSection(activeSection === 'shipping' ? '' : 'shipping')}>
                   <div className="space-y-3 text-sm text-heritage-charcoal/80">
                      <p><strong>Shipping:</strong> Dispatched within 24-48 hours. Domestic delivery takes 3-5 business days.</p>
                      <p><strong>Returns:</strong> We accept returns within 7 days of delivery for defective or incorrect items.</p>
                   </div>
                </Accordion>
              </div>

              {/* --- TRUST BADGES (BOTTOM) --- */}
              <div className="grid grid-cols-3 gap-4 text-center border-t border-heritage-border/40 pt-8 opacity-70">
                  <div className="flex flex-col items-center gap-2">
                     <ShieldCheck size={20} className="text-heritage-charcoal" strokeWidth={1}/>
                     <span className="text-[9px] uppercase tracking-widest font-medium">Authentic</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <Truck size={20} className="text-heritage-charcoal" strokeWidth={1}/>
                     <span className="text-[9px] uppercase tracking-widest font-medium">Global Ship</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <Lock size={20} className="text-heritage-charcoal" strokeWidth={1}/>
                     <span className="text-[9px] uppercase tracking-widest font-medium">Secure</span>
                  </div>
              </div>

            </div>
          </main>

          {/* --- YOU MAY ALSO LIKE SECTION --- */}
          <section className="mt-32 border-t border-heritage-border/40 pt-16">
             <h2 className="text-center font-serif text-3xl italic text-heritage-charcoal mb-12">You May Also Like</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
               {relatedProducts.length > 0 ? (
                 relatedProducts.map(item => (
                   <ProductCard key={item.id} item={item} />
                 ))
               ) : (
                 <div className="col-span-full text-center text-heritage-grey text-sm italic">
                   Explore our collection for more treasures.
                 </div>
               )}
             </div>
          </section>

        </div>
      )}
      
      {/* Mobile Sticky Footer (Only visible if Product is loaded) */}
      {!loading && product && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-heritage-border p-4 z-50 flex gap-4 items-center safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
           <div className="flex-1">
             <p className="text-xs font-serif text-heritage-charcoal truncate mb-0.5">{product.name}</p>
             <p className="text-sm font-bold text-heritage-charcoal">₹{formatPrice(finalPrice)}</p>
           </div>
           <button 
             onClick={handleAddToCart}
             className="bg-heritage-charcoal text-white px-8 py-3 text-[10px] uppercase tracking-widest rounded-sm"
           >
             Add to Bag
           </button>
        </div>
      )}

      {product && (
        <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} category={product.category} />
      )}
      
      <Footer />
    </div>
  );
}