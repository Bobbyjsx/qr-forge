import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "QR Forge | Precision Asset Management",
  description: "Hardware-accelerated edge routing and QR asset generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased font-sans"
      >
        <Providers>
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
