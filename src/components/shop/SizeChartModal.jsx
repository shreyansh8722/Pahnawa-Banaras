import React from 'react';
import { createPortal } from 'react-dom'; // IMPORT PORTAL
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SizeChartModal = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  const data = {
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)'],
    rows: [
      ['XS', '32', '24', '34'],
      ['S', '34', '26', '36'],
      ['M', '36', '28', '38'],
      ['L', '38', '30', '40'],
      ['XL', '40', '32', '42'],
      ['XXL', '42', '34', '44'],
    ]
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none">
          
          {/* 1. Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />

          {/* 2. The Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white w-full max-w-sm rounded-sm shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FFFCF7] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white border border-[#e8dccb] rounded-full text-[#B08D55]">
                   <Ruler size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-gray-900">Size Guide</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{category || 'Standard Fit'}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-auto scrollbar-hide">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0 z-10 font-bold">
                  <tr>
                    {data.headers.map((header, i) => (
                      <th key={i} className="px-4 py-3 border-b border-gray-100 text-center">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={`px-4 py-3 text-center ${j === 0 ? 'font-bold text-gray-900 bg-gray-50/30' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Footer Tip */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 shrink-0">
                <p className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">Measurement Tip</p>
                <p className="text-xs text-gray-500 leading-relaxed">Measure comfortably over your undergarments. If between sizes, we recommend sizing up for comfort.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body // RENDER IN BODY
  );
};