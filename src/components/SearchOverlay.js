"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from './StateContext';
import { X, Search, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useAppState();
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setQuery('');
  };

  const handleQuickSearch = (keyword) => {
    setSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(keyword)}`);
  };

  const trendingKeywords = [
    "Mulberry Silk",
    "Japanese Cargo",
    "Tailored Oversized",
    "Gold Collection",
    "Minimalist Shirts"
  ];

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-white/95 backdrop-blur-md z-[150] flex flex-col p-6 md:p-16"
        >
          {/* Close Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => setSearchOpen(false)}
              className="p-2 text-luxury-black hover:text-gold transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search form */}
          <div className="flex-grow flex flex-col justify-center max-w-4xl mx-auto w-full">
            <form onSubmit={handleSearchSubmit} className="relative w-full border-b border-primary pb-4">
              <input 
                ref={inputRef}
                type="text" 
                placeholder="SEARCH THE ATELIER..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-xl md:text-4xl font-editorial font-light tracking-[0.1em] text-primary placeholder-gray-300 focus:outline-none pr-12"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:text-gold transition-colors"
              >
                <ArrowRight size={28} />
              </button>
            </form>

            {/* Suggestions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] tracking-[0.2em] font-bold text-gray-400 mb-4 uppercase">TRENDING SEARCHES</h4>
                <ul className="flex flex-wrap gap-2">
                  {trendingKeywords.map((word, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => handleQuickSearch(word)}
                        className="text-[11px] font-semibold tracking-wider border border-luxury-border hover:border-primary px-4 py-2 hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        {word}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 p-6 bg-luxury-gray border border-luxury-border rounded">
                <div className="flex items-center gap-1 text-gold">
                  <Sparkles size={14} />
                  <span className="text-[10px] tracking-[0.1em] font-bold">AI PRODUCT DISCOVERY</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Struggling to find the perfect silhouette? Ask our AI assistant floating on the bottom right for immediate curation recommendations matching your precise measurements.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
