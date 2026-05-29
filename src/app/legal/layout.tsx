import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white vibrant-dots selection:bg-orange-100 selection:text-brand-orange">
      <header className="h-20 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto h-full flex items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-100 group-hover:rotate-6 transition-transform">
                <Shield size={16} className="text-white fill-white" />
             </div>
             <span className="font-black text-lg tracking-tighter text-zinc-800">QR Forge <span className="text-zinc-300 font-medium ml-1">Legal</span></span>
          </Link>
          <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-brand-orange transition-colors uppercase tracking-widest flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Forge
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-20 px-6 prose prose-zinc prose-orange">
        {children}
      </main>

      <footer className="border-t border-zinc-100 py-20 bg-zinc-50/50">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
           <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">Precision Ethics Resolution Node</p>
           <p className="text-xs text-zinc-400 font-medium">© 2026 QR Forge Precision Systems. All protocols reserved.</p>
        </div>
      </footer>
    </div>
  );
}
