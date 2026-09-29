import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HireHere - Local Job Portal',
  description: 'Direct Call and WhatsApp hiring for local workers',
  openGraph: {
    title: 'HireHere - Local Job Portal',
    description: 'Direct Call and WhatsApp hiring for local workers. Zero fees, 100% verified jobs!',
    url: 'https://hirehere.in',
    siteName: 'HireHere',
    images: [
      {
        url: 'https://hirehere.in/logo.png', // आपके लोगो का पूरा URL
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
    images: ['https://hirehere.in/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}