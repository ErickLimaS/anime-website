import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./layout/header";
import Footer from "./layout/footer";
import { Suspense } from "react";
import LoadingPlaceholder from "./loading";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AniProject",
  description: "Animes and Mangas Website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <Header />

        <NextTopLoader
          color="var(--brand-color)"
          showSpinner={false}
        />

        <Suspense fallback={<LoadingPlaceholder />}>

          {children}

        </Suspense>

        <Footer />

      </body>
    </html>
  );
}
