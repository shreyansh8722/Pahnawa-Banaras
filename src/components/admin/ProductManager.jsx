import React, { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { 
  collection, addDoc, deleteDoc, doc, updateDoc, 
  serverTimestamp, onSnapshot, query, orderBy 
} from 'firebase/firestore';
import { 
  ref, uploadBytes, getDownloadURL 
} from 'firebase/storage';
import { 
  Trash2, Plus, Image as ImageIcon, Loader2, X, 
  Edit2, Save, Search, ChevronRight, UploadCloud 
} from 'lucide-react';
import { compressImage } from '@/lib/utils'; 
import { motion, AnimatePresence } from 'framer-motion';

export const ProductManager = ({ notify }) => { // Receives notify prop
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialState = {
    name: '',
    price: '',
    comparePrice: '',
    category: 'Saree',
    description: '',
    stock: '',
    images: [],      
    existingImages: [] 
  };

  const [formData, setFormData] = useState(initialState);

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(list);
      setFilteredProducts(list);
      setLoading(false);
    }, (error) => {
      console.error(error);
      notify("Failed to load products", "error");
    });
    return () => unsubscribe();
  }, []);

  // Filter
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

  const handleImageSelect = (e) => {
    if (e.target.files) {
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...Array.from(e.target.files)] 
      }));
    }
  };

  const openDrawer = (product = null) => {
    if (product) {
      setEditMode(true);
      setEditId(product.id);
      setFormData({
        name: product.name,
        price: product.price,
        comparePrice: product.comparePrice || '',
        category: product.subCategory || product.category,
        description: product.fullDescription || '',
        stock: product.stock || 0,
        images: [],
        existingImages: product.imageUrls || [product.featuredImageUrl]
      });
    } else {
      setEditMode(false);
      setEditId(null);
      setFormData(initialState);
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0 && formData.existingImages.length === 0) {
      return notify("Please upload at least one image.", "error");
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
        stock: parseInt(formData.stock) || 0,
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
        notify("Product updated successfully!");
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
        notify("New product added!");
      }
      closeDrawer();
    } catch (error) {
      console.error(error);
      notify("Error saving product: " + error.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        notify("Product deleted.");
      } catch (err) {
        notify("Delete failed", "error");
      }
    }
  };

  return (
    <div className="relative h-full">
      {/* --- Main Content: Full Width Table --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-10">
           
           <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name or category..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B08D55] focus:ring-1 focus:ring-[#B08D55] transition-all bg-gray-50 focus:bg-white"
                />
           </div>

           <button 
             onClick={() => openDrawer()} 
             className="w-full sm:w-auto bg-[#1A1A1A] text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
           >
             <Plus size={18} /> Add Product
           </button>
        </div>
        
        <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-4 pl-6">Product Details</th>
                        <th className="p-4 hidden md:table-cell">Category</th>
                        <th className="p-4 text-center">Stock</th>
                        <th className="p-4">Price</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                       <tr><td colSpan="5" className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-gray-400"/></td></tr>
                    ) : filteredProducts.length === 0 ? (
                       <tr><td colSpan="5" className="p-10 text-center text-gray-400">No products found.</td></tr>
                    ) : (
                        filteredProducts.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                            <img src={p.featuredImageUrl} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                                            <p className="text-xs text-gray-400 sm:hidden">{p.subCategory}</p>
                                            {p.comparePrice > p.price && (
                                              <span className="text-[10px] text-green-600 font-medium">{Math.round(((p.comparePrice-p.price)/p.comparePrice)*100)}% OFF</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 hidden md:table-cell">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{p.subCategory}</span>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                       {p.stock}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-900 font-medium">₹{p.price.toLocaleString()}</td>
                                <td className="p-4 pr-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openDrawer(p)} className="text-gray-500 hover:text-[#B08D55] p-2 hover:bg-[#B08D55]/10 rounded-lg transition-colors" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- Slide-Over Drawer (Form) --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={closeDrawer}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-lg bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-serif text-xl text-gray-900 font-bold">
                  {editMode ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={closeDrawer} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Form */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Image Upload Section */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Product Images</label>
                    <div className="grid grid-cols-4 gap-3">
                        {formData.existingImages.map((url, idx) => (
                          <div key={`ex-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                            <img src={url} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setFormData(p => ({ ...p, existingImages: p.existingImages.filter(u => u !== url) }))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        {formData.images.map((file, idx) => (
                          <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-green-400 group">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-80" />
                            <button type="button" onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#B08D55] hover:bg-[#B08D55]/5 transition-all group">
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                            <UploadCloud className="text-gray-400 group-hover:text-[#B08D55] mb-1" size={20} />
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Upload</span>
                        </label>
                    </div>
                  </div>

                  {/* Basic Details */}
                  <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Product Name</label>
                        <input required name="name" className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-[#B08D55] outline-none bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Royal Red Banarasi" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹)</label>
                            <input required name="price" type="number" className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-[#B08D55] outline-none bg-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">MRP (Optional)</label>
                            <input name="comparePrice" type="number" className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-[#B08D55] outline-none bg-white" value={formData.comparePrice} onChange={e => setFormData({...formData, comparePrice: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                        <div className="relative">
                            <select name="category" className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm appearance-none bg-white focus:border-[#B08D55] outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option value="Saree">Saree</option>
                                <option value="Lehenga">Lehenga</option>
                                <option value="Suit">Suit</option>
                                <option value="Dupatta">Dupatta</option>
                                <option value="Fabric">Fabric</option>
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={14} />
                        </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Stock Quantity</label>
                          <input required name="stock" type="number" className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-[#B08D55] outline-none bg-white" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                      <textarea name="description" className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-[#B08D55] outline-none bg-white min-h-[120px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed description of the weave, fabric, and care instructions..." />
                    </div>
                  </div>
                </form>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100 bg-white">
                <button form="product-form" disabled={processing} className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-black transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-70">
                    {processing ? <Loader2 className="animate-spin" size={18} /> : <>{editMode ? <Save size={18} /> : <Plus size={18} />} {editMode ? 'Update Product' : 'Create Product'}</>}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};