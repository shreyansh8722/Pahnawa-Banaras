import React from 'react';
import { motion } from 'framer-motion';

// A reusable component for new pages
export const PlaceholderScreen = ({ name, icon }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-center h-[80vh] text-gray-400 dark:text-gray-600 px-5"
  >
    {React.cloneElement(icon, { size: 48, className: "mb-4" })}
    <h2 className="mt-4 text-2xl font-bold">{name}</h2>
    <p className="text-center text-sm">This section is coming soon!</p>
  </motion.div>
);
