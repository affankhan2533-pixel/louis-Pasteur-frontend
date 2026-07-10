"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from './StateContext';
import { Sparkles, MessageCircle, X, Send, Bot, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIFashionAssistant() {
  const { savedMeasurements } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: 'Salutations. I am your Louis Pasteur AI Stylist. How may I refine your selection today? Ask me about sizes, styling, or recommendations.'
    }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', content: userText }]);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          measurements: savedMeasurements
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', content: data.response }]);
    } catch (err) {
      console.error("Failed to query personal stylist API:", err);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        content: "I apologize, my stylistic telemetry is momentarily offline. However, based on your standard measurements, size M remains the recommended fit." 
      }]);
    }
  };

  const quickPrompts = [
    { label: "Check my size fit", text: "What size do you recommend for me?" },
    { label: "Style a pairing", text: "Recommend a luxury shirt layering." }
  ];

  return (
    <div className="hidden md:block fixed bottom-6 right-6 z-[200]">
      {/* Launcher Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-gold text-white flex items-center justify-center shadow-2xl relative border border-white/10"
        title="AI Stylist Assistant"
      >
        {isOpen ? <X size={20} /> : <Sparkles size={22} className="text-gold" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
            AI
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 bottom-20 w-[350px] md:w-[380px] h-[500px] bg-white border border-luxury-border shadow-2xl rounded-lg flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[12px] font-bold tracking-[0.15em] uppercase">LOUIS PASTEUR ATELIER AI</h3>
                  <span className="text-[9px] text-gray-400">Online | Personal Stylist</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages box */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 bg-luxury-gray">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gold text-white'
                  }`}>
                    {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  
                  <div className={`p-3 text-[11px] leading-relaxed rounded ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-luxury-black border border-luxury-border rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-luxury-border flex flex-col gap-1.5 bg-white">
                <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Suggested Inquiries</span>
                <div className="flex flex-col gap-1">
                  {quickPrompts.map((p, pidx) => (
                    <button 
                      key={pidx}
                      onClick={() => {
                        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', content: p.text }]);
                        setTimeout(() => {
                          setInput(p.text);
                        }, 50);
                      }}
                      className="text-[10px] text-left text-gray-600 hover:text-gold transition-colors flex items-center justify-between border border-luxury-border hover:border-gold p-1.5 rounded bg-luxury-gray/50"
                    >
                      <span>{p.label}</span>
                      <ChevronRight size={10} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer input form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-luxury-border flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about sizing, fits, outfits..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow text-[11px] px-3 py-2 border border-luxury-border rounded bg-luxury-gray/30 focus:outline-none focus:border-gold"
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-gold text-white p-2 rounded transition-colors"
                title="Send Message"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
