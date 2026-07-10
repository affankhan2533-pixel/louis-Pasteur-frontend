"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard/profile');
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <Sparkles className="text-gold animate-spin" size={32} />
      <div>
        <h3 className="text-sm font-bold tracking-wider">REDIRECTING TO PORTAL</h3>
        <p className="text-[11px] text-gray-400 mt-1">Establishing secure connection...</p>
      </div>
    </div>
  );
}
