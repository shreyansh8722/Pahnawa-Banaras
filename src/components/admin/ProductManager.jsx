import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Trash2, Plus, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { compressImage } from '@/lib/utils'; 

export const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    comparePrice: '',
    category: 'Saree',
    description: '',
    images: [] 
  });

  // --- SEAMLESS CONNECTION (Real-Time Listener) ---
  useEffect(() => {
    setLoading(true);
    // This 'onSnapshot' creates a live open pipe to your database.
    // Whenever the database changes (even from the console!), this code runs instantly.
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(list);
      setLoading(false);
    }, (error) => {
      console.error("Database Connection Error:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Close connection when leaving page
  }, []);

  // Image Helper
  const handleImageSelect = (e) => {
    if (e.target.files) {
      setNewProduct(prev => ({ ...prev, images: [...prev.images, ...Array.from(e.target.files)] }));
    }
  };

  const removeImage = (index) => {
    setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (newProduct.images.length === 0) return alert("Please upload at least one image.");

    setUploading(true);
    try {
      const imageUrls = [];
      
      // 1. Compress & Upload Images
      for (const file of newProduct.images) {
        const compressedFile = await compressImage(file); 
        const imageRef = ref(storage, `products/${Date.now()}_${compressedFile.name}`);
        await uploadBytes(imageRef, compressedFile);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      // 2. Create Database Entry (Fields are created automatically here!)
      await addDoc(collection(db, 'products'), {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        comparePrice: parseFloat(newProduct.comparePrice) || 0,
        category: 'artifact', 
        subCategory: newProduct.category,
        tags_lowercase: [newProduct.category.toLowerCase(), newProduct.name.toLowerCase()],
        material: 'Pure Silk',
        featuredImageUrl: imageUrls[0],
        imageUrls: imageUrls,
        fullDescription: newProduct.description,
        createdAt: serverTimestamp()
      });

      alert("Added to Inventory!");
      setNewProduct({ name: '', price: '', comparePrice: '', category: 'Saree', description: '', images: [] });
      
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans text-gray-800">
      
      {/* --- FORM --- */}
      <div className="lg:col-span-1 bg-white p-6 rounded-sm shadow-md border border-gray-200 h-fit">
        <h3 className="font-serif text-xl mb-4 text-[#1A1A1A]">Add New Item</h3>
        <form onSubmit={handleAddProduct} className="space-y-4">
          
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Name</label>
            <input required className="w-full border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-[#B08D55]" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Royal Red Banarasi" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Price (₹)</label>
                <input required type="number" className="w-full border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-[#B08D55]" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="12000" />
            </div>
            <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">MRP</label>
                <input type="number" className="w-full border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-[#B08D55]" value={newProduct.comparePrice} onChange={e => setNewProduct({...newProduct, comparePrice: e.target.value})} placeholder="18000" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Category</label>
            <select className="w-full border border-gray-300 p-2 text-sm rounded-sm bg-white outline-none focus:border-[#B08D55]" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                <option value="Saree">Saree</option>
                <option value="Lehenga">Lehenga</option>
                <option value="Suit">Suit</option>
                <option value="Dupatta">Dupatta</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Details</label>
            <textarea className="w-full border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-[#B08D55]" rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Fabric, weave details..." />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Photos (First is Cover)</label>
            <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-sm cursor-pointer hover:bg-gray-50 relative">
                <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageSelect} />
                <div className="text-gray-400 flex flex-col items-center gap-1">
                    <ImageIcon size={20} />
                    <span className="text-xs font-bold">Upload Images</span>
                </div>
            </div>
            {newProduct.images.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {newProduct.images.map((file, idx) => (
                  <div key={idx} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button disabled={uploading} className="w-full bg-[#B08D55] text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#8C6A48] transition-colors flex justify-center items-center gap-2 shadow-md">
            {uploading ? <Loader2 className="animate-spin" /> : <><Plus size={16} /> Add to Database</>}
          </button>
        </form>
      </div>

      {/* --- INVENTORY LIST --- */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-serif text-lg text-[#1A1A1A]">Live Inventory ({products.length})</h3>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                    <div className="p-10 text-center text-gray-400 flex flex-col items-center"><Loader2 className="animate-spin mb-2" /> Syncing...</div>
                ) : products.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">Database is empty. Add a product to start.</div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-3">Image</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Price</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3">
                                        <img src={p.featuredImageUrl} className="w-12 h-16 object-cover rounded-sm border border-gray-200" alt="" />
                                    </td>
                                    <td className="p-3 font-medium text-[#1A1A1A]">{p.name}</td>
                                    <td className="p-3 text-gray-600">₹{p.price}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-sm transition-colors">
                                            <Trash2 size={16} />
                                        </button>
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