"use client";

import React, { useState } from 'react';
import { useAppState } from '@/components/StateContext';
import AICameraScanner from '@/components/AICameraScanner';
import { Sparkles, Save, HelpCircle, Info } from 'lucide-react';

export default function MeasurementsPage() {
  const { savedMeasurements, setSavedMeasurements } = useAppState();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [formValues, setFormValues] = useState({ ...savedMeasurements });
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, val) => {
    setFormValues(prev => ({
      ...prev,
      [field]: Number(val) || 0
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMeasurements(formValues);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const measurementFields = [
    { key: 'height', label: 'Reference Height (cm)', desc: 'Absolute vertical span' },
    { key: 'chest', label: 'Chest Circumference (cm)', desc: 'Broadest span below armpits' },
    { key: 'waist', label: 'Waist Circumference (cm)', desc: 'Midsection structural narrow' },
    { key: 'shoulder', label: 'Shoulder Width (cm)', desc: 'Shoulder seam to shoulder seam' },
    { key: 'hip', label: 'Hips Circumference (cm)', desc: 'Broadest pelvic span' },
    { key: 'armLength', label: 'Arm Length (cm)', desc: 'Shoulder joint to wrist line' },
    { key: 'inseam', label: 'Inseam length (cm)', desc: 'Inner crotch join to ankle' }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-luxury-border pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[14px] font-bold tracking-[0.15em] text-primary uppercase">AI SAVED MEASUREMENTS</h2>
          <p className="text-[11px] text-gray-400 mt-1">Review calibrated skeletal vector metrics from scans.</p>
        </div>
        
        <button 
          onClick={() => setScannerOpen(true)}
          className="text-[10px] tracking-wider font-bold bg-primary hover:bg-gold text-white px-4 py-2.5 rounded transition-colors uppercase flex items-center gap-1.5"
        >
          <Sparkles size={12} className="text-gold" /> Trigger New Body Scan
        </button>
      </div>

      {/* Info Card */}
      <div className="p-4 bg-gold/5 border border-gold rounded flex items-start gap-3">
        <Info size={16} className="text-gold shrink-0 mt-0.5" />
        <p className="text-[11px] text-primary leading-relaxed">
          These body vector parameters are computed automatically during photo calibration. They are referenced in real-time by our tension algorithms when you view garments to recommend the perfect sizing drape.
        </p>
      </div>

      {/* Sizing Grid Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {measurementFields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <label className="text-[10px] text-gray-400 font-bold uppercase">{field.label}</label>
                <span className="text-[9px] text-gray-400 font-light italic">{field.desc}</span>
              </div>
              <input 
                type="number" 
                value={formValues[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="text-[12px] p-3 border border-luxury-border rounded bg-white focus:outline-none focus:border-gold font-semibold"
                required
              />
            </div>
          ))}
        </div>

        {success && <p className="text-[10px] text-green-600 font-bold">Landmarks successfully updated in local profile DB.</p>}

        <button 
          type="submit"
          className="text-[10px] tracking-[0.2em] font-bold bg-primary hover:bg-gold text-white py-3.5 transition-colors rounded uppercase flex items-center justify-center gap-2 max-w-[200px]"
        >
          <Save size={12} /> Save Dimensions
        </button>
      </form>

      {/* Scanner Modal overlay */}
      <AICameraScanner 
        isOpen={scannerOpen}
        onClose={() => {
          setScannerOpen(false);
          setFormValues({ ...savedMeasurements });
        }}
        productSizes={{
          S: { chest: 92, waist: 84 },
          M: { chest: 98, waist: 90 },
          L: { chest: 104, waist: 96 }
        }}
        productType="shirt"
        onSizeCalibrated={() => {}}
      />
    </div>
  );
}
