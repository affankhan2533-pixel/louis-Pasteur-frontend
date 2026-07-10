"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16">
        {/* Column 1: Editorial Branding & Newsletter */}
        <div className="flex flex-col gap-6 md:col-span-2 max-w-md">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded border border-white/10 bg-black">
              <Image 
                src="/logo.png" 
                alt="Louis Pasteur" 
                fill 
                sizes="40px"
                className="object-contain" 
              />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-md font-editorial font-bold tracking-[0.2em]">LOUIS PASTEUR</span>
              <span className="text-[7px] tracking-[0.4em] font-light text-gray-500 mt-0.5">ATELIER PARIS</span>
            </div>
          </Link>
          
          <p className="text-[12px] text-gray-400 leading-relaxed font-light">
            An avant-garde integration of haute couture craftsmanship and premium D2C menswear. Experience luxury shirts crafted to standard sizes.
            <span className="block mt-3 text-[11px] text-gold tracking-wide font-bold">
              EMAIL: <a href="mailto:welouispasteur@gmail.com" className="hover:underline text-white ml-1 font-normal lowercase">welouispasteur@gmail.com</a>
            </span>
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.15em] font-bold text-gold uppercase">Subscribe to the Chronicles</label>
            <div className="relative border-b border-white/20 focus-within:border-gold transition-colors py-2 flex items-center">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-[11px] tracking-widest text-white placeholder-gray-600 focus:outline-none w-full pr-8"
                required
              />
              <button 
                type="submit" 
                className="absolute right-0 text-gray-400 hover:text-gold transition-colors"
                title="Submit Subscription"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            {subscribed && <p className="text-[10px] text-gold">Thank you for joining the Louis Pasteur circle.</p>}
          </form>
        </div>

        {/* Column 2: Shop Catalog */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase border-b border-white/10 pb-2">THE COLLECTIONS</h4>
          <ul className="flex flex-col gap-2">
            <li><Link href="/new-arrivals" className="text-[12px] text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link href="/category/shirts" className="text-[12px] text-gray-400 hover:text-white transition-colors">Luxury Shirts</Link></li>
            <li><Link href="/category/pants" className="text-[12px] text-gray-400 hover:text-white transition-colors">Tailored Trousers</Link></li>
            <li><Link href="/products?filter=limited" className="text-[12px] text-gray-400 hover:text-white transition-colors">Limited Edition</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase border-b border-white/10 pb-2">CUSTOMER CARE</h4>
          <ul className="flex flex-col gap-2">
            <li><Link href="/dashboard/profile" className="text-[12px] text-gray-400 hover:text-white transition-colors">Customer Profile</Link></li>
            <li><Link href="/dashboard/orders" className="text-[12px] text-gray-400 hover:text-white transition-colors">Order Tracking</Link></li>
            <li><Link href="/about" className="text-[12px] text-gray-400 hover:text-white transition-colors">Atelier Heritage</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t border-white/5 max-w-[1400px] mx-auto px-6 md:px-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-[11px] text-gray-500 font-light flex flex-col md:flex-row gap-4 items-center">
          <span>&copy; {new Date().getFullYear()} LOUIS PASTEUR ATELIER. ALL RIGHTS RESERVED.</span>
          <span className="hidden md:inline font-bold">|</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Payment Gateways logos mock */}
        <div className="flex items-center gap-4 text-[10px] text-gray-500">
          <ShieldCheck size={14} className="text-gold" />
          <span>UPI / EMI / CREDITS SECURED BY RAZORPAY</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-400">
          <a href="https://www.instagram.com/louispasteur.clothing/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors"><Instagram size={16} /></a>
          <a href="#" className="hover:text-gold transition-colors"><Facebook size={16} /></a>
          <a href="#" className="hover:text-gold transition-colors"><Twitter size={16} /></a>
        </div>
      </div>
    </footer>
  );
}
