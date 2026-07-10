"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from './StateContext';
import { Search, Heart, ShoppingBag, User, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, wishlist, user, setUser, setCartOpen, setSearchOpen, cms } = useAppState();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Monitor scroll for sticky layout change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const campaigns = [
    { title: "CHECKS", image: "/category-banners/category-1.png", href: "/products?category=Checks" },
    { title: "PLAIN", image: "/category-banners/category-2.png", href: "/products?category=Plain" },
    { title: "PRINTED", image: "/category-banners/category-3.png", href: "/products?category=Printed" },
    { title: "LINEN", image: "/category-banners/category-4.png", href: "/products?category=Linen" }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* 1. Announcement Bar — hidden on mobile, bottom nav used instead */}
      <div className="hidden md:block bg-primary text-white text-[10px] tracking-[0.25em] font-medium py-2 px-4 text-center border-b border-white/10 uppercase select-none">
        {cms.announcement}
      </div>

      {/* 2. Main Luxury Header Navbar */}
      <nav className={`w-full py-2 md:py-3 px-4 md:px-8 flex items-center justify-between border-b transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 backdrop-blur-md border-luxury-border/50 py-1.5 md:py-2 shadow-sm' 
          : 'bg-white border-transparent'
      }`}>
        {/* Left Section: Menu Toggle on Mobile / Logo on Desktop */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-luxury-black hover:text-gold transition-colors p-1"
            onClick={() => setDrawerOpen(true)}
            title="Open Categories Menu"
          >
            <Menu size={22} className="stroke-[1.5]" />
          </button>

          {/* Desktop branding logo (aligned to the left) */}
          <div className="hidden md:block">
            <Link href="/" className="group flex items-center gap-2.5 select-none">
              <div className="relative w-8 h-8 overflow-hidden rounded-sm border border-luxury-border/10 bg-black">
                <Image 
                  src="/logo.png" 
                  alt="Louis Pasteur" 
                  fill 
                  sizes="32px"
                  className="object-contain" 
                />
              </div>
              <span className="text-[15px] font-editorial font-bold tracking-[0.25em] text-primary group-hover:text-gold transition-colors duration-300">
                LOUIS PASTEUR
              </span>
            </Link>
          </div>
        </div>

        {/* Center Section: Mobile branding logo (absolute centered) / Desktop Navigation Links */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center flex items-center justify-center md:static md:translate-x-0 md:flex-grow">
          {/* Mobile Logo */}
          <div className="md:hidden">
            <Link href="/" className="group flex items-center gap-2.5 select-none">
              <div className="relative w-8 h-8 overflow-hidden rounded-sm border border-luxury-border/10 bg-black">
                <Image 
                  src="/logo.png" 
                  alt="Louis Pasteur" 
                  fill 
                  sizes="32px"
                  className="object-contain" 
                />
              </div>
              <span className="text-[15px] font-editorial font-bold tracking-[0.25em] text-primary group-hover:text-gold transition-colors duration-300">
                LOUIS PASTEUR
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 mx-auto">
            {[
              { label: 'NEW ARRIVALS', href: '/products' },
              { label: 'BESTSELLERS', href: '/products?filter=bestsellers' },
              { label: 'LINEN', href: '/products?category=Linen' },
              { label: 'CHECKS', href: '/products?category=Checks' },
              { label: 'PRINTED', href: '/products?category=Printed' },
              { label: 'ABOUT', href: '/about' },
            ].map((link, idx) => (
              <Link 
                key={idx}
                href={link.href}
                className={`text-[10px] lg:text-[11px] font-bold tracking-[0.2em] transition-colors duration-300 hover:text-gold relative py-1 group/item ${
                  pathname === link.href ? 'text-gold' : 'text-primary'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left ${
                  pathname === link.href ? 'scale-x-100' : ''
                }`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section: User Action Items */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search bar matching Snitch */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder='Search "BLACK SHIRTS"' 
              onClick={() => setSearchOpen(true)}
              className="pl-9 pr-3 py-2 w-64 border border-gray-300 rounded-sm text-[10px] uppercase tracking-wider focus:outline-none focus:border-black bg-luxury-gray cursor-pointer"
              readOnly
            />
          </div>

          <button 
            onClick={() => setSearchOpen(true)} 
            className="md:hidden text-luxury-black hover:text-gold transition-colors p-1"
            title="Search Products"
          >
            <Search size={20} />
          </button>

          <div className="relative group">
            <Link 
              href={user ? "/dashboard/profile" : "/login"} 
              className="text-luxury-black hover:text-gold transition-colors p-1 flex items-center gap-1"
              title="Account"
            >
              <User size={20} />
            </Link>
            
            {/* Quick dropdown menu for logged in users */}
            {user && (
              <div className="absolute right-0 top-full pt-3 w-48 hidden group-hover:block z-50">
                <div className="bg-white border border-luxury-border shadow-lg py-2 rounded">
                  <div className="px-4 py-2 border-b border-luxury-border">
                    <p className="text-[10px] text-gray-400">LOYALTY RANK</p>
                    <p className="text-[11px] font-bold text-gold flex items-center gap-1 uppercase">{user.loyaltyRank}</p>
                  </div>
                  <Link href="/dashboard/profile" className="block px-4 py-2 text-[12px] text-gray-600 hover:bg-luxury-gray hover:text-primary">Profile Dashboard</Link>
                  <Link href="/dashboard/orders" className="block px-4 py-2 text-[12px] text-gray-600 hover:bg-luxury-gray hover:text-primary">Order History</Link>
                  {user.isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-[12px] text-gold font-semibold hover:bg-luxury-gray">Admin Enterprise</Link>
                  )}
                  <button 
                    onClick={() => setUser(null)} 
                    className="w-full text-left block px-4 py-2 text-[12px] text-red-500 hover:bg-luxury-gray border-t border-luxury-border mt-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setCartOpen(true)} 
            className="relative text-luxury-black hover:text-gold transition-colors p-1"
            title="Cart"
          >
            <ShoppingBag size={20} />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E04F4F] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Left-sliding Categories Drawer Menu */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black z-[100] cursor-pointer"
            />

            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="fixed left-0 top-0 bottom-0 w-full sm:w-[380px] bg-white z-[101] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-luxury-border flex items-center justify-between">
                <span className="w-5" />
                <h3 className="text-xs font-bold tracking-[0.25em] text-primary text-center">CATEGORIES</h3>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 hover:text-gold transition-colors"
                  title="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-6">
                
                {/* Horizontal Campaign Thumbnails */}
                <div>
                  <span className="text-[9px] tracking-[0.15em] font-bold text-gray-400 uppercase mb-3 block">FEATURED CAMPAIGNS</span>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                    {campaigns.map((camp, idx) => (
                      <Link 
                        key={idx} 
                        href={camp.href} 
                        onClick={() => setDrawerOpen(false)}
                        className="flex-shrink-0 w-24 snap-start group"
                      >
                        <div className="relative aspect-[3/4] rounded overflow-hidden border border-luxury-border bg-luxury-gray">
                          <Image 
                            src={camp.image} 
                            alt={camp.title}
                            fill
                            sizes="96px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/10" />
                        </div>
                        <span className="text-[9px] font-bold tracking-[0.1em] text-center block mt-1.5 text-primary group-hover:text-gold transition-colors">{camp.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Links Stack */}
                <div className="flex flex-col gap-1 border-t border-luxury-border/60 pt-4">
                  <span className="text-[9px] tracking-[0.15em] font-bold text-gray-400 uppercase mb-2 block">SHOP BY CATEGORY</span>
                  
                  {[
                    { label: 'NEW ARRIVALS', href: '/products' },
                    { label: 'BESTSELLERS', href: '/products?filter=bestsellers' },
                    { label: 'SHOP ALL SHIRTS', href: '/products' },
                    { label: 'LINEN SHIRTS', href: '/products?category=Linen' },
                    { label: 'CHECKED SHIRTS', href: '/products?category=Checks' },
                    { label: 'PLAIN SHIRTS', href: '/products?category=Plain' },
                    { label: 'PRINTED SHIRTS', href: '/products?category=Printed' },
                    { label: 'OVERSHIRTS', href: '/products?category=Overshirt' },
                    { label: 'ABOUT THE ATELIER', href: '/about' },
                  ].map((link, idx) => (
                    <Link 
                      key={idx}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="text-[12px] font-bold tracking-[0.15em] text-primary hover:text-gold transition-colors py-3 border-b border-luxury-border/30 flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <span className="text-gray-300 text-[10px]">→</span>
                    </Link>
                  ))}
                </div>


              </div>

              {/* Footer info */}
              <div className="p-5 border-t border-luxury-border bg-luxury-gray text-center flex flex-col gap-1.5 justify-center items-center">
                <p className="text-[9px] text-gray-400 tracking-wider">LOUIS PASTEUR ATELIER</p>
                <a 
                  href="https://www.instagram.com/louispasteur.clothing/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[9px] font-bold text-primary hover:text-gold uppercase tracking-widest transition-colors"
                >
                  @louispasteur.clothing
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
