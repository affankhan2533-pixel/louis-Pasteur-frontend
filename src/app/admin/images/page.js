"use client";

import React, { useState } from 'react';
import { useAppState } from '@/components/StateContext';
import { Smartphone, Image as ImageIcon, Save, ArrowUp, ArrowDown, Upload, RefreshCw, Layers, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminImages() {
  const { 
    heroImages, setHeroImages,
    lookbookImages, setLookbookImages,
    categoryBanners, setCategoryBanners,
    campaignBanners, setCampaignBanners,
    moodImages, setMoodImages,
    stealImages, setStealImages,
    sectionsOrder, setSectionsOrder,
    productsCatalog, setProductsCatalog
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState('hero');
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Bulk Upload state
  const [bulkUploading, setBulkUploading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(productsCatalog[0]?.id || '');
  const [newProductImg, setNewProductImg] = useState('');

  // Reorder Sections
  const moveSection = (idx, direction) => {
    const newOrder = [...sectionsOrder];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    
    // Swap
    const temp = newOrder[idx];
    newOrder[idx] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    
    setSectionsOrder(newOrder);
    triggerSuccess('Homepage sections reordered successfully.');
  };

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleUpdateImage = (type, index, url) => {
    if (!url) return;
    
    if (type === 'hero') {
      const copy = [...heroImages];
      copy[index] = url;
      setHeroImages(copy);
    } else if (type === 'lookbook') {
      const copy = [...lookbookImages];
      copy[index] = url;
      setLookbookImages(copy);
    } else if (type === 'category') {
      const copy = [...categoryBanners];
      copy[index] = url;
      setCategoryBanners(copy);
    } else if (type === 'campaign') {
      const copy = [...campaignBanners];
      copy[index] = url;
      setCampaignBanners(copy);
    } else if (type === 'mood') {
      const copy = [...moodImages];
      copy[index] = url;
      setMoodImages(copy);
    } else if (type === 'steal') {
      const copy = [...stealImages];
      copy[index] = url;
      setStealImages(copy);
    }
  };

  const handleUploadFile = (type, index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleUpdateImage(type, index, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteHeroSlot = (index) => {
    const copy = [...heroImages];
    copy.splice(index, 1);
    setHeroImages(copy);
    triggerSuccess('Hero slot removed successfully.');
  };

  const handleAddHeroSlot = () => {
    const copy = [...heroImages, "/hero/hero-1.png"];
    setHeroImages(copy);
    triggerSuccess('Added new Hero Image Slot.');
  };

  const handleBulkUpload = (e) => {
    e.preventDefault();
    setBulkUploading(true);
    
    // Simulate bulk converting 100+ files to WebP lazy-load images
    setTimeout(() => {
      setBulkUploading(false);
      triggerSuccess('Bulk Upload Complete: 104 images optimized to WebP and registered inside local folder.');
    }, 2500);
  };

  const handleUpdateProductImage = (e) => {
    e.preventDefault();
    if (!newProductImg || !selectedProductId) return;

    setProductsCatalog(prev => prev.map(p => {
      if (p.id === selectedProductId) {
        return {
          ...p,
          image: newProductImg,
          imageHover: newProductImg // fallback
        };
      }
      return p;
    }));
    triggerSuccess(`Garment product image reassigned.`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-luxury-border pb-3">
        <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">IMAGE & LAYOUT MANAGEMENT</h2>
        <p className="text-[11px] text-gray-400 mt-1">Manage featured model sliders, crop specifications, bulk uploads, and reorder page layouts.</p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 text-green-600 text-[11px] flex items-center gap-2 border border-green-200 rounded">
          <CheckCircle2 size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Left Section ordering list / Right main images tab editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Homepage Sections Reorder list */}
        <div className="lg:col-span-4 border border-luxury-border p-6 rounded bg-white flex flex-col gap-4">
          <div>
            <h3 className="text-[11px] tracking-wider font-bold text-primary uppercase flex items-center gap-1.5"><Layers size={13} className="text-gold" /> Reorder Layout</h3>
            <p className="text-[9px] text-gray-400 mt-0.5">Move blocks to instantly shift the homepage stack.</p>
          </div>

          <div className="flex flex-col gap-2">
            {sectionsOrder.map((section, idx) => (
              <div key={section} className="flex justify-between items-center p-3 bg-luxury-gray border border-luxury-border rounded text-[11px]">
                <span className="font-bold text-primary capitalize">{section.replace(/([A-Z])/g, ' $1')}</span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => moveSection(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 hover:text-gold disabled:opacity-30 disabled:hover:text-gray-400"
                    title="Move section up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button 
                    onClick={() => moveSection(idx, 1)}
                    disabled={idx === sectionsOrder.length - 1}
                    className="p-1 hover:text-gold disabled:opacity-30 disabled:hover:text-gray-400"
                    title="Move section down"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabbed Image lists managers */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="border-b border-luxury-border pb-2 flex gap-4">
            {[
              { id: 'hero', name: `Hero (${heroImages.length})` },
              { id: 'lookbook', name: `Lookbook (${lookbookImages.length})` },
              { id: 'categories', name: `Categories (${categoryBanners.length})` },
              { id: 'campaigns', name: `Campaigns (${campaignBanners.length})` },
              { id: 'moods', name: `Moods (${moodImages.length})` },
              { id: 'steals', name: `Steals (${stealImages.length})` }
            ].map(tb => (
              <button 
                key={tb.id}
                onClick={() => setActiveSubTab(tb.id)}
                className={`text-[10px] font-bold tracking-wider uppercase pb-2 border-b-2 transition-all -mb-2.5 ${
                  activeSubTab === tb.id ? 'border-gold text-gold' : 'border-transparent text-gray-400 hover:text-primary'
                }`}
              >
                {tb.name}
              </button>
            ))}
          </div>

          {/* Edit Hero Images */}
          {activeSubTab === 'hero' && (
            <div className="flex flex-col gap-4 bg-luxury-gray p-4 rounded border border-luxury-border">
              <h4 className="text-[10px] tracking-wider font-bold text-primary uppercase">Hero Carousel Allocation</h4>
              <div className="flex flex-col gap-4">
                {heroImages.map((img, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded border border-luxury-border">
                    <div className="relative w-12 h-16 border rounded bg-luxury-gray overflow-hidden">
                      <Image src={img} alt={`hero ${idx}`} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <label className="text-[9px] text-gray-400 font-bold block uppercase">Hero Image Slot {idx + 1}</label>
                      <input 
                        type="text" 
                        defaultValue={img}
                        onBlur={(e) => handleUpdateImage('hero', idx, e.target.value)}
                        className="text-[11px] p-2 border border-luxury-border rounded w-full mt-1 bg-luxury-gray/10 focus:outline-none"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-luxury-gray border border-luxury-border rounded text-[10px] text-primary hover:text-gold cursor-pointer transition-colors uppercase font-bold tracking-wider">
                          <Upload size={10} />
                          Upload Image
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleUploadFile('hero', idx, e)}
                            className="hidden" 
                          />
                        </label>
                        {heroImages.length > 1 && (
                          <button
                            onClick={() => handleDeleteHeroSlot(idx)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded text-[10px] hover:bg-red-50 cursor-pointer transition-colors uppercase font-bold tracking-wider font-semibold"
                          >
                            <Trash2 size={10} />
                            Delete Slot
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-4 border-t border-luxury-border pt-4">
                <button
                  onClick={handleAddHeroSlot}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-gold text-white text-[10px] font-bold tracking-[0.2em] rounded uppercase transition-colors"
                >
                  <Plus size={12} /> Add Hero Slot
                </button>
                <label className="flex items-center gap-1.5 px-4 py-2.5 border border-luxury-border hover:border-gold text-primary hover:text-gold text-[10px] font-bold tracking-[0.2em] rounded uppercase cursor-pointer transition-colors">
                  <Upload size={12} /> Upload & Add Slot
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const copy = [...heroImages, reader.result];
                        setHeroImages(copy);
                        triggerSuccess('New hero image slot uploaded and added.');
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          )}

          {/* Edit Lookbook Images */}
          {activeSubTab === 'lookbook' && (
            <div className="flex flex-col gap-4 bg-luxury-gray p-4 rounded border border-luxury-border max-h-[400px] overflow-y-auto">
              <h4 className="text-[10px] tracking-wider font-bold text-primary uppercase">Lookbook Masonry Slots</h4>
              <div className="flex flex-col gap-3">
                {lookbookImages.map((img, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white p-2.5 rounded border border-luxury-border">
                    <div className="relative w-10 h-14 border rounded bg-luxury-gray overflow-hidden">
                      <Image src={img} alt={`lookbook ${idx}`} fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <label className="text-[9px] text-gray-400 font-bold block uppercase">Lookbook Slot {idx + 1}</label>
                      <input 
                        type="text" 
                        defaultValue={img}
                        onBlur={(e) => handleUpdateImage('lookbook', idx, e.target.value)}
                        className="text-[11px] p-2 border border-luxury-border rounded w-full mt-1 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Category Banners */}
          {activeSubTab === 'categories' && (
            <div className="flex flex-col gap-4 bg-luxury-gray p-4 rounded border border-luxury-border">
              <h4 className="text-[10px] tracking-wider font-bold text-primary uppercase">Category Visual Banners</h4>
              <div className="flex flex-col gap-3">
                {categoryBanners.map((img, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white p-2.5 rounded border border-luxury-border">
                    <div className="relative w-10 h-14 border rounded bg-luxury-gray overflow-hidden">
                      <Image src={img} alt={`category ${idx}`} fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <label className="text-[9px] text-gray-400 font-bold block uppercase">Banner Slot {idx + 1}</label>
                      <input 
                        type="text" 
                        defaultValue={img}
                        onBlur={(e) => handleUpdateImage('category', idx, e.target.value)}
                        className="text-[11px] p-2 border border-luxury-border rounded w-full mt-1 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Campaign Banners */}
          {activeSubTab === 'campaigns' && (
            <div className="flex flex-col gap-4 bg-luxury-gray p-4 rounded border border-luxury-border">
              <h4 className="text-[10px] tracking-wider font-bold text-primary uppercase">Editorial Campaign Sections</h4>
              <div className="flex flex-col gap-3">
                {campaignBanners.map((img, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white p-2.5 rounded border border-luxury-border">
                    <div className="relative w-10 h-14 border rounded bg-luxury-gray overflow-hidden">
                      <Image src={img} alt={`campaign ${idx}`} fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <label className="text-[9px] text-gray-400 font-bold block uppercase">Campaign Slot {idx + 1}</label>
                      <input 
                        type="text" 
                        defaultValue={img}
                        onBlur={(e) => handleUpdateImage('campaign', idx, e.target.value)}
                        className="text-[11px] p-2 border border-luxury-border rounded w-full mt-1 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Mood Images */}
          {activeSubTab === 'moods' && (
            <div className="flex flex-col gap-4 bg-luxury-gray p-4 rounded border border-luxury-border">
              <h4 className="text-[10px] tracking-wider font-bold text-primary uppercase">Match The Mood Banners</h4>
              <div className="flex flex-col gap-3">
                {moodImages.map((img, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white p-2.5 rounded border border-luxury-border">
                    <div className="relative w-10 h-14 border rounded bg-luxury-gray overflow-hidden">
                      <Image src={img} alt={`mood ${idx}`} fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <label className="text-[9px] text-gray-400 font-bold block uppercase">Mood Slot {idx + 1}</label>
                      <input 
                        type="text" 
                        defaultValue={img}
                        onBlur={(e) => handleUpdateImage('mood', idx, e.target.value)}
                        className="text-[11px] p-2 border border-luxury-border rounded w-full mt-1 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Steals Images */}
          {activeSubTab === 'steals' && (
            <div className="flex flex-col gap-4 bg-luxury-gray p-4 rounded border border-luxury-border">
              <h4 className="text-[10px] tracking-wider font-bold text-primary uppercase">Steals Of The Week Banners</h4>
              <div className="flex flex-col gap-3">
                {stealImages.map((img, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white p-2.5 rounded border border-luxury-border">
                    <div className="relative w-10 h-14 border rounded bg-luxury-gray overflow-hidden">
                      <Image src={img} alt={`steal ${idx}`} fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <label className="text-[9px] text-gray-400 font-bold block uppercase">Steal Slot {idx + 1}</label>
                      <input 
                        type="text" 
                        defaultValue={img}
                        onBlur={(e) => handleUpdateImage('steal', idx, e.target.value)}
                        className="text-[11px] p-2 border border-luxury-border rounded w-full mt-1 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Product Image Override & Bulk Uploaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-luxury-border pt-8">
        
        {/* Uploader 1: Replace Product Image */}
        <form onSubmit={handleUpdateProductImage} className="border border-luxury-border p-6 rounded bg-white flex flex-col gap-4">
          <div>
            <h3 className="text-[11px] tracking-wider font-bold text-primary uppercase flex items-center gap-1.5"><ImageIcon size={13} className="text-gold" /> Replace Product Images</h3>
            <p className="text-[9px] text-gray-400 mt-0.5 font-light">Swap image allocations of specific catalog shirts.</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Select Shirt Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border rounded focus:outline-none bg-white font-semibold"
              >
                {productsCatalog.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">New Image URL (e.g. /products/product-12.png)</label>
              <input 
                type="text" 
                placeholder="e.g. /products/product-12.png" 
                value={newProductImg}
                onChange={(e) => setNewProductImg(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border rounded focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="text-[10px] tracking-[0.2em] font-bold bg-primary hover:bg-gold text-white py-3.5 transition-colors rounded uppercase flex items-center justify-center gap-2 max-w-[200px] shadow-sm"
          >
            <Save size={12} /> Assign Image
          </button>
        </form>

        {/* Uploader 2: Bulk Upload Simulator */}
        <form onSubmit={handleBulkUpload} className="border border-luxury-border p-6 rounded bg-white flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-[11px] tracking-wider font-bold text-primary uppercase flex items-center gap-1.5"><Upload size={13} className="text-gold" /> Bulk Upload 100+ Images</h3>
            <p className="text-[9px] text-gray-400 mt-0.5 font-light">Drag files to compile them into WebP formats matching Next.js Image sizes.</p>
          </div>

          <div className="border-2 border-dashed border-luxury-border rounded p-6 flex flex-col items-center justify-center text-center bg-luxury-gray cursor-pointer hover:border-gold transition-colors">
            <Upload size={24} className="text-gray-300 mb-1" />
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Drop fashion photos here</span>
            <span className="text-[9px] text-gray-400 mt-1">Automatic formatting to WebP & lazy load</span>
          </div>

          <button 
            type="submit"
            disabled={bulkUploading}
            className="text-[10px] tracking-[0.2em] font-bold bg-primary hover:bg-gold text-white py-3.5 transition-colors rounded uppercase flex items-center justify-center gap-2 shadow-sm"
          >
            {bulkUploading ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> RUNNING WEBP COMPRESSION...
              </>
            ) : (
              'EXECUTE BULK OPTIMIZATION RUN'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
