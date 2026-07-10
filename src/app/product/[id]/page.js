"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAppState } from "@/components/StateContext";
import AICameraScanner from "@/components/AICameraScanner";
import VirtualTryOn from "@/components/VirtualTryOn";
import { Star, Sparkles, Heart, ShoppingBag, RefreshCw, ChevronRight, CheckCircle2, Send, X, Bot, Shirt, Ruler, Package, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { catalog } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

function AskLouisWidget({ product }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickChips = [
    { label: "About this product", icon: <Shirt size={11} /> },
    { label: "What material is this", icon: <Package size={11} /> },
    { label: "What fit is this", icon: <Ruler size={11} /> },
    { label: "Similar colors", icon: <Palette size={11} /> },
    { label: "Style this shirt", icon: <Sparkles size={11} /> },
  ];

  const responses = {
    about: `This is the **${(product && product.name) || "shirt"}** from our exclusive atelier collection. Part of our curated release designed to combine editorial aesthetics with everyday wearability.`,
    material: "This shirt is crafted from **premium luxury fabric** selected for breathability, drape, and longevity. Machine washable at 30 degrees and gets softer with each wash.",
    fit: "This shirt has a **contemporary slim fit** tailored through the chest and shoulders. We recommend sizing up if you prefer a relaxed fit.",
    color: "Other colorways include **Blanc, Obsidian, Slate, and Ember**. Each photographed under natural light for accurate color.",
    style: "For smart-casual, pair with **slim chinos and white sneakers**. For formal, match with tailored trousers and Oxford shoes.",
  };

  const getResponse = (q) => {
    const ql = q.toLowerCase();
    if (ql.includes("about") || ql.includes("product")) return responses.about;
    if (ql.includes("material") || ql.includes("fabric")) return responses.material;
    if (ql.includes("fit") || ql.includes("size")) return responses.fit;
    if (ql.includes("color") || ql.includes("colour")) return responses.color;
    if (ql.includes("style") || ql.includes("pair") || ql.includes("wear")) return responses.style;
    return "Great question! As your AI style advisor, I can help with fit, fabric, or styling tips. What would you like to know?";
  };

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", text: msg }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((p) => [...p, { role: "ai", text: getResponse(msg) }]);
      setTyping(false);
    }, 1100);
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-[#0f0f0f] text-white text-[10px] tracking-[0.15em] font-bold px-4 py-3 rounded-xl hover:bg-gold transition-all duration-300 shadow-lg uppercase group">
        <div className="w-5 h-5 rounded-full bg-gold group-hover:bg-white flex items-center justify-center transition-all"><Bot size={11} className="text-black" /></div>
        ASK LOUIS - AI Style Advisor
        <ChevronRight size={12} className="text-gold group-hover:text-white" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.25 }} className="fixed bottom-6 right-6 z-[200] w-[370px] max-w-[95vw] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ maxHeight: "82vh" }}>
            <div className="bg-[#0f0f0f] px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center"><Bot size={16} className="text-black" /></div>
                <div><p className="text-white text-[12px] font-bold tracking-wider">ASK LOUIS</p><p className="text-gray-400 text-[9px] tracking-wider uppercase">AI-powered style assistant</p></div>
              </div>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"><X size={13} className="text-white" /></button>
            </div>
            <div className="bg-[#161616] px-4 py-3 flex flex-wrap gap-2 border-b border-white/5 shrink-0">
              {quickChips.map((chip) => (
                <button key={chip.label} onClick={() => sendMessage(chip.label)} className="flex items-center gap-1.5 border text-white/80 hover:text-white text-[9px] font-semibold px-3 py-1.5 rounded-full transition-all" style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}>
                  {chip.icon}{chip.label}
                </button>
              ))}
            </div>
            <div className="bg-[#111] flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ minHeight: "200px" }}>
              {messages.length === 0 && (
                <div className="text-center py-6 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center"><Sparkles size={20} className="text-gold" /></div>
                  <p className="text-gray-400 text-[11px] leading-relaxed max-w-[220px]">Ask me anything about fit, fabric, styling or this product!</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "ai" && <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center shrink-0 mr-2 mt-0.5"><Bot size={11} className="text-black" /></div>}
                  <div className={"max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed " + (msg.role === "user" ? "bg-gold text-black font-semibold rounded-tr-sm" : "text-white/90 rounded-tl-sm border border-white/5")} style={msg.role === "ai" ? { backgroundColor: "rgba(255,255,255,0.07)" } : {}}>
                    {msg.text.split("**").map((part, i) => i % 2 === 1 ? <strong key={i} className="text-gold">{part}</strong> : part)}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center"><Bot size={11} className="text-black" /></div>
                  <div className="border border-white/5 px-4 py-2.5 rounded-2xl flex gap-1" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                    {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: i * 0.15 + "s" }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-[#161616] border-t border-white/5 px-3 py-3 flex gap-2 shrink-0">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Complete the look..." className="flex-grow border rounded-xl text-[11px] text-white placeholder:text-gray-500 px-4 py-2.5 focus:outline-none transition-all" style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }} />
              <button onClick={() => sendMessage()} disabled={!input.trim()} className="w-9 h-9 rounded-xl bg-gold hover:bg-yellow-500 disabled:bg-white/10 flex items-center justify-center shrink-0"><Send size={14} className="text-black" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tryonMode = searchParams.get("tryon") === "true";
  const productId = params.id;
  const { productsCatalog, addToCart, toggleWishlist, wishlist, toggleCompare, compareProducts } = useAppState();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeTab, setActiveTab] = useState("description");
  const [is360Active, setIs360Active] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [addedToBag, setAddedToBag] = useState(false);
  const [ymalAdded, setYmalAdded] = useState({});

  useEffect(() => {
    const list = productsCatalog || catalog;
    const item = list.find(p => p.id === productId) || list[0];
    setProduct({ ...item, imageUrls: item.imageUrls || [item.image, item.imageHover || item.image], spinFrames: item.spinFrames || [item.image, item.imageHover || item.image] });
    if (tryonMode) setTryOnOpen(true);
  }, [productId, tryonMode, productsCatalog]);

  if (!product) return <div className="p-20 text-center text-gray-500">Loading...</div>;

  const inWishlist = wishlist.some(i => i.id === product.id);
  const isCompared = compareProducts.some(i => i.id === product.id);

  const handleAddToBag = () => {
    addToCart(product, selectedSize);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2500);
  };

  const handleYmalAdd = (prod) => {
    addToCart(prod, "M");
    setYmalAdded(p => ({ ...p, [prod.id]: true }));
    setTimeout(() => setYmalAdded(p => ({ ...p, [prod.id]: false })), 2000);
  };

  const recommendations = (productsCatalog || catalog).filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[3/4] bg-white border border-luxury-border rounded-xl overflow-hidden">
            {is360Active ? (
              <div className="w-full h-full flex flex-col items-center justify-center cursor-ew-resize select-none" onMouseMove={() => setSpinIndex(p => (p + 1) % product.spinFrames.length)}>
                <Image src={`${product.spinFrames[spinIndex]}?v=2`} alt="360" fill sizes="50vw" className="object-cover object-center mix-blend-multiply" />
                <div className="absolute bottom-6 bg-primary/80 backdrop-blur-sm text-white text-[9px] tracking-widest px-3 py-1.5 rounded-full uppercase">Drag to rotate 360</div>
              </div>
            ) : (
              <div className="w-full h-full relative">
                <Image src={`${product.imageUrls[selectedImage]}?v=2`} alt={product.name} fill sizes="50vw" priority className="object-cover object-center mix-blend-multiply" />
              </div>
            )}
            <div className="absolute bottom-4 right-4">
              <button onClick={() => setIs360Active(!is360Active)} className={"text-[9px] tracking-wider font-bold p-2 px-4 rounded-full shadow-md border transition-all uppercase " + (is360Active ? "bg-gold border-gold text-white" : "bg-white/90 border-luxury-border text-gray-500 hover:text-primary")}>
                {is360Active ? "Garment View" : "360 View"}
              </button>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.imageUrls.map((url, idx) => (
              <button key={idx} onClick={() => { setIs360Active(false); setSelectedImage(idx); }} className={"w-20 aspect-[3/4] border-2 rounded-lg overflow-hidden shrink-0 transition-all relative " + (!is360Active && selectedImage === idx ? "border-gold shadow-md" : "border-luxury-border")}>
                <Image src={`${url}?v=2`} alt="thumb" fill sizes="80px" className="object-cover object-center mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-editorial font-bold text-primary mt-1 uppercase tracking-wide leading-tight">{product.name}</h1>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleWishlist(product)} className="w-10 h-10 rounded-full border border-luxury-border flex items-center justify-center hover:bg-luxury-gray transition-all">
                <Heart size={16} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>
              <button onClick={() => toggleCompare(product)} className={"w-10 h-10 rounded-full border flex items-center justify-center transition-all " + (isCompared ? "bg-gold border-gold text-white" : "border-luxury-border text-gray-400 hover:bg-luxury-gray")}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">{[...Array(5)].map((_, s) => <Star key={s} size={12} className="fill-gold text-gold" />)}</div>
            <span className="text-[11px] text-gray-400">(2 reviews)</span>
          </div>
          <div className="text-2xl font-editorial font-bold text-primary">Rs.{product.price.toLocaleString("en-IN")}.00</div>

          <AskLouisWidget product={product} />

          <div className="p-5 bg-gold/5 border border-gold/40 rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gold"><Sparkles size={15} /><span className="text-[10px] tracking-[0.15em] font-bold uppercase">AI Proportional Fitting</span></div>
              <span className="text-[9px] text-green-600 font-bold uppercase bg-green-50 px-2 py-0.5 rounded-full">Highly Confident</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">Scan your body via front and side profiles to calculate fit tolerances precisely.</p>
            {aiAnalysis ? (
              <div className="p-3 bg-white border border-luxury-border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /><div><p className="text-[10px] text-gray-400 uppercase">Recommended Size</p><p className="text-[12px] font-bold text-primary">{aiAnalysis.bestSize} ({aiAnalysis.overallConfidence}% match)</p></div></div>
                <span className="text-[10px] text-gold font-bold uppercase">{aiAnalysis.recommendedFit}</span>
              </div>
            ) : (
              <button onClick={() => setScannerOpen(true)} className="w-full text-[10px] tracking-[0.2em] font-bold bg-primary text-white py-3.5 hover:bg-gold transition-colors rounded-lg uppercase">RUN BODY SCAN FOR SIZE</button>
            )}
            <button onClick={() => setTryOnOpen(true)} className="w-full text-[10px] tracking-[0.2em] font-semibold border border-gold text-gold hover:bg-gold hover:text-white py-2.5 transition-all rounded-lg uppercase">VIRTUAL TRY-ON</button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-wider font-bold text-gray-400 uppercase">Select Size</span>
              <button className="text-[10px] text-gold underline font-semibold hover:text-primary transition-colors">Size Guide</button>
            </div>
            <div className="flex gap-2">
              {Object.keys(product.sizes).map((sz) => (
                <button key={sz} onClick={() => setSelectedSize(sz)} className={"w-12 h-12 text-[12px] font-bold border-2 rounded-lg transition-all " + (selectedSize === sz ? "border-primary bg-primary text-white shadow-md" : "border-luxury-border text-gray-400 hover:border-gray-400 bg-white")}>{sz}</button>
              ))}
            </div>
          </div>

          <button onClick={handleAddToBag} className={"w-full text-[10px] tracking-[0.25em] font-bold py-5 transition-all rounded-xl flex items-center justify-center gap-2 shadow-lg " + (addedToBag ? "bg-green-600 text-white" : "bg-primary hover:bg-gold text-white")}>
            {addedToBag ? <><CheckCircle2 size={15} /> ADDED TO BAG!</> : <><ShoppingBag size={15} /> ADD TO SHOPPING BAG</>}
          </button>

          <div className="border-t border-luxury-border pt-6">
            <div className="flex gap-6 border-b border-luxury-border pb-2">
              {["description", "size-chart", "delivery"].map((tb) => (
                <button key={tb} onClick={() => setActiveTab(tb)} className={"text-[10px] font-bold tracking-wider uppercase pb-2 border-b-2 transition-all -mb-2.5 " + (activeTab === tb ? "border-gold text-gold" : "border-transparent text-gray-400 hover:text-primary")}>{tb.replace("-", " ")}</button>
              ))}
            </div>
            <div className="mt-5 text-[12px] text-gray-500 leading-relaxed">
              {activeTab === "description" && <p>{product.description}</p>}
              {activeTab === "size-chart" && (
                <table className="w-full border-collapse">
                  <thead><tr className="border-b border-luxury-border text-left">{["Size","Chest (cm)","Waist (cm)","Shoulders (cm)","Length (cm)"].map(h => <th key={h} className="py-2 text-[10px] text-gray-400 uppercase font-bold">{h}</th>)}</tr></thead>
                  <tbody>{Object.entries(product.sizes).map(([sz, dims]) => <tr key={sz} className="border-b border-luxury-border/40 last:border-0 text-primary"><td className="py-2.5 font-bold">{sz}</td><td className="py-2.5">{dims.chest||"-"}</td><td className="py-2.5">{dims.waist||"-"}</td><td className="py-2.5">{dims.shoulder||"-"}</td><td className="py-2.5">{dims.length||"-"}</td></tr>)}</tbody>
                </table>
              )}
              {activeTab === "delivery" && (
                <div className="flex flex-col gap-3">
                  <p><strong>Shipping:</strong> Complimentary priority shipping on orders over Rs.1500. Dispatched within 24 hours.</p>
                  <p><strong>Returns:</strong> Free returns within 14 days of delivery for Gold and Elite loyalty accounts.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="w-full border-t border-luxury-border py-20 px-6 md:px-12 bg-[#fafaf9]">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] tracking-[0.3em] text-gold font-bold uppercase">Curated For You</span>
              <h2 className="text-2xl md:text-3xl font-editorial font-bold text-primary mt-1">YOU MAY ALSO LIKE</h2>
            </div>
            <Link href="/products" className="text-[10px] tracking-widest font-bold text-primary border-b border-primary pb-0.5 hover:text-gold hover:border-gold transition-all uppercase flex items-center gap-1">View All <ChevronRight size={12} /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {recommendations.map((rec, idx) => {
              const recWL = wishlist.some(w => w.id === rec.id);
              return (
                <motion.div key={rec.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                  <ProductCard
                    product={rec}
                    inWishlist={recWL}
                    onWishlistToggle={toggleWishlist}
                    onAddToCart={addToCart}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <AICameraScanner isOpen={scannerOpen} onClose={() => setScannerOpen(false)} productSizes={product.sizes} productType={product.type} onSizeCalibrated={(a) => { setAiAnalysis(a); setSelectedSize(a.bestSize); }} />
      <VirtualTryOn isOpen={tryOnOpen} onClose={() => setTryOnOpen(false)} productName={product.name} productImage={product.imageUrls[0]} />
    </div>
  );
}
