"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalTooltipProps {
  label: string;
  targetRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
}

export function PortalTooltip({
  label,
  targetRef,
  isVisible,
}: PortalTooltipProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2, 
        left: rect.right + 4, 
      });
    }
  }, [isVisible, targetRef]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
          style={{
            position: "fixed",
            top: coords.top - 12,
            left: coords.left,
            transform: "translateY(-50%)", 
            zIndex: 9999,
          }}
          className="px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl whitespace-nowrap pointer-events-none flex items-center"
        >
          {label}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-900 rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
