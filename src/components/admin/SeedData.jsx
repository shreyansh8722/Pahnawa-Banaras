import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const SAMPLE_PRODUCTS = [
  {
    name: "The Kashi Opulence Saree",
    category: "Saree",
    subCategory: "Katan Silk",
    price: 45000,
    description: "A masterpiece of Kadhua weaving featuring intricate gold zari jangla pattern on a rich crimson base.",
    featuredImageUrl: "https://images.unsplash.com/photo-1610189012906-47833d772097?q=80&w=2070",
    stock: 5,
    colors: ["Red", "Gold"],
    keywords: ["wedding", "bridal", "red", "silk"]
  },
  {
    name: "Midnight Blue Tanchoi",
    category: "Saree",
    subCategory: "Tanchoi",
    price: 28000,
    description: "Fine satin tanchoi weave with subtle paisley motifs in a jamawar style.",
    featuredImageUrl: "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=2070",
    stock: 3,
    colors: ["Blue", "Navy"],
    keywords: ["party", "elegant", "blue"]
  },
  {
    name: "Royal Heritage Lehenga",
    category: "Lehenga",
    subCategory: "Bridal",
    price: 85000,
    description: "Handwoven Banarasi silk lehenga with heavy zardozi borders and a pure silk dupatta.",
    featuredImageUrl: "https://images.unsplash.com/photo-1605902394263-66869c466503?q=80",
    stock: 1,
    colors: ["Pink", "Magenta"],
    keywords: ["wedding", "lehenga", "pink"]
  },
  {
    name: "Ivory Gold Tissue Saree",
    category: "Saree",
    subCategory: "Tissue Silk",
    price: 32000,
    description: "A sheer elegance of tissue silk with real silver zari borders. Perfect for day weddings.",
    featuredImageUrl: "https://images.unsplash.com/photo-1595053702434-70490b4672ba?q=80",
    stock: 8,
    colors: ["White", "Gold", "Ivory"],
    keywords: ["modern", "tissue", "gold"]
  },
  {
    name: "Emerald Green Jangla Suit",
    category: "Suit",
    subCategory: "Unstitched",
    price: 18500,
    description: "3-piece unstitched suit set featuring a handwoven brocade kurta and plain silk bottom.",
    featuredImageUrl: "https://images.unsplash.com/photo-1621623194266-4b3664963684?q=80",
    stock: 10,
    colors: ["Green"],
    keywords: ["suit", "green", "festive"]
  }
];

export const SeedDataButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm("This will add 5 sample products to your database. Continue?")) return;
    
    setLoading(true);
    try {
      const colRef = collection(db, 'products');
      for (const product of SAMPLE_PRODUCTS) {
        await addDoc(colRef, {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      alert("Success! 5 Products Added. Refresh the Shop Page.");
    } catch (error) {
      console.error(error);
      alert("Error adding products. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSeed}
      className="fixed bottom-4 right-4 z-[9999] bg-red-600 text-white px-4 py-2 rounded shadow-lg text-xs font-bold uppercase"
    >
      {loading ? <Loader2 className="animate-spin" /> : "⚡ Seed DB (Dev Only)"}
    </button>
  );
};