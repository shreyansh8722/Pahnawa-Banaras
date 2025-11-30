import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const FILTER_GROUPS = [
  {
    id: 'category',
    label: 'Category',
    options: ['Saree', 'Lehenga', 'Suit', 'Dupatta', 'Men']
  },
  {
    id: 'fabric',
    label: 'Fabric',
    options: ['Katan Silk', 'Georgette', 'Organza', 'Munga Silk', 'Tussar']
  },
  {
    id: 'technique',
    label: 'Technique',
    options: ['Kadhua', 'Fekwa', 'Tanchoi', 'Jangla', 'Meenakari']
  },
  {
    id: 'color',
    label: 'Color Palette',
    options: ['Red', 'Pink', 'Gold', 'Blue', 'Green', 'Black', 'Pastel']
  },
  {
    id: 'price',
    label: 'Price Range',
    options: ['Under ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', 'Above ₹50,000']
  }
];

// Sub-component for clean accordion sections
const FilterSection = ({ group, isOpen, onToggle }) => {
  return (
    <div className="border-b border-heritage-border py-4">
      <button 
        onClick={() => onToggle(group.id)} 
        className="flex justify-between items-center w-full py-2 group"
      >
        <span className="text-xs uppercase tracking-widest text-heritage-charcoal group-hover:text-heritage-gold transition-colors">
          {group.label}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-2 pb-2">
          {group.options.map(option => (
            <label key={option} className="flex items-center gap-3 cursor-pointer group/item hover:opacity-80">
              <div className="relative w-4 h-4 border border-heritage-grey/40 rounded-sm flex items-center justify-center transition-colors group-hover/item:border-heritage-gold">
                <input type="checkbox" className="peer appearance-none w-full h-full absolute inset-0 cursor-pointer" />
                <Check size={10} className="text-heritage-gold opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm font-sans text-heritage-grey">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FilterSidebar = ({ mobile }) => {
  // Keep first two sections open by default
  const [openSections, setOpenSections] = useState(['category', 'fabric']);

  const toggleSection = (id) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className={`flex flex-col ${mobile ? '' : 'pr-8'}`}>
      {!mobile && <h3 className="text-lg font-serif italic mb-6 text-heritage-charcoal">Filters</h3>}
      
      {FILTER_GROUPS.map(group => (
        <FilterSection 
          key={group.id} 
          group={group} 
          isOpen={openSections.includes(group.id)} 
          onToggle={toggleSection} 
        />
      ))}

      <button className="mt-8 text-xs uppercase tracking-widest text-heritage-grey hover:text-heritage-charcoal underline underline-offset-4 transition-colors">
        Reset All Filters
      </button>
    </div>
  );
};