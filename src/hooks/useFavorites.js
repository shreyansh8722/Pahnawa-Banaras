import { useState, useEffect } from 'react';
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setFavorites(docSnap.data().favorites || []);
      } else {
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
    if (!user) {
      alert("Please login to save favorites");
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