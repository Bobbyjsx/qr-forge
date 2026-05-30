'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getServerError } from '@/lib/supabase/client';

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (errorParam) {
      toast.error(errorParam);
    }
  }, [errorParam]);

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

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });
        if (error) throw error;
        setIsSignedUp(true);
        toast.success('Verification link transmitted');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.refresh();
        router.push('/assets');
        toast.success('Welcome back to the forge');
      }
    } catch (error: unknown) {
      toast.error(getServerError(error));
    } finally {
      setLoading(false);
    }
  };

  if (isSignedUp) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 vibrant-dots">
        <div className="w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-50 rounded-[3rem] flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-green-100">
             <CheckCircle2 className="text-green-500" size={48} />
          </div>
          
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase italic">Check Your Email</h2>
             <p className="text-zinc-500 font-medium leading-relaxed">
                We&apos;ve dispatched a verification node to <span className="text-zinc-800 font-bold">{email}</span>. 
                Please activate the link to establish your identity.
             </p>
          </div>

          <div className="pt-4">
             <Button variant="ghost" onClick={() => setIsSignedUp(false)} className="text-zinc-400 hover:text-brand-orange font-bold uppercase tracking-widest text-[10px]">
                Wrong email? Back to Signup
             </Button>
          </div>

          <footer className="pt-12 text-center border-t border-zinc-100">
            <p className="text-[10px] text-zinc-300 font-black uppercase tracking-[0.3em]">Identity Verification Protocol</p>
          </footer>
        </div>
      </main>
    );
  }

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
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase italic">
            {mode === 'signup' ? 'Initiate Forge' : 'Identity Access'}
          </h2>
          <p className="text-zinc-500 font-medium leading-relaxed">
            {mode === 'signup' ? 'Establish your node to create and manage precision QR assets.' : 'Authorize session to manage your resolution endpoints.'}
          </p>
        </div>

        <div className="fun-card p-10 space-y-8 bg-white border border-zinc-100 shadow-sm">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email Terminal</label>
              <div className="relative group">
                <Input 
                  type="email" 
                  placeholder="name@precision.forge" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-zinc-50 border-0 focus:bg-white rounded-xl text-base"
                  required
                />
                <Mail className="absolute left-4 top-4.5 text-zinc-300 group-focus-within:text-brand-orange transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Secure Key</label>
              <div className="relative group">
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 bg-zinc-50 border-0 focus:bg-white rounded-xl text-base"
                  required
                />
                <Lock className="absolute left-4 top-4.5 text-zinc-300 group-focus-within:text-brand-orange transition-colors" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-zinc-300 hover:text-zinc-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button className="w-full h-16 gap-3 text-base rounded-2xl shadow-xl shadow-orange-100 group" disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" size={20} /> : (
                <>
                  <span className="font-black uppercase tracking-widest">
                    {mode === 'signup' ? 'Create My Account' : 'Sign In Node'}
                  </span>
                  <ArrowRight className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center space-y-4">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-tight">
            {mode === 'signup' ? 'Already established?' : "New to the forge?"}
          </p>
          <Link 
            href={mode === 'signup' ? '/auth/login' : '/auth/signup'} 
            className="inline-block px-6 py-2 rounded-full border border-zinc-100 text-zinc-400 hover:text-brand-orange hover:border-orange-100 transition-all font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            {mode === 'signup' ? 'Access My Account' : 'Forge New Identity'}
          </Link>
        </div>

        <footer className="pt-8 text-center border-t border-zinc-100">
          <div className="inline-flex items-center gap-2 text-[9px] text-zinc-300 font-black uppercase tracking-[0.3em]">
            <ShieldCheck size={14} /> Encrypted Session Node
          </div>
        </footer>
      </div>
    </main>
  );
}

// Internal RefreshCw for button loading state
function RefreshCw({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
