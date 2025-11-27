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
  Edit2, Save, Search, AlertCircle 
} from 'lucide-react';
import { compressImage } from '@/lib/utils'; 

export const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialState = {
    name: '',
    price: '',
    comparePrice: '',
    category: 'Saree',
    description: '',
    stock: '', // Added Stock Field
    images: [],      
    existingImages: [] 
  };

  const [formData, setFormData] = useState(initialState);

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
      stock: product.stock || 0, // Load existing stock
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
        stock: parseInt(formData.stock) || 0, // Save Stock
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
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
      }

      cancelEdit();
      alert(editMode ? "Product Updated!" : "Product Added!");
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
      <div className="lg:col-span-1 order-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900">
              {editMode ? 'Edit Product' : 'Add New Item'}
            </h3>
            {editMode && (
              <button onClick={cancelEdit} className="text-xs text-red-500 font-bold hover:underline bg-red-50 px-2 py-1 rounded">Cancel</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Product Name</label>
              <input required name="name" className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" value={formData.name} onChange={handleChange} placeholder="e.g. Royal Red Banarasi" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Price (₹)</label>
                  <input required name="price" type="number" className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:border-black outline-none" value={formData.price} onChange={handleChange} placeholder="12000" />
              </div>
              <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">MRP</label>
                  <input name="comparePrice" type="number" className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:border-black outline-none" value={formData.comparePrice} onChange={handleChange} placeholder="18000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Category</label>
                <select name="category" className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white focus:border-black outline-none" value={formData.category} onChange={handleChange}>
                    <option value="Saree">Saree</option>
                    <option value="Lehenga">Lehenga</option>
                    <option value="Suit">Suit</option>
                    <option value="Dupatta">Dupatta</option>
                    <option value="Fabric">Fabric</option>
                </select>
              </div>
              <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Stock Qty</label>
                  <input required name="stock" type="number" className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:border-black outline-none" value={formData.stock} onChange={handleChange} placeholder="5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Description</label>
              <textarea name="description" className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:border-black outline-none" rows="3" value={formData.description} onChange={handleChange} placeholder="Weave details, fabric quality..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Images</label>
              
              <div className="grid grid-cols-4 gap-2 mb-3">
                {formData.existingImages.map((url, idx) => (
                  <div key={`exist-${idx}`} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                    <img src={url} className="w-full h-full object-cover" alt="existing" />
                    <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {formData.images.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-green-400">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-80" alt="new" />
                    <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                    <ImageIcon size={20} className="text-gray-400 mb-1" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Add</span>
                </label>
              </div>
            </div>

            <button disabled={processing} className={`w-full text-white py-3.5 rounded-lg text-sm font-bold uppercase tracking-widest hover:shadow-lg transition-all flex justify-center items-center gap-2 ${editMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#1A1A1A] hover:bg-black'}`}>
              {processing ? <Loader2 className="animate-spin" size={18} /> : editMode ? <><Save size={18} /> Update Product</> : <><Plus size={18} /> Add Product</>}
            </button>
          </form>
        </div>
      </div>

      {/* --- RIGHT: INVENTORY LIST --- */}
      <div className="lg:col-span-2 order-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex gap-4 items-center">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
                    />
                </div>
                <div className="text-xs font-medium text-gray-500 ml-auto hidden sm:block">
                   {filteredProducts.length} Items
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-20 text-center text-gray-400 flex flex-col items-center"><Loader2 className="animate-spin mb-2" /> Loading Inventory...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">No products found.</div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider sticky top-0 z-10">
                            <tr>
                                <th className="p-4 pl-6">Product</th>
                                <th className="p-4 hidden sm:table-cell">Category</th>
                                <th className="p-4 text-center">Stock</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(p => (
                                <tr key={p.id} className={`hover:bg-gray-50 transition-colors group ${editId === p.id ? 'bg-blue-50/50' : ''}`}>
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <img src={p.featuredImageUrl} className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-gray-100" alt="" />
                                            <div>
                                                <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                                                <p className="text-xs text-gray-400 sm:hidden">{p.subCategory}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600 hidden sm:table-cell">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{p.subCategory}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`font-bold text-xs px-2 py-1 rounded ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                           {p.stock || 0}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-900 font-medium">₹{p.price}</td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(p)} className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete">
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