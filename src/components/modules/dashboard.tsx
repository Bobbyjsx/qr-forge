'use client';

import React, { useState } from 'react';
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
      <div className="min-h-screen bg-white flex items-center justify-center p-8 vibrant-dots">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-orange-50 rounded-[3rem] flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-orange-100">
            <ShieldCheck className="text-brand-orange" size={40} />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-zinc-800">
              {is401 ? 'Sign In Required' : 'Connection Error'}
            </h2>
            <p className="text-zinc-500 font-medium leading-relaxed">
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
              <Button onClick={() => window.location.reload()} className="h-14 text-base shadow-xl shadow-orange-200">
                <RefreshCw size={18} className="mr-2" /> Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <WorkspaceSidebar />
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto custom-scrollbar bg-white vibrant-dots">
        <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-10 bg-white/60 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Library</span>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="text-sm font-bold text-zinc-800">My QR Codes</span>
          </div>
          <Button size="sm" onClick={() => router.push('/workspace')} className="gap-2 shadow-lg shadow-orange-100">
            <Plus size={16} /> New QR Code
          </Button>
        </header>

        <div className="p-10 relative z-10 flex-1">
          <div className="max-w-6xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="fun-card p-8 space-y-3 bg-white">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Total Assets</p>
                <p className="text-4xl font-black text-zinc-800">{routes.length}</p>
              </div>
              <div className="fun-card p-8 space-y-3 bg-white">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Total Scans</p>
                <p className="text-4xl font-black text-brand-orange">
                  {routes.reduce((acc, r) => acc + (r.analyticsCount || 0), 0)}
                </p>
              </div>
              <div className="fun-card p-8 space-y-3 bg-white border-2 border-orange-100/50">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Status</p>
                <p className="text-xl font-black text-zinc-800 uppercase">
                  <span className="text-brand-orange">{routes.filter(r => r.isActive).length}</span> Online // {routes.filter(r => !r.isActive).length} Paused
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-3">
                  <FileSearch size={18} className="text-brand-orange" /> Asset Library
                </h3>
                <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100">Synced</span>
              </div>

              <div className="fun-card overflow-hidden bg-white mb-20 border-zinc-100 shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-50 text-left bg-zinc-50/30">
                      <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">Link Code</th>
                      <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">Destination URL</th>
                      <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">Type</th>
                      <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">Scans</th>
                      <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {routes.map((route) => (
                      <tr key={route.id} className="group hover:bg-orange-50/20 transition-colors cursor-pointer" onClick={() => router.push(`/assets/qr/${route.managementToken}`)}>
                        <td className="py-6 px-8 font-mono text-brand-orange font-black uppercase tracking-tighter text-sm">
                          {route.shortCode}
                        </td>
                        <td className="py-6 px-8">
                           <div className="max-w-xs space-y-1">
                              <p className="font-bold text-[13px] text-zinc-800 truncate">{route.destinationUrl}</p>
                              <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest italic">{route.isActive ? 'Online' : 'Paused'}</p>
                           </div>
                        </td>
                        <td className="py-6 px-8">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 ${
                             route.redirectType === '302' 
                             ? 'bg-orange-50 border-orange-100 text-brand-orange' 
                             : 'bg-zinc-50 border-zinc-100 text-zinc-400'
                          }`}>
                            {route.redirectType === '302' ? 'Dynamic' : 'Static'}
                          </span>
                        </td>
                        <td className="py-6 px-8 font-black text-sm text-zinc-700">
                          {route.redirectType === '301' ? '—' : (route.analyticsCount || 0)}
                        </td>
                        <td className="py-6 px-8 text-right space-x-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-9 w-9 bg-white border border-zinc-100 shadow-sm hover:border-brand-orange/30 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/assets/qr/${route.managementToken}`);
                            }}
                          >
                            <Activity size={16} />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-9 w-9 bg-white border border-zinc-100 shadow-sm hover:border-brand-orange/30 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/workspace?edit=${route.managementToken}`);
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="danger" 
                            size="icon" 
                            className="h-9 w-9 bg-white border border-red-50 shadow-sm hover:bg-red-50 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssetToDelete(route);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {routes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-32 text-center">
                          <div className="space-y-6">
                            <div className="w-20 h-20 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-dashed border-zinc-100">
                               <Plus size={32} className="text-zinc-200" />
                            </div>
                            <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs">No active deployments found</p>
                            <Button onClick={() => router.push('/workspace')} variant="primary" size="sm" className="rounded-xl px-8">Create First QR</Button>
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
