import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Navbar } from '../components/common/Navbar.jsx';
import { Footer } from '../components/common/Footer.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../lib/utils.js';
import { AppSkeleton } from '../components/skeletons/AppSkeleton.jsx';
import toast from 'react-hot-toast';
import { SEO } from '../components/SEO.jsx';
import { ChevronDown, MessageCircle, ShieldCheck, Ruler, Truck, Star, Heart } from 'lucide-react';
import { WhatsAppButton } from '../components/common/WhatsAppButton.jsx';

/* --- COMPONENTS IMPORTS --- */
import ProductGallery from '../components/shop/ProductGallery.jsx';
import ProductCustomization from '../components/shop/ProductCustomization.jsx';
import ProductOffers from '../components/shop/ProductOffers.jsx';
import DeliveryChecker from '../components/shop/DeliveryChecker.jsx';
import SizeChartModal from '../components/shop/SizeChartModal.jsx';

// --- ACCORDION COMPONENT ---
const DetailAccordion = ({ title, children, isOpen, onClick }) => (
  <div className="border-b border-gray-200">
    <button onClick={onClick} className="w-full flex justify-between items-center py-4 group hover:bg-gray-50/50 px-2 transition-colors">
      <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">
        {title}
      </span>
      <ChevronDown 
        size={16} 
        className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
    <div 
      className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 pb-4 px-2' : 'max-h-0 opacity-0'}`}
    >
      <div className="text-sm text-gray-600 leading-relaxed font-light font-sans">
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
  const [openSection, setOpenSection] = useState('description');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

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
    addToCart({ 
        ...product, 
        price: finalPrice, 
        selectedOptions: customizations, 
        size: selectedSize,
        quantity: 1 
    });
    toast.success(
      <div className="flex flex-col">
        <span className="font-bold text-[#B08D55]">Added to Bag</span>
        <span className="text-xs text-gray-500">Selection saved successfully.</span>
      </div>,
      { icon: '🛍️' }
    );
  };

  if (loading) return <AppSkeleton />;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product Not Found</div>;

  const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <SEO title={product.name} image={product.featuredImageUrl} />
      <Navbar />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 lg:py-10">
        
        {/* BREADCRUMBS */}
        <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-6 flex items-center gap-2">
            <span className="hover:text-black cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span className="hover:text-black cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
            <span>/</span>
            <span className="text-black font-medium truncate max-w-[200px]">{product.category || 'Collection'}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            
            {/* LEFT: GALLERY (Vertical Thumbnails + Main Image) */}
            <div className="w-full lg:w-[60%]">
                <ProductGallery images={images} />
            </div>

            {/* RIGHT: DETAILS */}
            <div className="w-full lg:w-[40%] flex flex-col">
                
                {/* Brand Name */}
                <h2 className="text-lg font-bold text-gray-900 mb-1">{product.brand || "PAHNAWA BANARAS"}</h2>
                
                {/* Product Name */}
                <h1 className="text-xl text-gray-500 font-light mb-4 leading-snug">
                    {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center bg-gray-100 px-1.5 py-0.5 rounded text-xs font-bold">
                        4.5 <Star size={10} fill="black" className="ml-1"/>
                    </div>
                    <span className="text-xs text-gray-400">| 1.2k Ratings</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-gray-900">₹{formatPrice(finalPrice)}</span>
                    <span className="text-lg text-gray-400 line-through font-light">
                        ₹{formatPrice(Number(product.price) * 1.3)}
                    </span>
                    <span className="text-sm font-bold text-[#ff905a]">(30% OFF)</span>
                </div>
                <p className="text-[#03a685] text-xs font-bold mb-6">inclusive of all taxes</p>

                {/* Offers Component */}
                <ProductOffers />

                {/* Size Selector */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider">Select Size</span>
                        <button 
                            onClick={() => setShowSizeChart(true)}
                            className="text-xs font-bold text-[#B08D55] uppercase tracking-wider hover:underline flex items-center gap-1"
                        >
                            Size Chart <Ruler size={12}/>
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border transition-all ${
                                    selectedSize === size 
                                    ? 'border-[#B08D55] text-[#B08D55] ring-1 ring-[#B08D55]' 
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {!selectedSize && <p className="text-[10px] text-red-500 mt-2 hidden">Please select a size</p>}
                </div>

                {/* Customizations */}
                <ProductCustomization options={customizations} onOptionsChange={setCustomizations} />

                {/* Action Buttons */}
                <div className="flex gap-3 my-6">
                    <button 
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="flex-[2] bg-[#ff3e6c] text-white py-4 rounded-[4px] font-bold text-sm uppercase tracking-wide hover:bg-[#e7355b] transition-colors disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                    >
                       <span className="text-lg">🛍️</span> {product.stock <= 0 ? "Out of Stock" : "Add to Bag"}
                    </button>
                    <button 
                        className="flex-[1] border border-gray-300 rounded-[4px] py-4 font-bold text-sm uppercase tracking-wide hover:border-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Heart size={18} /> Wishlist
                    </button>
                </div>

                {/* Delivery */}
                <DeliveryChecker />

                {/* Product Details Accordions */}
                <div className="mt-6">
                    <DetailAccordion 
                        title="Product Details" 
                        isOpen={openSection === 'description'} 
                        onClick={() => setOpenSection(openSection === 'description' ? '' : 'description')}
                    >
                        <p>{product.fullDescription || "Elegant and timeless, this piece is crafted with precision."}</p>
                        <ul className="mt-2 list-disc pl-4 space-y-1 text-xs">
                             <li><strong>Fabric:</strong> {product.fabric || "Premium Silk"}</li>
                             <li><strong>Pattern:</strong> {product.pattern || "Woven"}</li>
                             <li><strong>Fit:</strong> Regular</li>
                        </ul>
                    </DetailAccordion>
                    
                    <DetailAccordion 
                        title="Material & Care" 
                        isOpen={openSection === 'care'} 
                        onClick={() => setOpenSection(openSection === 'care' ? '' : 'care')}
                    >
                        <p>Dry clean only. Store in a cool, dry place. Avoid direct sunlight for prolonged periods.</p>
                    </DetailAccordion>
                </div>

            </div>
        </div>
      </main>

      <WhatsAppButton />
      <Footer />
      
      <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} />
    </div>
  );
}