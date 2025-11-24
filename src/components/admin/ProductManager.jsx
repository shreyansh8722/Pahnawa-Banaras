import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { 
  collection, addDoc, deleteDoc, doc, updateDoc, 
  serverTimestamp, onSnapshot, query, orderBy 
} from 'firebase/firestore';
import { 
  ref, uploadBytes, getDownloadURL 
} from 'firebase/storage';
import { 
  Trash2, Plus, Image as ImageIcon, Loader2, X, 
  Edit2, Save, Search
} from 'lucide-react';
import { compressImage } from '@/lib/utils'; 

export const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Editing State
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialState = {
    name: '',
    price: '',
    comparePrice: '',
    category: 'Saree',
    description: '',
    images: [],      
    existingImages: [] 
  };

  const [formData, setFormData] = useState(initialState);

  // 1. Real-Time Sync
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(list);
      setFilteredProducts(list);
      setLoading(false);
    }, (error) => {
      console.error("DB Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Search Filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredProducts(products.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        (p.subCategory && p.subCategory.toLowerCase().includes(lower))
      ));
    }
  }, [searchQuery, products]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    if (e.target.files) {
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...Array.from(e.target.files)] 
      }));
    }
  };

  const removeNewImage = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  const removeExistingImage = (urlToRemove) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(url => url !== urlToRemove)
    }));
  };

  const startEdit = (product) => {
    setEditMode(true);
    setEditId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice || '',
      category: product.subCategory || product.category,
      description: product.fullDescription || '',
      images: [],
      existingImages: product.imageUrls || [product.featuredImageUrl]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setFormData(initialState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0 && formData.existingImages.length === 0) {
      return alert("Product must have at least one image.");
    }

    setProcessing(true);
    try {
      let newImageUrls = [];
      for (const file of formData.images) {
        const compressedFile = await compressImage(file); 
        const imageRef = ref(storage, `products/${Date.now()}_${compressedFile.name}`);
        await uploadBytes(imageRef, compressedFile);
        const url = await getDownloadURL(imageRef);
        newImageUrls.push(url);
      }

      const finalImages = [...formData.existingImages, ...newImageUrls];

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        comparePrice: parseFloat(formData.comparePrice) || 0,
        category: 'artifact', 
        subCategory: formData.category,
        tags_lowercase: [formData.category.toLowerCase(), formData.name.toLowerCase()],
        material: 'Pure Silk',
        featuredImageUrl: finalImages[0], 
        imageUrls: finalImages,
        fullDescription: formData.description,
        updatedAt: serverTimestamp()
      };

      if (editMode) {
        await updateDoc(doc(db, 'products', editId), productData);
        alert("Product Updated Successfully!");
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
        alert("Product Added Successfully!");
      }

      cancelEdit();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans text-gray-800 pb-20">
      
      {/* --- LEFT: FORM SECTION --- */}
      {/* CHANGED: 'sticky top-24' is only for large screens (lg:) */}
      <div className="lg:col-span-1 order-1">
        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 lg:sticky lg:top-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-xl text-[#1A1A1A]">
              {editMode ? 'Edit Product' : 'Add New Item'}
            </h3>
            {editMode && (
              <button onClick={cancelEdit} className="text-xs text-red-500 hover:underline">Cancel</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Product Name</label>
              <input required name="name" className="w-full border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-[#B08D55]" value={formData.name} onChange={handleChange} placeholder="e.g. Royal Red Banarasi" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Price (₹)</label>
                  <input required name="price" type="number" className="w-full border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-[#B08D55]" value={formData.price} onChange={handleChange} placeholder="12000" />
              </div>
              <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">MRP (Optional)</label>
                  <input name="comparePrice" type="number" className="w-full border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-[#B08D55]" value={formData.comparePrice} onChange={handleChange} placeholder="18000" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Category</label>
              <select name="category" className="w-full border border-gray-300 p-2 text-sm rounded-sm bg-white outline-none focus:border-[#B08D55]" value={formData.category} onChange={handleChange}>
                  <option value="Saree">Saree</option>
                  <option value="Lehenga">Lehenga</option>
                  <option value="Suit">Suit</option>
                  <option value="Dupatta">Dupatta</option>
                  <option value="Fabric">Fabric</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Description</label>
              <textarea name="description" className="w-full border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-[#B08D55]" rows="3" value={formData.description} onChange={handleChange} placeholder="Weave details, fabric quality..." />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Images</label>
              {formData.existingImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {formData.existingImages.map((url, idx) => (
                    <div key={`exist-${idx}`} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden group border border-blue-200">
                      <img src={url} className="w-full h-full object-cover" alt="existing" />
                      <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-sm cursor-pointer hover:bg-gray-50 relative mb-2">
                  <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageSelect} />
                  <div className="text-gray-400 flex flex-col items-center gap-1">
                      <ImageIcon size={20} />
                      <span className="text-xs font-bold">Add Images</span>
                  </div>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden group border border-green-200">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="new" />
                      <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button disabled={processing} className={`w-full text-white py-3 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-colors flex justify-center items-center gap-2 shadow-md ${editMode ? 'bg-blue-600' : 'bg-[#B08D55]'}`}>
              {processing ? <Loader2 className="animate-spin" /> : editMode ? <><Save size={16} /> Update Product</> : <><Plus size={16} /> Add Product</>}
            </button>
          </form>
        </div>
      </div>

      {/* --- RIGHT: INVENTORY LIST --- */}
      <div className="lg:col-span-2 order-2">
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search inventory..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#B08D55]"
                    />
                </div>
            </div>
            
            <div className="max-h-[80vh] overflow-y-auto">
                {loading ? (
                    <div className="p-10 text-center text-gray-400 flex flex-col items-center"><Loader2 className="animate-spin mb-2" /> Syncing...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">No products found.</div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider sticky top-0 z-10">
                            <tr>
                                <th className="p-3">Item</th>
                                <th className="p-3 hidden md:table-cell">Category</th>
                                <th className="p-3">Price</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(p => (
                                <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${editId === p.id ? 'bg-blue-50' : ''}`}>
                                    <td className="p-3 flex items-center gap-3">
                                        <img src={p.featuredImageUrl} className="w-12 h-16 object-cover rounded-sm border border-gray-200 bg-gray-100" alt="" />
                                        <div>
                                            <p className="font-medium text-[#1A1A1A] line-clamp-1">{p.name}</p>
                                            <p className="text-[10px] text-gray-400 md:hidden">{p.subCategory}</p>
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-600 hidden md:table-cell">{p.subCategory}</td>
                                    <td className="p-3 text-brand-dark font-medium">₹{p.price}</td>
                                    <td className="p-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => startEdit(p)} className="text-blue-500 hover:bg-blue-100 p-2 rounded-sm transition-colors" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-sm transition-colors" title="Delete">
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
      </div>
    </div>
  );
};