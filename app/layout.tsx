import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./layout/header";
import Footer from "./layout/footer";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import StoreProvider from "./lib/redux/StoreProvider";
import LoadingPageContainer from "./components/LoadingContainer";
import GoogleAnalytics from "./googleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AniProject",
  description:
    "A anime platform that showcases popular and trending animes, mangas and movies. Explore the latest releases, keep watching your favorites, and discover what's popular in the anime world.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script src="/register-sw.js" />
      <GoogleAnalytics /> {/* Google Analytics */}
      <body className={inter.className}>
        <Analytics /> {/* Vercel Analytics - Has use limit */}
        <StoreProvider>
          <Header />

          <NextTopLoader color="var(--brand-color)" showSpinner={false} />

          {children || <LoadingPageContainer />}

          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
