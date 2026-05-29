import React from 'react';
import { motion } from 'framer-motion';

interface StatBarProps {
  label: string;
  count: number;
  total: number;
  icon?: React.ElementType;
}

export function StatBar({ label, count, total, icon: Icon }: StatBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
        <div className="flex items-center gap-2">
           {Icon && <Icon size={12} className="text-zinc-300" />}
           <span>{label}</span>
        </div>
        <span className="text-zinc-800">{count} ({Math.round(percentage)}%)</span>
      </div>
      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-brand-orange"
        />
      </div>
    </div>
  );
}
