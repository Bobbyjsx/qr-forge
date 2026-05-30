'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options
} from 'qr-code-styling';

export interface QRCodeForgeHandle {
  download: (fileName: string) => void;
}

interface QRCodeForgeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  logoUrl?: string;
  logoPadding?: number;
  dotType?: DotType;
  cornerType?: CornerSquareType;
  cornerDotType?: CornerDotType;
  margin?: number;
}

export const QRCodeForge = forwardRef<QRCodeForgeHandle, QRCodeForgeProps>(({
  value,
  size = 280,
  fgColor = '#000000',
  bgColor = '#FFFFFF',
  logoUrl,
  logoPadding = 10,
  dotType = 'square',
  cornerType = 'square',
  cornerDotType = 'square',
  margin = 0,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useImperativeHandle(ref, () => ({
    download(fileName: string) {
      if (qrCode.current) {
        qrCode.current.download({
          name: fileName.replace(/\.[^/.]+$/, ""),
          extension: 'png'
        });
      }
    }
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const options: Options = {
      width: size,
      height: size,
      type: 'canvas' as DrawType,
      data: value,
      margin: margin,
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: 'Byte' as Mode,
        errorCorrectionLevel: 'H' as ErrorCorrectionLevel
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: logoPadding,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        color: fgColor,
        type: dotType
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerType
      },
      cornersDotOptions: {
        color: fgColor,
        type: cornerDotType
      },
      image: logoUrl || undefined
    };

    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(options);
      if (containerRef.current) {
        // Clear container before initial append to prevent duplicates
        containerRef.current.innerHTML = '';
        qrCode.current.append(containerRef.current);
      }
    } else {
      qrCode.current.update(options);
    }
  }, [value, size, fgColor, bgColor, logoUrl, logoPadding, dotType, cornerType, cornerDotType, margin]);

  return (
    <div 
      ref={containerRef} 
      className="flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-zinc-100"
      style={{ width: size, height: size }}
    />
  );
});

QRCodeForge.displayName = 'QRCodeForge';
