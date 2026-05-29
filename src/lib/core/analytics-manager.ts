import { SupabaseClient } from '@supabase/supabase-js';
import { QRAnalytics } from '@/types/resources';
import { toCamelCase } from '@/lib/utils/case-transform';

export interface ScanContext {
  userAgent: string;
  ip: string;
  referrer: string;
}

export class AnalyticsManager {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Processes and records a scan event.
   */
  async recordScan(qrId: string, context: ScanContext): Promise<void> {
    const isMobile = /mobile/i.test(context.userAgent);
    const device = isMobile ? 'Mobile' : 'Desktop';
    const ipHash = context.ip ? btoa(context.ip).substring(0, 10) : 'unknown';

    const { error } = await this.supabase
      .from('qr_analytics')
      .insert([{
        qr_id: qrId,
        ip_hash: ipHash,
        device: device,
        browser: this.parseBrowser(context.userAgent),
        referrer: context.referrer.substring(0, 255),
      }]);

    if (error) {
      console.error('Analytics record failure:', error);
    }
  }

  private parseBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    return 'Other';
  }

  async getAnalyticsByQrId(qrId: string): Promise<QRAnalytics[]> {
    const { data, error } = await this.supabase
      .from('qr_analytics')
      .select('*')
      .eq('qr_id', qrId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return toCamelCase<QRAnalytics[]>(data);
  }
}
