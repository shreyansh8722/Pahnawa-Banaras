import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ImageCarousel } from '@/components/spot/ImageCarousel';
import { CartModal } from '@/components/shop/CartModal';

const ProductSkeleton = () => (
  <div className="animate-pulse p-5 max-w-7xl mx-auto mt-20">
    <div className="h-96 bg-gray-100 rounded-sm mb-4" />
    <div className="h-8 bg-gray-100 w-3/4 mb-2" />
    <div className="h-4 bg-gray-100 w-1/2" />
  </div>
);

export default function ProductDetailsPage() {
  const { productId } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // UPDATED: Fetch from 'products' collection
        const snap = await getDoc(doc(db, 'products', productId));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const addToCart = () => {
    if (!product) return;
    setCart(prev => [...prev, { ...product, quantity: 1 }]);
    setShowCart(true);
  };

  const images = useMemo(() => {
    if (!product) return [];
    // UPDATED: Handle array of images directly
    if (product.imageUrls && product.imageUrls.length > 0) {
        return product.imageUrls;
    }
    // Fallback for legacy structure
    return [product.featuredImageUrl].filter(Boolean);
  }, [product]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="p-20 text-center text-brand-dark font-serif text-2xl">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-brand-dark flex flex-col">
      <Navbar cartCount={cart.length} onOpenCart={() => setShowCart(true)} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-0 md:pt-10 flex-grow">
        {/* 1. Product Images Carousel */}
        <div className="relative w-full aspect-[3/4] bg-brand-gray md:sticky md:top-24">
          <ImageCarousel images={images} spotName={product.name} />
        </div>

        {/* 2. Product Info */}
        <div className="p-6 md:pt-0">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-brand-primary font-bold mb-2 block">
              {product.subCategory || product.category || 'Handloom'}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-brand-dark mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4 border-b border-gray-100 pb-6">
              <span className="text-2xl font-bold text-brand-dark">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.comparePrice > 0 && (
                <span className="text-sm text-gray-400 line-through font-light">
                  ₹{product.comparePrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="flex flex-col gap-3 mb-10">
            <button 
              onClick={addToCart}
              className="w-full bg-brand-primary text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-brand-primaryDark transition-all duration-300 shadow-lg"
            >
              Add to Shopping Bag
            </button>
            <button className="w-full border border-brand-dark text-brand-dark py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-brand-dark hover:text-white transition-all duration-300">
              Buy Now
            </button>
          </div>

          {/* 4. Description & Details */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl mb-3 border-b border-gray-100 pb-2">The Craft</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-light whitespace-pre-line">
                {product.fullDescription || "This exquisite piece is a testament to the centuries-old weaving tradition of Varanasi."}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl mb-3 border-b border-gray-100 pb-2">Product Details</h3>
              <ul className="text-sm text-gray-600 space-y-2 font-light">
                <li className="flex justify-between"><span>Material</span> <span className="font-medium text-brand-dark">{product.material || 'Katan Silk'}</span></li>
                <li className="flex justify-between"><span>Weave</span> <span className="font-medium text-brand-dark">Kadwa / Kadhua</span></li>
                <li className="flex justify-between"><span>Origin</span> <span className="font-medium text-brand-dark">Varanasi, India</span></li>
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 bg-brand-gray/50 rounded-sm">
              <div className="text-center p-2">
                <ShieldCheck size={24} className="mx-auto text-brand-primary mb-2" />
                <p className="text-[10px] uppercase font-bold tracking-wider">Silk Mark</p>
              </div>
              <div className="text-center p-2 border-l border-r border-gray-200">
                <Truck size={24} className="mx-auto text-brand-primary mb-2" />
                <p className="text-[10px] uppercase font-bold tracking-wider">Free Shipping</p>
              </div>
              <div className="text-center p-2">
                <RotateCcw size={24} className="mx-auto text-brand-primary mb-2" />
                <p className="text-[10px] uppercase font-bold tracking-wider">7 Day Return</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <CartModal 
        open={showCart} 
        onClose={() => setShowCart(false)} 
        cart={cart} 
        subtotal={0} savings={0} 
      />
    </div>
  );
}