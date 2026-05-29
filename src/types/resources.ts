export interface DesignSettings {
  fgColor: string;
  bgColor: string;
  borderStyle: string;
  logoUrl: string | null;
  logoPadding: number;
  // Advanced styling (Directly mapped to qr-code-styling types)
  dotType: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
  cornerType: 'square' | 'dot' | 'extra-rounded';
  cornerDotType: 'square' | 'dot';
  margin: number;
}

export interface QRRoute {
  id: string;
  shortCode: string;
  destinationUrl: string;
  redirectType: '301' | '302' | '307';
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  managementToken: string;
  guestId: string | null;
  design: DesignSettings;
}

export interface QRAnalytics {
  id: string;
  qrId: string;
  timestamp: string;
  ipHash: string;
  country: string | null;
  city: string | null;
  device: string | null;
  os: string | null;
  browser: string | null;
  referrer: string | null;
}

export interface QRRouteWithAnalytics extends QRRoute {
  analytics?: QRAnalytics[];
  analyticsCount?: number;
}
