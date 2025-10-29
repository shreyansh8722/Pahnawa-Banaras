// src/components/CategoryRow.jsx
import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useOnScreen } from "../hooks/useOnScreen";
import { applyGlobalFilter } from "../utils/filters";
import { SkeletonCard } from "./SkeletonCard";
import { SpotCard } from "./SpotCard";
import { SwipeHint } from "./SwipeHint"; // Your component!

export const CategoryRow = memo(
  ({ 
    category, 
    selectedCity, 
    globalFilter, 
    isPriorityRow = false, 
    navigate, 
    user, 
    showToast, 
    showLoginPrompt 
  }) => {
    
    // All your existing state and logic (Unchanged)
    const [spots, setSpots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const rowRef = useRef(null);
    const isVisible = useOnScreen(rowRef);
    const [hasFetched, setHasFetched] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const containerRef = useRef(null);
    const computeActive = useCallback(() => {
        const el = containerRef.current; if (!el) return;
        const items = Array.from(el.querySelectorAll("[data-idx]")); if (!items.length) return;
        const containerRect = el.getBoundingClientRect(); const centerX = containerRect.left + containerRect.width / 2;
        let closest = 0; let minD = Infinity;
        items.forEach((it) => {
            const rect = it.getBoundingClientRect(); const cx = rect.left + rect.width / 2;
            const d = Math.abs(cx - centerX); const idx = Number(it.getAttribute("data-idx"));
            if (d < minD) { minD = d; closest = idx; }
        });
        setActiveIdx(closest);
    }, []);
    useEffect(() => {
        if (!isVisible || !category.id || !selectedCity || hasFetched) { return; }
        let mounted = true;
        const fetchCategorySpots = async () => {
            setIsLoading(true);
            try {
                const q = query( collection(db, "spots"), where("category", "==", category.id), where("cityId", "==", selectedCity), limit(10) );
                const snap = await getDocs(q); if (!mounted) return;
                const spotData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setSpots(spotData); setHasFetched(true);
            } catch (err) { console.error(`Failed to fetch spots for: ${category.id} in ${selectedCity}`, err);
            } finally { if (mounted) setIsLoading(false); }
        };
        fetchCategorySpots();
        return () => (mounted = false);
    }, [isVisible, category.id, selectedCity, hasFetched]);
    useEffect(() => { setHasFetched(false); setSpots([]); setIsLoading(true); }, [selectedCity, category.id]);
    let title = category.name || category.id;
    if (category.id.toLowerCase().includes("food") || (category.name && category.name.toLowerCase().includes("food")))
      title = `Local eateries in ${selectedCity}`;
    else if (category.id.toLowerCase().includes("heritage") || (category.name && category.name.toLowerCase().includes("heritage")))
      title = `Top spots in ${selectedCity}`;
    else if (category.id.toLowerCase().includes("artifact") || (category.name && category.name.toLowerCase().includes("artifact")))
      title = `Local crafts in ${selectedCity}`;
    const filteredList = applyGlobalFilter(spots, globalFilter);
    if (!isVisible && !hasFetched) { return <div ref={rowRef} className="h-[240px] w-full" />; }
    if (!isLoading && filteredList.length === 0) { return null; }

    return (
      <section ref={rowRef} className="mb-8 relative">
        {/* Your Header (Unchanged) */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold capitalize">{title}</h2>
          <Link
            to={`/category/${category.id}`}
            className="text-xs font-medium text-gray-300 bg-white/6 px-3 py-1.5 rounded-full hover:bg-white/8 transition-colors"
            aria-label={`See all ${title}`}
          >
            See All
          </Link>
        </div>
        <div
          ref={containerRef}
          onScroll={computeActive}
          /* 💡 THE FIX: 
            REMOVED 'px-[6px]'. 
            This lets the 'gap-4' and cards scroll to the edge.
            The 'px-5' from HomePage provides the left indent.
          */
          className="flex gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth snap-x snap-mandatory"
        >
          {isLoading ? (
            [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          ) : (
            filteredList.map((spot, i) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                idx={i}
                activeIdx={activeIdx}
                isPriority={isPriorityRow && i === 0}
                navigate={navigate}
              />
            ))
          )}
        </div>
        {/* Your SwipeHint (Unchanged) */}
        {filteredList.length > 2 && <SwipeHint />}
      </section>
    );
  }
);

