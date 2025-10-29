import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export const SwipeHint = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const shown = sessionStorage.getItem("swipeHintShown");

    if (isMobile && !shown) {
      setShow(true);
      sessionStorage.setItem("swipeHintShown", "true");
      setTimeout(() => setShow(false), 3000);
    }
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: [0, 1, 0], x: [15, 0, -10] }}
      transition={{ duration: 2.2, ease: "easeInOut" }}
      className="absolute top-[45%] right-3 flex items-center gap-1 text-gray-300/70 text-xs font-medium select-none pointer-events-none"
    >
      <span>Swipe</span>
      <ChevronRight size={13} />
    </motion.div>
  );
};