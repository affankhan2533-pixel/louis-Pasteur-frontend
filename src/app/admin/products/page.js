"use client";

import React, { useState, useEffect } from 'react';
import { useAppState } from '@/components/StateContext';
import { Package, Save, Edit, Trash2, Plus, X, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function AdminProducts() {
  const { productsCatalog, refreshCatalog } = useAppState();
  
  // Local list to render
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'table' or 'cards'
  const [uploading, setUploading] = useState(false);
  
  // Form states
  const [editProduct, setEditProduct] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    category: 'Plain',
    price: 1099,
    description: '',
    imageName: '', // relative to /products/
    stock: 50,
    sizes: {
      S: { chest: 92, waist: 84, shoulder: 42, length: 70 },
      M: { chest: 98, waist: 90, shoulder: 44, length: 72 },
      L: { chest: 104, waist: 96, shoulder: 46, length: 74 },
      XL: { chest: 110, waist: 102, shoulder: 48, length: 76 }
    }
  });

  const handleImageUpload = async (e, isEdit) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setEditProduct(prev => ({
            ...prev,
            imageName: data.imageName,
            image: data.imageUrl,
            imageHover: data.imageUrl,
            imageUrls: [data.imageUrl, data.imageUrl]
          }));
        } else {
          setNewProduct(prev => ({
            ...prev,
            imageName: data.imageName,
            image: data.imageUrl,
            imageHover: data.imageUrl,
            imageUrls: [data.imageUrl, data.imageUrl]
          }));
        }
        alert("Image uploaded successfully: " + data.imageName);
      } else {
        alert("Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDirectCardUpload = async (e, prodId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        const productToUpdate = products.find(p => p.id === prodId);
        if (productToUpdate) {
          const updatedProduct = {
            ...productToUpdate,
            imageName: data.imageName,
            image: data.imageUrl,
            imageHover: data.imageUrl,
            imageUrls: [data.imageUrl, data.imageUrl]
          };
          const putRes = await fetch(`http://localhost:5000/api/products/${prodId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
          });
          if (putRes.ok) {
            refreshCatalog();
            alert("Product image updated successfully.");
          } else {
            alert("Image uploaded, but failed to save to product database.");
          }
        }
      } else {
        alert("Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };


  useEffect(() => {
    if (productsCatalog) {
      setProducts(productsCatalog);
    }
  }, [productsCatalog]);

  const handleStartEdit = (prod) => {
    setEditingId(prod.id);
    setEditProduct({ ...prod });
  };

  const handleEditChange = (field, val) => {
    setEditProduct(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'stock' ? Number(val) || 0 : val
    }));
  };

  const handleEditSizeChange = (size, field, val) => {
    setEditProduct(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: {
          ...prev.sizes[size],
          [field]: Number(val) || 0
        }
      }
    }));
  };

  const handleSaveEdit = async () => {
    if (!editProduct) return;
    
    // Set fallback image names if updated
    if (editProduct.imageName) {
      editProduct.image = `/products/${editProduct.imageName}`;
      editProduct.imageHover = `/products/${editProduct.imageName}`;
      editProduct.imageUrls = [editProduct.image, editProduct.image];
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProduct)
      });
      if (res.ok) {
        setEditingId(null);
        setEditProduct(null);
        refreshCatalog();
        alert('Product details updated successfully.');
      } else {
        alert('Failed to update product details.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating product: ' + err.message);
    }
  };

  const handleAddChange = (field, val) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'stock' ? Number(val) || 0 : val
    }));
  };

  const handleAddSizeChange = (size, field, val) => {
    setNewProduct(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: {
          ...prev.sizes[size],
          [field]: Number(val) || 0
        }
      }
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.id || !newProduct.name || !newProduct.price) {
      alert('Please fill in required fields (ID, Name, Price).');
      return;
    }

    // Set image paths
    const imageName = newProduct.imageName || 'product-1.png';
    const finalProduct = {
      ...newProduct,
      image: `/products/${imageName}`,
      imageHover: `/products/${imageName}`,
      imageUrls: [`/products/${imageName}`, `/products/${imageName}`],
      type: 'shirt'
    };

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProduct)
      });
      if (res.ok) {
        setIsAddOpen(false);
        setNewProduct({
          id: '',
          name: '',
          category: 'Plain',
          price: 1099,
          description: '',
          imageName: '',
          stock: 50,
          sizes: {
            S: { chest: 92, waist: 84, shoulder: 42, length: 70 },
            M: { chest: 98, waist: 90, shoulder: 44, length: 72 },
            L: { chest: 104, waist: 96, shoulder: 46, length: 74 },
            XL: { chest: 110, waist: 102, shoulder: 48, length: 76 }
          }
        });
        refreshCatalog();
        alert('Product created and saved to MongoDB successfully.');
      } else {
        alert('Failed to save product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product? This action is permanent.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        refreshCatalog();
        alert('Product successfully removed.');
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting product: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title & Add Trigger */}
      <div className="border-b border-luxury-border pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">GARMENT INVENTORY & SIZES</h2>
          <p className="text-[11px] text-gray-400 mt-1">Configure catalogs, manage stocks, and edit sizing guidelines in cm.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* View Toggler */}
          <div className="flex bg-[#FAF7EF] border border-[#D4AF37]/45 rounded-lg p-1 text-[10px] font-bold shadow-sm">
            <button 
              type="button"
              onClick={() => setViewMode('table')} 
              className={`px-3 py-1.5 rounded transition-all uppercase ${viewMode === 'table' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}
            >
              Table View
            </button>
            <button 
              type="button"
              onClick={() => setViewMode('cards')} 
              className={`px-3 py-1.5 rounded transition-all uppercase ${viewMode === 'cards' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}
            >
              Cards View
            </button>
          </div>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-black text-white text-[10px] tracking-wider font-bold py-2.5 px-4 rounded hover:bg-gray-800 transition-colors uppercase flex items-center gap-1.5 shadow-md"
          >
            <Plus size={12} /> Add Product
          </button>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-luxury-border w-full max-w-[650px] shadow-2xl overflow-hidden flex flex-col my-8" style={{ maxHeight: '90vh' }}>
            <div className="bg-primary text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-gold" />
                <span className="text-[11px] tracking-wider font-bold uppercase">CREATE NEW SHIRT</span>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-white/80 hover:text-white"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 flex-grow overflow-y-auto flex flex-col gap-5 text-[12px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px] tracking-wider">Product ID (Unique String)</label>
                  <input type="text" placeholder="shirt-61" required value={newProduct.id} onChange={(e) => handleAddChange('id', e.target.value)} className="border border-luxury-border p-2.5 rounded focus:outline-none focus:border-gold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px] tracking-wider">Garment Name</label>
                  <input type="text" placeholder="Atelier Linen Solid Shirt" required value={newProduct.name} onChange={(e) => handleAddChange('name', e.target.value)} className="border border-luxury-border p-2.5 rounded focus:outline-none focus:border-gold" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px] tracking-wider">Category</label>
                  <select value={newProduct.category} onChange={(e) => handleAddChange('category', e.target.value)} className="border border-luxury-border p-2.5 rounded focus:outline-none focus:border-gold">
                    {['Checks', 'Plain', 'Printed', 'Linen', 'Overshirt'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px] tracking-wider">Price (₹ INR)</label>
                  <input type="number" required value={newProduct.price} onChange={(e) => handleAddChange('price', e.target.value)} className="border border-luxury-border p-2.5 rounded focus:outline-none focus:border-gold" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px] tracking-wider">Stock Level</label>
                  <input type="number" value={newProduct.stock} onChange={(e) => handleAddChange('stock', e.target.value)} className="border border-luxury-border p-2.5 rounded focus:outline-none focus:border-gold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px] tracking-wider">Image Filename or URL</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" placeholder="product-1.png or http://..." value={newProduct.imageName} onChange={(e) => handleAddChange('imageName', e.target.value)} className="border border-luxury-border p-2.5 rounded focus:outline-none focus:border-gold flex-grow" />
                    <label className="bg-[#FAF7EF] hover:bg-[#FAF7EF]/85 text-black border border-[#D4AF37] text-[10px] tracking-wider font-bold py-2.5 px-3 rounded cursor-pointer transition-colors uppercase shrink-0 text-center">
                      {uploading ? 'Uploading...' : 'Choose File'}
                      <input type="file" accept="image/*" disabled={uploading} onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px] tracking-wider">Description</label>
                  <input type="text" placeholder="Crafted from premium fabric..." value={newProduct.description} onChange={(e) => handleAddChange('description', e.target.value)} className="border border-luxury-border p-2.5 rounded focus:outline-none focus:border-gold" />
                </div>
              </div>

              {/* Sizing inputs */}
              <div className="border-t border-luxury-border pt-4">
                <div className="flex items-center gap-1.5 text-gold mb-3">
                  <Sparkles size={12} />
                  <span className="text-[10px] tracking-widest font-bold uppercase">Sizing Matrix Calibration (cm)</span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-[10px]">
                  {['S', 'M', 'L', 'XL'].map(sz => (
                    <div key={sz} className="border border-luxury-border/60 p-3 rounded bg-luxury-gray flex flex-col gap-2">
                      <span className="font-bold text-primary uppercase text-center border-b pb-1.5">Size {sz}</span>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Chest</label>
                        <input type="number" value={newProduct.sizes[sz].chest} onChange={(e) => handleAddSizeChange(sz, 'chest', e.target.value)} className="p-1 border rounded w-full" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Waist</label>
                        <input type="number" value={newProduct.sizes[sz].waist} onChange={(e) => handleAddSizeChange(sz, 'waist', e.target.value)} className="p-1 border rounded w-full" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Shoulder</label>
                        <input type="number" value={newProduct.sizes[sz].shoulder} onChange={(e) => handleAddSizeChange(sz, 'shoulder', e.target.value)} className="p-1 border rounded w-full" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400">Length</label>
                        <input type="number" value={newProduct.sizes[sz].length} onChange={(e) => handleAddSizeChange(sz, 'length', e.target.value)} className="p-1 border rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-black text-white text-[11px] font-bold tracking-widest py-3.5 rounded hover:bg-gray-800 transition-colors uppercase shrink-0 mt-2">
                SUBMIT & SAVE TO DATABASE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Products Inventory List */}
      {viewMode === 'table' ? (
        <div className="flex flex-col gap-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-luxury-border text-left">
                <th className="py-3 text-[10px] text-gray-400 uppercase font-bold pr-4">Image</th>
                <th className="py-3 text-[10px] text-gray-400 uppercase font-bold">Product Name</th>
                <th className="py-3 text-[10px] text-gray-400 uppercase font-bold">Category</th>
                <th className="py-3 text-[10px] text-gray-400 uppercase font-bold">Price</th>
                <th className="py-3 text-[10px] text-gray-400 uppercase font-bold">Stock</th>
                <th className="py-3 text-[10px] text-gray-400 uppercase font-bold">Sizing (S / M / L / XL Chest)</th>
                <th className="py-3 text-[10px] text-gray-400 uppercase font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const isEditing = editingId === prod.id;
                const source = isEditing ? editProduct : prod;
                
                // Handle image falls
                const displayImg = source.imageUrls ? source.imageUrls[0] : (source.image || '/products/product-1.png');

                return (
                  <tr key={prod.id} className="border-b border-luxury-border/40 last:border-0 text-[12px] text-primary">
                     {/* Image Column */}
                    <td className="py-4 pr-4">
                      <div className="flex flex-col gap-1 items-center">
                        <div className="relative w-10 h-13 border rounded bg-luxury-gray overflow-hidden">
                          <Image src={displayImg} alt="preview" fill sizes="40px" className="object-cover" />
                        </div>
                        {isEditing && (
                          <div className="flex flex-col gap-1 items-center mt-1">
                            <input 
                              type="text" 
                              placeholder="Image name or URL"
                              value={source.imageName || source.image || ''} 
                              onChange={(e) => handleEditChange('imageName', e.target.value)} 
                              className="p-1 border rounded text-[9px] w-20 text-center" 
                            />
                            <label className="bg-[#FAF7EF] hover:bg-[#FAF7EF]/85 border border-[#D4AF37] text-[8px] font-black py-1 px-1.5 rounded cursor-pointer uppercase text-center w-20 tracking-wider">
                              {uploading ? '...' : 'Upload'}
                              <input type="file" accept="image/*" disabled={uploading} onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                            </label>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name Column */}
                    <td className="py-4">
                      {isEditing ? (
                        <input type="text" value={source.name} onChange={(e) => handleEditChange('name', e.target.value)} className="p-2 border rounded w-48 font-bold" />
                      ) : (
                        <span className="font-bold">{prod.name}</span>
                      )}
                    </td>

                    {/* Category Column */}
                    <td className="py-4 uppercase text-gray-400">
                      {isEditing ? (
                        <select value={source.category} onChange={(e) => handleEditChange('category', e.target.value)} className="p-1.5 border rounded focus:outline-none">
                          {['Checks', 'Plain', 'Printed', 'Linen', 'Overshirt'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      ) : (
                        <span>{prod.category}</span>
                      )}
                    </td>

                    {/* Price Column */}
                    <td className="py-4 font-semibold">
                      {isEditing ? (
                        <input type="number" value={source.price} onChange={(e) => handleEditChange('price', e.target.value)} className="p-1.5 border rounded w-20" />
                      ) : (
                        <span>₹{prod.price.toLocaleString('en-IN')}</span>
                      )}
                    </td>

                    {/* Stock Column */}
                    <td className="py-4">
                      {isEditing ? (
                        <input type="number" value={source.stock} onChange={(e) => handleEditChange('stock', e.target.value)} className="p-1.5 border rounded w-16" />
                      ) : (
                        <span className={`font-bold ${prod.stock < 10 ? 'text-red-500' : 'text-primary'}`}>{prod.stock}</span>
                      )}
                    </td>

                    {/* Sizing matrix preview/edit */}
                    <td className="py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          {['S', 'M', 'L', 'XL'].map(sz => (
                            <div key={sz} className="flex flex-col gap-1 border p-1.5 rounded bg-luxury-gray text-[9px] w-14">
                              <span className="font-bold text-center border-b mb-1 uppercase">Size {sz}</span>
                              <input type="number" value={source.sizes[sz].chest} onChange={(e) => handleEditSizeChange(sz, 'chest', e.target.value)} className="p-0.5 border rounded text-center w-full" placeholder="Chest" />
                              <input type="number" value={source.sizes[sz].waist} onChange={(e) => handleEditSizeChange(sz, 'waist', e.target.value)} className="p-0.5 border rounded text-center w-full" placeholder="Waist" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-3 text-[10px] text-gray-500">
                          <span>S: <strong className="text-primary">{prod.sizes?.S?.chest || '-'}cm</strong></span>
                          <span>M: <strong className="text-primary">{prod.sizes?.M?.chest || '-'}cm</strong></span>
                          <span>L: <strong className="text-primary">{prod.sizes?.L?.chest || '-'}cm</strong></span>
                          <span>XL: <strong className="text-primary">{prod.sizes?.XL?.chest || '-'}cm</strong></span>
                        </div>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button 
                              onClick={handleSaveEdit}
                              className="text-[9px] tracking-wider font-bold bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded uppercase flex items-center gap-1 shadow-sm"
                            >
                              <Save size={10} /> Save
                            </button>
                            <button 
                              onClick={() => { setEditingId(null); setEditProduct(null); }}
                              className="text-[9px] tracking-wider font-bold bg-gray-500 hover:bg-gray-600 text-white px-2.5 py-1.5 rounded uppercase flex items-center gap-1 shadow-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleStartEdit(prod)}
                              className="text-[9px] tracking-wider font-semibold border border-luxury-border hover:bg-luxury-gray px-2.5 py-1.5 rounded uppercase flex items-center gap-1"
                            >
                              <Edit size={10} /> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(prod.id)}
                              className="text-[9px] tracking-wider font-semibold border border-red-200 text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded uppercase flex items-center gap-1"
                            >
                              <Trash2 size={10} /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* beautiful Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((prod) => {
            const isEditing = editingId === prod.id;
            const source = isEditing ? editProduct : prod;
            const displayImg = source.imageUrls ? source.imageUrls[0] : (source.image || '/products/product-1.png');

            return (
              <div key={prod.id} className="border border-luxury-border/60 bg-white rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all duration-300">
                {/* Image & Direct Upload overlay */}
                <div className="relative aspect-[4/5] bg-luxury-gray w-full flex items-center justify-center border-b border-luxury-border/40 overflow-hidden">
                  <Image src={displayImg} alt="preview" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Upload overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 gap-2">
                    <label className="bg-white hover:bg-neutral-100 text-black text-[9px] font-black tracking-widest py-2 px-3 rounded shadow cursor-pointer uppercase transition-colors">
                      {uploading ? '...' : 'Upload Image'}
                      <input type="file" accept="image/*" disabled={uploading} onChange={(e) => handleDirectCardUpload(e, prod.id)} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex flex-col gap-3 flex-grow justify-between">
                  <div className="flex flex-col gap-1.5">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={source.name} 
                        onChange={(e) => handleEditChange('name', e.target.value)} 
                        className="p-1 border rounded w-full font-bold text-xs mb-1.5 focus:outline-none" 
                      />
                    ) : (
                      <h4 className="font-bold text-[12px] text-primary tracking-wide leading-tight uppercase truncate" title={prod.name}>
                        {prod.name}
                      </h4>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-[8.5px] font-black tracking-widest text-[#D4AF37] uppercase">{prod.category}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">ID: {prod.id}</span>
                    </div>
                  </div>

                  {/* Pricing and Stock fields */}
                  <div className="grid grid-cols-2 gap-3 border-t border-b border-luxury-border/30 py-2">
                    <div>
                      <span className="block text-[8px] text-gray-400 font-bold uppercase mb-0.5">Price</span>
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={source.price} 
                          onChange={(e) => handleEditChange('price', e.target.value)} 
                          className="p-1 border rounded w-full text-xs" 
                        />
                      ) : (
                        <span className="font-extrabold text-[12px] text-primary">₹{prod.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <div>
                      <span className="block text-[8px] text-gray-400 font-bold uppercase mb-0.5">Stock</span>
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={source.stock} 
                          onChange={(e) => handleEditChange('stock', e.target.value)} 
                          className="p-1 border rounded w-full text-xs" 
                        />
                      ) : (
                        <span className={`font-black text-[12px] ${prod.stock < 10 ? 'text-red-500' : 'text-primary'}`}>{prod.stock} Items</span>
                      )}
                    </div>
                  </div>

                  {/* Sizing chest list */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-[#D4AF37] font-black tracking-wider uppercase mb-0.5">Chest Calibration</span>
                    {isEditing ? (
                      <div className="grid grid-cols-4 gap-1">
                        {['S', 'M', 'L', 'XL'].map(sz => (
                          <div key={sz} className="flex flex-col items-center border border-luxury-border/50 rounded bg-luxury-gray p-0.5 text-[8px]">
                            <span className="font-bold uppercase text-gray-400">{sz}</span>
                            <input 
                              type="number" 
                              value={source.sizes?.[sz]?.chest || 90} 
                              onChange={(e) => handleEditSizeChange(sz, 'chest', e.target.value)} 
                              className="w-full text-center border p-0.5 mt-0.5 rounded text-[8px]" 
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-between text-[9px] text-gray-500 border border-luxury-border/30 rounded p-1.5 bg-luxury-gray/45">
                        <span>S: <strong className="text-primary font-bold">{prod.sizes?.S?.chest || '-'}cm</strong></span>
                        <span>M: <strong className="text-primary font-bold">{prod.sizes?.M?.chest || '-'}cm</strong></span>
                        <span>L: <strong className="text-primary font-bold">{prod.sizes?.L?.chest || '-'}cm</strong></span>
                        <span>XL: <strong className="text-primary font-bold">{prod.sizes?.XL?.chest || '-'}cm</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={handleSaveEdit}
                          className="flex-1 text-[9px] tracking-wider font-bold bg-green-600 hover:bg-green-700 text-white py-2 rounded uppercase flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Save size={10} /> Save
                        </button>
                        <button 
                          onClick={() => { setEditingId(null); setEditProduct(null); }}
                          className="flex-1 text-[9px] tracking-wider font-bold bg-gray-500 hover:bg-gray-600 text-white py-2 rounded uppercase flex items-center justify-center gap-1 shadow-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleStartEdit(prod)}
                          className="flex-1 text-[9px] tracking-wider font-bold border border-luxury-border hover:bg-luxury-gray py-2 rounded uppercase flex items-center justify-center gap-1 transition-colors"
                        >
                          <Edit size={10} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(prod.id)}
                          className="flex-1 text-[9px] tracking-wider font-bold border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded uppercase flex items-center justify-center gap-1 transition-colors"
                        >
                          <Trash2 size={10} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-4 bg-luxury-gray border border-luxury-border rounded text-[11px] text-gray-500 leading-normal">
        <strong>* Admin Inventory Operations:</strong> Add new shirts to the MongoDB catalog, edit stocks, adjust chest dimensions, or delete items. Changes propagate immediately across the storefront collections drawer and listing grids.
      </div>
    </div>
  );
}
