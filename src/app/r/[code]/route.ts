import { AnalyticsManager } from '@/lib/core/analytics-manager';
import { QRManager } from '@/lib/core/qr-manager';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const supabase = await createClient();

  const qrManager = new QRManager(supabase);
  const analyticsManager = new AnalyticsManager(supabase);

  try {
    const route = await qrManager.resolveRoute(code);

    const headerList = await headers();
    analyticsManager.recordScan(route.id, {
      userAgent: headerList.get('user-agent') || '',
      ip: headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
      referrer: headerList.get('referer') || '',
    });

    const redirectStatus = parseInt(route.redirectType) || 302;
    return NextResponse.redirect(route.destinationUrl, { status: redirectStatus as 301 | 302 | 307 });

  } catch (error: unknown) {
    const message = (error as Error).message;
    const isPaused = message === 'ASSET_PAUSED';
    const isExpired = message === 'ASSET_EXPIRED';
    
    let title = 'QR Code Not Found';
    let subMessage = `The requested link #${code.toUpperCase()} does not exist.`;
    let status = 404;

    if (isPaused) {
      title = 'Link Paused';
      subMessage = `This link (#${code.toUpperCase()}) is currently paused by its owner.`;
      status = 403;
    } else if (isExpired) {
      title = 'Link Expired';
      subMessage = `This link (#${code.toUpperCase()}) has reached its expiration date and is no longer active.`;
      status = 410;
    }

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QR Forge | ${title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100;400;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Geist', sans-serif; background-color: #ffffff; }
          .vibrant-dots {
            background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
            background-size: 24px 24px;
          }
        </style>
      </head>
      <body class="vibrant-dots min-h-screen flex items-center justify-center p-6 text-zinc-900">
        <div class="max-w-md w-full text-center space-y-8">
          <div class="w-20 h-20 bg-orange-50 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF5722" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-7.61 7.61a2 2 0 1 1-2.78-2.78"/><path d="M18 5.68a9.24 9.24 0 0 0-1.55-1.12"/><path d="M14.28 2.66a9.42 9.24 0 0 0-4.56 0"/><path d="M6.35 4.56a9.24 9.24 0 0 0-2.28 2.34"/><path d="M2.66 11.42a9.42 9.24 0 0 0 0 4.56"/><path d="M4.56 19.65a9.24 9.24 0 0 0 2.34 2.28"/><path d="M11.42 22.34a9.42 9.24 0 0 0 4.56 0"/><path d="M19.65 20.44a9.24 9.24 0 0 0 2.28-2.34"/><path d="M22.34 14.28a9.42 9.24 0 0 0 0-4.56"/><path d="M20.44 6.35c.1.18.2.36.3.55"/><path d="m2 22 2-2"/></svg>
          </div>
          
          <div class="space-y-3">
            <h1 class="text-3xl font-black tracking-tighter uppercase italic text-zinc-800">${title}</h1>
            <p class="text-zinc-500 font-medium leading-relaxed">${subMessage}</p>
          </div>

          <div class="pt-4">
            <a href="/" class="inline-block bg-[#FF5722] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Go to Home
            </a>
          </div>

          <footer class="pt-12">
            <p class="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">QR Forge Precision Systems</p>
          </footer>
        </div>
      </body>
      </html>
      `,
      {
        status: status,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}
