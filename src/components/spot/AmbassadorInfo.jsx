import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

// --- Ambassador Info Component ---
const AmbassadorInfoComponent = ({ ambassadorId }) => {
  const [ambassador, setAmbassador] = useState(null);
  const [loadingAmbassador, setLoadingAmbassador] = useState(true);

  useEffect(() => {
    if (!ambassadorId) {
      setLoadingAmbassador(false);
      return;
    }
    setLoadingAmbassador(true);
    let cancelled = false;
    
    getDoc(doc(db, "ambassadors", ambassadorId))
      .then((ambSnap) => {
        if (!cancelled) {
          if (ambSnap.exists()) {
            setAmbassador({ id: ambSnap.id, ...ambSnap.data() });
          } else {
            console.warn(`Ambassador with ID ${ambassadorId} not found.`);
            setAmbassador(null);
          }
          setLoadingAmbassador(false);
        }
      })
      .catch(err => {
        console.error("Error fetching ambassador:", err);
        if (!cancelled) setLoadingAmbassador(false);
      });
      
    return () => (cancelled = true);
  }, [ambassadorId]);

  if (loadingAmbassador) return <AmbassadorInfoSkeleton />;
  if (!ambassador) return null;

  return (
    <Link 
      to={`/ambassador/${ambassador.id}`} 
      className="mt-6 flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
    >
      {ambassador.profileImageUrl ? (
        <img 
          src={ambassador.profileImageUrl} 
          alt={ambassador.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <UserCircle2 className="w-6 h-6 text-gray-400"/>
        </div>
      )}
      <div>
        <p className="text-xs text-gray-400">Suggested by</p>
        <p className="text-sm font-medium text-gray-100">{ambassador.name || 'Ambassador'}</p>
      </div>
    </Link>
  );
};

// --- Ambassador Skeleton ---
const AmbassadorInfoSkeleton = memo(() => (
    <div className="mt-6 flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 animate-pulse">
        <div className="w-10 h-10 bg-gray-800/40 rounded-full" />
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-800/40 rounded w-1/4" />
            <div className="h-4 bg-gray-800/40 rounded w-1/2" />
        </div>
    </div>
));

export const AmbassadorInfo = memo(AmbassadorInfoComponent);
// Attach the skeleton as a property for Suspense fallback
AmbassadorInfo.Skeleton = AmbassadorInfoSkeleton;
