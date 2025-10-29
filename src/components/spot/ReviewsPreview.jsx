import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, UserCircle2, Star } from "lucide-react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";

// --- Utility (can be moved to a utils file later) ---
function formatUsername(displayName, email) {
    if (displayName) return displayName;
    return email ? email.split("@")[0] : "Anonymous";
}

// --- Reviews Preview Component ---
const ReviewsPreviewComponent = ({ spotId, spotName }) => {
  const [reviewsPreview, setReviewsPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!spotId) {
      setLoading(false);
      return;
    };
    
    let cancelled = false;
    setLoading(true);
    
    const q = query(
      collection(db, "reviews"),
      where("spotId", "==", spotId),
      orderBy("createdAt", "desc"),
      limit(2)
    );
    
    getDocs(q)
      .then((rsnap) => {
        if (!cancelled) {
          const reviews = rsnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            username: formatUsername(d.data().username, d.data().userEmail)
          }));
          setReviewsPreview(reviews);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error fetching reviews preview:", err);
        if (!cancelled) setLoading(false);
      });
      
    return () => (cancelled = true);
  }, [spotId]);

  if (loading) return <ReviewPreviewSkeleton />;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between px-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Reviews</h3>
        {reviewsPreview.length > 0 && (
          <Link 
            to={`/spot/${spotId}/reviews`} 
            state={{ spotName: spotName }} 
            className="text-blue-400 font-medium text-sm hover:underline"
          >
            See all
          </Link>
        )}
      </div>
      <div className="px-6">
        {reviewsPreview.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border border-dashed border-white/10 rounded-xl bg-white/5">
              <MessageSquare className="w-10 h-10 mx-auto text-gray-600 mb-2"/>
              <p>No reviews yet.</p>
              <p className="text-xs mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <ul className="space-y-4 list-none">
            {reviewsPreview.map((r) => (
              <li key={r.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                       <UserCircle2 className="w-6 h-6 text-gray-400 flex-shrink-0" />
                       <p className="font-medium text-sm text-gray-200">{r.username}</p>
                   </div>
                  <span className="flex items-center gap-1 text-gray-300 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {r.rating}
                  </span>
                </div>
                <p className="text-gray-300 mt-2 text-sm leading-snug line-clamp-2">
                  {r.comment}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// --- Reviews Preview Skeleton ---
const ReviewPreviewSkeleton = memo(() => (
    <div className="mt-4 px-6 space-y-4">
        {[1, 2].map((i) => (
        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 animate-pulse list-none">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-800/40 rounded-full" />
                    <div className="h-4 bg-gray-800/40 rounded w-24" />
                </div>
                <div className="h-4 bg-gray-800/40 rounded w-16" />
            </div>
            <div className="h-3 bg-gray-800/40 rounded w-full mt-3" />
            <div className="h-3 bg-gray-800/40 rounded w-5/6 mt-1.5" />
        </div>
        ))}
    </div>
));


export const ReviewsPreview = memo(ReviewsPreviewComponent);
// Attach the skeleton as a property for Suspense fallback
ReviewsPreview.Skeleton = ReviewPreviewSkeleton;
