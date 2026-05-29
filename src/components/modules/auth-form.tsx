'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ShieldCheck, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/assets');
      }
    };
    checkUser();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = mode === 'signup' 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      router.refresh();
      router.push('/workspace');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 vibrant-dots">
      <div className="w-full max-w-md space-y-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 group-hover:rotate-6 transition-transform">
              <Zap className="text-white fill-white" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tight text-zinc-800">QR Forge</span>
          </Link>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900">
            {mode === 'signup' ? 'Join the community' : 'Welcome back!'}
          </h2>
          <p className="text-zinc-500 font-medium">
            {mode === 'signup' ? 'Start creating and tracking your QR codes today.' : 'Login to manage your active QR codes.'}
          </p>
        </div>

        <div className="fun-card p-10 space-y-8 bg-white">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 ml-1">Email Address</label>
              <div className="relative group">
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                  required
                />
                <Mail className="absolute left-4 top-3.5 text-zinc-300 group-focus-within:text-brand-orange transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 ml-1">Password</label>
              <div className="relative group">
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12"
                  required
                />
                <Lock className="absolute left-4 top-3.5 text-zinc-300 group-focus-within:text-brand-orange transition-colors" size={20} />
              </div>
            </div>

            <Button className="w-full h-14 gap-3 text-base shadow-xl shadow-orange-100 mt-2" disabled={loading}>
              {loading ? 'Working...' : mode === 'signup' ? 'Create My Account' : 'Sign Me In'} 
              {!loading && <ArrowRight size={20} />}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100" /></div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-zinc-500 font-medium">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account yet?"} <br />
            <Link 
              href={mode === 'signup' ? '/auth/login' : '/auth/signup'} 
              className="text-brand-orange hover:text-orange-600 transition-colors font-bold underline underline-offset-4 mt-2 inline-block"
            >
              {mode === 'signup' ? 'Log in here' : 'Sign up for free'}
            </Link>
          </p>
        </div>

        <footer className="pt-8 text-center border-t border-zinc-100">
          <div className="inline-flex items-center gap-2 text-[10px] text-zinc-300 font-bold uppercase tracking-widest">
            <ShieldCheck size={14} /> Secure Login
          </div>
        </footer>
      </div>
    </main>
  );
}
