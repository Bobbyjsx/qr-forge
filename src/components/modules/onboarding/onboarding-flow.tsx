'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Zap, ArrowRight, User, Star } from 'lucide-react';
import Link from 'next/link';

export function OnboardingFlow() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 py-24 px-8 relative">
      <div className="text-center space-y-6 animate-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border-2 border-orange-100 rounded-full text-brand-orange font-bold text-xs uppercase tracking-wider mx-auto">
          <Star size={14} className="fill-brand-orange" /> Choose Your Journey
        </div>
        <h2 className="text-5xl lg:text-6xl font-black tracking-tight text-zinc-900">
          How do you want to <br/>
          <span className="text-brand-orange underline underline-offset-8 decoration-orange-200">start forging?</span>
        </h2>
        <p className="text-zinc-500 font-medium max-w-lg mx-auto text-lg">
          Pick the best way for you to create and manage your QR codes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Anonymous Path */}
        <div className="fun-card p-12 flex flex-col justify-between group relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full -mr-16 -mt-16 group-hover:bg-orange-50 transition-colors duration-500" />
          
          <div className="space-y-8 relative z-10">
            <div className="w-16 h-16 bg-zinc-50 border-2 border-zinc-100 flex items-center justify-center rounded-[2rem] group-hover:bg-white group-hover:border-orange-100 group-hover:scale-110 transition-all duration-500 shadow-sm">
              <Zap className="text-zinc-300 group-hover:text-brand-orange transition-colors" size={28} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-zinc-800 tracking-tight">Quick Guest</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Just need a simple QR code? Skip the account and start creating immediately. Best for one-time use.
              </p>
            </div>
            <ul className="space-y-4 pt-4 border-t border-zinc-50">
              {['No account needed', 'Instant PNG download', 'Permanent direct link'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-zinc-400 group-hover:text-zinc-600 transition-colors">
                  <div className="w-1.5 h-1.5 bg-zinc-200 group-hover:bg-brand-orange rounded-full transition-colors" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/workspace?mode=anonymous" className="mt-12 block">
            <Button variant="outline" className="w-full h-14 text-base gap-3 rounded-2xl group-hover:bg-zinc-50">
              Continue as Guest <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {/* Account Path */}
        <div className="fun-card p-12 flex flex-col justify-between border-brand-orange/20 bg-orange-50/[0.3] group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/5 blur-[80px] -mr-24 -mt-24 pointer-events-none" />
          
          <div className="space-y-8 relative z-10">
            <div className="w-16 h-16 bg-brand-orange flex items-center justify-center rounded-[2rem] shadow-xl shadow-orange-200 group-hover:scale-110 transition-all duration-500">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-brand-orange tracking-tight">Professional Identity</h3>
              <p className="text-zinc-600 font-medium leading-relaxed">
                The full power of QR Forge. Track every scan, edit your links anytime, and save your custom designs.
              </p>
            </div>
            <ul className="space-y-4 pt-4 border-t border-orange-100">
              {['Track scan behavior', 'Update links anytime', 'Save design templates', 'Full asset history'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-brand-orange/60 group-hover:text-brand-orange transition-colors">
                  <div className="w-1.5 h-1.5 bg-brand-orange/30 group-hover:bg-brand-orange rounded-full transition-colors" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/auth/signup" className="mt-12 block">
            <Button variant="primary" className="w-full h-14 text-base gap-3 rounded-2xl shadow-xl shadow-orange-200">
              Create My Account <User size={18} />
            </Button>
          </Link>
        </div>
      </div>

      <footer className="pt-12 text-center">
        <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
          Safe · Secure · Simple
        </p>
      </footer>
    </div>
  );
}
