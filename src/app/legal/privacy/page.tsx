import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase italic">Privacy Protocol</h1>
        <p className="text-zinc-500 font-medium">Version 2.0.1 // Last Synced: May 2026</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tight">1. Data Ingestion</h2>
        <p className="text-zinc-600 leading-relaxed">
          At QR Forge, we believe in technical transparency. When you resolution an asset through our nodes, 
          we ingest minimum viable telemetry required for precision analytics. This includes obfuscated 
          IP hashes, device headers, and geographic metadata.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tight">2. Anonymization Pipeline</h2>
        <p className="text-zinc-600 leading-relaxed">
          All client identification is passed through a one-way SHA-256 hashing forge before permanent 
          storage. We do not store raw IP addresses. Your digital fingerprint is anonymized to protect 
          individual resolution identity while maintaining high-fidelity telemetry for asset owners.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tight">3. Storage Protocols</h2>
        <p className="text-zinc-600 leading-relaxed">
          Asset configurations and brand signatures are stored on encrypted edge databases. 
          Users with a "Verified Identity" maintain full control over their data lifecycle, including 
          the ability to permanently decommission any resolution node and its associated telemetry.
        </p>
      </section>

      <section className="space-y-6 border-l-4 border-brand-orange pl-8 py-2">
        <h2 className="text-xl font-black text-zinc-800 uppercase tracking-tight">GDPR & CCPA Compliance</h2>
        <p className="text-zinc-500 italic">
          Our systems are engineered for global compliance. We act as a data processor for asset owners 
          and provide comprehensive tools for right-to-erasure and data portability.
        </p>
      </section>
    </div>
  );
}
