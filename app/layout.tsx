import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireHere - Local Job Portal",
  description: "Direct Call and WhatsApp hiring for local workers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}