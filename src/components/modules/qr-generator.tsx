'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Globe, 
  Layout, 
  ChevronRight,
  Monitor,
  Copy,
  Check,
  RefreshCw,
  Link2,
  Save,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  XCircle,
  Eye,
  EyeOff,
  Pencil,
  Fingerprint,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DesignPanel } from './design-panel/design-panel';
import { DesignProcessor } from '@/lib/core/design-processor';
import { qrRouteSchema, type QRRouteSchema } from '@/lib/utils/schemas';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingState } from '@/components/ui/loading-state';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { CopyButton } from '@/components/ui/copy-button';
import { getServerError } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { QRRoute } from '@/types/resources';
import { transformQRRoute } from '@/lib/utils/case-transform';
import { QRCodeForge } from '@/components/ui/qr-code-forge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateAsset, useUpdateAsset, useGetAsset } from '@/api/useAssets/assets';
import { TimePicker } from '@/components/ui/time-picker';
import { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';

type QRMode = 'direct' | 'redirect';

export function QRGenerator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAnonymous = searchParams.get('mode') === 'anonymous';
  const editToken = searchParams.get('edit');
  
  const [mode, setMode] = useState<QRMode>(isAnonymous ? 'direct' : 'redirect');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const form = useForm<QRRouteSchema>({
    resolver: zodResolver(qrRouteSchema),
    defaultValues: {
      url: '',
      redirectType: '302',
      isActive: true,
      expiresAt: null,
      design: {
        fgColor: '#FF5722',
        bgColor: '#FFFFFF',
        borderStyle: 'none',
        logoPadding: 10,
        dotType: 'square',
        cornerType: 'square',
        cornerDotType: 'square',
        margin: 0
      }
    }
  });

  const { register, watch, handleSubmit, reset, setValue, formState: { isDirty, errors } } = form;
  
  const watchedUrl = watch('url');
  const watchedRedirectType = watch('redirectType');
  const watchedIsActive = watch('isActive');
  const watchedExpiresAt = watch('expiresAt');
  const watchedFgColor = watch('design.fgColor');
  const watchedBgColor = watch('design.bgColor');
  const watchedBorderStyle = watch('design.borderStyle');
  const watchedLogoUrl = watch('design.logoUrl');
  const watchedLogoPadding = watch('design.logoPadding');
  const watchedDotType = watch('design.dotType') as DotType;
  const watchedCornerType = watch('design.cornerType') as CornerSquareType;
  const watchedCornerDotType = watch('design.cornerDotType') as CornerDotType;
  const watchedMargin = watch('design.margin');

  const { data: existingAsset, isLoading: isLoadingAsset } = useGetAsset(editToken);

  useEffect(() => {
    if (existingAsset) {
      reset({
        url: existingAsset.destinationUrl,
        redirectType: existingAsset.redirectType,
        isActive: existingAsset.isActive,
        expiresAt: existingAsset.expiresAt,
        design: {
          fgColor: existingAsset.design.fgColor,
          bgColor: existingAsset.design.bgColor,
          borderStyle: existingAsset.design.borderStyle,
          logoUrl: existingAsset.design.logoUrl || '',
          logoPadding: existingAsset.design.logoPadding,
          dotType: existingAsset.design.dotType,
          cornerType: existingAsset.design.cornerType,
          cornerDotType: existingAsset.design.cornerDotType,
          margin: existingAsset.design.margin
        }
      });
      setMode(existingAsset.redirectType === '302' ? 'redirect' : 'direct');
    }
  }, [existingAsset, reset]);

  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset(editToken);

  const onFormSubmit = async (data: QRRouteSchema) => {
    if (isAnonymous && !editToken && mode === 'redirect') {
      router.push('/onboarding');
      return;
    }
    
    data.redirectType = (mode === 'redirect' ? '302' : '301') as '301' | '302' | '307';
    
    if (data.expiresAt === '') {
      data.expiresAt = null;
    }

    try {
      let result;
      if (editToken) {
        result = await updateMutation.mutateAsync(data);
        toast.success('Changes saved successfully');
      } else {
        result = await createMutation.mutateAsync(data);
        toast.success('Asset forged successfully');
      }

      if (result) {
        if (!result.createdBy) {
          const key = `qrf_token_${result.shortCode}`;
          localStorage.setItem(key, result.managementToken);
        }
        router.push(`/assets/qr/${result.managementToken}`);
        reset(); 
      }
    } catch (err: unknown) {
      toast.error(getServerError(err));
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://qrforge.com';
  const previewShortCode = existingAsset?.shortCode;
  
  // Logic: If Dynamic (302) and we have a code, route through /r/. 
  // If Static (301) or New creation, encode the target URL directly.
  const qrValue = mode === 'redirect' && previewShortCode 
    ? `${baseUrl}/r/${previewShortCode}` 
    : (watchedUrl || 'https://qrforge.com');
  
  const moduleStyles = DesignProcessor.getModuleStyles({
    fgColor: watchedFgColor || '#FF5722',
    bgColor: watchedBgColor || '#FFFFFF',
    borderStyle: watchedBorderStyle || 'none',
  });

  const handleCancel = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      router.push(editToken ? `/assets/qr/${editToken}` : '/assets');
    }
  };

  if (editToken && isLoadingAsset) return <LoadingState title="Loading..." description="Fetching your QR code..." />;

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-white lg:overflow-hidden">
      <div className="flex-1 min-h-0 lg:h-full lg:overflow-y-auto custom-scrollbar vibrant-dots p-6 lg:p-12 border-r border-zinc-100">
        <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-2xl mx-auto space-y-12 pb-24">
          <header className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] bg-orange-50 px-2 py-0.5 rounded">
                  {editToken ? 'Edit QR Code' : 'Create QR Code'}
               </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900">
               {editToken ? `Customize Style` : 'New QR Code'}
            </h2>
            <p className="text-sm font-medium text-zinc-400">
               {editToken ? 'Change how your QR looks or update its destination.' : 'Create a new QR code for your brand or project.'}
            </p>
          </header>
          
          {editToken && watchedRedirectType === '302' && (
             <div className="fun-card p-6 flex items-center justify-between bg-orange-50/20 border-brand-orange/10">
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${watchedIsActive ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                      {watchedIsActive ? <Eye size={20} /> : <EyeOff size={20} />}
                   </div>
                   <div>
                      <h4 className="font-bold text-sm text-zinc-800 uppercase tracking-tight">Status</h4>
                      <p className="text-xs text-zinc-500 font-medium">{watchedIsActive ? 'Active' : 'Paused'}</p>
                   </div>
                </div>
                <Button 
                   type="button"
                   variant={watchedIsActive ? 'ghost' : 'primary'}
                   size="sm"
                   onClick={() => {
                      setValue('isActive', !watchedIsActive, { shouldDirty: true });
                   }}
                   className="rounded-xl px-6"
                >
                   {watchedIsActive ? 'Pause' : 'Resume'}
                </Button>
             </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                <Globe size={16} className="text-brand-orange" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800">1. Destination</h3>
            </div>
            
            {!editToken && (
               <div className="fun-card p-2 flex flex-col sm:flex-row gap-2">
               <button
                 type="button"
                 onClick={() => setMode('redirect')}
                 className={`flex-1 p-5 rounded-xl transition-all text-left group relative ${
                   mode === 'redirect' 
                   ? 'bg-orange-50 border-2 border-brand-orange/20' 
                   : 'hover:bg-zinc-50'
                 }`}
               >
                 <div className="flex items-center justify-between mb-2">
                   <span className={`text-[13px] font-bold ${mode === 'redirect' ? 'text-brand-orange' : 'text-zinc-600'}`}>Dynamic Link</span>
                   {mode === 'redirect' && <div className="w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                 </div>
                 <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">Change the link anytime & track scans.</p>
                 {isAnonymous && <span className="absolute top-2 right-2 text-[8px] bg-white border border-red-100 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase">Pro</span>}
               </button>
 
               <button
                 type="button"
                 onClick={() => setMode('direct')}
                 className={`flex-1 p-5 rounded-xl transition-all text-left group relative ${
                   mode === 'direct' 
                   ? 'bg-orange-50 border-2 border-brand-orange/20' 
                   : 'hover:bg-zinc-50'
                 }`}
               >
                 <div className="flex items-center justify-between mb-2">
                   <span className={`text-[13px] font-bold ${mode === 'direct' ? 'text-brand-orange' : 'text-zinc-600'}`}>Static Link</span>
                   {mode === 'direct' && <div className="w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                 </div>
                 <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">Permanent link. No tracking.</p>
               </button>
             </div>
            )}

            <div className="fun-card p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 ml-1 uppercase tracking-widest flex justify-between">
                   Target URL
                   {errors.url && <span className="text-red-500 text-[10px] lowercase italic font-normal flex items-center gap-1"><AlertCircle size={10} /> {errors.url.message}</span>}
                </label>
                <div className="relative">
                  <Input
                    placeholder="https://example.com"
                    {...register('url')}
                    className={`bg-zinc-50 border-0 focus:bg-white h-14 text-base ${errors.url ? 'ring-2 ring-red-500/20' : ''}`}
                  />
                  <div className="absolute right-4 top-4 text-zinc-300 flex items-center gap-2">
                    {editToken && <CopyButton value={watchedUrl} size="sm" className="h-8 w-8 bg-white border border-zinc-100 shadow-sm" />}
                    <Link2 size={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 ml-1 uppercase tracking-widest flex items-center gap-2">
                   <CalendarIcon size={14} className="text-zinc-300" />
                   Expiration (Optional)
                </label>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-14 justify-start text-left font-medium bg-zinc-50 border-0 hover:bg-zinc-100/50 rounded-xl px-4 transition-all",
                        !watchedExpiresAt && "text-zinc-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-40 text-brand-orange" />
                      {watchedExpiresAt ? (
                        format(new Date(watchedExpiresAt), "PPP 'at' p")
                      ) : (
                        <span>Set Expiry Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0 rounded-[2rem] border border-zinc-100 shadow-2xl overflow-hidden" align="start">
                    <div className="p-5 border-b border-zinc-50 bg-zinc-50/50 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-6 bg-brand-orange rounded-full" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">Expiration</span>
                       </div>
                       {watchedExpiresAt && (
                         <button 
                           type="button" 
                           onClick={() => setValue('expiresAt', null, { shouldDirty: true })}
                           className="text-[10px] font-black uppercase tracking-tighter text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                         >
                           Clear Date
                         </button>
                       )}
                    </div>
                    
                    <div className="p-3">
                       <Calendar
                         mode="single"
                         selected={watchedExpiresAt ? new Date(watchedExpiresAt) : undefined}
                         onSelect={(date) => {
                           if (date) {
                              const current = watchedExpiresAt ? new Date(watchedExpiresAt) : new Date();
                              const d = new Date(date);
                              d.setHours(current.getHours());
                              d.setMinutes(current.getMinutes());
                              d.setSeconds(current.getSeconds());
                              setValue('expiresAt', d.toISOString(), { shouldDirty: true });
                           }
                         }}
                       />
                    </div>

                    <TimePicker 
                       value={watchedExpiresAt}
                       onChange={(iso) => setValue('expiresAt', iso, { shouldDirty: true })}
                    />
                  </PopoverContent>
                </Popover>
                
                <p className="text-[10px] text-zinc-400 font-medium ml-1">The QR link will stop working after this time.</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {editToken && (
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
               >
                  <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                     <Layout size={16} className="text-brand-orange" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800">2. Design Settings</h3>
                  </div>
                  <DesignPanel form={form} />
               </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <aside className={`w-full lg:w-[450px] lg:h-screen lg:sticky lg:top-0 bg-zinc-50/50 flex flex-col items-center relative transition-all duration-700`}>
        <div className="w-full flex items-center justify-between p-8 lg:p-12 pb-0 shrink-0">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Live Preview</span>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-zinc-100 shadow-sm">
            <div className={`w-1.5 h-1.5 rounded-full ${editToken ? 'bg-green-500 animate-pulse' : 'bg-zinc-300'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${editToken ? 'text-zinc-800' : 'text-zinc-400'}`}>
               {editToken ? 'Online' : 'Awaiting'}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 p-8 lg:p-12">
           {editToken ? (
              <div className="w-full space-y-10 bouncy-enter pr-1">
                 <div 
                   className="w-full aspect-square fun-card flex items-center justify-center relative p-10 bg-white group shadow-2xl shadow-orange-100/50 shrink-0"
                   style={moduleStyles}
                 >
                   <QRCodeForge
                     value={qrValue || ' '}
                     size={240}
                     fgColor={watchedFgColor}
                     bgColor={watchedBgColor}
                     logoUrl={watchedLogoUrl || undefined}
                     logoPadding={watchedLogoPadding}
                     dotType={watchedDotType}
                     cornerType={watchedCornerType}
                     cornerDotType={watchedCornerDotType}
                     margin={watchedMargin}
                   />
                 </div>

                 <div className="space-y-6">
                   <div className="fun-card p-6 space-y-4 bg-white border-zinc-100 shadow-sm">
                     <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">
                       <span>Link Code</span>
                       <span className="text-brand-orange font-bold">#{existingAsset?.shortCode.toUpperCase() || '...'}</span>
                     </div>
                     <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-100 group">
                       <code className="text-xs font-mono text-zinc-600 flex-1 truncate font-medium">{qrValue}</code>
                       <CopyButton value={qrValue} className="bg-white hover:bg-zinc-50 shadow-sm border border-zinc-100" />
                     </div>
                   </div>

                   {existingAsset?.guestId && (
                      <div className="fun-card p-6 space-y-4 bg-white border-zinc-100 shadow-sm">
                        <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">
                          <span>Owner ID</span>
                          <Fingerprint size={12} className="text-zinc-300" />
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-100 group">
                          <code className="text-[10px] font-mono text-zinc-400 flex-1 truncate">{existingAsset.guestId}</code>
                          <CopyButton value={existingAsset.guestId} className="bg-white hover:bg-zinc-50 shadow-sm border border-zinc-100" />
                        </div>
                      </div>
                   )}
                 </div>
              </div>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-10">
                 <div className="w-24 h-24 rounded-[2.5rem] bg-white border-4 border-dashed border-zinc-100 flex items-center justify-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles size={40} className="text-zinc-200 relative z-10 group-hover:text-brand-orange transition-colors" />
                 </div>
                 <div className="space-y-3">
                    <p className="text-lg font-black text-zinc-800 uppercase tracking-tighter italic">Create QR</p>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">Enter a link on the left to generate your custom QR code.</p>
                 </div>
              </div>
           )}
        </div>

        <div className="w-full p-8 lg:p-12 pt-0 shrink-0 space-y-4">
           <Button 
              className="w-full h-16 gap-3 text-base rounded-2xl shadow-xl shadow-orange-100 group"
              onClick={handleSubmit(onFormSubmit)}
              disabled={!watchedUrl || (editToken ? !isDirty : false) || createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                 <RefreshCw className="animate-spin" size={24} />
              ) : (
                <>
                  {editToken ? <Save size={20} /> : <Zap size={20} className="group-hover:fill-white transition-colors" />}
                  <span className="uppercase tracking-widest font-black">
                     {editToken ? 'Save Changes' : 'Create QR Code'}
                  </span>
                  <ArrowRight size={20} className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            
            <Button 
               type="button"
               variant="ghost"
               className="w-full h-12 gap-2 rounded-xl text-zinc-400 hover:text-zinc-600 font-bold uppercase tracking-widest text-[11px]"
               onClick={handleCancel}
            >
               {editToken ? 'Cancel Edits' : 'Clear Form'}
            </Button>
        </div>
      </aside>

      <ConfirmationModal 
         isOpen={isCancelModalOpen}
         onClose={() => setIsCancelModalOpen(false)}
         onConfirm={() => {
            setIsCancelModalOpen(false);
            router.push(editToken ? `/assets/qr/${editToken}` : '/assets');
         }}
         title="Unsaved Changes"
         description="You have pending changes that haven't been saved. Leaving now will undo your design updates."
         confirmLabel="Discard Changes"
         variant="warning"
      />
    </div>
  );
}
