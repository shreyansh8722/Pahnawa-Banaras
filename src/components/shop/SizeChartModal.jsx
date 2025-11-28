import React from 'react';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* 1. Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 2. The Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                   <Ruler size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-gray-900">Size Guide</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{category || 'Standard Fit'}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-100"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Table (Scrollable if too long) */}
            <div className="p-0 overflow-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {data.headers.map((header, i) => (
                      <th key={i} className="px-6 py-3 font-bold border-b border-gray-100">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={`px-6 py-3 ${j === 0 ? 'font-bold text-gray-900 bg-gray-50/50' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Footer Tip */}
            <div className="p-5 bg-[#fffcf7] border-t border-[#e8dccb] shrink-0">
                <p className="font-bold text-[#B08D55] text-xs uppercase tracking-wider mb-1">Measuring Tip</p>
                <p className="text-xs text-gray-600 leading-relaxed">For the best fit, measure comfortably over your undergarments. If you are between sizes, we recommend sizing up for comfort.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};