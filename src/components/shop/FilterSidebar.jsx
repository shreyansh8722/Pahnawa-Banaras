import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRICE_RANGES = [
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
  { label: 'Above ₹20,000', min: 20000, max: 1000000 },
];

const COLORS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Gold', hex: '#EAB308' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
];

export const FilterSidebar = ({ filters, setFilters, isOpen, onClose }) => {
  
  const handleRangeChange = (range) => {
    setFilters(prev => ({ ...prev, minPrice: range.min, maxPrice: range.max }));
  };

  const toggleColor = (color) => {
    setFilters(prev => {
      const colors = prev.colors.includes(color) 
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  const FilterContent = () => (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Categories */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4">Category</h3>
        <div className="space-y-2">
          {['Saree', 'Lehenga', 'Suit', 'Dupatta', 'Fabric'].map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.categories.includes(cat)}
                onChange={() => setFilters(prev => {
                   const categories = prev.categories.includes(cat) 
                     ? prev.categories.filter(c => c !== cat) 
                     : [...prev.categories, cat];
                   return { ...prev, categories };
                })}
                className="w-4 h-4 accent-[#B08D55] rounded-sm"
              />
              <span className={`text-sm group-hover:text-[#B08D55] transition-colors ${filters.categories.includes(cat) ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => (
             <button 
               key={idx}
               onClick={() => handleRangeChange(range)}
               className={`block text-sm w-full text-left py-1 hover:text-[#B08D55] transition-colors ${
                 filters.minPrice === range.min && filters.maxPrice === range.max 
                   ? 'font-bold text-[#B08D55]' 
                   : 'text-gray-600'
               }`}
             >
               {range.label}
             </button>
          ))}
          <button 
             onClick={() => setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 1000000 }))}
             className="text-xs text-gray-400 underline mt-2 hover:text-black"
          >
            Reset Price
          </button>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => (
             <button
               key={c.name}
               onClick={() => toggleColor(c.name)}
               className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110 relative ${filters.colors.includes(c.name) ? 'ring-2 ring-[#B08D55] ring-offset-2' : ''}`}
               style={{ backgroundColor: c.hex }}
               title={c.name}
             >
               {c.name === 'White' && <Check size={12} className="text-gray-300"/>}
               {filters.colors.includes(c.name) && <Check size={14} className={c.name === 'White' ? 'text-black' : 'text-white'} />}
             </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-100 pr-8">
         <FilterContent />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/50 backdrop-blur-sm"
               onClick={onClose}
             />
             <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="absolute inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-xl flex flex-col"
             >
               <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                 <h2 className="font-serif text-xl font-bold">Filters</h2>
                 <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6">
                 <FilterContent />
               </div>

               <div className="p-4 border-t border-gray-100 bg-gray-50">
                 <button 
                   onClick={onClose} 
                   className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-sm font-bold uppercase tracking-widest text-xs"
                 >
                   Show Results
                 </button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};