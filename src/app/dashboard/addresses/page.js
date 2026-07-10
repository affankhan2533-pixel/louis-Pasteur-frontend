"use client";

import React, { useState } from 'react';
import { useAppState } from '@/components/StateContext';
import { MapPin, Save, Plus } from 'lucide-react';

export default function AddressesPage() {
  const { user, setUser } = useAppState();
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || '');
  const [success, setSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (user) {
      setUser(prev => ({
        ...prev,
        address: { street, city, postalCode, country }
      }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-luxury-border pb-3">
        <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">SAVED SHIPPING ADDRESSES</h2>
        <p className="text-[11px] text-gray-400 mt-1">Configure default locations for priority express shipments.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 font-bold uppercase">Street Address</label>
            <input 
              type="text" 
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="text-[12px] p-3 border border-luxury-border rounded bg-white focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">City</label>
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border rounded bg-white focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Postal Code</label>
              <input 
                type="text" 
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="text-[12px] p-3 border border-luxury-border rounded bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 font-bold uppercase">Country</label>
            <input 
              type="text" 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="text-[12px] p-3 border border-luxury-border rounded bg-white focus:outline-none"
              required
            />
          </div>
        </div>

        {success && <p className="text-[10px] text-green-600 font-bold">Shipping address details successfully updated.</p>}

        <button 
          type="submit"
          className="text-[10px] tracking-[0.2em] font-bold bg-primary hover:bg-gold text-white py-3.5 transition-colors rounded uppercase flex items-center justify-center gap-2 max-w-[200px]"
        >
          <Save size={12} /> Save Address
        </button>
      </form>
    </div>
  );
}
