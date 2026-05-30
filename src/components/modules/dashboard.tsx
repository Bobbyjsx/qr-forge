'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus,
  RefreshCw,
  Zap,
  ChevronRight,
  FileSearch,
  ShieldCheck,
  Activity,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useRouter } from 'next/navigation';
import { WorkspaceSidebar } from '@/components/layout/workspace-sidebar';
import { QRRouteWithAnalytics } from '@/types/resources';
import { toast } from 'sonner';
import { getServerError } from '@/lib/supabase/client';
import { useGetAssets, useDeleteAsset } from '@/api/useAssets/assets';

export function Dashboard() {
  const router = useRouter();
  const [assetToDelete, setAssetToDelete] = useState<QRRouteWithAnalytics | null>(null);

  const { data: routes = [], isLoading, error } = useGetAssets();

  const deleteMutation = useDeleteAsset();

  useEffect(() => {
    if (error) {
      const is401 = (error as Error).message?.includes('Unauthorized');
      if (is401) {
        router.push('/auth/login');
      }
    }
  }, [error, router]);

  const handleDelete = async () => {
    if (!assetToDelete) return;
    
    try {
      await deleteMutation.mutateAsync(assetToDelete.managementToken);
      setAssetToDelete(null);
      toast.success('Asset deleted successfully');
    } catch (err: unknown) {
      toast.error(getServerError(err));
    }
  };

  if (isLoading) return <LoadingState title="Loading..." description="Loading your QR codes..." />;

  if (error) {
    const is401 = (error as Error).message?.includes('Unauthorized');

    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center p-6 sm:p-8 vibrant-dots">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-50 rounded-[2.5rem] sm:rounded-[3rem] flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-orange-100">
            <ShieldCheck className="text-brand-orange" size={32} />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-800">
              {is401 ? 'Sign In Required' : 'Connection Error'}
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 font-medium leading-relaxed">
              {is401 
                ? 'Please sign in to access your QR code library.' 
                : 'We had a problem connecting to the server. Please try again.'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {is401 ? (
              <>
                <Button onClick={() => router.push('/auth/login')} className="h-14 text-base shadow-xl shadow-orange-200">
                  Sign In
                </Button>
                <Button variant="ghost" onClick={() => router.push('/')}>
                  Go Home
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => window.location.reload()} className="h-14 text-base shadow-xl shadow-orange-200">
                  <RefreshCw size={18} className="mr-2" /> Try Again
                </Button>
                <Button variant="ghost" onClick={() => router.push('/')} className="h-14 text-base">
                  Go Home
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-white overflow-hidden">
      <WorkspaceSidebar />
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto custom-scrollbar bg-white vibrant-dots pb-20 lg:pb-0">
        <header className="h-16 sm:h-20 border-b border-zinc-100 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest">Library</span>
            <ChevronRight size={12} className="text-zinc-300" />
            <span className="text-xs sm:text-sm font-bold text-zinc-800 whitespace-nowrap">My QR Codes</span>
          </div>
          <Button size="sm" onClick={() => router.push('/workspace')} className="gap-2 shadow-lg shadow-orange-100">
            <Plus size={16} /> <span className="hidden sm:inline">New QR Code</span><span className="sm:hidden">New</span>
          </Button>
        </header>

        <div className="p-6 sm:p-10 relative z-10 flex-1">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="fun-card p-6 sm:p-8 space-y-2 sm:space-y-3 bg-white">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">Total Assets</p>
                <p className="text-3xl sm:text-4xl font-black text-zinc-800">{routes.length}</p>
              </div>
              <div className="fun-card p-6 sm:p-8 space-y-2 sm:space-y-3 bg-white">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">Total Scans</p>
                <p className="text-3xl sm:text-4xl font-black text-brand-orange">
                  {routes.reduce((acc, r) => acc + (r.analyticsCount || 0), 0)}
                </p>
              </div>
              <div className="fun-card p-6 sm:p-8 space-y-2 sm:space-y-3 bg-white border-2 border-orange-100/50 sm:col-span-2 md:col-span-1">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">Status</p>
                <p className="text-lg sm:text-xl font-black text-zinc-800 uppercase">
                  <span className="text-brand-orange">{routes.filter(r => r.isActive).length}</span> Online // {routes.filter(r => !r.isActive).length} Paused
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 sm:gap-3">
                  <FileSearch size={16} className="text-brand-orange sm:w-[18px] sm:h-[18px]" /> Asset Library
                </h3>
                <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100">Synced</span>
              </div>

              <div className="fun-card bg-white mb-20 border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-zinc-50 text-left bg-zinc-50/30">
                        <th className="py-4 sm:py-5 px-6 sm:px-8 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400">Link Code</th>
                        <th className="py-4 sm:py-5 px-6 sm:px-8 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400">Destination URL</th>
                        <th className="py-4 sm:py-5 px-6 sm:px-8 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400">Type</th>
                        <th className="py-4 sm:py-5 px-6 sm:px-8 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400">Scans</th>
                        <th className="py-4 sm:py-5 px-6 sm:px-8 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {routes.map((route) => (
                        <tr key={route.id} className="group hover:bg-orange-50/20 transition-colors cursor-pointer" onClick={() => router.push(`/assets/qr/${route.managementToken}`)}>
                          <td className="py-4 sm:py-6 px-6 sm:px-8 font-mono text-brand-orange font-black uppercase tracking-tighter text-sm">
                            {route.shortCode}
                          </td>
                          <td className="py-4 sm:py-6 px-6 sm:px-8">
                             <div className="max-w-xs space-y-1">
                                <p className="font-bold text-[12px] sm:text-[13px] text-zinc-800 truncate">{route.destinationUrl}</p>
                                <p className="text-[9px] sm:text-[10px] font-medium text-zinc-400 uppercase tracking-widest italic">{route.isActive ? 'Online' : 'Paused'}</p>
                             </div>
                          </td>
                          <td className="py-4 sm:py-6 px-6 sm:px-8">
                            <span className={`inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest border-2 ${
                               route.redirectType === '302' 
                               ? 'bg-orange-50 border-orange-100 text-brand-orange' 
                               : 'bg-zinc-50 border-zinc-100 text-zinc-400'
                            }`}>
                              {route.redirectType === '302' ? 'Dynamic' : 'Static'}
                            </span>
                          </td>
                          <td className="py-4 sm:py-6 px-6 sm:px-8 font-black text-sm text-zinc-700">
                            {route.redirectType === '301' ? '—' : (route.analyticsCount || 0)}
                          </td>
                          <td className="py-4 sm:py-6 px-6 sm:px-8 text-right space-x-1 sm:space-x-2 whitespace-nowrap">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="h-8 w-8 sm:h-9 sm:w-9 bg-white border border-zinc-100 shadow-sm hover:border-brand-orange/30 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/assets/qr/${route.managementToken}`);
                              }}
                            >
                              <Activity size={14} className="sm:w-[16px] sm:h-[16px]" />
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="h-8 w-8 sm:h-9 sm:w-9 bg-white border border-zinc-100 shadow-sm hover:border-brand-orange/30 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/workspace?edit=${route.managementToken}`);
                              }}
                            >
                              <Pencil size={14} className="sm:w-[16px] sm:h-[16px]" />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="icon" 
                              className="h-8 w-8 sm:h-9 sm:w-9 bg-white border border-red-50 shadow-sm hover:bg-red-50 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAssetToDelete(route);
                              }}
                            >
                              <Trash2 size={14} className="sm:w-[16px] sm:h-[16px]" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {routes.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-24 sm:py-32 text-center">
                            <div className="space-y-4 sm:space-y-6 px-6">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-50 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-dashed border-zinc-100">
                                 <Plus size={24} className="text-zinc-200 sm:w-[32px] sm:h-[32px]" />
                              </div>
                              <p className="font-bold text-zinc-400 uppercase tracking-widest text-[10px] sm:text-xs leading-relaxed">No active deployments found</p>
                              <Button onClick={() => router.push('/workspace')} variant="primary" size="sm" className="rounded-xl px-8 h-12">Create First QR</Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConfirmationModal 
          isOpen={!!assetToDelete}
          onClose={() => setAssetToDelete(null)}
          onConfirm={handleDelete}
          title="Delete QR Code"
          description={`Are you sure you want to permanently delete #${assetToDelete?.shortCode.toUpperCase()}? This cannot be undone.`}
          confirmLabel="Delete QR Code"
          isLoading={deleteMutation.isPending}
        />
      </main>
    </div>
  );
}
