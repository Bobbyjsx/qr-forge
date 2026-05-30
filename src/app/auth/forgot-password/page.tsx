'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ShieldCheck, Mail, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { toast } from 'sonner';
import { getServerError } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setIsSubmitted(true);
      toast.success('Reset link dispatched');
    } catch (error: unknown) {
      toast.error(getServerError(error));
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-[100dvh] bg-white flex flex-col items-center justify-center p-4 sm:p-8 vibrant-dots">
        <div className="w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500 px-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-50 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-orange-100">
             <CheckCircle2 className="text-brand-orange" size={40} />
          </div>
          
          <div className="space-y-3">
             <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight uppercase">Link Dispatched</h2>
             <p className="text-sm sm:text-base text-zinc-500 font-medium leading-relaxed">
                If an account exists for <span className="text-zinc-800 font-bold">{email}</span>, 
                you will receive a password reset link shortly.
             </p>
          </div>

          <div className="pt-4">
             <Link href="/auth/login">
                <Button variant="ghost" className="text-zinc-400 hover:text-brand-orange font-bold uppercase tracking-widest text-[10px]">
                   Return to Login
                </Button>
             </Link>
          </div>

          <footer className="pt-12 text-center border-t border-zinc-100">
            <p className="text-[10px] text-zinc-300 font-black uppercase tracking-[0.3em]">Security Protocol</p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-white flex flex-col items-center justify-center p-4 sm:p-8 vibrant-dots">
      <div className="w-full max-w-md space-y-8 sm:space-y-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-3 mb-2 sm:mb-4 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-orange rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 group-hover:rotate-6 transition-transform">
              <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="font-black text-xl sm:text-2xl tracking-tight text-zinc-800">QR Forge</span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 uppercase">
            Reset Password
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 font-medium leading-relaxed">
            Enter your email to receive a secure password reset link.
          </p>
        </div>

        <div className="fun-card p-6 sm:p-10 space-y-8 bg-white border border-zinc-100 shadow-sm">
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-zinc-50 border-0 focus:bg-white rounded-xl text-base"
                  required
                />
                <Mail className="absolute left-4 top-4.5 text-zinc-300 group-focus-within:text-brand-orange transition-colors" size={20} />
              </div>
            </div>

            <Button className="w-full h-14 sm:h-16 gap-3 text-sm sm:text-base rounded-2xl shadow-xl shadow-orange-100 group" disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" size={20} /> : (
                <>
                  <span className="font-black uppercase tracking-widest">
                    Send Reset Link
                  </span>
                  <ArrowRight className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-orange transition-all font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>

        <footer className="pt-8 text-center border-t border-zinc-100">
          <div className="inline-flex items-center gap-2 text-[9px] text-zinc-300 font-black uppercase tracking-[0.3em]">
            <ShieldCheck size={14} /> Secure Access Node
          </div>
        </footer>
      </div>
    </main>
  );
}
