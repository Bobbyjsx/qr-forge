'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button, type ButtonProps } from './button';
import { motion, AnimatePresence } from 'framer-motion';

interface CopyButtonProps extends ButtonProps {
  value: string;
}

export function CopyButton({ value, className, variant = 'ghost', size = 'icon', ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleCopy}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Check className="text-green-500" size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Copy size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
