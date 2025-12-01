import { useState, useEffect } from 'react';
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';
import { useLoginModal } from '@/context/LoginModalContext';
import toast from 'react-hot-toast';

export function useFavorites() {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. REAL-TIME LISTENER (The Source of Truth)
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Force strings to ensure perfect matching
        const safeFavs = (data.favorites || []).map(id => String(id));
        setFavorites(safeFavs);
      } else {
        // Doc doesn't exist yet (new user) -> Empty favorites
        setFavorites([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Wishlist Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. TOGGLE ACTION
  const toggleFavorite = async (productId) => {
    if (!user) {
      openLoginModal(); 
      return;
    }

    const idString = String(productId); // Ensure String ID
    const userRef = doc(db, 'users', user.uid);
    const isAlreadyFavorite = favorites.includes(idString);

    try {
      if (isAlreadyFavorite) {
        // REMOVE
        await updateDoc(userRef, { favorites: arrayRemove(idString) });
        toast.success("Removed from Wishlist", { 
          icon: '💔', 
          style: { background: '#fff', color: '#1a1a1a', border: '1px solid #eee' } 
        });
      } else {
        // ADD (Use setDoc merge to create user doc if missing)
        await setDoc(userRef, { favorites: arrayUnion(idString) }, { merge: true });
        toast.success("Saved to Wishlist", { 
          icon: '❤️', 
          style: { background: '#fff', color: '#1a1a1a', border: '1px solid #eee' } 
        });
      }
    } catch (err) {
      console.error("Wishlist Update Failed:", err);
      toast.error("Could not update wishlist");
    }
  };

  // Helper
  const isFavorite = (id) => favorites.includes(String(id));

  return { favorites, isFavorite, toggleFavorite, loading };
}