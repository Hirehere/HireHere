import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css'; // Global styling load karne ke liye

// SEO metadata setup
export const metadata: Metadata = {
  title: 'HireHere - Local Job Portal',
  description: 'Direct Call and WhatsApp hiring for local workers',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'HireHere - Local Job Portal',
    description: 'Direct Call and WhatsApp hiring for local workers. Zero fees, 100% verified jobs!',
    url: 'https://hirehere.in',
    siteName: 'HireHere',
    images: [
      {
        url: 'https://hirehere.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'HireHere Logo',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HireHere - Local Job Portal',
    description: 'Direct Call and WhatsApp hiring for local workers',
    images: ['https://hirehere.in/icon.png'],
  },
};

// Main RootLayout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body>
        {children}
        
        {/* Vercel Web Analytics & Speed Monitoring */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}