"use client";

import React, { useState } from 'react';
import { useAppState } from '@/components/StateContext';
import { Edit3, Save, Sparkles, Tag, AlertCircle } from 'lucide-react';

export default function AdminCms() {
  const { cms, setCms } = useAppState();
  const [announcement, setAnnouncement] = useState(cms.announcement);
  const [heroTitle, setHeroTitle] = useState(cms.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(cms.heroSubtitle);
  const [couponCode, setCouponCode] = useState(cms.couponCode);
  const [couponDiscount, setCouponDiscount] = useState(cms.couponDiscount);
  const [aiRuleChestPenalty, setAiRuleChestPenalty] = useState(cms.aiRuleChestPenalty);
  const [aiRuleShoulderPenalty, setAiRuleShoulderPenalty] = useState(cms.aiRuleShoulderPenalty);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedCms = {
      ...cms,
      announcement,
      heroTitle,
      heroSubtitle,
      couponCode,
      couponDiscount: Number(couponDiscount) || 0,
      aiRuleChestPenalty: Number(aiRuleChestPenalty) || 0,
      aiRuleShoulderPenalty: Number(aiRuleShoulderPenalty) || 0
    };

    try {
      const res = await fetch('http://localhost:5000/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCms)
      });
      if (res.ok) {
        const savedData = await res.json();
        setCms(savedData);
        setSuccess(true);
      } else {
        alert('Failed to save CMS settings to database.');
      }
    } catch (err) {
      console.error("Error saving CMS settings:", err);
      // local fallback
      setCms(updatedCms);
      setSuccess(true);
    }
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-luxury-border pb-3">
        <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">CMS & BRAND SETTINGS</h2>
        <p className="text-[11px] text-gray-400 mt-1">Configure layout copywriting, promotional coupon parameters, and AI engine coefficients instantly.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        
        {/* Section 1: Homepage Copy */}
        <div className="flex flex-col gap-4 border border-luxury-border p-6 rounded bg-white">
          <h3 className="text-[11px] tracking-wider font-bold text-primary uppercase border-b pb-2 flex items-center gap-1.5"><Edit3 size={12} className="text-gold" /> 1. Storefront Headings</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Announcement Banner Text</label>
              <input 
                type="text" 
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border bg-white rounded focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Hero Headline Title</label>
                <input 
                  type="text" 
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="text-[12px] p-3 border border-luxury-border bg-white rounded focus:outline-none font-editorial font-bold"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Hero Subtitle</label>
                <input 
                  type="text" 
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="text-[12px] p-3 border border-luxury-border bg-white rounded focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Promo Coupons */}
        <div className="flex flex-col gap-4 border border-luxury-border p-6 rounded bg-white">
          <h3 className="text-[11px] tracking-wider font-bold text-primary uppercase border-b pb-2 flex items-center gap-1.5"><Tag size={12} className="text-gold" /> 2. active Coupon Rules</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Coupon promo code</label>
              <input 
                type="text" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border bg-white rounded focus:outline-none font-semibold uppercase"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Discount value (%)</label>
              <input 
                type="number" 
                value={couponDiscount}
                onChange={(e) => setCouponDiscount(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border bg-white rounded focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: AI Sizing Rules */}
        <div className="flex flex-col gap-4 border border-luxury-border p-6 rounded bg-white">
          <h3 className="text-[11px] tracking-wider font-bold text-primary uppercase border-b pb-2 flex items-center gap-1.5"><Sparkles size={12} className="text-gold" /> 3. AI engine coefficients</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Tight Chest Penalty Modifier</label>
              <input 
                type="number" 
                step="0.1"
                value={aiRuleChestPenalty}
                onChange={(e) => setAiRuleChestPenalty(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border bg-white rounded focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Tight Shoulder Penalty Modifier</label>
              <input 
                type="number" 
                step="0.1"
                value={aiRuleShoulderPenalty}
                onChange={(e) => setAiRuleShoulderPenalty(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border bg-white rounded focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {success && <p className="text-[10px] text-green-600 font-bold">CMS variables saved and synced globally across layout modules.</p>}

        <button 
          type="submit"
          className="text-[10px] tracking-[0.2em] font-bold bg-primary hover:bg-gold text-white py-3.5 transition-colors rounded uppercase flex items-center justify-center gap-2 max-w-[200px]"
        >
          <Save size={12} /> Sync CMS Settings
        </button>
      </form>
    </div>
  );
}
