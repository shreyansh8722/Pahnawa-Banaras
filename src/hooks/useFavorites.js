import { useState, useEffect } from 'react';
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';
import { useLoginModal } from '@/context/LoginModalContext'; // Import the trigger

export function useFavorites() {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal(); // Hook to open modal
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    // Real-time listener for favorites
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setFavorites(docSnap.data().favorites || []);
      } else {
        // Create user doc if it doesn't exist (edge case)
        setDoc(userRef, { favorites: [] }, { merge: true });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching favorites:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleFavorite = async (productId) => {
    // 1. If no user, show the Login Modal instead of an alert
    if (!user) {
      openLoginModal(); 
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const isFavorite = favorites.includes(productId);

    try {
      if (isFavorite) {
        await updateDoc(userRef, { favorites: arrayRemove(productId) });
      } else {
        await updateDoc(userRef, { favorites: arrayUnion(productId) });
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  return { favorites, toggleFavorite, loading };
}