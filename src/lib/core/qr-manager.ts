import { SupabaseClient } from '@supabase/supabase-js';
import { QRRoute, DesignSettings } from '@/types/resources';
import { transformQRRoute } from '@/lib/utils/case-transform';

export interface QRRouteManagerConfig {
  destinationUrl: string;
  redirectType?: '301' | '302' | '307';
  isActive?: boolean;
  expiresAt?: string | null;
  design?: Partial<DesignSettings>;
  guestId?: string;
}

export class QRManager {
  constructor(private supabase: SupabaseClient) {}

  generateShortCode(length: number = 6): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  /**
   * Verifies if a user has permission to manage a specific asset using its private management token.
   */
  async verifyPermission(token: string, userId?: string): Promise<boolean> {
    const { data: route, error } = await this.supabase
      .from('qr_routes')
      .select('created_by, management_token')
      .eq('management_token', token)
      .single();

    if (error || !route) return false;

    // 1. If user is owner
    if (userId && route.created_by === userId) return true;

    // 2. If valid management token matches (for guests or direct links)
    if (route.management_token === token) return true;

    return false;
  }

  async createRoute(userId: string | undefined, config: QRRouteManagerConfig): Promise<QRRoute> {
    const shortCode = this.generateShortCode();
    
    const rawInsert: Record<string, unknown> = {
      short_code: shortCode,
      destination_url: config.destinationUrl,
      redirect_type: config.redirectType || '302',
      created_by: userId,
      guest_id: config.guestId,
      is_active: config.isActive ?? true,
    };

    if (config.design) {
      rawInsert.fg_color = config.design.fgColor;
      rawInsert.bg_color = config.design.bgColor;
      rawInsert.border_style = config.design.borderStyle;
      rawInsert.logo_url = config.design.logoUrl;
      rawInsert.logo_padding = config.design.logoPadding;
      // Advanced fields
      rawInsert.dot_type = config.design.dotType;
      rawInsert.corner_type = config.design.cornerType;
      rawInsert.corner_dot_type = config.design.cornerDotType;
      rawInsert.margin = config.design.margin;
    }

    const { data, error } = await this.supabase
      .from('qr_routes')
      .insert([rawInsert])
      .select()
      .single();

    if (error) throw error;
    return transformQRRoute(data) as QRRoute;
  }

  /**
   * Updates a route using its private management token.
   */
  async updateRouteByToken(token: string, config: Partial<QRRouteManagerConfig>, userId?: string): Promise<QRRoute> {
    const hasPermission = await this.verifyPermission(token, userId);
    if (!hasPermission) throw new Error('Unauthorized asset access');

    const updateData: Record<string, unknown> = {};
    
    if (config.destinationUrl) updateData.destination_url = config.destinationUrl;
    if (config.redirectType) updateData.redirect_type = config.redirectType;
    if (config.isActive !== undefined) updateData.is_active = config.isActive;
    if (config.expiresAt !== undefined) updateData.expires_at = config.expiresAt;
    
    if (config.design) {
      if (config.design.fgColor) updateData.fg_color = config.design.fgColor;
      if (config.design.bgColor) updateData.bg_color = config.design.bgColor;
      if (config.design.borderStyle) updateData.border_style = config.design.borderStyle;
      if (config.design.logoUrl !== undefined) updateData.logo_url = config.design.logoUrl;
      if (config.design.logoPadding !== undefined) updateData.logo_padding = config.design.logoPadding;
      if (config.design.dotType) updateData.dot_type = config.design.dotType;
      if (config.design.cornerType) updateData.corner_type = config.design.cornerType;
      if (config.design.cornerDotType) updateData.corner_dot_type = config.design.cornerDotType;
      if (config.design.margin !== undefined) updateData.margin = config.design.margin;
    }

    const { data, error } = await this.supabase
      .from('qr_routes')
      .update(updateData)
      .eq('management_token', token)
      .select()
      .single();

    if (error) throw error;
    return transformQRRoute(data) as QRRoute;
  }

  /**
   * Resolves a route for public redirection using the public short code.
   * Returns the route if active, or throws specific errors for UI handling.
   */
  async resolveRoute(shortCode: string): Promise<QRRoute> {
    const { data, error } = await this.supabase
      .from('qr_routes')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    if (error || !data) throw new Error('ASSET_NOT_FOUND');
    
    const route = transformQRRoute(data) as QRRoute;
    
    // Check if asset is paused
    if (!route.isActive) throw new Error('ASSET_PAUSED');

    // Check if asset has expired
    if (route.expiresAt && new Date(route.expiresAt) < new Date()) {
      throw new Error('ASSET_EXPIRED');
    }

    return route;
  }

  /**
   * Fetches full route details using its private management token.
   */
  async getRouteByToken(token: string, userId?: string): Promise<QRRoute> {
    const hasPermission = await this.verifyPermission(token, userId);
    if (!hasPermission) throw new Error('Unauthorized asset access');

    const { data, error } = await this.supabase
      .from('qr_routes')
      .select('*')
      .eq('management_token', token)
      .single();

    if (error) throw error;
    return transformQRRoute(data) as QRRoute;
  }

  /**
   * Deletes a route using its private management token.
   */
  async deleteRouteByToken(token: string, userId?: string): Promise<void> {
    const hasPermission = await this.verifyPermission(token, userId);
    if (!hasPermission) throw new Error('Unauthorized asset access');

    const { error } = await this.supabase
      .from('qr_routes')
      .delete()
      .eq('management_token', token);

    if (error) throw error;
  }
}
