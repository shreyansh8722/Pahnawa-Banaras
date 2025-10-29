import React, {
  useEffect,
  useState,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Heart, Share2, Check, Star, Clock, Tag, MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  doc, getDoc, updateDoc, arrayUnion, arrayRemove
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

// --- Custom Hook for scroll ---
import { useScrollDirection } from "../hooks/useScrollDirection"; 

// --- Lazily import non-critical components ---
const LoginPromptModal = lazy(() => import("../components/LoginPromptModal"));

// --- 💡 FIX: Adjust lazy imports for named exports ---
const AmbassadorInfo = lazy(() => 
  import("../components/spot/AmbassadorInfo").then(module => ({ default: module.AmbassadorInfo }))
);
const ReviewsPreview = lazy(() => 
  import("../components/spot/ReviewsPreview").then(module => ({ default: module.ReviewsPreview }))
);

// --- Import critical components directly ---
import { ImageCarousel } from "../components/spot/ImageCarousel";
import { SpotDetailsSkeleton } from "../components/spot/SpotDetailsSkeleton";


/* -------------------------- Main Component -------------------------- */
export default function SpotDetailsPage() {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // --- 🔥 UPGRADE: Use our new scroll hook ---
  const scrollDirection = useScrollDirection(60); // Use a 60px threshold
  // Show buttons if scrolling up, at the top, or direction isn't set yet
  const showButtons = scrollDirection !== "down"; 

  // --- Fetch Spot Data ---
  useEffect(() => {
    if (!spotId) {
      setError("Spot ID is missing.");
      setLoading(false);
      return;
    };
    let cancelled = false;
    const fetchSpotData = async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDoc(doc(db, "spots", spotId));
        if (!snap.exists()) {
          if (!cancelled) {
            setError(`Spot not found.`);
            setSpot(null);
            console.error("Spot not found:", spotId);
          }
          return;
        }
        const data = { id: snap.id, ...snap.data() };
        if (!cancelled) setSpot(data);
      } catch (err) {
        console.error("Error fetching spot:", err);
        if (!cancelled) {
          setError("Failed to load spot details.");
          setSpot(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSpotData();
    return () => (cancelled = true);
  }, [spotId]);

  // --- Check Favorite Status ---
  useEffect(() => {
    if (!user || !spotId) {
      setIsFav(false);
      return;
    }
    const checkFav = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().favorites?.includes(spotId)) {
          setIsFav(true);
        } else {
          setIsFav(false);
        }
      } catch (err) {
        console.error("Error checking fav:", err);
        setIsFav(false);
      }
    };
    checkFav();
  }, [user, spotId]);

  // --- Toggle Favorite ---
  const toggleFavorite = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const previousIsFav = isFav;
    setIsFav(!isFav); // Optimistic update
    try {
      await updateDoc(userRef, {
        favorites: previousIsFav ? arrayRemove(spotId) : arrayUnion(spotId),
      });
    } catch (err) {
      console.error("Error updating fav:", err);
      setIsFav(previousIsFav); // Revert on error
    }
  };

  // --- Handle Share ---
  const handleShare = async () => {
    const shareData = {
      title: spot?.name || "Check out this spot!",
      text: (spot?.fullDescription || "").slice(0, 120) + "...",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // --- Generate Google Maps URL ---
  const mapsUrl = useMemo(() => {
    if (!spot) return "#";
    if (spot.googleMapsUrl) return spot.googleMapsUrl;
    if (spot.location?.latitude && spot.location?.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${spot.location.latitude},${spot.location.longitude}`;
    }
    const query = encodeURIComponent(`${spot.name || ''}, ${spot.cityId || spot.city || ''}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [spot]);

  // --- Prepare images for carousel ---
  const images = useMemo(() => {
    if (!spot) return [];
    let allImages = [];
    if (spot.featuredImageUrl) allImages.push(spot.featuredImageUrl);
    if (Array.isArray(spot.imageUrls)) {
      spot.imageUrls.forEach(url => {
        if (url && typeof url === 'string' && url.trim() !== '' && url !== spot.featuredImageUrl) {
          allImages.push(url);
        }
      });
    }
    return allImages;
  }, [spot]);


  // --- Render States ---
  if (loading) return <SpotDetailsSkeleton />;
  
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#0b0b0c] to-[#0a0a0a] text-white">
      <p className="text-red-500 text-lg mb-4">{error}</p>
      <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline">Go Back</button>
    </div>
  );
  
  if (!spot) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#0b0b0c] to-[#0a0a0a] text-white">
      <p className="text-lg text-gray-400 mb-4">Spot data could not be found.</p>
      <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline">Go Back</button>
    </div>
  );


  // --- Main Render ---
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0b0b0c] via-[#111214] to-[#0a0a0a] text-white overflow-x-hidden">

      {/* 1. Imported Component */}
      <ImageCarousel images={images} spotName={spot.name}/>

      {/* 2. Top Nav Buttons (using new scroll logic) */}
      <motion.div
        animate={{ opacity: showButtons ? 1 : 0, y: showButtons ? 0 : -20 }}
        initial={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed top-6 left-0 right-0 w-full px-5 flex justify-between items-center z-20 pointer-events-none"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-black/40 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-white hover:bg-black/60 transition-colors pointer-events-auto"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div className="flex gap-3 pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className={`w-9 h-9 bg-black/40 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-black/50 transition-colors ${
              isFav ? "text-red-500" : "text-white"
            }`}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
             <AnimatePresence mode="wait">
                <motion.span
                  key={isFav ? 'filled' : 'empty'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'inline-block' }}
                >
                  <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                </motion.span>
             </AnimatePresence>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="w-9 h-9 bg-black/40 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            aria-label="Share spot"
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </motion.button>
        </div>
      </motion.div>

      {/* 3. Page Content */}
      <motion.div
        key={spot.id}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 mt-[360px] bg-gradient-to-b from-[#111214] to-[#0a0a0a] rounded-t-[32px] shadow-lg pb-28 min-h-[calc(100vh-360px)]"
      >
        <div className="px-6 pt-8">
            {/* Spot Header */}
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-semibold leading-tight text-gray-100 mr-4">
                {spot.name}
              </h1>
              <div className="flex flex-col items-end flex-shrink-0">
                <div className="flex items-center bg-white/10 px-3 py-1 rounded-full text-sm">
                  <Star className="text-yellow-400 w-4 h-4 mr-1 fill-yellow-400" />
                  <span className="text-gray-100 font-medium">{spot.averageRating != null ? spot.averageRating.toFixed(1) : "New"}</span>
                </div>
                {(spot.reviewCount ?? 0) > 0 && (
                  <span className="text-xs text-gray-400 mt-1 whitespace-nowrap">
                    ({spot.reviewCount} reviews)
                  </span>
                )}
              </div>
            </div>
            
            {/* Spot Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400 mb-6 border-b border-white/10 pb-6">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-500" />
                {spot.cityId || spot.city || "Location"}
              </span>
              {spot.openingHours && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {spot.openingHours}
                </span>
              )}
              {spot.priceRange && (
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-gray-500" />
                  {spot.priceRange}
                </span>
              )}
            </div>
            
            {/* Description */}
            <h2 className="text-lg font-semibold text-gray-100 mb-2">Description</h2>
            {/* 💡 FIX: Corrected closing </p> tag */}
            <p className="text-gray-300 leading-relaxed text-sm">
              {spot.fullDescription || "No description available."}
            </p>

            {/* 4. Lazily Loaded Ambassador Info */}
            <Suspense fallback={<SpotDetailsSkeleton.Ambassador />}>
              {spot.ambassadorId && <AmbassadorInfo ambassadorId={spot.ambassadorId} />}
            </Suspense>
        </div>
        
        {/* 5. Lazily Loaded Reviews Preview */}
        <Suspense fallback={<SpotDetailsSkeleton.Reviews />}>
          {spot.id && <ReviewsPreview spotId={spot.id} spotName={spot.name} />}
        </Suspense>
      </motion.div>

      {/* 6. Bottom "Get Directions" Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 w-full p-4 pt-2 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/0 z-20"
      >
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-md mx-auto flex justify-center bg-blue-600 text-white py-3.5 rounded-full shadow-lg font-medium hover:bg-blue-700 transition-colors text-base"
        >
          Get Directions
        </a>
      </motion.div>

      {/* 7. Login Modal */}
      <Suspense fallback={null}>
        <LoginPromptModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
      </Suspense>
    </div>
  );
}

