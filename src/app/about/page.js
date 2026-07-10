"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Mail, Instagram, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="w-full bg-white select-none">
      
      {/* 1. Header Hero Banner */}
      <section className="relative w-full h-[60vh] bg-black overflow-hidden flex items-center justify-center p-6">
        <Image 
          src="/products/product-21.png" 
          alt="Atelier Heritage" 
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 z-10" />
        
        <div className="relative z-20 text-center max-w-2xl flex flex-col items-center gap-4 text-white">
          <span className="text-[10px] tracking-[0.3em] text-gold font-bold uppercase">HERITAGE & INNOVATION</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-editorial font-bold tracking-wider uppercase drop-shadow-md">
            LOUIS PASTEUR
          </h1>
          <p className="text-[11px] sm:text-xs tracking-[0.25em] text-gray-300 uppercase leading-relaxed max-w-lg">
            A Parisian Atelier merging heritage tailoring with premium D2C menswear.
          </p>
        </div>
      </section>

      {/* 2. Core Story Grid */}
      <section className="w-full max-w-[1200px] mx-auto py-24 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[3/4] rounded overflow-hidden border border-luxury-border bg-luxury-gray">
          <Image 
            src="/products/product-22.png" 
            alt="Craftsmanship" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-6 text-luxury-black">
          <span className="text-[9px] tracking-[0.25em] text-gold font-bold uppercase">THE ATELIER PHILOSOPHY</span>
          <h2 className="text-3xl md:text-4xl font-editorial font-bold text-primary tracking-wide uppercase">
            L'ART DE LA COUTURE ET DU FIT
          </h2>
          
          <p className="text-[13px] text-gray-500 leading-relaxed font-light">
            Founded with a commitment to redefining menswear silhouettes, **Louis Pasteur Atelier** bridges the gap between classic tailoring and modern digital intelligence. We design exclusively for the modern man, focusing on the ultimate luxury shirt category—checks, plains, linen, and printed overshirts.
          </p>

          <p className="text-[13px] text-gray-500 leading-relaxed font-light">
            Each piece is crafted from premium materials—including Mulberry Silk, Italian Linen, and Egyptian Cotton. We believe that fit is architectural. Each garment is meticulously designed to offer a comfortable and flattering drape for all standard body types.
          </p>

          <div className="flex flex-col gap-3 mt-4 border-t border-luxury-border/60 pt-6">
            <div className="flex items-center gap-3">
              <Award size={16} className="text-gold shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-primary uppercase">Pure Italian Fabrics</h4>
                <p className="text-[10px] text-gray-400">Strictly sourced natural linen, silk jacquard, and long-staple cotton.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-gold shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-primary uppercase">Meticulous Fit Engineering</h4>
                <p className="text-[10px] text-gray-400">Carefully designed silhouettes ensuring a perfect comfortable fit for standard sizing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Social Integration & Contact info */}
      <section className="w-full bg-luxury-gray py-20 px-6 md:px-12 flex justify-center border-t border-y border-luxury-border">
        <div className="max-w-[800px] w-full text-center flex flex-col items-center gap-8">
          <span className="text-[10px] tracking-[0.25em] text-gold font-bold uppercase">COMMUNICATION DIRECTORY</span>
          <h3 className="text-2xl md:text-3xl font-editorial font-bold text-primary uppercase">
            CONNECT WITH THE ATELIER
          </h3>
          <p className="text-[12px] text-gray-500 leading-relaxed max-w-md font-light">
            Follow our digital chronicles for seasonal collections, looks, and product releases, or contact our support console directly.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mt-2">
            {/* Instagram Link */}
            <a 
              href="https://www.instagram.com/louispasteur.clothing/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-luxury-border hover:border-gold hover:text-gold p-6 rounded flex flex-col items-center gap-3 transition-all group shadow-sm"
            >
              <Instagram size={24} className="text-primary group-hover:text-gold transition-colors" />
              <span className="text-[11px] font-bold tracking-widest text-primary group-hover:text-gold transition-colors">@louispasteur.clothing</span>
              <p className="text-[9px] text-gray-400">Follow our Visual Journal for drops and releases</p>
            </a>

            {/* Email Link */}
            <a 
              href="mailto:welouispasteur@gmail.com" 
              className="flex-1 bg-white border border-luxury-border hover:border-gold hover:text-gold p-6 rounded flex flex-col items-center gap-3 transition-all group shadow-sm"
            >
              <Mail size={24} className="text-primary group-hover:text-gold transition-colors" />
              <span className="text-[11px] font-bold tracking-widest text-primary group-hover:text-gold transition-colors">welouispasteur@gmail.com</span>
              <p className="text-[9px] text-gray-400">Reach our concierge desk directly for support</p>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Action Banner */}
      <section className="w-full max-w-[1200px] mx-auto py-24 px-6 md:px-12 text-center flex flex-col items-center gap-6">
        <h3 className="text-2xl md:text-4xl font-editorial font-bold text-primary uppercase tracking-wide">
          DISCOVER THE COLLECTION
        </h3>
        <p className="text-[12px] text-gray-500 max-w-sm leading-relaxed font-light">
          Experience our premium shirting catalogue and find your perfect size.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/products" 
            className="bg-primary hover:bg-gold text-white font-bold text-[10px] tracking-[0.2em] py-4 px-8 transition-colors rounded-sm uppercase shadow-md"
          >
            Browse Catalog
          </Link>
        </div>
      </section>
    </div>
  );
}
