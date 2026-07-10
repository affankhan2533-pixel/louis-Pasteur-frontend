"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { catalog } from '@/lib/catalog';

const StateContext = createContext();

export function StateProvider({ children }) {
  // User starts as null — must log in via the login page
  const [user, setUser] = useState(null);

  const [cart, setCart] = useState([
    {
      id: "shirt-1",
      name: "Atelier Mulberry Silk Checked Shirt in Noir (Vol. 1)",
      price: 1099,
      image: "/products/product-1.png",
      size: "M",
      quantity: 1,
      type: "shirt"
    }
  ]);

  const [wishlist, setWishlist] = useState([]);
  const [compareProducts, setCompareProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Image Management System States (using your uploaded files)
  const [heroImages, setHeroImages] = useState([
    "/hero/hero-1.png",
    "/hero/hero-2.png",
    "/hero/hero-3.png",
    "/hero/hero-4.png",
    "/hero/hero-5.png"
  ]);

  const [lookbookImages, setLookbookImages] = useState([
    // AI lookbook images (1 to 15)
    ...Array.from({ length: 15 }).map((_, i) => `/lookbook/lookbook-${i + 1}.png`),
    // Curated original product model images (excluding close-ups and boxes)
    ...[8, 9, 11, 13, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 32, 33, 35, 36, 37, 38, 39, 40].map(n => `/products/product-${n}.png`)
  ]);

  const [categoryBanners, setCategoryBanners] = useState([
    "/category-banners/category-1.png",
    "/category-banners/category-2.png",
    "/category-banners/category-3.png",
    "/category-banners/category-4.png",
    "/category-banners/category-5.png",
    "/category-banners/category-6.png"
  ]);

  const [campaignBanners, setCampaignBanners] = useState([
    "/lookbook/lookbook-11.png",
    "/lookbook/lookbook-12.png",
    "/lookbook/lookbook-13.png",
    "/lookbook/lookbook-14.png",
    "/lookbook/lookbook-15.png"
  ]);

  const [moodImages, setMoodImages] = useState([
    "/template/image.png",
    "/template/image copy.png",
    "/template/image copy 2.png",
    "/template/image copy 3.png",
    "/template/image copy 4.png"
  ]);

  const [stealImages, setStealImages] = useState([
    "/template/steal-1.png",
    "/template/steal-2.png",
    "/template/steal-3.png",
    "/template/steal-4.png"
  ]);

  const [sectionsOrder, setSectionsOrder] = useState([
    "hero",
    "categories",
    "newArrivals",
    "matchTheMood",
    "stealsGrid",
    "limited",
    "campaigns",
    "lookbook",
    "reviews",
    "instagram",
    "about"
  ]);

  // Product cards catalog state to support product image overrides
  const [productsCatalog, setProductsCatalog] = useState(catalog);

  const refreshCatalog = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const normalized = data.map(p => ({
            ...p,
            image: p.image || (p.imageUrls && p.imageUrls[0]) || "/products/product-1.png",
            imageHover: p.imageHover || (p.imageUrls && p.imageUrls[1]) || p.image || (p.imageUrls && p.imageUrls[0]) || "/products/product-1.png"
          }));
          setProductsCatalog(normalized);
        }
      })
      .catch(err => console.error("Error loading products:", err));
  };

  const refreshOrders = () => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setOrders(data);
        }
      })
      .catch(err => console.error("Error loading orders:", err));
  };

  const refreshCms = () => {
    fetch('http://localhost:5000/api/cms')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCms(data);
        }
      })
      .catch(err => console.error("Error loading CMS:", err));
  };

  useEffect(() => {
    refreshCatalog();
    refreshOrders();
    refreshCms();
  }, []);


  // Saved measurements default to mock sizing values matching validate.js checks
  const [savedMeasurements, setSavedMeasurements] = useState({
    height: 178,
    chest: 96,
    waist: 82,
    shoulder: 44,
    hip: 98,
    armLength: 62,
    inseam: 78
  });

  // CMS editable state loaded with default high-end aesthetic values
  const [cms, setCms] = useState({
    announcement: "COMPLIMENTARY SHIPPING ACROSS INDIA ON ORDERS OVER ₹1500 — ENTER 'PASTEUR30' FOR 30% OFF",
    heroTitle: "THE SHIRT THAT DEFINES YOU",
    heroSubtitle: "Modern fits. Premium fabrics. Timeless appeal.",
    heroVideo: "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40172-large.mp4",
    heroFallbackImage: "/hero/hero-1.png",
    lookbookTitle: "ATELIER MEMOIRS",
    lookbookQuote: "\"Fashion is architecture: it is a matter of proportions.\" — Coco Chanel",
    couponCode: "PASTEUR30",
    couponDiscount: 30,
    aiRuleChestPenalty: 4.5,
    aiRuleShoulderPenalty: 6.0,
    aiConfidenceMultiplier: 98.6
  });

  // Default orders
  const [orders, setOrders] = useState([
    {
      orderId: "SV-ORD-889312",
      date: "2026-06-02",
      total: 2498,
      paymentMethod: "UPI",
      trackingStatus: "quality_check",
      paymentStatus: "Paid",
      shippingAddress: "Plot No. 5, Chanakyapuri, New Delhi, 110021, India",
      items: [
        {
          productId: "shirt-2",
          name: "Atelier Italian Linen Solid Shirt in Blanc (Vol. 2)",
          priceAtPurchase: 1399,
          quantity: 1,
          size: "M"
        },
        {
          productId: "shirt-1",
          name: "Atelier Mulberry Silk Checked Shirt in Noir (Vol. 1)",
          priceAtPurchase: 1099,
          quantity: 1,
          size: "M"
        }
      ]
    }
  ]);

  const addToCart = (product, size = "M") => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => item.id === product.id && item.size === size 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrls ? product.imageUrls[0] : (product.image || "/products/product-1.png"),
        size: size,
        quantity: 1,
        type: product.type || "shirt"
      }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateCartQty = (id, size, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.size === size) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const toggleCompare = (product) => {
    setCompareProducts(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      if (prev.length >= 3) return prev; // max 3 compare
      return [...prev, product];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <StateContext.Provider value={{
      user, setUser,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      wishlist, toggleWishlist,
      compareProducts, toggleCompare,
      cartOpen, setCartOpen,
      searchOpen, setSearchOpen,
      savedMeasurements, setSavedMeasurements,
      cms, setCms,
      orders, setOrders,
      heroImages, setHeroImages,
      lookbookImages, setLookbookImages,
      categoryBanners, setCategoryBanners,
      campaignBanners, setCampaignBanners,
      moodImages, setMoodImages,
      stealImages, setStealImages,
      sectionsOrder, setSectionsOrder,
      productsCatalog, setProductsCatalog,
      refreshCatalog, refreshOrders
    }}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
}
