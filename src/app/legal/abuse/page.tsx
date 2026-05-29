import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AbusePage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
           <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase italic">Threat Resolution</h1>
        <p className="text-zinc-500 font-medium">Reporting Protocol for Malicious Resolution Nodes</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tight">How to Report</h2>
        <p className="text-zinc-600 leading-relaxed">
          If you have encountered a QR Forge resolution node that points to phishing content, malware, or illegal 
          materials, please transmit the shortcode or full management URL to our resolution team immediately.
        </p>
        <div className="p-6 bg-zinc-900 rounded-2xl text-white font-mono text-sm border border-zinc-800 shadow-xl">
           <p className="text-zinc-400 mb-2">// Transmission Channel</p>
           <p className="text-brand-orange">{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tight">Our Action Pipeline</h2>
        <p className="text-zinc-600 leading-relaxed">
          Upon receiving a valid abuse transmission, our node scanners will perform a high-fidelity audit of 
          the destination endpoint. Verified malicious assets are decommissioned within 60 minutes of detection 
          across all global edge resolution points.
        </p>
      </section>

      <section className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center gap-6">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
           <AlertTriangle size={20} className="text-zinc-400" />
        </div>
        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] leading-relaxed">
          We maintain zero tolerance for deceptive resolution. Our forge is engineered for trust.
        </p>
      </section>
    </div>
  );
}
