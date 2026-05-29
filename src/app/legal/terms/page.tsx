import React from 'react';

export default function TermsPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase italic">Service Protocols</h1>
        <p className="text-zinc-500 font-medium">Version 4.1.0 // Effective May 2026</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tight">1. Precision Resolution Agreement</h2>
        <p className="text-zinc-600 leading-relaxed">
          By utilizing the QR Forge platform, you agree to deploy only valid and legal resolution endpoints. 
          The use of our nodes for phishing, malware distribution, or deceptive routing is strictly prohibited 
          and will result in immediate decommissioning.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tight">2. Identity Verified Access</h2>
        <p className="text-zinc-600 leading-relaxed">
          You are responsible for the security of your private management tokens. These UUIDs grant full 
          administrative control over your assets. Loss of a token may lead to permanent loss of asset 
          modification capabilities.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tight">3. System Uptime & SLA</h2>
        <p className="text-zinc-600 leading-relaxed">
          While we aim for 99.99% resolution availability, the forge is provided "as is". We reserve the right 
          to throttle high-volume anonymous nodes to ensure stability for our "Professional Identity" subscribers.
        </p>
      </section>

      <section className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
        <p className="text-xs text-zinc-400 font-medium text-center uppercase tracking-widest leading-loose">
          Failure to comply with these protocols may result in permanent node exclusion from the forge network.
        </p>
      </section>
    </div>
  );
}
