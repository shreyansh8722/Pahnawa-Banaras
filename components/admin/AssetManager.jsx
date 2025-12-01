import React, { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { compressImage } from '@/lib/utils';
import { Upload, Loader2, Image as ImageIcon, LayoutGrid, Monitor, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

// --- VISUAL MAPPING CONFIG ---
const ASSET_SECTIONS = [
  {
    title: "Home Page: Hero Slideshow",
    description: "The main rotating banners at the top. Upload images with text pre-designed (Canva).",
    icon: Layers,
    slots: [
      { id: 'hero_slide_1', label: 'Slide 1', desc: 'Main Banner (Desktop 1920x1080 recommended)', width: 1920 },
      { id: 'hero_slide_2', label: 'Slide 2', desc: 'Second Banner', width: 1920 },
      { id: 'hero_slide_3', label: 'Slide 3', desc: 'Third Banner', width: 1920 },
    ]
  },
  {
    title: "Home Page: Category Grid",
    description: "The 4-tile grid visible immediately after the Hero section.",
    icon: LayoutGrid,
    slots: [
      { id: 'cat_saree', label: 'Sarees (Top Left)', desc: 'Vertical Portrait (3:4 ratio)', width: 800 },
      { id: 'cat_lehenga', label: 'Lehengas (Top Right)', desc: 'Vertical Portrait (3:4 ratio)', width: 800 },
      { id: 'cat_suit', label: 'Suits (Bottom Left)', desc: 'Vertical Portrait (3:4 ratio)', width: 800 },
      { id: 'cat_fabric', label: 'Fabrics (Bottom Right)', desc: 'Vertical Portrait (3:4 ratio)', width: 800 },
    ]
  },
  {
    title: "Home Page: Story & Banners",
    description: "The large editorial sections as you scroll down.",
    icon: Monitor,
    slots: [
      { id: 'feat_collection', label: 'Featured Collection Banner', desc: 'The massive full-width banner mid-page (Landscape).', width: 1600 },
      { id: 'craft_loom', label: 'Craft Section: Top Image', desc: 'The larger background image in the "Philosophy" section.', width: 800 },
      { id: 'craft_hands', label: 'Craft Section: Bottom Image', desc: 'The smaller overlapping image in the "Philosophy" section.', width: 800 },
    ]
  },
  {
    title: "Shop Page: Collection Headers",
    description: "The hero banner shown at the top when a user visits a specific category.",
    icon: BookOpen,
    slots: [
      { id: 'header_sarees', label: 'Sarees Header', desc: 'Top banner for /shop?cat=sarees', width: 1600 },
      { id: 'header_lehengas', label: 'Lehengas Header', desc: 'Top banner for /shop?cat=lehengas', width: 1600 },
      { id: 'header_suits', label: 'Suits Header', desc: 'Top banner for /shop?cat=suits', width: 1600 },
      { id: 'header_men', label: 'Men / Grooms Header', desc: 'Top banner for /shop?cat=men', width: 1600 },
      { id: 'header_default', label: 'Default Shop Header', desc: 'Fallback banner for "All Collections"', width: 1600 },
    ]
  }
];

export const AssetManager = () => {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      const docRef = doc(db, 'settings', 'global_assets');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setImages(docSnap.data());
      setLoading(false);
    };
    fetchAssets();
  }, []);

  const handleUpload = async (file, slotId, maxWidth) => {
    if (!file) return;
    setUploading(slotId);

    try {
      const compressedFile = await compressImage(file, maxWidth);
      const storageRef = ref(storage, `assets/${slotId}_${Date.now()}.webp`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);

      const docRef = doc(db, 'settings', 'global_assets');
      await setDoc(docRef, { [slotId]: url }, { merge: true });

      setImages(prev => ({ ...prev, [slotId]: url }));
      toast.success("Image updated!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading your visual assets...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {ASSET_SECTIONS.map((section, idx) => (
        <section key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Section Header */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex items-start gap-4">
            <div className="p-3 bg-white rounded-full border border-gray-200 text-heritage-gold">
              <section.icon size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-heritage-charcoal font-bold">{section.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{section.description}</p>
            </div>
          </div>

          {/* Slots Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {section.slots.map((slot) => (
              <div key={slot.id} className="flex gap-6 p-4 rounded-lg border border-gray-100 hover:border-heritage-gold/30 transition-colors bg-white group">
                
                {/* Preview Box */}
                <div className="w-28 h-36 bg-gray-50 shrink-0 border border-gray-200 overflow-hidden relative rounded-sm shadow-inner">
                  {images[slot.id] ? (
                    <img src={images[slot.id]} alt={slot.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                      <ImageIcon size={20} />
                      <span className="text-[9px] uppercase font-bold">Empty</span>
                    </div>
                  )}
                  
                  {/* Loading Overlay */}
                  {uploading === slot.id && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="animate-spin text-heritage-gold" size={20} />
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="mb-3">
                    <h4 className="font-bold text-sm text-gray-900">{slot.label}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{slot.desc}</p>
                  </div>

                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-heritage-gold transition-all rounded-sm w-fit">
                    <Upload size={12} />
                    {images[slot.id] ? "Replace Image" : "Upload Image"}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleUpload(e.target.files[0], slot.id, slot.width)} 
                    />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-2 font-mono">Max Width: {slot.width}px</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

    </div>
  );
};