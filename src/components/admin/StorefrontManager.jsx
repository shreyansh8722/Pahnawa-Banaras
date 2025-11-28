import React, { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LayoutTemplate, Save, Image as ImageIcon, Loader2, Megaphone, Layers, BookOpen, UploadCloud } from 'lucide-react';
import { compressImage } from '@/lib/utils';

const TABS = [
  { id: 'hero', label: 'Home Banner', icon: LayoutTemplate },
  { id: 'collections', label: 'Collections', icon: Layers },
  { id: 'about', label: 'About Us', icon: BookOpen },
];

export const StorefrontManager = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- STATE ---
  const [heroData, setHeroData] = useState({
    title: "", subtitle: "", buttonText: "", announcement: "", imageUrl: ""
  });
  
  const [collections, setCollections] = useState([
    { name: 'Banarasi', img: '' },
    { name: 'Bridal', img: '' },
    { name: 'Suit', img: '' },
    { name: 'Dupatta', img: '' }
  ]);

  const [aboutData, setAboutData] = useState({
    title: "Reviving the Golden Age",
    content: "Our story begins in the narrow lanes of Varanasi...",
    imageUrl: ""
  });

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const heroSnap = await getDoc(doc(db, 'settings', 'storefront'));
        if (heroSnap.exists()) setHeroData(prev => ({ ...prev, ...heroSnap.data() }));

        const collSnap = await getDoc(doc(db, 'settings', 'collections'));
        if (collSnap.exists()) setCollections(collSnap.data().items || []);

        const aboutSnap = await getDoc(doc(db, 'settings', 'about'));
        if (aboutSnap.exists()) setAboutData(prev => ({ ...prev, ...aboutSnap.data() }));
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleImageUpload = async (file, path) => {
    const compressed = await compressImage(file);
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, compressed);
    return await getDownloadURL(storageRef);
  };

  const saveHero = async (e) => {
    e.preventDefault();
    setSaving(true);
    const file = e.target.elements.heroImage.files[0];
    let url = heroData.imageUrl;
    if (file) url = await handleImageUpload(file, `storefront/hero_${Date.now()}.webp`);
    
    await setDoc(doc(db, 'settings', 'storefront'), { ...heroData, imageUrl: url, updatedAt: new Date() });
    setSaving(false); alert("Banner updated!");
  };

  const saveAbout = async (e) => {
    e.preventDefault();
    setSaving(true);
    const file = e.target.elements.aboutImage.files[0];
    let url = aboutData.imageUrl;
    if (file) url = await handleImageUpload(file, `storefront/about_${Date.now()}.webp`);

    await setDoc(doc(db, 'settings', 'about'), { ...aboutData, imageUrl: url, updatedAt: new Date() });
    setSaving(false); alert("Story updated!");
  };

  const saveCollections = async () => {
    setSaving(true);
    // Note: Individual image uploads for collections would ideally be handled per item
    // For simplicity, we just save the text changes here. 
    // Real-world: Add file inputs for each collection item.
    await setDoc(doc(db, 'settings', 'collections'), { items: collections, updatedAt: new Date() });
    setSaving(false); alert("Collections updated!");
  };

  const handleCollectionImage = async (index, file) => {
    if (!file) return;
    setSaving(true); // Show loading state
    const url = await handleImageUpload(file, `storefront/col_${index}_${Date.now()}.webp`);
    
    const newCols = [...collections];
    newCols[index].img = url;
    setCollections(newCols);
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center text-gray-400">Loading CMS...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white border-b-2 border-[#B08D55] text-[#B08D55]' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- HERO EDITOR --- */}
        {activeTab === 'hero' && (
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <form onSubmit={saveHero} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Announcement Bar</label>
                 <div className="flex items-center gap-3">
                    <Megaphone size={18} className="text-[#B08D55]" />
                    <input 
                      value={heroData.announcement} 
                      onChange={e => setHeroData({...heroData, announcement: e.target.value})}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium p-0"
                      placeholder="Enter announcement text..."
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Main Title</label>
                    <textarea 
                      rows="2"
                      value={heroData.title} 
                      onChange={e => setHeroData({...heroData, title: e.target.value})}
                      className="w-full border border-gray-300 p-3 rounded-lg text-lg font-serif font-bold"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Subtitle</label>
                    <input 
                      value={heroData.subtitle} 
                      onChange={e => setHeroData({...heroData, subtitle: e.target.value})}
                      className="w-full border border-gray-300 p-3 rounded-lg text-sm"
                    />
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Hero Image</label>
                <div className="relative aspect-[21/9] bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 group">
                   <img src={heroData.imageUrl} className="w-full h-full object-cover opacity-80" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity cursor-pointer">
                      <ImageIcon className="text-white mb-2" />
                      <span className="text-white text-xs font-bold uppercase">Change Image</span>
                      <input type="file" name="heroImage" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                   </div>
                </div>
              </div>

              <button disabled={saving} className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Banner</>}
              </button>
            </form>
          </div>
        )}

        {/* --- COLLECTIONS EDITOR --- */}
        {activeTab === 'collections' && (
          <div className="lg:col-span-3">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {collections.map((col, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
                     <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-100 group">
                        <img src={col.img || "https://placehold.co/200"} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                           <UploadCloud className="text-white" />
                           <input 
                             type="file" 
                             accept="image/*" 
                             className="absolute inset-0 opacity-0 cursor-pointer"
                             onChange={(e) => handleCollectionImage(idx, e.target.files[0])}
                           />
                        </div>
                     </div>
                     <input 
                       value={col.name}
                       onChange={(e) => {
                         const newCols = [...collections];
                         newCols[idx].name = e.target.value;
                         setCollections(newCols);
                       }}
                       className="text-center font-bold text-gray-900 border-b border-transparent focus:border-[#B08D55] outline-none w-full pb-1"
                       placeholder="Category Name"
                     />
                  </div>
                ))}
             </div>
             <button onClick={saveCollections} disabled={saving} className="mt-8 bg-[#1A1A1A] text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 mx-auto">
               {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Collections</>}
             </button>
          </div>
        )}

        {/* --- ABOUT US EDITOR --- */}
        {activeTab === 'about' && (
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <form onSubmit={saveAbout} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Page Title</label>
                  <input 
                    value={aboutData.title}
                    onChange={e => setAboutData({...aboutData, title: e.target.value})}
                    className="w-full border border-gray-300 p-3 rounded-lg text-lg font-serif font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Our Story</label>
                  <textarea 
                    rows="8"
                    value={aboutData.content}
                    onChange={e => setAboutData({...aboutData, content: e.target.value})}
                    className="w-full border border-gray-300 p-3 rounded-lg text-sm leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Header Image</label>
                  <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 group">
                     <img src={aboutData.imageUrl} className="w-full h-full object-cover opacity-80" />
                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity cursor-pointer">
                        <ImageIcon className="text-white mb-2" />
                        <span className="text-white text-xs font-bold uppercase">Change Image</span>
                        <input type="file" name="aboutImage" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                     </div>
                  </div>
                </div>
                <button disabled={saving} className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Story</>}
                </button>
             </form>
          </div>
        )}

      </div>
    </div>
  );
};