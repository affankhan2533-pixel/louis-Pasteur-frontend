"use client";

import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualTryOn({ isOpen, onClose, productName, productImage }) {
  const [modelType, setModelType] = useState('model-1');
  const [tryOnApplied, setTryOnApplied] = useState(true);
  const [fitHeatmap, setFitHeatmap] = useState(false);

  const models = [
    { id: 'model-1', name: 'Editorial Model (M)', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400' },
    { id: 'model-2', name: 'Bespoke Model (L)', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400' }
  ];

  const activeModel = models.find(m => m.id === modelType);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[250] cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-6 md:inset-auto md:w-[750px] md:h-[550px] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded shadow-2xl z-[251] flex flex-col md:flex-row overflow-hidden"
          >
            {/* Left Panel: Virtual fitting viewport */}
            <div className="flex-grow bg-luxury-gray relative flex items-center justify-center p-6 border-r border-luxury-border">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button
                  onClick={() => setFitHeatmap(!fitHeatmap)}
                  className={`text-[9px] tracking-wider font-bold p-2 px-3 border rounded transition-all uppercase ${fitHeatmap
                      ? 'bg-gold border-gold text-white'
                      : 'bg-white/80 border-luxury-border text-gray-500 hover:text-primary'
                    }`}
                >
                  {fitHeatmap ? 'Disable Tension Map' : 'Enable Tension Map'}
                </button>
              </div>

              {/* Viewport Wrapper */}
              <div className="relative w-full max-w-[280px] aspect-[3/4] bg-white border border-luxury-border rounded overflow-hidden shadow-sm">

                {/* Underlay: Model Body */}
                <img
                  src={activeModel.image}
                  alt="Fitting body"
                  className={`w-full h-full object-cover transition-all duration-700 ${tryOnApplied ? 'brightness-90 grayscale-[20%]' : ''
                    }`}
                />

                {/* Overlay: Garment Simulation (if applied) */}
                {tryOnApplied && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    className={`absolute inset-0 transition-all duration-500 pointer-events-none ${fitHeatmap ? 'mix-blend-multiply' : 'mix-blend-normal'
                      }`}
                  >
                    {fitHeatmap ? (
                      // Heatmap color simulation overlay
                      <div className="w-full h-full bg-gradient-to-b from-green-500/20 via-gold-dark/40 to-green-500/10 flex items-center justify-center">
                        <div className="w-48 h-32 border-2 border-dashed border-red-500/50 rounded bg-red-500/10 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-red-600 bg-white/90 px-1 py-0.5 rounded shadow">Shoulder Tension High</span>
                        </div>
                      </div>
                    ) : (
                      // Garment texture overlay
                      <img
                        src={productImage}
                        alt="Garment Overlay"
                        className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                      />
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Panel: Controls */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between shrink-0">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase flex items-center gap-1"><Sparkles size={12} /> Bespoke fitting</span>
                    <h3 className="text-[14px] font-editorial font-bold text-primary mt-1 uppercase">{productName}</h3>
                  </div>
                  <button onClick={onClose} className="p-1 hover:text-gold text-gray-400">
                    <X size={16} />
                  </button>
                </div>

                {/* Model Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider font-bold text-gray-400 uppercase">Select Silhouette Body</label>
                  <div className="flex flex-col gap-2">
                    {models.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setModelType(m.id)}
                        className={`text-left text-[11px] p-2.5 border rounded transition-all ${modelType === m.id
                            ? 'border-primary bg-primary/5 font-semibold text-primary'
                            : 'border-luxury-border text-gray-500 hover:border-gray-400 bg-white'
                          }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit Diagnostics */}
                <div className="p-4 bg-luxury-gray rounded border border-luxury-border flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                    <AlertCircle size={12} className="text-gold" />
                    <span className="uppercase tracking-wider">AI FIT DIAGNOSTICS</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shoulder fit:</span>
                      <span className="font-semibold text-red-500">Slightly restrictive</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chest drape:</span>
                      <span className="font-semibold text-green-600">Perfect alignment</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Waist fit:</span>
                      <span className="font-semibold text-green-600">Comfort allocation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setTryOnApplied(!tryOnApplied)}
                  className="w-full text-center text-[10px] tracking-[0.2em] font-bold bg-primary hover:bg-gold text-white py-3.5 transition-colors rounded uppercase"
                >
                  {tryOnApplied ? 'Remove Garment Overlay' : 'Apply Garment Overlay'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-center text-[10px] tracking-[0.2em] font-semibold border border-luxury-border text-gray-500 hover:bg-luxury-gray py-2.5 transition-colors rounded uppercase"
                >
                  Close fitting Room
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
