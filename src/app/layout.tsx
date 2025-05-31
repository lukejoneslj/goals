import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RepentDaily - Goal Setting & Daily Habits",
  description: "Grow spiritually, physically, socially, and intellectually through intentional goal setting and daily repentance. 100% free forever.",
  icons: {
    icon: [
      { url: '/app-icon.png', sizes: '1024x1024', type: 'image/png' },
      { url: '/app-icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/app-icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/app-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/app-icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/app-icon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/app-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#8b5cf6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
