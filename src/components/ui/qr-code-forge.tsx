'use client';

import React, { useEffect, useRef } from 'react';
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
  id?: string;
}

export const QRCodeForge = ({
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
  id = 'qr-code-canvas'
}: QRCodeForgeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const options: Options = {
      width: size,
      height: size,
      type: 'svg' as DrawType,
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
      if (ref.current) {
        qrCode.current.append(ref.current);
      }
    } else {
      qrCode.current.update(options);
    }
  }, [value, size, fgColor, bgColor, logoUrl, logoPadding, dotType, cornerType, cornerDotType, margin]);

  return <div ref={ref} id={id} className="flex items-center justify-center" />;
};
