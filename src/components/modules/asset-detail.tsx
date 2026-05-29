'use client';

import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { LoadingState } from '@/components/ui/loading-state';
import { DesignProcessor } from '@/lib/core/design-processor';
import { getServerError } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  Calendar as CalendarIcon,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  History,
  Monitor,
  Pencil,
  RefreshCw,
  Smartphone,
  Clock,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { QRCodeForge } from '@/components/ui/qr-code-forge';
import { useUpdateAsset } from '@/api/useAssets/assets';
import { useGetAssetWithAnalytics } from '@/api/useAnalytics/analytics';
import { StatBar } from '@/components/ui/stat-bar';
import { QRAnalytics } from '@/types/resources';

interface AssetPageProps {
  params: Promise<{ code: string }>;
}

export function AssetDetail({ params }: AssetPageProps) {
  const { code } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { data, isLoading, error } = useGetAssetWithAnalytics(code);

  const route = data?.route;
  const analytics = data?.analytics || [];

  const updateMutation = useUpdateAsset(code);

  const handleStatusToggle = async () => {
    if (!route) return;
    
    try {
      await updateMutation.mutateAsync({
        isActive: !route.isActive,
      });
      toast.success('Status updated successfully');
    } catch (err: unknown) {
      toast.error(getServerError(err));
    }
  };

  if (isLoading) return <LoadingState title="Loading..." description="Fetching your data..." />;

  if (error || !data || !route) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white space-y-6 vibrant-dots">
        <p className="font-bold text-zinc-400 uppercase tracking-widest text-sm">QR Code Not Found</p>
        <Button onClick={() => router.push('/assets')} className="shadow-lg shadow-orange-100">Return to Library</Button>
      </div>
    );
  }

  const totalScans = analytics.length;
  const design = route.design;
  const moduleStyles = DesignProcessor.getModuleStyles(design);
  
  // High-precision resolution logic: 
  // 301 (Static) = Direct to destination. 
  // 302 (Dynamic) = Route through edge node.
  const qrUrl = route.redirectType === '301' 
    ? route.destinationUrl 
    : (typeof window !== 'undefined' ? `${window.location.origin}/r/${route.shortCode}` : '');

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-code-canvas canvas') as HTMLCanvasElement;
    if (canvas) {
       const link = document.createElement('a');
       link.download = `qr-forge-${route.shortCode}.png`;
       link.href = canvas.toDataURL('image/png');
       link.click();
    } else {
       const svg = document.querySelector('#qr-code-canvas svg');
       if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const link = document.createElement('a');
          link.download = `qr-forge-${route.shortCode}.svg`;
          link.href = 'data:image/svg+xml;base64,' + btoa(svgData);
          link.click();
       }
    }
  };

  const deviceCounts = analytics.reduce((acc: Record<string, number>, curr: QRAnalytics) => {
    const device = curr.device || 'Unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const browserCounts = analytics.reduce((acc: Record<string, number>, curr: QRAnalytics) => {
    const browser = curr.browser || 'Unknown';
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-4">
          <button 
            onClick={() => router.push('/assets')}
            className="flex items-center gap-2 text-zinc-400 hover:text-brand-orange transition-colors font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} /> Back to Library
          </button>
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tight text-zinc-900 flex items-center gap-3">
              #{route.shortCode.toUpperCase()}
              <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-black ${route.isActive ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                 {route.isActive ? 'Active' : 'Paused'}
              </span>
            </h2>
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
               <p className="truncate max-w-lg">{route.destinationUrl}</p>
               {route.expiresAt && (
                 <div className="flex items-center gap-1.5 text-red-400 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                   <Clock size={12} /> Expires: {new Date(route.expiresAt).toLocaleString()}
                 </div>
               )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            className="gap-2 rounded-xl h-12 px-8 shadow-xl shadow-orange-100"
            onClick={() => {
              router.push(`/workspace?edit=${route.managementToken}`);
            }}
          >
            <Pencil size={16} /> Edit QR Code
          </Button>
          <Link href={route.destinationUrl} target="_blank">
            <Button variant="secondary" className="gap-2 rounded-xl h-12 px-6">
              Visit <ExternalLink size={14} />
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-8 sticky top-12">
           <div 
              className="w-full aspect-square fun-card flex items-center justify-center relative p-10 bg-white group shadow-2xl shadow-orange-100/50"
              style={moduleStyles}
            >
              <QRCodeForge
                value={qrUrl}
                size={260}
                fgColor={design.fgColor}
                bgColor={design.bgColor}
                logoUrl={design.logoUrl || undefined}
                logoPadding={design.logoPadding}
                dotType={design.dotType}
                cornerType={design.cornerType}
                cornerDotType={design.cornerDotType}
                margin={design.margin}
                id="qr-code-canvas"
              />
            </div>

            <div className="fun-card p-6 space-y-4 bg-white">
                <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">
                  <span>Link Type</span>
                  <span className="text-brand-orange font-bold">{route.redirectType === '302' ? 'Dynamic' : 'Static'}</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <code className="text-xs font-mono text-zinc-600 flex-1 truncate font-medium">{qrUrl}</code>
                  <CopyButton value={qrUrl} className="bg-white hover:bg-zinc-50 shadow-sm border border-zinc-100" />
                </div>
                <Button 
                   className="w-full gap-2 rounded-xl shadow-lg shadow-orange-100 mt-2 h-12"
                   onClick={handleDownload}
                >
                   <Download size={18} /> Download High-Res
                </Button>
                
                {route.redirectType === '302' && (
                   <Button 
                      variant={route.isActive ? 'danger' : 'primary'}
                      className="w-full gap-2 rounded-xl h-12 mt-2"
                      onClick={handleStatusToggle}
                      disabled={updateMutation.isPending}
                   >
                      {updateMutation.isPending ? <RefreshCw className="animate-spin" size={16} /> : (
                         <>
                           {route.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                           {route.isActive ? 'Pause Link' : 'Resume Link'}
                         </>
                      )}
                   </Button>
                )}
            </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="fun-card p-10 space-y-2 bg-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:bg-orange-100 transition-colors" />
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 relative z-10">Total Scans</p>
                <p className="text-6xl font-black text-brand-orange relative z-10">
                   {route.redirectType === '301' ? 'NIL' : totalScans}
                </p>
              </div>
              <div className="fun-card p-10 space-y-2 bg-white group">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Date Created</p>
                <div className="flex items-end gap-3">
                   <CalendarIcon className="text-zinc-100 mb-1 group-hover:text-zinc-200 transition-colors" size={48} />
                   <p className="text-4xl font-black text-zinc-800">{new Date(route.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {route.redirectType === '301' ? (
               <div className="fun-card p-12 text-center space-y-6 bg-zinc-50/50 border-dashed border-2 border-zinc-200">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-zinc-100">
                     <Zap size={24} className="text-zinc-300" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="font-black text-lg text-zinc-800 uppercase tracking-tight">Offline Resolution</h3>
                     <p className="text-sm text-zinc-400 max-w-md mx-auto font-medium">This is a static QR code. It encodes your destination directly and does not route through our servers, making resolution lightning-fast but untrackable.</p>
                  </div>
               </div>
            ) : (
               <>
                  <div className="space-y-6">
                     <div className="flex items-center gap-4 ml-1">
                        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                           <Activity size={20} />
                        </div>
                        <h3 className="font-black text-xl text-zinc-800 uppercase tracking-tight">Scan Statistics</h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="fun-card p-10 space-y-10 bg-white border-2 border-zinc-50">
                           <div className="flex items-center gap-4">
                              <Smartphone size={20} className="text-brand-orange" />
                              <h4 className="font-bold text-sm text-zinc-800 uppercase tracking-widest">Device Types</h4>
                           </div>
                           <div className="space-y-6">
                              {Object.entries(deviceCounts).map(([label, count]) => (
                                 <StatBar key={label} label={label} count={count} total={totalScans} icon={label === 'Mobile' ? Smartphone : Monitor} />
                              ))}
                              {totalScans === 0 && <p className="text-center py-10 text-zinc-300 font-mono text-[10px] uppercase tracking-widest">No device data available</p>}
                           </div>
                        </div>

                        <div className="fun-card p-10 space-y-10 bg-white border-2 border-zinc-50">
                           <div className="flex items-center gap-4">
                              <Globe size={20} className="text-brand-orange" />
                              <h4 className="font-bold text-sm text-zinc-800 uppercase tracking-widest">Browsers</h4>
                           </div>
                           <div className="space-y-6">
                              {Object.entries(browserCounts).map(([label, count]) => (
                                 <StatBar key={label} label={label} count={count} total={totalScans} icon={Globe} />
                              ))}
                              {totalScans === 0 && <p className="text-center py-10 text-zinc-300 font-mono text-[10px] uppercase tracking-widest">No browser data available</p>}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-4 ml-1">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-brand-orange">
                           <History size={20} />
                        </div>
                        <h3 className="font-black text-xl text-zinc-800 uppercase tracking-tight">Recent Activity</h3>
                     </div>
                     
                     <div className="fun-card overflow-hidden bg-white border-2 border-zinc-50">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-zinc-50 text-left bg-zinc-50/30">
                              <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">Timestamp</th>
                              <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">Device</th>
                              <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">Client ID</th>
                              <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 text-right">Referrer</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-50">
                            {analytics.slice(0, 15).map((event) => (
                              <tr key={event.id} className="hover:bg-orange-50/20 transition-colors">
                                <td className="py-4 px-8 text-xs font-bold text-zinc-600 font-mono">
                                  {new Date(event.timestamp).toLocaleString()}
                                </td>
                                <td className="py-4 px-8">
                                   <span className="inline-flex items-center gap-2 text-[11px] font-black text-zinc-800 uppercase tracking-tighter">
                                      {event.device === 'Mobile' ? <Smartphone size={12} /> : <Monitor size={12} />} {event.device}
                                   </span>
                                </td>
                                <td className="py-4 px-8 text-[11px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                   {event.ipHash}
                                   <CopyButton value={event.ipHash} size="sm" className="h-6 w-6" />
                                </td>
                                <td className="py-4 px-8 text-right text-[11px] font-medium text-zinc-500 truncate max-w-[200px]">
                                   {event.referrer || 'Direct Scan'}
                                </td>
                              </tr>
                            ))}
                            {analytics.length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-20 text-center font-mono text-xs uppercase tracking-[0.3em] text-zinc-300">No scans yet</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                     </div>
                  </div>
               </>
            )}
        </div>
      </div>
    </div>
  );
}
