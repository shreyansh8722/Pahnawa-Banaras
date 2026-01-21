import React from 'react';
import { X, Check } from 'lucide-react';

export const FilterSidebar = ({ isOpen, onClose, filters = {}, setFilters }) => {
  
  const FILTER_GROUPS = {
    "Category": ["Sarees", "Lehengas", "Suits", "Dupattas", "Blouses"],
    "Color": ["Red", "Pink", "Gold", "Yellow", "Green", "Blue", "Black", "White", "Purple"],
    "Fabric": ["Katan Silk", "Georgette", "Organza", "Tussar", "Munga Silk", "Tissue"],
    "Craft": ["Kadhua", "Fekwa", "Tanchoi", "Jangla", "Meenakari", "Rangkaat"],
    "Occasion": ["Bridal", "Festive", "Cocktail", "Party Wear", "Casual"]
  };

  const toggleFilter = (group, value) => {
    setFilters(prev => {
      const currentGroup = prev[group] || [];
      const updatedGroup = currentGroup.includes(value) 
        ? currentGroup.filter(item => item !== value)
        : [...currentGroup, value];
      
      if (updatedGroup.length === 0) {
        const { [group]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [group]: updatedGroup };
    });
  };

  const isSelected = (group, value) => filters[group]?.includes(value) || false;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel - FIX: bg-[#FDFBF7] ensures it is NOT transparent */}
      <div className={`fixed inset-y-0 left-0 z-[70] w-[320px] bg-[#FDFBF7] shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col border-r border-[#E6DCCA]/50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#E6DCCA]/60 bg-[#F4F1EA]/50">
           <h3 className="font-display text-2xl text-[#2D2424]">Filters</h3>
           <button onClick={onClose} className="p-2 hover:bg-[#701a1a] hover:text-white rounded-full transition-colors duration-200">
             <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
           {Object.entries(FILTER_GROUPS).map(([title, options]) => (
             <div key={title} className="animate-fade-in">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#701a1a] mb-4 pb-2 border-b border-[#E6DCCA]/30">
                  {title}
                </h4>
                <div className="space-y-3">
                  {options.map(opt => {
                    const checked = isSelected(title, opt);
                    return (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group select-none">
                        <div className={`w-4 h-4 border flex items-center justify-center transition-all duration-200 rounded-[2px] ${checked ? 'bg-[#C5A059] border-[#C5A059]' : 'border-[#6B6060]/40 group-hover:border-[#C5A059] bg-white'}`}>
                           {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={checked}
                          onChange={() => toggleFilter(title, opt)}
                        />
                        <span className={`text-sm font-sans transition-colors duration-200 ${checked ? 'text-[#2D2424] font-bold' : 'text-[#6B6060] group-hover:text-[#2D2424]'}`}>
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
             </div>
           ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E6DCCA]/60 bg-white">
          <button 
            onClick={() => { setFilters({}); onClose(); }}
            className="w-full py-3 border border-[#2D2424] text-[#2D2424] uppercase text-[10px] tracking-[0.2em] font-bold hover:bg-[#2D2424] hover:text-white transition-colors duration-200 rounded-sm"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};