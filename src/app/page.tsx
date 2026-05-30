import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SecurityFooter } from '@/components/layout/security-footer';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/assets');
  }

  return (
    <main className="min-h-[100dvh] bg-white text-zinc-900 selection:bg-orange-100 flex flex-col vibrant-dots">
      {/* Navigation */}
      <nav className="h-16 sm:h-20 border-b border-zinc-100 flex items-center justify-between px-6 sm:px-10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-100 shrink-0">
            <Zap className="text-white fill-white" size={16} />
          </div>
          <span className="font-black text-lg sm:text-xl tracking-tight text-zinc-800 whitespace-nowrap">QR Forge</span>
        </div>
        <div className="flex gap-4 sm:gap-8 items-center">
          <Link href="/auth/login" className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-brand-orange transition-colors">Login</Link>
          <Link href="/onboarding">
            <Button size="sm" className="sm:hidden gap-2">Start</Button>
            <Button size="md" className="hidden sm:flex gap-2 px-8">Start Now <ArrowRight size={16} /></Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10 space-y-8 sm:space-y-12 max-w-5xl mx-auto">
        <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-1000 ease-out">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border-2 border-orange-100 rounded-full text-brand-orange font-bold text-[10px] sm:text-xs uppercase tracking-wider mx-auto">
            ⚡️ Fast, Simple, and Fun
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-zinc-900">
            QR codes that <br/>
            <span className="text-brand-orange text-3xl sm:text-5xl md:text-7xl lg:text-8xl">actually look good.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-500 font-medium leading-relaxed px-4">
            Stop making boring QR codes. Add your logo, pick your colors, and track every single scan with our simple, bouncy tool.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto animate-in fade-in zoom-in duration-1000 delay-200 px-6 sm:px-0">
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button size="lg" className="h-14 sm:h-16 px-12 text-base sm:text-lg w-full rounded-2xl shadow-xl shadow-orange-200">
              Create My Free QR
            </Button>
          </Link>
        </div>

        {/* Floating QR Preview */}
        <div className="pt-6 sm:pt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-orange-100 border-4 sm:border-8 border-orange-50 flex items-center justify-center relative rotate-3 hover:rotate-0 transition-transform cursor-pointer overflow-hidden group">
             <div className="absolute inset-0 bg-brand-orange opacity-0 group-hover:opacity-5 transition-opacity" />
             <div className="p-3 sm:p-4 bg-zinc-900 rounded-xl sm:rounded-2xl">
                <div className="grid grid-cols-3 gap-1 w-12 h-12 sm:w-20 sm:h-20">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`rounded-sm ${i === 4 ? 'bg-brand-orange' : 'bg-white/20'}`} />
                  ))}
                </div>
             </div>
             <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-brand-orange text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                <Zap size={16} fill="currentColor" className="sm:hidden" />
                <Zap size={24} fill="currentColor" className="hidden sm:block" />
             </div>
          </div>
        </div>
      </div>

      <SecurityFooter />
    </main>
  );
}
