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
import { ChevronDown, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

// --- SUB-COMPONENT: LUXURY ACCORDION ---
const DetailAccordion = ({ title, children, isOpen, onClick }) => (
  <div className="border-b border-heritage-border/50">
    <button onClick={onClick} className="w-full flex justify-between items-center py-5 group">
      <span className="text-[10px] uppercase tracking-widest text-heritage-charcoal group-hover:text-heritage-gold transition-colors font-medium">
        {title}
      </span>
      <ChevronDown 
        size={14} 
        className={`text-heritage-grey transition-transform duration-500 ease-out ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
    <div 
      className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
    >
      <div className="text-sm font-sans text-heritage-grey leading-loose font-light">
        {children}
      </div>
    </div>
  </div>
);

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customizations, setCustomizations] = useState({ fallPico: false, blouseStitching: false });
  const [openSection, setOpenSection] = useState('description'); // Default open section

  // Fetch Logic
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

  const handleAddToCart = () => {
    addToCart({ ...product, price: finalPrice, selectedOptions: customizations, quantity: 1 });
    toast.success(
      <div className="flex flex-col">
        <span className="font-serif italic">Added to Trousseau</span>
        <span className="text-xs text-gray-500">Your selection is saved.</span>
      </div>,
      { icon: '👜', style: { borderRadius: '0px', background: '#FDFBF7', color: '#1A1A1A', border: '1px solid #E5E0D8' } }
    );
  };

  const handleConsult = () => {
    window.open(`https://wa.me/919876543210?text=I'm interested in the ${product?.name}. Can I see a real video?`, '_blank');
  };

  if (loading) return <AppSkeleton />;
  if (!product) return <div className="h-screen flex flex-col items-center justify-center font-serif text-2xl text-heritage-charcoal bg-heritage-paper"><span>Product Not Found</span><button onClick={()=>navigate('/')} className="mt-4 text-xs uppercase underline">Return Home</button></div>;

  return (
    <div className="min-h-screen bg-heritage-paper font-serif text-heritage-charcoal selection:bg-heritage-gold/20">
      <SEO title={product.name} image={product.featuredImageUrl} />
      <Navbar />

      {/* --- SPLIT LAYOUT CONTAINER --- */}
      <div className="lg:flex relative">
        
        {/* LEFT: Scrollable Gallery (60%) */}
        <div className="w-full lg:w-[60%] bg-heritage-sand/30 flex flex-col gap-1 lg:min-h-screen">
           {images.map((img, i) => (
             <div key={i} className="relative w-full group overflow-hidden">
               <img 
                 src={img} 
                 alt={`${product.name} view ${i}`} 
                 className="w-full h-auto object-cover transition-transform duration-[2s] group-hover:scale-105" 
               />
             </div>
           ))}
        </div>

        {/* RIGHT: Sticky Story & Actions (40%) */}
        <div className="w-full lg:w-[40%] px-6 md:px-12 py-12 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto scrollbar-hide flex flex-col bg-heritage-paper">
          
          {/* Breadcrumb */}
          <div className="text-[9px] uppercase tracking-lux text-heritage-grey mb-10 opacity-70">
            Home / Handloom / {product.category} / {product.subCategory}
          </div>

          {/* Title & Price */}
          <h1 className="text-4xl md:text-5xl font-light italic mb-3 leading-tight text-heritage-charcoal">
            {product.name}
          </h1>
          <div className="text-xl font-light text-heritage-charcoal/90 mb-8 font-sans">
            ₹{formatPrice(finalPrice)}
            <span className="text-xs text-heritage-grey ml-2 font-normal">(Inclusive of all taxes)</span>
          </div>

          {/* Quick Trust Badges */}
          <div className="flex gap-6 mb-10 border-t border-b border-heritage-border/40 py-4">
             <div className="flex items-center gap-3">
               <ShieldCheck strokeWidth={1} size={18} className="text-heritage-gold"/>
               <span className="text-[10px] uppercase tracking-widest text-heritage-charcoal">Silk Mark Certified</span>
             </div>
             <div className="flex items-center gap-3">
               <Truck strokeWidth={1} size={18} className="text-heritage-gold"/>
               <span className="text-[10px] uppercase tracking-widest text-heritage-charcoal">Free Global Shipping</span>
             </div>
          </div>

          {/* Customization */}
          <div className="mb-8">
            <ProductCustomization options={customizations} onOptionsChange={setCustomizations} />
          </div>

          {/* Primary Actions */}
          <div className="space-y-4 mb-12">
            <button 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-heritage-charcoal text-heritage-paper py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-heritage-gold hover:shadow-lg transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock <= 0 ? "Currently Unavailable" : "Add to Trousseau"}
            </button>
            
            <button 
              onClick={handleConsult}
              className="w-full border border-heritage-border text-heritage-charcoal py-3 text-[10px] uppercase tracking-[0.2em] hover:border-heritage-charcoal transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <MessageCircle size={16} strokeWidth={1} className="group-hover:text-heritage-gold transition-colors"/> 
              Speak to a Stylist
            </button>
          </div>

          {/* Detailed Accordions */}
          <div className="mt-auto">
            <DetailAccordion 
              title="The Story" 
              isOpen={openSection === 'description'} 
              onClick={() => setOpenSection(openSection === 'description' ? '' : 'description')}
            >
              {product.fullDescription || "A masterpiece of the Kadhua technique. This saree features complex jangla patterns woven entirely by hand. It takes a master weaver approximately 120 hours to complete this piece. The silk used is pure Mulberry Katan, renowned for its luster and durability."}
            </DetailAccordion>
            
            <DetailAccordion 
              title="Weave & Dimensions" 
              isOpen={openSection === 'weave'} 
              onClick={() => setOpenSection(openSection === 'weave' ? '' : 'weave')}
            >
              <ul className="list-disc pl-4 space-y-1 marker:text-heritage-gold">
                <li><strong>Technique:</strong> {product.weaveType || "Handwoven Banarasi Kadhua"}</li>
                <li><strong>Fabric:</strong> Pure Katan Silk (Silk Mark Certified)</li>
                <li><strong>Length:</strong> 6.5 Meters (Includes Blouse Piece)</li>
                <li><strong>Weight:</strong> 850 grams (Approx)</li>
                <li><strong>Origin:</strong> Varanasi, Uttar Pradesh</li>
              </ul>
            </DetailAccordion>

            <DetailAccordion 
              title="Care & Heirloom Maintenance" 
              isOpen={openSection === 'care'} 
              onClick={() => setOpenSection(openSection === 'care' ? '' : 'care')}
            >
              Store in a muslin cloth to allow the fabric to breathe. Dry clean only. Change the fold every 3 months to prevent permanent creasing on the Zari. Avoid direct contact with perfume or moisture.
            </DetailAccordion>
          </div>

        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}