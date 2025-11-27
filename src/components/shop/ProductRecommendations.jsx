import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductCard } from './ProductCard';
import { Loader2 } from 'lucide-react';

export const ProductRecommendations = ({ title, category, currentProductId, type = 'related' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        let q;
        if (type === 'related' && category) {
          // Fetch similar category, excluding current
          q = query(
            collection(db, 'products'), 
            where('category', '==', category), 
            limit(5) 
          );
        } else {
          // Fetch "Best Sellers" (just latest for now, or sort by sales if you have that field)
          q = query(
            collection(db, 'products'), 
            orderBy('createdAt', 'desc'), 
            limit(5)
          );
        }

        const snap = await getDocs(q);
        // Filter out current product client-side if needed
        const docs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.id !== currentProductId)
          .slice(0, 4); // Show max 4

        setProducts(docs);
      } catch (err) {
        console.error("Recs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (category || type === 'bestseller') {
      fetchRecs();
    }
  }, [category, currentProductId, type]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-100">
      <div className="mb-8 text-center">
        <h3 className="font-serif text-2xl md:text-3xl text-brand-dark mb-2">{title}</h3>
        <div className="w-12 h-0.5 bg-[#B08D55] mx-auto" />
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-300" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      )}
    </section>
  );
};