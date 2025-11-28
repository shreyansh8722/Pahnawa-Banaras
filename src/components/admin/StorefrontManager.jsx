import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon, ArrowUp, ArrowDown, Edit2, Check } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const StorefrontManager = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // New Slide Form State
  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '/shop',
    buttonText: 'Shop Now',
    order: 0
  });

  // Fetch Slides Realtime
  useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlides(data);
      setLoading(false);
      // Set next order index
      if(data.length > 0) {
        setNewSlide(prev => ({ ...prev, order: data.length }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!newSlide.image || !newSlide.title) {
      toast.error("Image URL and Title are required");
      return;
    }
    
    try {
      await addDoc(collection(db, 'hero_slides'), newSlide);
      toast.success("Slide Added Successfully");
      setIsAdding(false);
      setNewSlide({ title: '', subtitle: '', image: '', link: '/shop', buttonText: 'Shop Now', order: slides.length + 1 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add slide");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this slide?")) return;
    try {
      await deleteDoc(doc(db, 'hero_slides', id));
      toast.success("Slide Deleted");
    } catch (error) {
      toast.error("Error deleting slide");
    }
  };

  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const currentSlide = slides[index];
    const swapSlide = direction === 'up' ? slides[index - 1] : slides[index + 1];

    // Swap orders in DB
    try {
        await updateDoc(doc(db, 'hero_slides', currentSlide.id), { order: swapSlide.order });
        await updateDoc(doc(db, 'hero_slides', swapSlide.id), { order: currentSlide.order });
        toast.success("Reordered!");
    } catch (err) {
        toast.error("Failed to reorder");
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-gray-900">Hero Slider Manager</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#B08D55] text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#8c6a40]"
        >
          {isAdding ? <><span className="text-xl">×</span> Cancel</> : <><Plus size={16} /> Add Slide</>}
        </button>
      </div>

      {/* --- ADD NEW SLIDE FORM --- */}
      {isAdding && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4">Add New Slide</h3>
          <form onSubmit={handleAddSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://... or /assets/hero1.webp (if public)"
                  className="w-full border p-2 rounded-sm"
                  value={newSlide.image}
                  onChange={e => setNewSlide({...newSlide, image: e.target.value})}
                />
                <p className="text-[10px] text-gray-400">For local images, use: /assets/hero1.webp if moved to public folder, otherwise use external URL.</p>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Main Title</label>
                <input 
                  type="text" 
                  placeholder="E.g. Elegance Woven in Gold"
                  className="w-full border p-2 rounded-sm"
                  value={newSlide.title}
                  onChange={e => setNewSlide({...newSlide, title: e.target.value})}
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Subtitle</label>
                <input 
                  type="text" 
                  placeholder="E.g. Heritage Collection 2025"
                  className="w-full border p-2 rounded-sm"
                  value={newSlide.subtitle}
                  onChange={e => setNewSlide({...newSlide, subtitle: e.target.value})}
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Button Text</label>
                <input 
                  type="text" 
                  placeholder="E.g. Shop Now"
                  className="w-full border p-2 rounded-sm"
                  value={newSlide.buttonText}
                  onChange={e => setNewSlide({...newSlide, buttonText: e.target.value})}
                />
            </div>

            <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">Link URL</label>
                <input 
                  type="text" 
                  placeholder="E.g. /shop?cat=saree"
                  className="w-full border p-2 rounded-sm"
                  value={newSlide.link}
                  onChange={e => setNewSlide({...newSlide, link: e.target.value})}
                />
            </div>

            <div className="md:col-span-2 pt-2">
               <button type="submit" className="bg-black text-white px-6 py-2 rounded-sm font-bold uppercase text-xs w-full hover:bg-gray-800">
                  Save Slide
               </button>
            </div>
          </form>
        </div>
      )}

      {/* --- SLIDES LIST --- */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">Loading slides...</div>
        ) : slides.length === 0 ? (
            <div className="p-8 text-center">
                <ImageIcon className="mx-auto text-gray-300 mb-2" size={48} />
                <p className="text-gray-500">No custom slides active. Showing default local slides on homepage.</p>
            </div>
        ) : (
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                    <tr>
                        <th className="p-4">Image</th>
                        <th className="p-4">Content</th>
                        <th className="p-4">Link</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {slides.map((slide, index) => (
                        <tr key={slide.id} className="group hover:bg-gray-50/50">
                            <td className="p-4 w-32">
                                <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden">
                                    <img src={slide.image} alt="Slide" className="w-full h-full object-cover" />
                                </div>
                            </td>
                            <td className="p-4">
                                <p className="font-serif font-bold text-gray-900">{slide.title}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">{slide.subtitle}</p>
                            </td>
                            <td className="p-4 text-sm text-blue-600 truncate max-w-[150px]">
                                {slide.link}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => handleMove(index, 'up')} 
                                      disabled={index === 0}
                                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleMove(index, 'down')} 
                                      disabled={index === slides.length - 1}
                                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(slide.id)} 
                                      className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-sm ml-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
};