'use client';

import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { LoadingState } from '@/components/ui/loading-state';
import { DesignProcessor } from '@/lib/core/design-processor';
import { getServerError } from '@/lib/supabase/client';
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
import { useRouter } from 'next/navigation';
import { use, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { QRCodeForge, QRCodeForgeHandle } from '@/components/ui/qr-code-forge';
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
  const qrRef = useRef<QRCodeForgeHandle>(null);

  const { data, isLoading, error } = useGetAssetWithAnalytics(code);

  const route = data?.route;
  const analytics = data?.analytics || [];

  const updateMutation = useUpdateAsset(code);

  useEffect(() => {
    if (error) {
      const is401 = (error as Error).message?.includes('Unauthorized');
      if (is401) {
        router.push('/auth/login');
      }
    }
  }, [error, router]);

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
    const is401 = (error as Error)?.message?.includes('Unauthorized');
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-8 bg-white space-y-6 vibrant-dots text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl">
           <Zap size={32} className="text-brand-orange" />
        </div>
        <div className="space-y-2">
           <p className="font-bold text-zinc-800 uppercase tracking-widest text-sm">
             {is401 ? 'Identity Required' : 'QR Code Not Found'}
           </p>
           <p className="text-zinc-500 text-xs max-w-xs mx-auto">
             {is401 ? 'Please sign in to view this asset.' : 'The requested asset node does not exist in the forge.'}
           </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-[200px]">
           {is401 ? (
              <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
           ) : (
              <Button onClick={() => window.location.reload()}>Try Again</Button>
           )}
           <Button variant="ghost" onClick={() => router.push('/assets')}>Return to Library</Button>
        </div>
      </div>
    );
  }

  const totalScans = analytics.length;
  const design = route.design;
  const moduleStyles = DesignProcessor.getModuleStyles(design);
  
  const qrUrl = route.redirectType === '301' 
    ? route.destinationUrl 
    : (typeof window !== 'undefined' ? `${window.location.origin}/r/${route.shortCode}` : '');

  const handleDownload = () => {
    if (qrRef.current) {
      qrRef.current.download(`qr-forge-${route.shortCode}.png`);
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
    <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-4 w-full">
          <button 
            onClick={() => router.push('/assets')}
            className="flex items-center gap-2 text-zinc-400 hover:text-brand-orange transition-colors font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} /> Back to Library
          </button>
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 flex flex-wrap items-center gap-3">
              #{route.shortCode.toUpperCase()}
              <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-black ${route.isActive ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                 {route.isActive ? 'Active' : 'Paused'}
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-zinc-400">
               <p className="truncate max-w-full sm:max-w-lg">{route.destinationUrl}</p>
               {route.expiresAt && (
                 <div className="flex items-center gap-1.5 text-red-400 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit">
                   <Clock size={12} /> Expires: {new Date(route.expiresAt).toLocaleString()}
                 </div>
               )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
          <Button 
            className="flex-1 md:flex-none gap-2 rounded-xl h-12 px-4 sm:px-8 shadow-xl shadow-orange-100 text-xs sm:text-sm"
            onClick={() => {
              router.push(`/workspace?edit=${route.managementToken}`);
            }}
          >
            <Pencil size={16} /> <span className="sm:hidden">Edit</span><span className="hidden sm:inline">Edit QR Code</span>
          </Button>
          <Link href={route.destinationUrl} target="_blank" className="flex-1 md:flex-none">
            <Button variant="secondary" className="w-full gap-2 rounded-xl h-12 px-4 sm:px-6 text-xs sm:text-sm">
              Visit <ExternalLink size={14} />
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-12">
           <div 
              className="w-full aspect-square fun-card flex items-center justify-center relative p-6 sm:p-10 bg-white group shadow-2xl shadow-orange-100/50"
              style={moduleStyles}
            >
              <QRCodeForge
                ref={qrRef}
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
              />
            </div>

            <div className="fun-card p-6 space-y-4 bg-white">
                <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">
                  <span>Link Type</span>
                  <span className="text-brand-orange font-bold">{route.redirectType === '302' ? 'Dynamic' : 'Static'}</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-50 p-3 sm:p-4 rounded-xl border border-zinc-100">
                  <code className="text-[10px] sm:text-xs font-mono text-zinc-600 flex-1 truncate font-medium">{qrUrl}</code>
                  <CopyButton value={qrUrl} className="bg-white hover:bg-zinc-50 shadow-sm border border-zinc-100 h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <Button 
                   className="w-full gap-2 rounded-xl shadow-lg shadow-orange-100 mt-2 h-12 text-sm"
                   onClick={handleDownload}
                >
                   <Download size={18} /> Download High-Res
                </Button>
                
                {route.redirectType === '302' && (
                   <Button 
                      variant={route.isActive ? 'danger' : 'primary'}
                      className="w-full gap-2 rounded-xl h-12 mt-2 text-sm"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="fun-card p-8 sm:p-10 space-y-2 bg-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:bg-orange-100 transition-colors" />
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 relative z-10">Total Scans</p>
                <p className="text-5xl sm:text-6xl font-black text-brand-orange relative z-10">
                   {route.redirectType === '301' ? 'NIL' : totalScans}
                </p>
              </div>
              <div className="fun-card p-8 sm:p-10 space-y-2 bg-white group">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">Date Created</p>
                <div className="flex items-end gap-3">
                   <CalendarIcon className="text-zinc-100 mb-1 group-hover:text-zinc-200 transition-colors hidden sm:block" size={48} />
                   <CalendarIcon className="text-zinc-100 mb-1 group-hover:text-zinc-200 transition-colors sm:hidden" size={40} />
                   <p className="text-3xl sm:text-4xl font-black text-zinc-800">{new Date(route.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {route.redirectType === '301' ? (
               <div className="fun-card p-10 sm:p-12 text-center space-y-6 bg-zinc-50/50 border-dashed border-2 border-zinc-200">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-zinc-100">
                     <Zap size={24} className="text-zinc-300" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="font-black text-base sm:text-lg text-zinc-800 uppercase tracking-tight">Offline Resolution</h3>
                     <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-medium">This is a static QR code. It encodes your destination directly and does not route through our servers, making resolution lightning-fast but untrackable.</p>
                  </div>
               </div>
            ) : (
               <>
                  <div className="space-y-6">
                     <div className="flex items-center gap-4 ml-1">
                        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shrink-0">
                           <Activity size={20} />
                        </div>
                        <h3 className="font-black text-lg sm:text-xl text-zinc-800 uppercase tracking-tight">Scan Statistics</h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="fun-card p-8 sm:p-10 space-y-8 sm:space-y-10 bg-white border-2 border-zinc-50">
                           <div className="flex items-center gap-4">
                              <Smartphone size={20} className="text-brand-orange" />
                              <h4 className="font-bold text-xs sm:text-sm text-zinc-800 uppercase tracking-widest">Device Types</h4>
                           </div>
                           <div className="space-y-6">
                              {Object.entries(deviceCounts).map(([label, count]) => (
                                 <StatBar key={label} label={label} count={count} total={totalScans} icon={label === 'Mobile' ? Smartphone : Monitor} />
                              ))}
                              {totalScans === 0 && <p className="text-center py-10 text-zinc-300 font-mono text-[10px] uppercase tracking-widest">No device data available</p>}
                           </div>
                        </div>

                        <div className="fun-card p-8 sm:p-10 space-y-8 sm:space-y-10 bg-white border-2 border-zinc-50">
                           <div className="flex items-center gap-4">
                              <Globe size={20} className="text-brand-orange" />
                              <h4 className="font-bold text-xs sm:text-sm text-zinc-800 uppercase tracking-widest">Browsers</h4>
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
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-brand-orange shrink-0">
                           <History size={20} />
                        </div>
                        <h3 className="font-black text-lg sm:text-xl text-zinc-800 uppercase tracking-tight">Recent Activity</h3>
                     </div>
                     
                     <div className="fun-card bg-white border-2 border-zinc-50 overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                           <table className="w-full border-collapse min-w-[600px]">
                              <thead>
                                 <tr className="border-b border-zinc-50 text-left bg-zinc-50/30">
                                    <th className="py-4 sm:py-5 px-6 sm:px-8 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400">Timestamp</th>
                                    <th className="py-4 sm:py-5 px-6 sm:px-8 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400">Device</th>
                                    <th className="py-4 sm:py-5 px-6 sm:px-8 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400">Client ID</th>
                                    <th className="py-4 sm:py-5 px-6 sm:px-8 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400 text-right">Referrer</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-50">
                                 {analytics.slice(0, 15).map((event) => (
                                    <tr key={event.id} className="hover:bg-orange-50/20 transition-colors">
                                       <td className="py-4 px-6 sm:px-8 text-[11px] font-bold text-zinc-600 font-mono whitespace-nowrap">
                                          {new Date(event.timestamp).toLocaleString()}
                                       </td>
                                       <td className="py-4 px-6 sm:px-8">
                                          <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-zinc-800 uppercase tracking-tighter">
                                             {event.device === 'Mobile' ? <Smartphone size={12} /> : <Monitor size={12} />} {event.device}
                                          </span>
                                       </td>
                                       <td className="py-4 px-6 sm:px-8 text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                                          {event.ipHash.substring(0, 8)}...
                                          <CopyButton value={event.ipHash} size="sm" className="h-6 w-6" />
                                       </td>
                                       <td className="py-4 px-6 sm:px-8 text-right text-[10px] sm:text-[11px] font-medium text-zinc-500 truncate max-w-[150px]">
                                          {event.referrer || 'Direct Scan'}
                                       </td>
                                    </tr>
                                 ))}
                                 {analytics.length === 0 && (
                                    <tr>
                                       <td colSpan={4} className="py-16 sm:py-20 text-center font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-zinc-300">No scans yet</td>
                                    </tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </>
            )}
        </div>
      </div>
    </div>
  );
}
