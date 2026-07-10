import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, RefreshCw, ShoppingBag } from 'lucide-react';

export default function ProductCard({
  product,
  inWishlist,
  isCompared,
  onWishlistToggle,
  onCompareToggle,
  onAddToCart,
  showCompare = false
}) {
  // Generate swatches deterministically based on product ID/index
  const getProductSwatches = (id) => {
    const numericId = id ? parseInt(id.replace(/\D/g, ''), 10) || 0 : 0;
    const swatchOptions = [
      ["#3b82f6", "#fef08a", "#f43f5e"], // Blue, Yellow, Pink
      ["#1e3a8a", "#d97706", "#ec4899"], // Dark Blue, Orange, Light Pink
      ["#111827", "#6b7280", "#78350f"], // Black, Grey, Brown
      ["#15803d", "#ca8a04", "#7c2d12"], // Green, Yellow, Rust
      ["#1e293b", "#f59e0b", "#a21caf"], // Navy, Gold, Purple
    ];
    const swatches = swatchOptions[numericId % swatchOptions.length];
    const extraCount = (numericId % 3) + 1; // +1, +2, +3
    return { swatches, extraCount };
  };

  const { swatches, extraCount } = getProductSwatches(product.id);

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] card-hover-lift transition-all duration-300">
      {/* Image Container — Premium pure white studio background */}
      <div className="relative aspect-[4/5] overflow-hidden mb-1.5 md:mb-2 block bg-white" style={{ backgroundColor: '#ffffff' }}>
        
        {/* Tag */}
        {product.tag && (
          <span className="absolute top-2 left-2 z-10 bg-primary text-white text-[7px] md:text-[8px] tracking-[0.15em] font-extrabold py-0.5 px-2 rounded-sm uppercase shadow-sm">
            {product.tag}
          </span>
        )}

        {/* Wishlist Trigger */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistToggle(product);
          }}
          className={`absolute top-2 right-2 z-10 w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm ${
            inWishlist 
              ? 'bg-red-50 border-red-200' 
              : 'bg-white/90 backdrop-blur-sm border-luxury-border hover:bg-white hover:border-gray-400'
          }`}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            size={12} 
            className={inWishlist ? "fill-red-500 text-red-500 stroke-[1.5]" : "text-gray-700 stroke-[1.5] hover:text-red-400"} 
          />
        </button>

        {/* Compare Selector Toggle (Optional) */}
        {showCompare && onCompareToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompareToggle(product);
            }}
            className={`absolute top-12 right-3 z-10 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              isCompared ? 'bg-gold border-gold text-white' : 'bg-white/90 backdrop-blur-sm border-luxury-border text-gray-950 hover:text-gold shadow-sm'
            }`}
            title="Add to Compare specifications"
          >
            <RefreshCw size={11} className={isCompared ? "animate-spin" : ""} />
          </button>
        )}

        {/* Product Images with Hover Swap */}
        <Link href={`/product/${product.id}`} className="absolute inset-3 md:inset-4 block bg-white">
          <Image
            src={`${product.image}?v=6`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            loading="lazy"
            className="object-contain object-center transition-opacity duration-700 group-hover:opacity-0 bg-white"
          />
          <Image
            src={`${product.imageHover || product.image}?v=6`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            loading="lazy"
            className="absolute inset-0 object-contain object-center opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-white"
          />
        </Link>

        {/* Quick Add Size Bar — slides up on hover */}
        <div className="absolute bottom-0 inset-x-0 bg-white/97 backdrop-blur-sm py-2.5 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-350 flex justify-center gap-2 items-center z-20 border-t border-luxury-border shadow-md">
          <span className="text-[8px] tracking-widest text-gray-400 font-extrabold mr-1">SIZE:</span>
          {['S', 'M', 'L', 'XL'].map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product, size);
              }}
              className="text-[10px] font-bold text-primary hover:text-white hover:bg-black transition-all px-2 py-1 border border-transparent hover:border-black rounded-sm"
            >
              {size}
            </button>
          ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product, 'M');
            }}
            className="ml-auto text-gold hover:text-primary transition-colors"
            title="Add to cart"
          >
            <ShoppingBag size={13} />
          </button>
        </div>
      </div>

      {/* Info Details Panel */}
      <div className="flex flex-col gap-0.5 md:gap-1 pt-1.5 pb-3.5 md:pb-4 px-4 bg-white">
        {/* Name */}
        <Link href={`/product/${product.id}`} className="text-[11px] md:text-[12px] font-medium tracking-wide text-primary hover:text-gold transition-colors truncate animated-underline">
          {product.name}
        </Link>

        {/* Price Row */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[12px] md:text-[13px] font-extrabold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
          {product.originalPrice && (
            <span className="text-[10px] md:text-[11px] text-gray-400 line-through font-normal">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          )}
        </div>

        {/* Color Swatches — hidden on very small screens */}
        <div className="flex items-center gap-1 md:gap-1.5 mt-1">
          {swatches.map((colorBg, sIdx) => (
            <span
              key={sIdx}
              className="w-3 h-3 md:w-3.5 md:h-3.5 border border-luxury-border rounded-sm block hover:scale-125 hover:border-gray-400 transition-transform cursor-pointer"
              style={{ backgroundColor: colorBg }}
              title={`Color option ${sIdx + 1}`}
            />
          ))}
          <span className="text-[9px] md:text-[10px] text-gray-400 font-medium ml-0.5">+{extraCount}</span>
        </div>
      </div>
    </div>
  );
}
