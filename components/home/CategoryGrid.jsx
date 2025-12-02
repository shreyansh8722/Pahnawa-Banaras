import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid = () => {
  const navigate = useNavigate();
  
  const categories = [
    { title: "Benarasi Sarees", link: "/shop?cat=saree", img: "https://images.unsplash.com/photo-1610189012906-47833d772097?q=80&w=800" },
    { title: "Bridal Lehengas", link: "/shop?cat=lehenga", img: "https://images.unsplash.com/photo-1583391726247-e29237d8612f?auto=format&fit=crop&q=80&w=800" },
    { title: "Handloom Suits", link: "/shop?cat=suit", img: "https://images.unsplash.com/photo-1621623194266-4b3664963684?auto=format&fit=crop&q=80&w=800" },
    { title: "Dupattas", link: "/shop?cat=dupatta", img: "https://images.unsplash.com/photo-1596472655431-8933b49ecb2d?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <section className="py-12 px-4 md:px-8 bg-white">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.title} 
              onClick={() => navigate(cat.link)}
              className="group relative h-[60vh] md:h-[75vh] overflow-hidden cursor-pointer"
            >
              <img 
                src={cat.img} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex justify-between items-end">
                <h3 className="text-white font-serif text-3xl md:text-4xl leading-none">
                  {cat.title}
                </h3>
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-white/10 backdrop-blur-sm">
                  <ArrowUpRight size={20} strokeWidth={1} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};