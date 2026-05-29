'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[200]"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[201] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl pointer-events-auto overflow-hidden relative border border-zinc-100"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  variant === 'danger' ? 'bg-red-50 text-red-500' : 
                  variant === 'warning' ? 'bg-orange-50 text-brand-orange' : 
                  'bg-indigo-50 text-cobalt'
                }`}>
                  <AlertCircle size={24} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter">{title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                    {description}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1 h-12 rounded-xl"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    variant={variant === 'danger' ? 'danger' : 'primary'}
                    className="flex-1 h-12 rounded-xl"
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : confirmLabel}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
