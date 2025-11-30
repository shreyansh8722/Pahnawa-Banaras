import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'sarees',
    title: "Sarees",
    image: "https://images.unsplash.com/photo-1610189012906-47833d772097?q=80&w=800", // Replace with a Saree Image
    link: "/shop?category=Sarees"
  },
  {
    id: 'lehengas',
    title: "Lehengas",
    image: "https://images.unsplash.com/photo-1583391726247-e29237d8612f?q=80&w=800", // Replace with Lehenga Image
    link: "/shop?category=Lehengas"
  },
  {
    id: 'suits',
    title: "Suits",
    image: "https://images.unsplash.com/photo-1621623194266-4b3664963684?q=80&w=800", // Replace with Suit Image
    link: "/shop?category=Suits"
  },
  {
    id: 'fabrics',
    title: "Fabrics",
    image: "https://images.unsplash.com/photo-1596289456578-192569e54d36?q=80&w=800", // Replace with Fabric Image
    link: "/shop?category=Fabrics"
  }
];

export const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 md:px-8 max-w-[1800px] mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-4xl text-heritage-charcoal mb-3">Explore Collections</h2>
        <div className="w-24 h-[1px] bg-heritage-gold mx-auto"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => navigate(cat.link)}
            className="group cursor-pointer flex flex-col items-center gap-4"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm">
              <img 
                src={cat.image} 
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-500" />
            </div>
            
            <div className="text-center">
              <h3 className="font-serif text-xl text-heritage-charcoal mb-1 group-hover:text-heritage-gold transition-colors">
                {cat.title}
              </h3>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0">
                View <ArrowRight size={10} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};