import React from 'react';
import { Tag } from 'lucide-react';

export const ProductOffers = () => {
  return (
    <div className="mb-6 p-4 bg-[#fffcf7] border border-[#e8dccb] rounded-sm">
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3 flex items-center gap-2">
        <Tag size={14} className="text-[#B08D55]" /> Available Offers
      </h4>
      <ul className="space-y-2">
        <li className="text-xs text-gray-700 flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B08D55] mt-1.5 shrink-0" />
          <span>
            Use code <span className="font-bold text-black">BANARAS5</span> for <span className="font-bold text-[#B08D55]">5% OFF</span> on your first order.
          </span>
        </li>
        <li className="text-xs text-gray-700 flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B08D55] mt-1.5 shrink-0" />
          <span>
            Free Shipping on all prepaid orders above ₹10,000.
          </span>
        </li>
      </ul>
    </div>
  );
};