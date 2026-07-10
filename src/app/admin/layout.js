"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert, BarChart3, Package, ShoppingCart, Edit3, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useAppState } from '@/components/StateContext';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppState();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center">
        <div className="text-center p-8 bg-white border border-luxury-border rounded shadow-md max-w-sm">
          <ShieldAlert size={36} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Access Denied</h3>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider leading-relaxed">
            Verifying secure administrator session signature...
          </p>
        </div>
      </div>
    );
  }

  const adminLinks = [
    { label: 'Analytics & ROI', href: '/admin', icon: BarChart3 },
    { label: 'Inventory & Sizes', href: '/admin/products', icon: Package },
    { label: 'Order Logistics', href: '/admin/orders', icon: ShoppingCart },
    { label: 'CMS Configurator', href: '/admin/cms', icon: Edit3 },
    { label: 'Image & Layout Manager', href: '/admin/images', icon: ImageIcon },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row gap-12">
      
      {/* Admin Side Nav */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="bg-[#111111] text-white p-6 rounded flex flex-col gap-2 relative overflow-hidden border border-white/5 shadow-lg">
          <div className="flex items-center gap-2 text-gold">
            <ShieldAlert size={16} />
            <span className="text-[10px] tracking-[0.2em] font-bold uppercase">SV ENTERPRISE</span>
          </div>
          <div>
            <h3 className="text-[14px] font-editorial font-bold uppercase tracking-wide">ADMIN CONSOLE</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Atelier management active</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 text-[12px] p-3 rounded transition-all ${
                  isActive 
                    ? 'bg-primary text-white font-semibold' 
                    : 'text-gray-600 hover:bg-luxury-gray hover:text-primary'
                }`}
              >
                <link.icon size={14} className={isActive ? "text-gold" : "text-gray-400"} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <Link 
            href="/"
            className="flex items-center gap-3 text-[12px] p-3 text-gray-400 hover:text-primary transition-all border-t border-luxury-border mt-4"
          >
            <ArrowLeft size={14} />
            <span>Storefront Front</span>
          </Link>
        </nav>
      </aside>

      {/* Main Admin Content View */}
      <div className="flex-grow bg-white border border-luxury-border p-6 md:p-8 rounded min-h-[500px]">
        {children}
      </div>

    </div>
  );
}
