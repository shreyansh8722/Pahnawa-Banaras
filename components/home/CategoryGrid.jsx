import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteAssets } from '@/hooks/useSiteAssets';

export const CategoryGrid = () => {
  const navigate = useNavigate();
  const { getAsset } = useSiteAssets();

  const CATEGORIES = [
    {
      id: 'sarees',
      title: "Sarees",
      image: getAsset('cat_saree'),
      link: "/shop?category=Sarees"
    },
    {
      id: 'lehengas',
      title: "Lehengas",
      image: getAsset('cat_lehenga'),
      link: "/shop?category=Lehengas"
    },
    {
      id: 'suits',
      title: "Suits",
      image: getAsset('cat_suit'),
      link: "/shop?category=Suits"
    },
    {
      id: 'fabrics',
      title: "Fabrics",
      image: getAsset('cat_fabric'),
      link: "/shop?category=Fabrics"
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 max-w-[1800px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-serif text-4xl md:text-5xl text-heritage-charcoal mb-4">Explore Collections</h2>
        <div className="w-24 h-[2px] bg-heritage-gold mx-auto"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => navigate(cat.link)}
            className="group cursor-pointer flex flex-col items-center gap-6"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm shadow-md">
              <img 
                src={cat.image} 
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
            </div>
            
            <div className="text-center">
              <h3 className="font-serif text-2xl text-heritage-charcoal mb-2 group-hover:text-heritage-gold transition-colors">
                {cat.title}
              </h3>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-heritage-grey flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0">
                View Collection <ArrowRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};