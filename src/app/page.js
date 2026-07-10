"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppState } from '@/components/StateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Instagram, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

// Deterministic seed-based shuffle helper to prevent similar images/poses next to each other
function shuffleArray(array, seed = 12345) {
  const shuffled = [...array];
  let m = shuffled.length, t, i;
  let currentSeed = seed;
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
  while (m) {
    i = Math.floor(random() * m--);
    t = shuffled[m];
    shuffled[m] = shuffled[i];
    shuffled[i] = t;
  }
  return shuffled;
}

export default function Home() {
  const {
    addToCart, toggleWishlist, wishlist, cms,
    heroImages, lookbookImages, categoryBanners, campaignBanners,
    moodImages, stealImages, sectionsOrder, productsCatalog
  } = useAppState();

  const slides = [
    {
      type: 'video',
      src: '/videos/hero-video.mp4',
      title: cms.heroTitle || "THE SHIRT THAT DEFINES YOU",
      subtitle: cms.heroSubtitle || "Modern fits. Premium fabrics. Timeless appeal.",
      ctaText: "SHOP COLLECTION",
      textColor: "text-white",
      subColor: "text-white/95",
      btnClass: "bg-white text-primary border-white hover:bg-transparent hover:text-white"
    }
  ];

  if (heroImages.length > 0) {
    slides.push({
      type: 'image',
      src: heroImages[0] || '/hero/hero-1.png',
      title: "THE NEVER RUN-OUT COLLECTION",
      subtitle: "ESSENTIAL SHIRTS FOR EVERYDAY LUXURY",
      ctaText: "DISCOVER NOW",
      textColor: "text-[#4A3F35]",
      subColor: "text-[#6C5F53]",
      btnClass: "bg-[#4A3F35] text-white border-[#4A3F35] hover:bg-transparent hover:text-[#4A3F35]"
    });
  }

  if (heroImages.length > 1) {
    slides.push({
      type: 'reminder',
      src: heroImages[1] || '/hero/hero-2.png'
    });
  }

  if (heroImages.length > 2) {
    slides.push({
      type: 'image',
      src: heroImages[2] || '/hero/hero-3.png',
      title: "THE ATELIER SELECTION",
      subtitle: "VOL. III: SILK & COTTON NARRATIVES",
      ctaText: "EXPLORE ATELIER",
      textColor: "text-[#4A3F35]",
      subColor: "text-[#6C5F53]",
      btnClass: "bg-[#4A3F35] text-white border-[#4A3F35] hover:bg-transparent hover:text-[#4A3F35]"
    });
  }

  if (heroImages.length > 3) {
    slides.push({
      type: 'image',
      src: heroImages[3] || '/hero/hero-4.png',
      title: "MODERN MINIMALISM",
      subtitle: "STRUCTURED SHAPES, COUTURE FINISH",
      ctaText: "SHOP MINIMALIST",
      textColor: "text-[#4A3F35]",
      subColor: "text-[#6C5F53]",
      btnClass: "bg-[#4A3F35] text-white border-[#4A3F35] hover:bg-transparent hover:text-[#4A3F35]"
    });
  }

  if (heroImages.length > 4) {
    for (let idx = 4; idx < heroImages.length; idx++) {
      slides.push({
        type: 'image',
        src: heroImages[idx],
        title: `EXQUISITE SELECTION VOL. ${idx + 1}`,
        subtitle: "CURATED COUTURE SILHOUETTES",
        ctaText: "SHOP THE LOOK",
        textColor: "text-[#4A3F35]",
        subColor: "text-[#6C5F53]",
        btnClass: "bg-[#4A3F35] text-white border-[#4A3F35] hover:bg-transparent hover:text-[#4A3F35]"
      });
    }
  }

  const [activeTab, setActiveTab] = useState('ALL');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const videoRef = useRef(null);

  useEffect(() => {
    if (currentSlide === 0 && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(err => {
        console.warn("Autoplay blocked or failed to play video:", err);
      });
    }
  }, [currentSlide]);

  const handlePrevSlide = () => {
    setDirection(-1);
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setDirection(1);
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  useEffect(() => {
    // If it's the video slide (idx 0), we set a longer fallback (e.g. 15s) and let onEnded trigger it
    const delay = currentSlide === 0 ? 15000 : 6000;
    const timer = setTimeout(() => {
      handleNextSlide();
    }, delay);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Filter featured products dynamically based on selected tab
  const displayProducts = productsCatalog.filter(product => {
    if (activeTab === "ALL") return true;
    if (activeTab === "CHECKED") return product.category === "Checks";
    if (activeTab === "PLAIN") return product.category === "Plain";
    if (activeTab === "PRINTED") return product.category === "Printed";
    if (activeTab === "LINEN") return product.category === "Linen";
    if (activeTab === "OVERSHIRT") return product.category === "Overshirt";
    if (activeTab === "CASUAL") return product.aesthetic === "streetwear" || product.aesthetic === "minimalist";
    if (activeTab === "FORMAL") return product.aesthetic === "classic" || product.aesthetic === "avantgarde";
    return true;
  }).slice(0, 8);

  // Shuffled lookbook list to distribute poses and avoid repeating adjacent items
  const shuffledLookbook = shuffleArray(lookbookImages, 42);

  // Masonry Lookbook Columns
  const masonryCols = [
    shuffledLookbook.filter((_, idx) => idx % 3 === 0),
    shuffledLookbook.filter((_, idx) => idx % 3 === 1),
    shuffledLookbook.filter((_, idx) => idx % 3 === 2)
  ];

  // Category list details
  const categories = [
    { name: "Checked Shirts", image: categoryBanners[0] || "/category-banners/category-1.png", count: "12 Items", href: "/products?category=Checks" },
    { name: "Plain Shirts", image: categoryBanners[1] || "/category-banners/category-2.png", count: "12 Items", href: "/products?category=Plain" },
    { name: "Linen Shirts", image: categoryBanners[3] || "/category-banners/category-4.png", count: "12 Items", href: "/products?category=Linen" },
    { name: "Printed Shirts", image: categoryBanners[2] || "/category-banners/category-3.png", count: "12 Items", href: "/products?category=Printed" },
    { name: "Formal Shirts", image: "/products/product-9.png", count: "12 Items", href: "/products?aesthetic=classic" },
    { name: "Casual Shirts", image: "/products/product-22.png", count: "12 Items", href: "/products?aesthetic=streetwear" },
    { name: "Oversized Shirts", image: "/products/product-28.png", count: "12 Items", href: "/products?category=Overshirt" },
    { name: "Summer Collection", image: categoryBanners[4] || "/category-banners/category-5.png", count: "12 Items", href: "/products" },
    { name: "New Arrivals", image: categoryBanners[5] || "/category-banners/category-6.png", count: "12 Items", href: "/products?filter=limited" }
  ];

  // Testimonials list
  const reviews = [
    {
      name: "Victoria Sterling",
      city: "London",
      rating: 5,
      fit: "M (Perfect Fit)",
      text: "The silk shirt feels incredible. The AI sizing engine was shockingly accurate—it recommended an M after I entered my height and uploaded the pictures, and it fits like a bespoke tailored piece."
    },
    {
      name: "Julien Mercer",
      city: "Milan",
      rating: 5,
      fit: "L (Perfect Fit)",
      text: "Louis Pasteur has redefined online shopping. The checkout was seamless via UPI, and the Linen shirt's structured lines look amazing. The AI fit calibration and sizing tool is a brilliant addition."
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">

      {/* Loop and render sections in custom order */}
      {sectionsOrder.map((sectionId) => {

        // --- 1. HERO SLIDER SECTION ---
        if (sectionId === "hero") {
          return (
          <section key={sectionId} className="relative w-full h-[50vh] md:h-screen overflow-hidden select-none group animate-slider" style={{ backgroundColor: '#F4F4F2' }}>
            {/* Slides Container */}
            <div className="relative w-full h-full">
              <AnimatePresence initial={false} custom={direction}>
                {slides.map((slide, idx) => {
                  if (idx !== currentSlide) return null;
                  return (
                    <motion.div
                      key={idx}
                      custom={direction}
                      variants={{
                        enter: (dir) => ({
                          x: dir > 0 ? "100%" : "-100%",
                          opacity: 0
                        }),
                        center: {
                          x: 0,
                          opacity: 1
                        },
                        exit: (dir) => ({
                          x: dir < 0 ? "100%" : "-100%",
                          opacity: 0
                        })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 32 },
                        opacity: { duration: 0.5 }
                      }}
                      className="absolute inset-0 w-full h-full"
                    >
                      {/* Zoom/Scale Animation wrapper */}
                      <motion.div
                        initial={{ scale: 1.0 }}
                        animate={{ scale: 1.06 }}
                        transition={{ duration: 6, ease: "easeOut" }}
                        className="relative w-full h-full"
                      >
                        {slide.type === 'video' ? (
                          <video
                            ref={videoRef}
                            poster={cms.heroFallbackImage || '/hero/hero-1.png'}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="object-cover w-full h-full"
                          >
                            <source src={slide.src} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <Image
                            src={slide.src}
                            alt={slide.title || "Hero Slide"}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover object-center"
                          />
                        )}
                      </motion.div>

                      {/* Dark gradient overlay - only for video slides to protect white text readability */}
                      {slide.type === 'video' && (
                        <div className="absolute inset-0 bg-black/15 z-10" />
                      )}

                      {/* Slide Content Overlay */}
                      {slide.type !== 'reminder' ? (
                        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-4">
                          {/* Center Title, Subtitle and CTA directly over background */}
                          <div className="max-w-4xl w-full flex flex-col items-center gap-4 md:gap-8 text-center px-4">
                            <motion.h1
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.8 }}
                              className={`text-3xl sm:text-5xl md:text-7xl font-editorial font-bold tracking-wider leading-tight uppercase ${slide.textColor || 'text-white'}`}
                              style={{ textShadow: slide.textColor === 'text-white' ? '0 2px 10px rgba(0,0,0,0.4)' : 'none' }}
                            >
                              {slide.title}
                            </motion.h1>

                            <motion.p
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.8 }}
                              className={`text-[10px] sm:text-xs md:text-sm tracking-[0.25em] md:tracking-[0.35em] max-w-2xl leading-relaxed uppercase ${slide.subColor || 'text-white/90'}`}
                              style={{ textShadow: slide.textColor === 'text-white' ? '0 1px 5px rgba(0,0,0,0.3)' : 'none' }}
                            >
                              {slide.subtitle}
                            </motion.p>

                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.7, duration: 0.8 }}
                              className="mt-2 md:mt-4"
                            >
                              <Link
                                href="/products"
                                className={`inline-block px-6 py-3 md:px-9 md:py-4.5 text-[9px] md:text-[11px] font-bold tracking-[0.25em] md:tracking-[0.3em] uppercase transition-all duration-300 rounded-sm shadow-md ${slide.btnClass || 'bg-white text-black border-white hover:bg-transparent hover:text-white'}`}
                              >
                                {slide.ctaText}
                              </Link>
                            </motion.div>
                          </div>
                        </div>
                      ) : (
                        /* Center Reminder card for Slide 3 */
                        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-4 md:p-6">
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="w-[240px] sm:w-[310px] bg-[#f9f8f4] border border-black rounded-2xl shadow-2xl flex flex-col overflow-hidden text-luxury-black font-sans"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between p-2.5 md:p-3.5 border-b border-black">
                              <span className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-black flex items-center justify-center text-[10px] md:text-[12px] font-bold">+</span>
                              <span className="text-[10px] md:text-[12px] font-bold text-[#E04F4F] tracking-wider uppercase">Reminder</span>
                              <div className="flex flex-col gap-0.5 w-3.5 cursor-pointer">
                                <span className="h-0.5 w-full bg-black"></span>
                                <span className="h-0.5 w-full bg-black"></span>
                              </div>
                            </div>
                            {/* Body */}
                            <div className="p-4 md:p-6 text-center flex flex-col gap-2 md:gap-4">
                              <p className="text-[11px] md:text-[13px] leading-relaxed font-semibold text-gray-800">
                                Father's Day is on 21 June and you're seeing this for a reason.
                              </p>
                            </div>
                            {/* Footer button */}
                            <Link
                              href="/products"
                              className="border-t border-black p-3 md:p-4 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-center uppercase hover:bg-black hover:text-white transition-colors"
                            >
                              GIFT NOW
                            </Link>
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Slide Indicators Navigation (Centered at the bottom) */}
            <div className="absolute bottom-5 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
              {slides.map((_, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setCurrentSlide(sIdx)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === sIdx ? 'w-10 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  aria-label={`Go to slide ${sIdx + 1}`}
                />
              ))}
            </div>

            {/* Left/Right Navigation Arrows */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 text-white p-3.5 rounded-full backdrop-blur-md transition-all border border-white/10 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 text-white p-3.5 rounded-full backdrop-blur-md transition-all border border-white/10 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight size={22} />
            </button>
          </section>
          );
        }

      // --- MATCH THE MOOD SECTION ---
      if (sectionId === "matchTheMood") {
        const collections = [
          {
            title1: "BUSINESS",
            title2: "ESSENTIALS",
            tagline: "SHARP LOOKS. STRONG IMPRESSION.",
            image: moodImages[0] || "/template/image.png",
            href: "/products?aesthetic=classic"
          },
          {
            title1: "SUMMER",
            title2: "COLLECTION",
            tagline: "LIGHTER FABRICS. BRIGHTER DAYS.",
            image: moodImages[1] || "/template/image copy.png",
            href: "/products?category=Linen"
          },
          {
            title1: "FORMAL",
            title2: "EDIT",
            tagline: "TAILORED TO PERFECTION. MADE TO LEAD.",
            image: moodImages[2] || "/template/image copy 2.png",
            href: "/products?category=Plain"
          },
          {
            title1: "EVERYDAY",
            title2: "CLASSICS",
            tagline: "COMFORT THAT FITS RIGHT INTO YOUR DAY.",
            image: moodImages[3] || "/template/image copy 3.png",
            href: "/products?aesthetic=streetwear"
          },
          {
            title1: "SIGNATURE",
            title2: "LUXURY",
            tagline: "PREMIUM FABRICS. TIMELESS ELEGANCE.",
            image: moodImages[4] || "/template/image copy 4.png",
            href: "/products?filter=limited"
          }
        ];

        return (
          <section key={sectionId} className="w-full bg-white pt-2 pb-2 md:pt-14 md:pb-8 select-none overflow-hidden">
            {/* Desktop and Tablet View */}
            <div className="hidden md:block max-w-[1400px] mx-auto px-4 md:px-12">
              {/* Section Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-4 md:mb-6"
              >
                <h2 className="text-base md:text-lg font-sans font-bold text-black tracking-[0.2em] uppercase">
                  MATCH THE MOOD
                </h2>
              </motion.div>

              {/* Grid: 5 cols on desktop, 3 cols on tablet, scroll on mobile */}
              <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-scroll-x scrollbar-none pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                {collections.map((col, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex-shrink-0 w-[65vw] sm:w-[45vw] md:w-auto"
                    style={{ aspectRatio: '320/675' }}
                  >
                    <Link
                      href={col.href}
                      className="group relative block w-full h-full rounded-sm overflow-hidden card-hover-lift"
                    >
                      {/* Full-body model image */}
                      <Image
                        src={`${col.image}?v=6`}
                        alt={`${col.title1} ${col.title2}`}
                        fill
                        sizes="(max-width: 768px) 65vw, (max-width: 1024px) 33vw, 20vw"
                        loading="lazy"
                        className="object-cover scale-[1.06] group-hover:scale-[1.11] transition-transform duration-500 ease-out"
                      />

                      {/* No text overlay needed - text is already embedded in the template images */}

                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" style={{ transition: 'transform 0.8s ease, opacity 0.3s ease' }} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile View: Horizontal scrolling list of cards with top red labels */}
            <div className="block md:hidden px-2 pt-2">
              <div className="flex overflow-x-auto gap-[6px] snap-x snap-mandatory scrollbar-none pb-2">
                {[
                  { image: moodImages[0] || "/template/image.png", label: "ENERGY", href: "/products?aesthetic=classic" },
                  { image: moodImages[1] || "/template/image copy.png", label: "ESCAPE", href: "/products?category=Linen" },
                  { image: moodImages[2] || "/template/image copy 2.png", label: "WEAR", href: "/products?category=Plain" },
                  { image: moodImages[3] || "/template/image copy 3.png", label: "CLASSIC", href: "/products?aesthetic=streetwear" },
                  { image: moodImages[4] || "/template/image copy 4.png", label: "LUXURY", href: "/products?filter=limited" }
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="relative block flex-shrink-0 w-[36vw] aspect-[3/4.4] snap-start overflow-hidden rounded-sm"
                  >
                    <Image
                      src={`${item.image}?v=6`}
                      alt={item.label}
                      fill
                      sizes="36vw"
                      priority={idx < 3}
                      className="object-cover object-center scale-[1.04]"
                    />
                    <div className="absolute top-2.5 left-0 right-0 z-10 text-center">
                      <span className="text-[#FF0000] text-[10px] font-black tracking-wide uppercase">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      }

      // --- STEALS / FEATURED OFFERS GRID ---
      if (sectionId === "stealsGrid") {
        const steals = [
          {
            image: stealImages[0] || "/template/steal-1.png",
            href: "/products"
          },
          {
            image: stealImages[1] || "/template/steal-2.png",
            href: "/products?size=XL"
          },
          {
            image: stealImages[2] || "/template/steal-3.png",
            href: "/products"
          },
          {
            image: stealImages[3] || "/template/steal-4.png",
            href: "/products"
          }
        ];

        return (
          <section key={sectionId} className="w-full bg-white pt-2 pb-6 md:pt-8 md:pb-14 select-none overflow-hidden">
            {/* Desktop & Tablet View */}
            <div className="hidden md:block max-w-[1400px] mx-auto px-4 md:px-12">
              {/* Section Header */}
              <div className="text-center mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-sans font-bold text-black tracking-[0.2em] uppercase">
                  STEALS
                </h2>
              </div>

              {/* Grid: 4 cols on desktop, 2 cols on tablet, scroll on mobile */}
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-scroll-x scrollbar-none pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                {steals.map((deal, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex-shrink-0 w-[65vw] sm:w-[45vw] md:w-auto"
                    style={{ aspectRatio: '1/1' }}
                  >
                    <Link
                      href={deal.href}
                      className="group relative block w-full h-full rounded-sm overflow-hidden card-hover-lift"
                    >
                      <Image
                        src={`${deal.image}?v=6`}
                        alt={`Steal ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 65vw, 25vw"
                        loading="lazy"
                        className="object-cover scale-[1.02] group-hover:scale-[1.07] transition-transform duration-500 ease-out"
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" 
                        style={{ transition: 'transform 0.8s ease, opacity 0.3s ease' }} 
                      />
                      <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2 shadow-sm">
                        <ArrowRight size={14} className="text-black" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile View: 2x2 grid with exact gaps and same container alignment */}
            <div className="block md:hidden px-2 pt-2">
              {/* Section Header */}
              <div className="text-center mb-4 mt-2">
                <h2 className="text-[17px] font-black text-black tracking-[0.05em] uppercase">
                  STEALS
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-[4px]">
                {steals.map((deal, idx) => (
                  <Link
                    key={idx}
                    href={deal.href}
                    className="relative block w-full aspect-square overflow-hidden"
                  >
                    <Image
                      src={`${deal.image}?v=6`}
                      alt={`Steal mobile ${idx + 1}`}
                      fill
                      sizes="50vw"
                      priority={idx < 2}
                      className="object-cover scale-[1.01]"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      }

      // --- 2. NEW ARRIVALS GRID SECTION ---
      if (sectionId === "newArrivals") {
          const popularTabs = ["ALL", "CHECKED", "PLAIN", "PRINTED", "LINEN", "OVERSHIRT", "CASUAL", "FORMAL"];
      return (
      <section key={sectionId} className="w-full max-w-[1400px] py-12 md:py-20 px-4 md:px-12 select-none">
        <div className="text-center mb-6 md:mb-8">
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-gold font-bold uppercase">FRESH DROPS</span>
          <h2 className="text-xl md:text-3xl font-editorial font-bold text-primary tracking-wide uppercase mt-2">NEW AND POPULAR</h2>
          <div className="section-divider mt-3 md:mt-4"></div>
        </div>

        {/* Scrollable Category Tabs - mobile horizontal scroll */}
        <div className="flex justify-start md:justify-center items-center gap-1.5 md:gap-2 overflow-x-auto pb-4 md:pb-6 scrollbar-none mb-6 md:mb-8 -mx-1 px-1">
          {popularTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 md:px-4 py-2 md:py-2.5 border text-[9px] md:text-[10px] tracking-widest font-bold uppercase transition-all duration-300 rounded-sm ${activeTab === tab
                  ? 'bg-black border-black text-white'
                  : 'bg-white border-gray-300 text-primary hover:border-black'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Cards — 2 cols on mobile, 4 on desktop (like Snitch/Myntra) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-12">
          {displayProducts.map((product) => {
            const inWishlist = wishlist.some(item => item.id === product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ProductCard
                  product={product}
                  inWishlist={inWishlist}
                  onWishlistToggle={toggleWishlist}
                  onAddToCart={addToCart}
                />
              </motion.div>
            );
          })}
        </div>
      </section>
      );
        }

      // --- 3. CATEGORY BANNERS SECTION ---
      if (sectionId === "categories") {
          return (
      <section key={sectionId} className="w-full max-w-[1400px] py-10 md:py-16 px-4 md:px-12 bg-white select-none">
        <div className="text-center mb-6 md:mb-10">
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-gold font-bold uppercase">EDITORIAL SELECTION</span>
          <h2 className="text-xl md:text-3xl font-editorial font-bold text-primary mt-2 tracking-wide uppercase">SHOP BY CATEGORY</h2>
          <div className="section-divider mt-3"></div>
        </div>

        {/* Horizontal scroll on mobile, 4 cols on desktop */}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-scroll-x scrollbar-none pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat, cidx) => (
            <Link
              href={cat.href}
              key={cidx}
              className="group relative flex-shrink-0 w-[55vw] sm:w-[40vw] md:w-auto aspect-[2/3] overflow-hidden rounded-lg shadow-sm card-hover-lift"
            >
              <Image
                src={`${cat.image}?v=6`}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 55vw, 25vw"
                loading="lazy"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />



              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10 flex flex-col gap-0.5">
                <span className="text-[8px] md:text-[9px] tracking-[0.25em] font-extrabold text-[#D4AF37] uppercase">{cat.count.toUpperCase()}</span>
                <h3 className="text-[13px] md:text-base font-editorial font-bold text-black uppercase tracking-wider leading-tight">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
      );
        }
      // --- ABOUT THE ATELIER STORY SECTION ---
      if (sectionId === "about") {
          return (
      <section key={sectionId} className="w-full bg-[#fcfbfa] py-20 border-y border-luxury-border flex justify-center">
        <div className="max-w-[1200px] w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Branding details */}
          <div className="flex flex-col gap-6 text-luxury-black">
            <span className="text-[10px] tracking-[0.3em] text-gold font-bold uppercase">THE BRAND STORY</span>
            <h2 className="text-3xl md:text-5xl font-editorial font-bold text-primary tracking-wide uppercase leading-tight">
              LOUIS PASTEUR ATELIER
            </h2>
            <p className="text-[12px] text-gray-500 leading-relaxed font-light">
              Merging the tactile artistry of traditional Parisian menswear tailoring with computational body calibration neural nets. We design shirts exclusively for the modern silhouette—using pure Italian linen, mulberry silk, and Egyptian cotton.
            </p>
            <p className="text-[12px] text-gray-500 leading-relaxed font-light">
              Our AI Sizing Scanner calibrates physical dimensions to ensure a 98.6% fit confidence match, reducing standard return rates to the single digits.
            </p>
            <div className="flex gap-4 items-center mt-2">
              <Link
                href="/about"
                className="text-[10px] tracking-[0.2em] font-bold bg-primary text-white hover:bg-gold py-4 px-8 transition-all duration-300 rounded-sm uppercase shadow"
              >
                READ OUR JOURNAL
              </Link>
              <a
                href="https://www.instagram.com/louispasteur.clothing/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.2em] font-bold text-primary hover:text-gold uppercase"
              >
                @louispasteur.clothing
              </a>
            </div>
          </div>

          {/* Right: Premium lookbook image */}
          <div className="relative aspect-[4/3] rounded overflow-hidden border border-luxury-border bg-luxury-gray shadow-sm">
            <Image
              src="/lookbook/lookbook-4.png"
              alt="Atelier Crafts"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>
      );
        }

        // --- 4. LIMITED EDITION DROP ---
        if (sectionId === "limited") {
          return (
            <section key={sectionId} className="w-full py-6 md:py-16 px-4 md:px-12 flex flex-col items-center gap-3 md:gap-6 select-none bg-white">
              <div className="text-center mb-1 md:mb-2">
                <h2 className="text-[20px] md:text-[24px] font-black text-black tracking-[0.1em] uppercase">SHOP YOUR SIZE</h2>
              </div>
              
              <div className="max-w-[1100px] w-full bg-white rounded-xl overflow-hidden flex flex-col md:flex-row items-center border border-gray-200 shadow-sm">
                {/* Left Side (Desktop) / Top (Mobile): Image Area */}
                <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[400px] bg-luxury-gray overflow-hidden">
                  {/* Mobile image (Walking models) */}
                  <div className="block md:hidden relative w-full h-[200px]">
                    <Image 
                      src="/category-banners/category-3.png" 
                      alt="Shop Your Size mobile campaign"
                      fill
                      sizes="100vw"
                      loading="lazy"
                      className="object-cover object-center" 
                    />
                  </div>
                  {/* Desktop image (Sitting model) */}
                  <div className="hidden md:block relative w-full h-full">
                    <Image 
                      src="/lookbook/lookbook-11.png" 
                      alt="Shop Your Size campaign"
                      fill
                      sizes="50vw"
                      loading="lazy"
                      className="object-cover object-top md:object-left" 
                    />
                  </div>
                </div>
                
                {/* Right Side (Desktop) / Bottom (Mobile): Typography Promo */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-5 md:p-12 text-luxury-black gap-2 md:gap-4">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-2xl md:text-5xl font-editorial font-bold text-primary tracking-tight">
                      Last chance!
                    </h3>
                    <p className="text-[10px] md:text-[12px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">
                      Few sizes left
                    </p>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight leading-none my-1 md:my-2">
                    UPTO 30% OFF*
                  </h2>
 
                  {/* Sizing Selector Circle Buttons */}
                  <div className="flex flex-col gap-1.5 mt-1 md:mt-2">
                    <span className="text-[8px] md:text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">Select Size to Shop</span>
                    <div className="flex flex-row md:flex-wrap gap-2.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                      {["S", "M", "L", "XL"].map((size) => (
                        <Link
                          key={size}
                          href={`/products?size=${size}`}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center text-[10px] md:text-[11px] font-black tracking-wider border border-black hover:bg-gold hover:border-gold hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm shrink-0"
                        >
                          {size}
                        </Link>
                      ))}
                    </div>
                  </div>
 
                  <Link 
                    href="/products" 
                    className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold bg-primary text-white hover:bg-gold py-3 px-6 md:py-4 md:px-8 mt-2 md:mt-4 transition-all duration-300 w-fit rounded-lg uppercase shadow-lg text-center"
                  >
                    Browse All Garments
                  </Link>
                </div>
              </div>
            </section>
          );
        }

      // --- 5. EDITORIAL CAMPAIGN BANNERS SECTION ---
      if (sectionId === "campaigns") {
          return (
      <section key={sectionId} className="w-full flex flex-col gap-8 md:gap-12 py-12 md:py-16 px-4 md:px-12 max-w-[1400px]">
        <div className="text-center">
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-gold font-bold uppercase">EDITORIAL NARRATIVES</span>
          <h2 className="text-2xl md:text-3xl font-editorial font-bold text-primary mt-1">THE LOUIS PASTEUR MONOGRAPHS</h2>
        </div>

        {/* Full Width Campaign Banner 1 */}
        <div className="relative w-full h-[40vh] md:h-[60vh] rounded-xl overflow-hidden border border-luxury-border flex items-center p-6 md:p-16" style={{ backgroundColor: '#F4F4F2' }}>
          <Image
            src={`${campaignBanners[1] || "/lookbook/lookbook-12.png"}?v=6`}
            alt="Campaign banner 1"
            fill
            sizes="100vw"
            loading="lazy"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />

          <div className="relative z-10 max-w-lg flex flex-col gap-3 md:gap-4 text-white">
            <span className="text-[8px] md:text-[9px] tracking-widest text-gold font-bold uppercase">MONOCHROME STORIES</span>
            <h3 className="text-xl md:text-4xl font-editorial font-bold uppercase tracking-wide">SILENT DRAPE</h3>
            <p className="text-[10px] md:text-[11px] text-gray-200 leading-relaxed font-light">
              Fluidity resolved against stark structured backgrounds. The juxtaposition of silk weave alignments and concrete minimalism.
            </p>
            <Link href="/products" className="text-[9px] md:text-[10px] tracking-wider font-bold text-gold uppercase underline flex items-center gap-1">
              Explore Monographs <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* Campaign Banner 2 Grid - horizontal scrolling on mobile, grid on desktop */}
        <div className="flex flex-row md:grid md:grid-cols-2 gap-4 md:gap-8 overflow-x-auto md:overflow-visible scrollbar-none pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {/* Banner 2.1 */}
          <div className="relative w-[85vw] md:w-auto flex-shrink-0 aspect-[16/10] rounded-xl overflow-hidden border border-luxury-border flex items-end p-5 md:p-8" style={{ backgroundColor: '#F4F4F2' }}>
            <Image
              src={`${campaignBanners[2] || "/lookbook/lookbook-13.png"}?v=6`}
              alt="Campaign banner 2"
              fill
              sizes="(max-width: 768px) 85vw, 50vw"
              loading="lazy"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 text-white flex flex-col gap-1 drop-shadow" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}>
              <h4 className="text-[12px] md:text-[14px] font-editorial font-bold uppercase">THE ATELIER LIGHT</h4>
              <p className="text-[9px] md:text-[10px] text-gray-200 font-light">Precision cuts designed to silhouette dynamic joint movements.</p>
            </div>
          </div>

          {/* Banner 2.2 */}
          <div className="relative w-[85vw] md:w-auto flex-shrink-0 aspect-[16/10] rounded-xl overflow-hidden border border-luxury-border flex items-end p-5 md:p-8" style={{ backgroundColor: '#F4F4F2' }}>
            <Image
              src={`${campaignBanners[3] || "/lookbook/lookbook-14.png"}?v=6`}
              alt="Campaign banner 3"
              fill
              sizes="(max-width: 768px) 85vw, 50vw"
              loading="lazy"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 text-white flex flex-col gap-1 drop-shadow" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}>
              <h4 className="text-[12px] md:text-[14px] font-editorial font-bold uppercase">COUTURE ALIGNMENT</h4>
              <p className="text-[9px] md:text-[10px] text-gray-200 font-light">Bespoke digital tailoring formulas synchronized across platforms.</p>
            </div>
          </div>
        </div>
      </section>
      );
        }

      // --- 6. MASONRY PINTEREST LOOKBOOK GALLERY ---
      if (sectionId === "lookbook") {
          return (
      <section key={sectionId} className="w-full max-w-[1400px] py-20 px-6 md:px-12" id="lookbook">
        <div className="text-center flex flex-col items-center gap-2 mb-16">
          <span className="text-[10px] tracking-[0.3em] text-gold font-bold uppercase">{cms.lookbookTitle}</span>
          <p className="text-md md:text-xl font-editorial italic text-gray-500 max-w-xl">
            {cms.lookbookQuote}
          </p>
        </div>

        {/* Pinterest-style Masonry Columns */}
        <div className="flex flex-col md:flex-row gap-5">
          {masonryCols.map((col, cidx) => (
            <div key={cidx} className="flex-1 flex flex-col gap-5">
              {col.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-full rounded overflow-hidden border border-luxury-border group shadow-sm card-hover-lift"
                  style={{ backgroundColor: '#F4F4F2' }}
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={`${imgUrl}?v=6`}
                      alt={`Lookbook photo ${imgUrl.split('/').pop().replace('.png', '')}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      className="object-cover object-top transition-all duration-700 group-hover:scale-105"
                    />
                    {/* Subtle hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      );
        }

      // --- 7. AI BODY SCANNER PROMOTION BANNER ---
      if (sectionId === "aiBanner") {
          return (
      <section key={sectionId} className="w-full bg-luxury-gray py-20 px-6 md:px-12 flex justify-center">
        <div className="max-w-[1200px] w-full bg-white border border-luxury-border p-8 md:p-16 rounded grid grid-cols-1 md:grid-cols-2 gap-12 items-center shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles size={18} />
              <span className="text-[11px] tracking-[0.2em] font-bold uppercase">LOUIS PASTEUR ATELIER TECHNOLOGY</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-editorial font-bold text-primary tracking-wide leading-tight uppercase">
              ELIMINATE THE SIZING DILEMMA WITH AI
            </h2>

            <p className="text-[12px] text-gray-500 leading-relaxed">
              Upload a front photo, a side photo, and enter your height. Our anthropometric engine calculates precise chest, waist, and inseam measurements to match you with the exact garment sizes—reducing return rates by up to 30%.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-luxury-gray border border-luxury-border flex items-center justify-center text-[10px] font-bold text-primary">1</div>
                <span className="text-[11px] text-gray-600">Enter your reference height (cm)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-luxury-gray border border-luxury-border flex items-center justify-center text-[10px] font-bold text-primary">2</div>
                <span className="text-[11px] text-gray-600">Upload high-contrast front and side profile photos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-luxury-gray border border-luxury-border flex items-center justify-center text-[10px] font-bold text-primary">3</div>
                <span className="text-[11px] text-gray-600">Unlock your bespoke dimensions and fit rating outputs</span>
              </div>
            </div>

            <Link
              href="/dashboard/measurements"
              className="text-[10px] tracking-[0.2em] font-semibold bg-primary text-white hover:bg-gold py-4 px-8 transition-all duration-300 w-fit rounded-sm shadow-md uppercase"
            >
              RUN BODY SCAN NOW
            </Link>
          </div>

          <div className="flex justify-center relative">
            <div className="w-full max-w-[340px] aspect-[3/4] border border-luxury-border rounded-lg relative overflow-hidden flex flex-col justify-between p-5" style={{ backgroundColor: '#F4F4F2' }}>
              {/* Animated scan line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/15 to-transparent animate-scan z-20 pointer-events-none" />
              {/* Grid overlay for tech look */}
              <div className="absolute inset-0 opacity-5 z-10 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />

              <div className="relative z-30 flex items-center justify-between border-b border-luxury-border pb-3">
                <span className="text-[10px] font-bold tracking-wider text-primary">AI Posture Scanner</span>
                <span className="text-[9px] text-gold font-bold flex items-center gap-1 animate-pulse"><Sparkles size={10} /> CALIBRATING</span>
              </div>

              {/* Model Image */}
              <div className="flex-grow relative overflow-hidden rounded my-3">
                <Image
                  src="/lookbook/scanner-model.png?v=6"
                  alt="Fit scanner model"
                  fill
                  sizes="320px"
                  loading="lazy"
                  className="object-cover object-top"
                />
                {/* Corner scan markers */}
                <div className="absolute top-2 left-2 w-5 h-5 border-l-2 border-t-2 border-gold z-30" />
                <div className="absolute top-2 right-2 w-5 h-5 border-r-2 border-t-2 border-gold z-30" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-l-2 border-b-2 border-gold z-30" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-r-2 border-b-2 border-gold z-30" />
              </div>

              <div className="relative z-30 border-t border-luxury-border pt-3 flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Chest Fit Target</span>
                  <span className="font-semibold text-primary">96cm (Size M Match)</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Fit Index Accuracy</span>
                  <span className="text-green-600 font-bold">98.6% Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      );
        }

      // --- 8. CUSTOMER TESTIMONIALS SECTION ---
      if (sectionId === "reviews") {
          return (
      <section key={sectionId} className="w-full bg-[#F8F8F8] py-20 px-6 md:px-12 flex justify-center border-y border-luxury-border">
        <div className="max-w-[1200px] w-full">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] text-gold font-bold uppercase">VOICES OF SATISFACTION</span>
            <h2 className="text-2xl md:text-3xl font-editorial font-bold text-primary mt-1">THE BESPOKE REPUTATION</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white border border-luxury-border p-8 rounded shadow-sm flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-1 text-gold">
                    {[...Array(rev.rating)].map((_, s) => (
                      <Star key={s} size={12} className="fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed font-light italic">
                    "{rev.text}"
                  </p>
                </div>
                <div className="flex justify-between items-baseline border-t border-luxury-border pt-4 mt-2">
                  <div>
                    <h4 className="text-[11px] font-bold text-primary">{rev.name.toUpperCase()}</h4>
                    <span className="text-[9px] text-gray-400">{rev.city}</span>
                  </div>
                  <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{rev.fit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      );
        }

      // --- 9. INSTAGRAM JOURNAL SECTION ---
      if (sectionId === "instagram") {
          return (
      <section key={sectionId} className="w-full max-w-[1400px] py-20 px-6 md:px-12 text-center">
        <div className="flex flex-col items-center gap-1 mb-12">
          <Instagram size={20} className="text-gold" />
          <span className="text-[10px] tracking-[0.3em] font-bold text-primary uppercase">JOURNAL VISUEL</span>
          <p className="text-[11px] text-gray-400 mt-1">Follow our narrative on Instagram <a href="https://www.instagram.com/louispasteur.clothing/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:text-gold">@louispasteur.clothing</a></p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {heroImages.slice(0, 4).map((url, idx) => (
            <div key={idx} className="aspect-square overflow-hidden bg-luxury-gray border border-luxury-border rounded group relative">
              <Image
                src={url}
                alt="Instagram post"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Instagram size={18} className="text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>
      );
        }

      return null;
      })}
    </div>
  );
}
