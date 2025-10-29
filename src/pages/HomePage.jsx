import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  lazy,
  Suspense,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  PlayCircle,
  PauseCircle,
  X, // 💡 THE FIX: Added 'X' to the import list
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { CategoryRow } from "../components/CategoryRow";
import { SkeletonCard } from "../components/SkeletonCard";
import { FILTER_OPTIONS } from "../utils/filters";

// Lazy-loaded components
const LoginPromptModal = lazy(() => import("../components/LoginPromptModal"));
const CityPopover = lazy(() => 
  import("../components/home/CityPopover").then(module => ({ default: module.CityPopover }))
);
// (We are not using the lazy-loaded FilterModal here, as the code is in this file)
// const FilterModal = lazy(() => ... ); 


/* ---------------------- Main ---------------------- */
export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Your State (Unchanged)
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(() => sessionStorage.getItem("selectedCity") || "");
  const [loadingCities, setLoadingCities] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("All");
  const [toast, setToast] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  
  // State for Popover
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const cityTriggerRef = useRef(null); 

  // Hero State
  const [heroSrc, setHeroSrc] = useState("");
  const [heroSrcWebM, setHeroSrcWebM] = useState("");
  const [heroPoster, setHeroPoster] = useState("");
  const [heroIsVideo, setHeroIsVideo] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  
  // Video Playback State
  const heroRef = useRef(null);
  const [showVideoPlayButton, setShowVideoPlayButton] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // (All your functions: showToast, showLoginPrompt, firstName, fetchInitialMeta... are unchanged)
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }, []);
  
  const showLoginPrompt = useCallback(() => setShowPrompt(true), []);
  
  const firstName = useMemo(() => {
    return (user?.displayName?.split(" ")[0] || "Guest").replace(/[^A-Za-z]/g, "") || "Guest";
  }, [user]);

  const fetchInitialMeta = useCallback(async () => {
    setLoadingCities(true);
    try {
      const [citySnap, catSnap] = await Promise.all([
        getDocs(collection(db, "cities")),
        getDocs(collection(db, "categories")),
      ]);
      const cs = citySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const cats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const findByKey = (arr, key) =>
        arr.find((c) => (c.id && c.id.toLowerCase().includes(key)) || (c.name && c.name.toLowerCase().includes(key)));
      const preferred = [findByKey(cats, "food"), findByKey(cats, "heritage"), findByKey(cats, "artifact")].filter(Boolean);
      const remaining = cats.filter((c) => !preferred.some((p) => p.id === c.id));
      const orderedCats = preferred.concat(remaining);
      setCities(cs);
      setCategories(orderedCats.length ? orderedCats : cats);
      setSelectedCity((current) => {
        const storedCity = sessionStorage.getItem("selectedCity");
        const isValidStoredCity = cs.some((city) => city.name === storedCity);
        if (isValidStoredCity) {
          return storedCity;
        } else if (cs.length > 0) {
          const defaultCity = cs[0].name;
          sessionStorage.setItem("selectedCity", defaultCity);
          return defaultCity;
        }
        return "";
      });
    } catch (err) {
      console.error("Failed to load cities/categories:", err);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialMeta();
  }, [fetchInitialMeta]);

  useEffect(() => {
    if (selectedCity && !loadingCities && cities.some((c) => c.name === selectedCity)) {
      sessionStorage.setItem("selectedCity", selectedCity);
    }
  }, [selectedCity, loadingCities, cities]);

  
  const selectedCityObj = useMemo(() => {
    return cities.find((c) => c.name === selectedCity);
  }, [cities, selectedCity]);

  useEffect(() => {
    if (!selectedCity || !cities.length || !selectedCityObj) {
      setHeroReady(false);
      return;
    }
    const url_mp4 = selectedCityObj.heroVideoUrl || selectedCityObj.heroImageUrl || selectedCityObj.hero || "";
    const url_webm = selectedCityObj.heroWebMUrl || "";
    const url_poster = selectedCityObj.heroPosterUrl || "";
    const isVideo = /\.mp4|\.webm|\.ogg$/i.test(url_mp4);
    setHeroSrc(url_mp4);
    setHeroSrcWebM(url_webm);
    setHeroPoster(url_poster);
    setHeroIsVideo(isVideo);
    setHeroReady(true);
    if (isVideo) {
      setIsVideoPlaying(true);
      setShowVideoPlayButton(false);
      setTimeout(() => {
        if (heroRef.current) {
          const playPromise = heroRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsVideoPlaying(true);
              setShowVideoPlayButton(false);
            })
            .catch(error => {
              console.warn("Video autoplay prevented:", error);
              setIsVideoPlaying(false);
              setShowVideoPlayButton(true);
            });
          }
        }
      }, 100);
    }
  }, [selectedCity, cities, selectedCityObj]);
  
  const toggleVideoPlay = () => {
    if (heroRef.current) {
      if (heroRef.current.paused) {
        heroRef.current.play();
        setIsVideoPlaying(true);
        setShowVideoPlayButton(true); 
      } else {
        heroRef.current.pause();
        setIsVideoPlaying(false);
        setShowVideoPlayButton(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0c] via-[#111214] to-[#0a0a0a] text-white pb-28">
      <div className="max-w-md mx-auto relative">
        
        {/* === HERO SECTION (Your UI) === */}
        <motion.section
          className="relative w-full overflow-hidden rounded-b-3xl shadow-2xl"
        >
          {/* (Skeleton, Video, Image, Gradients, Text... all unchanged) */}
          {!heroReady && (
            <div className="w-full h-[280px] bg-gradient-to-r from-[#071022] to-[#08102a] animate-pulse" />
          )}
          {heroReady && (
            heroIsVideo ? (
              <motion.video
                key={heroSrc} ref={heroRef} autoPlay muted loop playsInline poster={heroPoster}
                className="w-full h-[280px] object-cover"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                onPlay={() => setIsVideoPlaying(true)} onPause={() => setIsVideoPlaying(false)}
              >
                {heroSrcWebM && <source src={heroSrcWebM} type="video/webm" />}
                <source src={heroSrc} type="video/mp4" />
              </motion.video>
            ) : (
              <motion.img
                key={heroSrc} src={heroSrc} alt={selectedCityObj?.name || "city"}
                className="w-full h-[280px] object-cover"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
              />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-6 text-white">
            <motion.h1
              key={selectedCity}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-4xl font-extrabold mb-2 tracking-tight drop-shadow-xl"
            >
              {selectedCity || "Explore"}
            </motion.h1>
            <p className="text-sm text-gray-200">
              {selectedCityObj?.subtitle || "Hidden gems & curated escapes"}
            </p>
          </div>
          {heroIsVideo && showVideoPlayButton && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <button
                onClick={toggleVideoPlay}
                className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg"
                aria-label={isVideoPlaying ? "Pause video" : "Play video"}
              >
                {isVideoPlaying ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
              </button>
            </motion.div>
          )}
        </motion.section>

        {/* === HEADER SECTION === */}
        <header 
          className="px-5 pt-6"
          ref={cityTriggerRef}
        >
          {/* (Header content... unchanged) */}
          <h2 className="text-lg font-semibold mb-1 text-gray-300">Welcome back, {firstName} 👋</h2>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <p>Currently exploring</p>
            <button
              onClick={() => setCityPopoverOpen(true)}
              className="flex items-center gap-1 font-medium bg-white/10 backdrop-blur-md hover:bg-white/20 px-3 py-1 rounded-full border border-white/10 transition"
            >
              <MapPin size={14} className="text-blue-400" />
              <span>{selectedCity || "Select City"}</span>
            </button>
          </div>
        </header>

        {/* === Search + filter (Your UI, Unchanged) === */}
        <div className="flex items-center bg-white/5 backdrop-blur-lg rounded-full px-4 py-3 mb-5 mt-4 mx-5 border border-white/8">
          {/* (Search input... unchanged) */}
          <Search size={18} className="text-gray-300" />
          <input
            readOnly
            onClick={() => navigate("/search")}
            placeholder="Search destinations, eateries, heritage..."
            className="bg-transparent w-full text-sm ml-3 placeholder-gray-400 focus:outline-none text-gray-100"
            aria-label="Search"
          />
          <button
            onClick={() => setFilterModal(true)}
            className="ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* === Categories === */}
        <div className="pb-8 px-5">
          {/* (CategoryRow mapping... unchanged) */}
          {loadingCities ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="mb-8">
                  <div className="h-5 bg-gray-800/40 rounded w-1/2 mb-3 animate-pulse"></div>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                    {[1, 2, 3].map((j) => (
                      <SkeletonCard key={j} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No categories found.</div>
          ) : selectedCity ? (
            categories.map((cat, index) => (
              <CategoryRow
                key={`${selectedCity}-${cat.id}`}
                category={cat}
                selectedCity={selectedCity}
                globalFilter={globalFilter}
                isPriorityRow={index === 0}
                navigate={navigate}
                user={user}
                showToast={showToast}
                showLoginPrompt={showLoginPrompt}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-10">Please select a city to see spots.</div>
          )}
        </div>
      </div> {/* End of max-w-md wrapper */}

      {/* === MODALS (LAZY LOADED) === */}
      
      {/* City Popover */}
      <Suspense fallback={null}>
        <CityPopover
          open={cityPopoverOpen}
          onClose={() => setCityPopoverOpen(false)}
          cities={cities}
          selectedCity={selectedCity}
          triggerRef={cityTriggerRef}
          onCitySelect={(cityName) => {
            setSelectedCity(cityName);
            setCityPopoverOpen(false);
            showToast(`Now exploring ${cityName} ✈️`);
          }}
        />
      </Suspense>

      {/* Filter Modal (Your lazy load) */}
      <Suspense fallback={null}>
        {/* Using your original logic for the FilterModal */}
        {filterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end"
            onClick={() => setFilterModal(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0b0b0c] rounded-t-[28px] shadow-2xl p-6 pb-8 border-t border-white/6"
            >
              <div className="w-10 h-1.5 bg-gray-800 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-100">Filters</h2>
                {/* This button now has its 'X' icon imported */}
                <button onClick={() => setFilterModal(false)} className="text-gray-400 hover:text-gray-200" aria-label="Close filters">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {FILTER_OPTIONS.map((f) => (
                  <motion.button
                    key={f.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setGlobalFilter(f.id);
                      requestAnimationFrame(() => setFilterModal(false));
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      globalFilter === f.id ? "bg-white/10 text-white" : "bg-white/10 text-gray-200"
                    }`}
                  >
                    {f.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </Suspense>

      {/* Login Prompt (Your lazy load) */}
      <Suspense fallback={null}>
        <LoginPromptModal open={showPrompt} onClose={() => setShowPrompt(false)} />
      </Suspense>

      {/* === Toast (Your UI, Unchanged) === */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.28 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-white/8 text-white text-sm px-4 py-2 rounded-full shadow-md backdrop-blur-md z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

