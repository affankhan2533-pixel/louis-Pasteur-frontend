"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import { signInWithGoogle } from '@/lib/firebase';
import { User, Mail, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
  const { user, setUser } = useAppState();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard/profile');
      }
    }
  }, [user]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();

        if (response.ok && data.user) {
          setSuccess(true);
          setUser({
            uid: data.user.uid || "sv-user-101",
            name: data.user.name,
            email: email,
            loyaltyRank: data.user.loyalty || 'Elite',
            walletBalance: data.user.wallet || 2500.00,
            address: {
              street: "Plot No. 5, Chanakyapuri",
              city: "New Delhi",
              postalCode: "110021",
              country: "India"
            }
          });
        } else {
          setError(data.error || "Registration failed. Please try again.");
        }
      } catch (err) {
        setError("Cannot reach the server. Please try Google Sign-Up instead.");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleGoogleSignUp = async () => {
    setLoadingGoogle(true);
    setError('');

    try {
      const firebaseUser = await signInWithGoogle();

      // Map Firebase user → app user state
      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName?.toUpperCase() || firebaseUser.email.split('@')[0].toUpperCase(),
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || null,
        loyaltyRank: 'Gold',
        walletBalance: 1500.00,
        address: {
          street: "",
          city: "",
          postalCode: "",
          country: "India"
        }
      });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Google Sign-Up failed. Please try again.');
        console.error('Google Sign-Up error:', err);
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-12">
      {/* Left Column: Visual Campaign Image (Desktop only) */}
      <div className="hidden lg:block lg:col-span-6 relative bg-black">
        <Image 
          src="/products/product-19.png" 
          alt="Campaign Editorial" 
          fill
          priority
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-16">
          <span className="text-[10px] tracking-[0.3em] text-gold font-bold uppercase mb-2">LOUIS PASTEUR ATELIER</span>
          <h1 className="text-3xl font-editorial font-bold text-white tracking-wide uppercase leading-tight max-w-md">
            LA CRÉATION DU COMPTE
          </h1>
          <p className="text-[11px] text-gray-400 mt-2 leading-relaxed max-w-sm">
            Register your Atelier ID to enable AI size-fitting models and unlock customized garment calibration catalogs.
          </p>
        </div>
      </div>

      {/* Right Column: Auth Forms */}
      <div className="lg:col-span-6 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-[420px] flex flex-col gap-6">
          <div className="text-center flex flex-col items-center">
            <span className="text-[9px] tracking-[0.25em] text-gold font-bold uppercase">CREATION DE COMPTE</span>
            <h2 className="text-2xl font-editorial font-bold text-primary mt-1 uppercase">CREATE ATELIER ID</h2>
            <p className="text-[11px] text-gray-400 mt-1">Register dimensions &amp; unlock custom collections.</p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Real Firebase Google Sign Up Button */}
            <button
              id="google-signup-btn"
              onClick={handleGoogleSignUp}
              disabled={loading || loadingGoogle}
              className="w-full border border-luxury-border hover:bg-luxury-gray py-3 rounded text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingGoogle ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  CREATING GOOGLE ACCOUNT...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  SIGN UP WITH GOOGLE
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-grow h-px bg-luxury-border" />
            <span className="text-[10px] text-gray-400 font-semibold uppercase">OR EMAIL REGISTRATION</span>
            <div className="flex-grow h-px bg-luxury-border" />
          </div>

          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Full Name</label>
              <div className="relative">
                <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Aurelius Vance" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-[12px] pl-9 pr-3 py-2.5 border border-luxury-border rounded focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Email Address</label>
              <div className="relative">
                <Mail size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="aurelius@louispasteur.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-[12px] pl-9 pr-3 py-2.5 border border-luxury-border rounded focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Password</label>
              <div className="relative">
                <Lock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-[12px] pl-9 pr-3 py-2.5 border border-luxury-border rounded focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded px-3 py-2">
                <p className="text-[10px] text-red-600 font-semibold">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                <p className="text-[10px] text-green-700 font-semibold">Account created! Authenticating...</p>
              </div>
            )}

            <button 
              type="submit"
              id="email-register-btn"
              disabled={loading || loadingGoogle}
              className="w-full text-[10px] tracking-[0.2em] font-bold bg-primary hover:bg-gold text-white py-3.5 mt-2 transition-colors rounded uppercase shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  TRANSMITTING SECURE DATA...
                </>
              ) : 'REGISTER ATELIER ID'}
            </button>
          </form>

          <div className="border-t border-luxury-border/60 pt-4 text-center">
            <Link 
              href="/login"
              className="text-[11px] text-gold hover:text-primary transition-colors font-semibold"
            >
              Already have an Atelier ID? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
