import type { Metadata } from "next";
import { Suspense } from "react";
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
  title: "Genesis Research",
  description: "Research, timely insights, and transparent trade ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Global Suspense so any page (including /404) using client hooks is wrapped */}
        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading…</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
