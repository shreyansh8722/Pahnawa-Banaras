import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Quote, Star } from 'lucide-react';

export const TestimonialSlider = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'), limit(6));
        const snap = await getDocs(q);
        setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 bg-[#F5F0EB] px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
           <Quote size={40} className="mx-auto text-[#B08D55] mb-4 opacity-50" />
           <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">Love from our Patrons</h2>
           <p className="text-gray-500 uppercase tracking-[0.2em] text-xs">Stories of Tradition & Trust</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {reviews.map((review) => (
             <div key={review.id} className="bg-white p-8 rounded-sm shadow-sm border-b-4 border-[#B08D55] relative">
                <div className="flex text-[#B08D55] mb-4">
                   {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 text-sm leading-loose italic mb-6">"{review.text}"</p>
                <div className="flex items-center gap-4">
                   <img src={review.image || "https://placehold.co/100"} alt={review.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                   <div>
                      <h4 className="font-serif font-bold text-gray-900">{review.name}</h4>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{review.role}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};