import React from 'react';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
    { id: 1, name: "Ananya B.", text: "The silk quality is unmatched. It feels like wearing a piece of history.", location: "Mumbai" },
    { id: 2, name: "Mira K.", text: "Ordered a bridal lehenga and it was breathtaking. The packaging was so luxurious.", location: "Delhi" },
    { id: 3, name: "Priya S.", text: "Authentic Banarasi weave. My mother loved the saree.", location: "Bangalore" }
];

export const TestimonialSlider = () => {
  return (
    <section className="py-24 bg-royal-cream border-t border-royal-border">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <Quote size={40} className="text-royal-gold mx-auto mb-8 opacity-50" />
        
        <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map(review => (
                <div key={review.id} className="p-6 border border-royal-gold/10 bg-white/50 rounded-sm">
                    <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-royal-gold text-royal-gold" />)}
                    </div>
                    <p className="font-serif italic text-lg text-royal-charcoal mb-4">"{review.text}"</p>
                    <div className="text-xs font-bold uppercase tracking-widest text-royal-grey">
                        {review.name} <span className="text-royal-gold mx-1">•</span> {review.location}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};