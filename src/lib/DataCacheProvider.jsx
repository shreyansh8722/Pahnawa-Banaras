import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from '../hooks/useAuth';

const DataCacheContext = createContext(null);

export function DataCacheProvider({ children }) {
  const { user } = useAuth();
  const [spots, setSpots] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedSpots, setSavedSpots] = useState([]);
  const [lastFetch, setLastFetch] = useState(null);

  // Cache TTL: 5 minutes
  const CACHE_TTL = 5 * 60 * 1000;

  // Fetch all spots and artifacts once
  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Don't re-fetch if we have fresh data (unless forced)
    if (!force && lastFetch && (now - lastFetch) < CACHE_TTL && spots.length > 0) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Fetch all spots in parallel
      const spotsQuery = query(
        collection(db, 'spots'),
        where('cityId', '==', 'Varanasi')
      );
      const spotsSnap = await getDocs(spotsQuery);
      const spotsData = spotsSnap.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Separate spots and artifacts
      const regularSpots = spotsData.filter(s => s.category !== 'artifact');
      const artifactSpots = spotsData.filter(s => s.category === 'artifact');
      
      setSpots(regularSpots);
      setArtifacts(artifactSpots);
      setLastFetch(now);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [lastFetch, spots.length]);

  // Listen for favorites in real-time
  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const unsub = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setSavedSpots(docSnap.data().favorites || []);
        } else {
          setSavedSpots([]);
        }
      });
      return () => unsub();
    } else {
      setSavedSpots([]);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Memoized filtered data helpers
  const getSpotsByCategory = useCallback((categories) => {
    if (!categories || categories.includes('all')) return spots;
    return spots.filter(spot => categories.includes(spot.category));
  }, [spots]);

  const getSpotsWithLocation = useCallback(() => {
    // Include both spots and artifacts with valid locations for MapPage
    const allItems = [...spots, ...artifacts];
    return allItems.filter(item => 
      item.location?.latitude && item.location?.longitude
    );
  }, [spots, artifacts]);

  const searchSpots = useCallback((searchTerm, categoryFilter = null) => {
    let filtered = categoryFilter ? getSpotsByCategory([categoryFilter]) : spots;
    
    if (!searchTerm) return filtered;
    
    const searchLower = searchTerm.toLowerCase();
    return filtered.filter(spot =>
      spot.name.toLowerCase().includes(searchLower) ||
      (spot.tags_lowercase && 
       Array.isArray(spot.tags_lowercase) && 
       spot.tags_lowercase.some(tag => tag.includes(searchLower)))
    );
  }, [spots, getSpotsByCategory]);

  const searchArtifacts = useCallback((searchTerm, tagFilter = null) => {
    let filtered = artifacts;
    
    if (tagFilter && tagFilter !== 'all') {
      filtered = filtered.filter(item =>
        item.tags_lowercase && 
        Array.isArray(item.tags_lowercase) && 
        item.tags_lowercase.includes(tagFilter)
      );
    }
    
    if (!searchTerm) return filtered;
    
    const searchLower = searchTerm.toLowerCase();
    return filtered.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      (item.fullDescription && 
       item.fullDescription.toLowerCase().includes(searchLower))
    );
  }, [artifacts]);

  const value = useMemo(() => ({
    spots,
    artifacts,
    loading,
    error,
    savedSpots,
    refetch: () => fetchData(true),
    getSpotsByCategory,
    getSpotsWithLocation,
    searchSpots,
    searchArtifacts,
  }), [
    spots,
    artifacts,
    loading,
    error,
    savedSpots,
    fetchData,
    getSpotsByCategory,
    getSpotsWithLocation,
    searchSpots,
    searchArtifacts,
  ]);

  return (
    <DataCacheContext.Provider value={value}>
      {children}
    </DataCacheContext.Provider>
  );
}

export function useDataCache() {
  const context = useContext(DataCacheContext);
  if (!context) {
    throw new Error('useDataCache must be used within DataCacheProvider');
  }
  return context;
}
