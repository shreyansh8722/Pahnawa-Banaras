import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FabricEdit = () => {
  const navigate = useNavigate();
  const fabrics = [
    { name: "Katan Silk", img: "https://images.unsplash.com/photo-1595991209266-5ff5a3a2f008?auto=format&fit=crop&q=80&w=300", filter: "katan" },
    { name: "Organza", img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=300", filter: "organza" },
    { name: "Georgette", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300", filter: "georgette" },
    { name: "Tussar", img: "https://images.unsplash.com/photo-1582738411706-bfc887367175?auto=format&fit=crop&q=80&w=300", filter: "tussar" }
  ];

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 border-b border-gray-100 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h3 className="font-serif text-3xl text-[#1a1a1a]">Shop by Fabric</h3>
          <button onClick={() => navigate('/shop')} className="text-xs font-bold uppercase tracking-widest text-[#B08D55]">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {fabrics.map((fabric) => (
            <div 
              key={fabric.name} 
              onClick={() => navigate(`/shop?fabric=${fabric.filter}`)}
              className="group cursor-pointer text-center"
            >
              <div className="overflow-hidden rounded-full aspect-square mb-6 border border-gray-100 group-hover:border-[#B08D55] transition-colors mx-auto max-w-[200px]">
                <img src={fabric.img} alt={fabric.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <h4 className="font-serif text-xl text-[#1a1a1a] group-hover:text-[#B08D55] transition-colors">{fabric.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};