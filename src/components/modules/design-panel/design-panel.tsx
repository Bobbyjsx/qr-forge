'use client';

import React, { useRef, useState } from 'react';
import { 
  Palette, 
  Layout, 
  Image as ImageIcon,
  Upload,
  RefreshCw,
  X,
  Type,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { QRRouteSchema } from '@/lib/utils/schemas';

interface DesignPanelProps {
  form: UseFormReturn<QRRouteSchema>;
}

const DOT_TYPES = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'C-Rounded' },
  { value: 'extra-rounded', label: 'X-Rounded' },
] as const;

const CORNER_TYPES = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Rounded' },
] as const;

export function DesignPanel({ form }: DesignPanelProps) {
  const { register, watch, setValue } = form;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const borderStyle = watch('design.borderStyle');
  const logoUrl = watch('design.logoUrl');
  const logoPadding = watch('design.logoPadding');
  const dotType = watch('design.dotType');
  const cornerType = watch('design.cornerType');
  const margin = watch('design.margin');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];

    if (file.size > maxSize) {
      toast.error('File size exceeds 2MB limit');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PNG, JPEG or SVG.');
      return;
    }

    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(data.path);

      setValue('design.logoUrl', publicUrl, { shouldDirty: true });
      toast.success('Logo uploaded successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="fun-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Palette size={18} className="text-brand-orange" />
          </div>
          <h4 className="font-bold text-sm text-zinc-800 uppercase tracking-widest">Color Engine</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Pattern Bits</label>
            <input 
              type="color" 
              {...register('design.fgColor')}
              className="w-full h-12 bg-zinc-50 border-2 border-transparent rounded-xl cursor-pointer hover:border-brand-orange/20 transition-all p-1" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Canvas Base</label>
            <input 
              type="color" 
              {...register('design.bgColor')}
              className="w-full h-12 bg-zinc-50 border-2 border-transparent rounded-xl cursor-pointer hover:border-brand-orange/20 transition-all p-1" 
            />
          </div>
        </div>
      </div>

      <div className="fun-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Type size={18} className="text-brand-orange" />
          </div>
          <h4 className="font-bold text-sm text-zinc-800 uppercase tracking-widest">Pattern Geometry</h4>
        </div>

        <div className="space-y-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Module Style</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-50 rounded-xl">
                {DOT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setValue('design.dotType', type.value, { shouldDirty: true })}
                    className={`py-2 text-[10px] font-black uppercase tracking-tight rounded-lg transition-all ${
                      dotType === type.value 
                        ? 'bg-white text-brand-orange shadow-sm border border-orange-100' 
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Finder Style</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-50 rounded-xl">
                {CORNER_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setValue('design.cornerType', type.value, { shouldDirty: true })}
                    className={`py-2 text-[10px] font-black uppercase tracking-tight rounded-lg transition-all ${
                      cornerType === type.value 
                        ? 'bg-white text-brand-orange shadow-sm border border-orange-100' 
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>

      <div className="fun-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Layout size={18} className="text-brand-orange" />
          </div>
          <h4 className="font-bold text-sm text-zinc-800 uppercase tracking-widest">Architecture</h4>
        </div>

        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Outer Border</label>
              <div className="flex gap-2 p-1 bg-zinc-50 rounded-xl">
                {['none', 'solid', 'dashed'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setValue('design.borderStyle', style as any, { shouldDirty: true })}
                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                      borderStyle === style 
                        ? 'bg-white text-brand-orange shadow-sm border border-orange-100' 
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    {style === 'none' ? 'Clean' : style}
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Internal Margin</label>
                <span className="text-[10px] font-mono font-bold text-brand-orange">{margin}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="40" 
                {...register('design.margin', { valueAsNumber: true })}
                className="w-full accent-brand-orange h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
              />
           </div>
        </div>
      </div>

      <div className="fun-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <ImageIcon size={18} className="text-brand-orange" />
          </div>
          <h4 className="font-bold text-sm text-zinc-800 uppercase tracking-widest">Brand Signature</h4>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Identity Asset URL"
              {...register('design.logoUrl')}
              className="bg-zinc-50 border-0 focus:bg-white flex-1 h-12 text-sm font-medium"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="shrink-0 h-12 w-12 rounded-xl border border-zinc-100 shadow-sm hover:border-orange-200 transition-all"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/png,image/jpeg,image/svg+xml"
            />
          </div>

          {logoUrl && (
            <div className="space-y-4 p-5 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Asset Preview</span>
                <button 
                  type="button"
                  onClick={() => setValue('design.logoUrl', '', { shouldDirty: true })}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex justify-center bg-white p-6 rounded-xl border border-zinc-100 shadow-sm">
                <img src={logoUrl} alt="Logo" className="max-h-16 object-contain" />
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Scaling Factor</label>
                  <span className="text-[10px] font-mono font-bold text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full">{logoPadding}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="80" 
                  {...register('design.logoPadding', { valueAsNumber: true })}
                  className="w-full accent-brand-orange h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
