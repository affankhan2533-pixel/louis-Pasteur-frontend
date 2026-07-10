"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import { Search, SlidersHorizontal, Grid, List, Star, Eye, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { catalog } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';

// Separate inner component to wrap in Suspense to avoid Next.js build-time errors
function CatalogContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const filterQuery = searchParams.get('filter') || '';
  const { productsCatalog, addToCart, toggleWishlist, wishlist, toggleCompare, compareProducts } = useAppState();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [aestheticFilter, setAestheticFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Set initial filters based on search params
  useEffect(() => {
    setLoading(true);
    if (searchParams.get('category')) {
      setCategoryFilter(searchParams.get('category'));
    } else {
      setCategoryFilter('all');
    }
    if (searchParams.get('size')) {
      setSizeFilter(searchParams.get('size'));
    } else {
      setSizeFilter('all');
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, filterQuery, searchParams]);

  // Filters logic
  const filteredProducts = (productsCatalog || catalog).filter(product => {
    // 1. Search Query Filter
    if (searchQuery) {
      const matchName = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = product.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchName && !matchCat) return false;
    }

    // 2. Filter Tag Shortcuts
    if (filterQuery === 'bestsellers' && product.tag !== 'Best Seller') return false;
    if (filterQuery === 'limited' && product.tag !== 'Limited Drop') return false;

    // 3. Category Filter
    if (categoryFilter !== 'all' && product.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;

    // 4. Price Filter
    if (priceFilter !== 'all') {
      if (priceFilter === 'under1100' && product.price >= 1100) return false;
      if (priceFilter === '1100to1400' && (product.price < 1100 || product.price > 1400)) return false;
      if (priceFilter === 'over1400' && product.price <= 1400) return false;
    }

    // 5. Aesthetic Preference
    if (aestheticFilter !== 'all' && product.aesthetic !== aestheticFilter) return false;

    // 6. Size filter validation
    if (sizeFilter !== 'all') {
      if (!product.sizes || !product.sizes[sizeFilter]) return false;
    }

    return true;
  });

  return (
    <div className="w-full">
      {/* Search Header Banner */}
      <div className="bg-luxury-gray py-12 px-6 md:px-12 border-b border-luxury-border text-center">
        {searchQuery ? (
          <div>
            <span className="text-[10px] tracking-[0.25em] text-gray-400 font-bold uppercase">Search Results for</span>
            <h1 className="text-xl md:text-3xl font-editorial font-bold text-primary mt-1">"{searchQuery.toUpperCase()}"</h1>
            <p className="text-[11px] text-gray-400 mt-2">({filteredProducts.length} premium iterations found)</p>
          </div>
        ) : (
          <div>
            <span className="text-[10px] tracking-[0.25em] text-gray-400 font-bold uppercase">Meticulously Curated</span>
            <h1 className="text-xl md:text-3xl font-editorial font-bold text-primary mt-1">THE COLLECTION CATALOGUE</h1>
            <p className="text-[11px] text-gray-400 mt-2">Crafted silhouettes. Refined aesthetics.</p>
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sticky Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8 self-start lg:sticky lg:top-[140px]">
          <div className="flex items-center gap-2 border-b pb-3">
            <SlidersHorizontal size={14} className="text-gold" />
            <h3 className="text-[11px] tracking-[0.2em] font-bold text-primary uppercase">Filters</h3>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.1em] font-bold text-gray-400 uppercase">Category</span>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-[12px] p-2.5 border border-luxury-border rounded focus:outline-none focus:border-gold bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Checks">Checked Shirts</option>
              <option value="Plain">Solid Shirts</option>
              <option value="Printed">Printed Shirts</option>
              <option value="Linen">Linen Shirts</option>
              <option value="Overshirt">Overshirts</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.1em] font-bold text-gray-400 uppercase">Price Range</span>
            <select 
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="text-[12px] p-2.5 border border-luxury-border rounded focus:outline-none focus:border-gold bg-white"
            >
              <option value="all">Any Price</option>
              <option value="under1100">Under ₹1100</option>
              <option value="1100to1400">₹1100 - ₹1400</option>
              <option value="over1400">Over ₹1400</option>
            </select>
          </div>

          {/* Sizing Aesthetic */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.1em] font-bold text-gray-400 uppercase">Style Aesthetic</span>
            <select 
              value={aestheticFilter}
              onChange={(e) => setAestheticFilter(e.target.value)}
              className="text-[12px] p-2.5 border border-luxury-border rounded focus:outline-none focus:border-gold bg-white"
            >
              <option value="all">Any Aesthetic</option>
              <option value="minimalist">Minimalist</option>
              <option value="streetwear">Streetwear</option>
              <option value="classic">Classic Editorial</option>
              <option value="avantgarde">Avant-Garde</option>
            </select>
          </div>

          {/* Size Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.1em] font-bold text-gray-400 uppercase">Size Availability</span>
            <select 
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="text-[12px] p-2.5 border border-luxury-border rounded focus:outline-none focus:border-gold bg-white font-semibold"
            >
              <option value="all">All Sizes</option>
              <option value="S">Size S (Small)</option>
              <option value="M">Size M (Medium)</option>
              <option value="L">Size L (Large)</option>
              <option value="XL">Size XL (Extra Large)</option>
            </select>
          </div>


        </aside>

        {/* Products Grid */}
        <div className="flex-grow flex flex-col gap-8">
          {/* Compare bar if items selected */}
          {compareProducts.length > 0 && (
            <div className="p-4 bg-gold/5 border border-gold rounded flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw size={14} className="text-gold animate-spin" />
                <span className="text-[11px] text-primary">Compare Selection: <span className="font-bold">{compareProducts.length} / 3</span> products selected.</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => compareProducts.forEach(p => toggleCompare(p))}
                  className="text-[10px] font-bold text-red-500 uppercase tracking-wider"
                >
                  Clear Selection
                </button>
                <Link 
                  href={`/product/${compareProducts[0].id}?compare=true`}
                  className="text-[10px] font-bold text-gold uppercase tracking-wider underline"
                >
                  Compare Specifications
                </Link>
              </div>
            </div>
          )}

          {loading ? (
            // Skeleton Loader
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-10 md:gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="aspect-[4/5] skeleton-line rounded bg-luxury-gray w-full" />
                  <div className="w-16 h-3 skeleton-line bg-luxury-gray" />
                  <div className="w-3/4 h-4 skeleton-line bg-luxury-gray" />
                  <div className="w-12 h-4 skeleton-line bg-luxury-gray" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-luxury-border rounded flex flex-col items-center justify-center gap-4">
              <SlidersHorizontal size={40} className="text-gray-300 stroke-1" />
              <div>
                <h4 className="text-[12px] font-bold tracking-wider text-primary">NO SILHOUETTES MATCHING FILTERS</h4>
                <p className="text-[11px] text-gray-400 mt-1">Try resetting the drop filters or clear the search query.</p>
              </div>
              <button 
                onClick={() => {
                  setCategoryFilter('all');
                  setPriceFilter('all');
                  setAestheticFilter('all');
                  setSizeFilter('all');
                }}
                className="text-[10px] tracking-widest font-bold border border-primary px-4 py-2 hover:bg-primary hover:text-white transition-colors uppercase"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-10 md:gap-12">
              {filteredProducts.map((product) => {
                const inWishlist = wishlist.some(item => item.id === product.id);
                const isCompared = compareProducts.some(item => item.id === product.id);
                return (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ProductCard
                      product={product}
                      inWishlist={inWishlist}
                      isCompared={isCompared}
                      onWishlistToggle={toggleWishlist}
                      onCompareToggle={toggleCompare}
                      onAddToCart={addToCart}
                      showCompare={true}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-luxury-black font-semibold">
        Curating Luxury Silhouettes...
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
