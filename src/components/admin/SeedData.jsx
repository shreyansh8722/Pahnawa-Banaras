import React, { useState, useEffect } from 'react';
import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'; 
import { Loader2, Database, Trash2, AlertTriangle, UserCheck, Lock, Package, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const MOCK_PRODUCTS = [
  {
    name: "Kadhua Jangla Red Saree",
    category: "Saree",
    subCategory: "Katan Silk",
    price: 45000,
    description: "A timeless red Kadhua Jangla saree woven with real gold zari.",
    fullDescription: "This masterpiece features the intricate Kadhua weave, where each motif is woven separately. The vibrant red hue makes it perfect for bridal wear. Takes approximately 3 weeks to weave.",
    weaveType: "Kadhua",
    fabric: "Pure Katan Silk",
    stock: 5,
    featuredImageUrl: "https://images.unsplash.com/photo-1610189012906-47833d772097?auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1610189012906-47833d772097?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583391726247-e29237d8612f?auto=format&fit=crop&q=80"
    ],
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Midnight Blue Tanchoi",
    category: "Saree",
    subCategory: "Tanchoi",
    price: 28000,
    description: "Elegant midnight blue Tanchoi silk saree with subtle paisley motifs.",
    fullDescription: "Tanchoi is a weaving technique that creates a smooth, satin-like finish. This saree features a dense pattern of small paisleys woven in muted gold and silver threads.",
    weaveType: "Tanchoi",
    fabric: "Satin Silk",
    stock: 8,
    featuredImageUrl: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80"
    ],
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    name: "Golden Tissue Lehenga",
    category: "Lehenga",
    subCategory: "Bridal Handloom",
    price: 85000,
    description: "A radiant golden tissue lehenga for the modern bride.",
    fullDescription: "Handwoven tissue fabric that glows under light. The skirt features broad borders with traditional floral vines. Includes unstitched blouse piece and pure organza dupatta.",
    weaveType: "Tissue",
    fabric: "Tissue Silk",
    stock: 2,
    featuredImageUrl: "https://images.unsplash.com/photo-1583391726247-e29237d8612f?auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1583391726247-e29237d8612f?auto=format&fit=crop&q=80"
    ],
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Ivory Organza Saree",
    category: "Saree",
    subCategory: "Organza",
    price: 18500,
    description: "Lightweight ivory organza with delicate floral embroidery.",
    fullDescription: "Perfect for summer weddings. This pure organza saree drapes beautifully and features hand-embroidered floral motifs scattered across the body.",
    weaveType: "Hand Embroidery",
    fabric: "Pure Kora Organza",
    stock: 12,
    featuredImageUrl: "https://images.unsplash.com/photo-1596230529625-7eeeff6f1a8c?auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1596230529625-7eeeff6f1a8c?auto=format&fit=crop&q=80"
    ],
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    name: "Emerald Green Jangla",
    category: "Saree",
    subCategory: "Katan Silk",
    price: 52000,
    description: "Luxurious emerald green saree with all-over Jangla pattern.",
    fullDescription: "The Jangla pattern is characterized by continuous creeper motifs covering the entire saree. This piece uses real silver zari which will acquire a beautiful patina over time.",
    weaveType: "Jangla",
    fabric: "Pure Katan Silk",
    stock: 3,
    featuredImageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80"
    ],
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Royal Men's Sherwani Fabric",
    category: "Men",
    subCategory: "Sherwani Fabrics",
    price: 22000,
    description: "Heavy silk brocade fabric for bespoke sherwanis.",
    fullDescription: "3.5 meters of heavy brocade fabric suitable for a groom's sherwani. Intricate geometrical patterns woven in antique gold zari.",
    weaveType: "Brocade",
    fabric: "Silk Blend",
    stock: 10,
    featuredImageUrl: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80",
    imageUrls: [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80"
    ],
    isFeatured: false,
    createdAt: new Date().toISOString()
  }
];

export const SeedData = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [existingProducts, setExistingProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Monitor Auth State constantly
  useEffect(() => {
    if (!auth) {
        console.error("Firebase Auth not initialized in SeedData.");
        setAuthChecking(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
      if (user) fetchProducts(); // Fetch on load if user exists
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Existing Products to Display
  const fetchProducts = async () => {
    setRefreshing(true);
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
      const snapshot = await getDocs(collectionRef);
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExistingProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      // toast.error("Could not fetch existing products.");
    } finally {
      setRefreshing(false);
    }
  };

  // 3. Manual Login Helper (Fallback)
  const forceLogin = async () => {
    try {
      setLoading(true);
      await signInAnonymously(auth);
      toast.success("Signed in anonymously for seeding.");
    } catch (error) {
      toast.error("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!currentUser) {
      toast.error("Authentication Missing. Please click 'Force Login' or Log in again.");
      return;
    }

    if (!window.confirm(`Seeding as ${currentUser.email || 'Anonymous'}. Continue?`)) return;
    
    setLoading(true);
    const toastId = toast.loading("Writing to database...");

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      
      // CRITICAL: Writing to the EXACT path defined in your Firestore Rules
      const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');

      const batch = writeBatch(db);

      MOCK_PRODUCTS.forEach(product => {
        const newDocRef = doc(collectionRef); 
        batch.set(newDocRef, {
          ...product,
          ownerId: currentUser.uid // Tagging the creator
        });
      });

      await batch.commit();
      toast.success("Success! Products have been added.", { id: toastId });
      fetchProducts(); // Refresh list after seeding
      
    } catch (error) {
      console.error("Seed Error:", error);
      // Detailed error message for debugging
      toast.error(`Permission Denied. Check Console. (${error.code})`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const clearData = async () => {
    if (!currentUser) {
      toast.error("Authentication Missing.");
      return;
    }
    if (!window.confirm("WARNING: DELETE ALL PRODUCTS? This cannot be undone.")) return;

    setLoading(true);
    const toastId = toast.loading("Deleting...");

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
      
      const snapshot = await getDocs(collectionRef);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      toast.success("Database cleared.", { id: toastId });
      fetchProducts(); // Refresh list after clearing
    } catch (error) {
      console.error("Clear Error:", error);
      toast.error(`Failed to clear: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-serif italic text-gray-800 mb-4 flex items-center gap-2">
          <Database size={18} />
          Database Tools
        </h3>
        
        {/* Auth Status Box */}
        <div className={`text-xs p-3 rounded-md mb-6 flex items-center justify-between ${
          currentUser ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {currentUser ? <UserCheck size={16}/> : <Lock size={16}/>}
            <span>
              {authChecking ? "Checking Status..." : currentUser 
                ? `Ready as: ${currentUser.email || 'Anonymous Admin'}` 
                : "Not Authenticated (Writes will fail)"}
            </span>
          </div>
          {!currentUser && !authChecking && (
            <button 
              onClick={forceLogin}
              className="underline font-bold hover:text-red-900"
            >
              Force Login
            </button>
          )}
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleSeed}
            disabled={loading || !currentUser}
            className="flex items-center gap-2 px-4 py-2 bg-heritage-charcoal text-white rounded hover:bg-heritage-gold transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : null}
            Seed Products
          </button>

          <button
            onClick={clearData}
            disabled={loading || !currentUser}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
            Clear All
          </button>
        </div>
      </div>

      {/* Database Preview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-serif italic text-gray-800 flex items-center gap-2">
            <Package size={18} />
            Current Products ({existingProducts.length})
          </h3>
          <button onClick={fetchProducts} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {existingProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm italic border-2 border-dashed border-gray-100 rounded-lg">
            No products found in database. <br/> Click "Seed Products" to start.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingProducts.map(product => (
              <div key={product.id} className="flex gap-4 p-3 border border-gray-100 rounded-lg hover:border-heritage-gold/50 transition-colors">
                <div className="w-16 h-20 bg-gray-100 shrink-0 overflow-hidden rounded-sm">
                  <img src={product.featuredImageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500 mb-1">{product.category} • {product.subCategory}</p>
                  <p className="text-xs font-bold text-heritage-charcoal">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Export alias to satisfy any specific imports (like App.jsx) if needed
export const SeedDataButton = SeedData;