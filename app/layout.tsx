import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import NextTopLoader from 'nextjs-toploader';
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AniProject",
  description: "A anime platform that showcases popular and trending animes, mangas and movies. Explore the latest releases, keep watching your favorites, and discover what's popular in the anime world.",
  manifest: '/manifest.json',
  themeColor: '#030f16',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      <Script src='/register-sw.js' />

      <body className={inter.className}>

        <Header />

        <NextTopLoader
          color="var(--brand-color)"
          showSpinner={false}
        />

        <Analytics />

        {children}

        <Footer />

      </body>
    </html>
  );
}
