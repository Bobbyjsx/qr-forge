'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ShieldCheck, Lock, ArrowRight, CheckCircle2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getServerError } from '@/lib/supabase/client';
import Link from 'next/link';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setIsSuccess(true);
      toast.success('Security key updated');
      setTimeout(() => {
        router.push('/assets');
      }, 2000);
    } catch (error: unknown) {
      toast.error(getServerError(error));
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-[100dvh] bg-white flex flex-col items-center justify-center p-4 sm:p-8 vibrant-dots">
        <div className="w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500 px-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-green-100">
             <CheckCircle2 className="text-green-500" size={40} />
          </div>
          
          <div className="space-y-3">
             <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight uppercase">Access Restored</h2>
             <p className="text-sm sm:text-base text-zinc-500 font-medium leading-relaxed">
                Your password has been successfully updated. <br/>
                We are redirecting you to your asset library...
             </p>
          </div>

          <footer className="pt-12 text-center border-t border-zinc-100">
            <p className="text-[10px] text-zinc-300 font-black uppercase tracking-[0.3em]">Identity Protocol 3.0</p>
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
            New Key Setup
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 font-medium leading-relaxed">
            Choose a strong new password for your node access.
          </p>
        </div>

        <div className="fun-card p-6 sm:p-10 space-y-8 bg-white border border-zinc-100 shadow-sm">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">New Password</label>
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

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Confirm New Password</label>
              <div className="relative group">
                <Input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 bg-zinc-50 border-0 focus:bg-white rounded-xl text-base"
                  required
                />
                <Lock className="absolute left-4 top-4.5 text-zinc-300 group-focus-within:text-brand-orange transition-colors" size={20} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-zinc-300 hover:text-zinc-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button className="w-full h-14 sm:h-16 gap-3 text-sm sm:text-base rounded-2xl shadow-xl shadow-orange-100 group" disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" size={20} /> : (
                <>
                  <span className="font-black uppercase tracking-widest">
                    Update Password
                  </span>
                  <ArrowRight className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </Button>
          </form>
        </div>

        <footer className="pt-8 text-center border-t border-zinc-100">
          <div className="inline-flex items-center gap-2 text-[9px] text-zinc-300 font-black uppercase tracking-[0.3em]">
            <ShieldCheck size={14} /> End-to-End Encrypted
          </div>
        </footer>
      </div>
    </main>
  );
}
