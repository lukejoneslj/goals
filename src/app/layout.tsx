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
  title: {
    default: "Repent Daily - Transform Your Life Through Daily Repentance & Goal Setting",
    template: "%s | Repent Daily"
  },
  description: "Repent Daily - A free goal-setting platform for spiritual growth. Set goals, build daily habits, and transform your life through daily repentance. Based on Luke 2:52, helping you grow spiritually, physically, socially, and intellectually.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  keywords: [
    "repent daily",
    "daily repentance",
    "repentance daily",
    "repent daily app",
    "daily repent",
    "spiritual growth",
    "goal setting",
    "christian goals",
    "faith-based goals",
    "daily habits",
    "spiritual development",
    "repentance practice",
    "daily spiritual practice",
    "luke 2:52",
    "goal tracking",
    "habit tracker",
    "spiritual goals",
    "christian productivity",
    "faith goals",
    "repentance tracker"
  ],
  authors: [{ name: "Luke Jones" }],
  creator: "Luke Jones",
  publisher: "Repent Daily",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://repentdaily.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Repent Daily - Transform Your Life Through Daily Repentance & Goal Setting",
    description: "Repent Daily - A free goal-setting platform for spiritual growth. Set goals, build daily habits, and transform your life through daily repentance. Based on Luke 2:52.",
    siteName: "Repent Daily",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Repent Daily - Daily Repentance & Goal Setting Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Repent Daily - Transform Your Life Through Daily Repentance",
    description: "A free goal-setting platform for spiritual growth. Set goals, build daily habits, and transform your life through daily repentance.",
    images: ["/og-image.png"],
    creator: "@repentdaily",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Verification codes can be added here when available
  },
  category: "Spiritual Growth & Goal Setting",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
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
