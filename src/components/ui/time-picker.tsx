"use client";

import React from 'react';
import { format } from 'date-fns';

interface TimePickerProps {
  value: string | null | undefined;
  onChange: (isoString: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const current = value ? new Date(value) : new Date();

  const handleHourChange = (h: number) => {
    const d = new Date(current);
    const isPM = d.getHours() >= 12;
    let finalH = h;
    if (isPM && h !== 12) finalH += 12;
    if (!isPM && h === 12) finalH = 0;
    d.setHours(finalH);
    onChange(d.toISOString());
  };

  const handleMinChange = (m: number) => {
    const d = new Date(current);
    d.setMinutes(m);
    onChange(d.toISOString());
  };

  const handlePeriodChange = (p: 'AM' | 'PM') => {
    const d = new Date(current);
    const isPM = p === 'PM';
    let h = d.getHours();
    if (isPM && h < 12) h += 12;
    if (!isPM && h >= 12) h -= 12;
    d.setHours(h);
    onChange(d.toISOString());
  };

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59];

  const currentH = current.getHours();
  const displayH = currentH === 0 ? 12 : currentH > 12 ? currentH - 12 : currentH;
  const isPM = currentH >= 12;

  return (
    <div className="p-6 bg-zinc-50/50 border-t border-zinc-100 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Resolution Time</span>
          <p className="text-[9px] text-zinc-400 font-medium italic">Adjusts to your local time zone</p>
        </div>
        <span className="text-[10px] font-mono font-bold text-brand-orange bg-white px-2 py-0.5 rounded border border-orange-100 uppercase">Local</span>
      </div>
      
      <div className="flex gap-2 items-center">
        <div className="flex-1 space-y-1.5">
          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter ml-1">Hour</label>
          <select 
            value={displayH}
            onChange={(e) => handleHourChange(parseInt(e.target.value))}
            className="w-full bg-white border border-zinc-100 rounded-xl h-12 px-3 text-sm font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            {hours.map((h) => (
              <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
            ))}
          </select>
        </div>
        
        <span className="text-zinc-300 font-bold mt-6">:</span>
        
        <div className="flex-1 space-y-1.5">
          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter ml-1">Min</label>
          <select 
            value={current.getMinutes()}
            onChange={(e) => handleMinChange(parseInt(e.target.value))}
            className="w-full bg-white border border-zinc-100 rounded-xl h-12 px-3 text-sm font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-1.5">
          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter ml-1">Period</label>
          <select 
            value={isPM ? 'PM' : 'AM'}
            onChange={(e) => handlePeriodChange(e.target.value as 'AM' | 'PM')}
            className="w-full bg-white border border-zinc-100 rounded-xl h-12 px-3 text-sm font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {value && (
        <div className="bg-zinc-900 rounded-xl p-3 flex items-center justify-between border border-zinc-800">
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Universal Time</span>
          <span className="text-[10px] font-mono font-bold text-brand-orange">
            {format(new Date(value), "HH:mm 'UTC'")}
          </span>
        </div>
      )}
    </div>
  );
}
