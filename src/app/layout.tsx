import type { Metadata } from "next";
import { Inter, Bangers } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bangers = Bangers({ weight: "400", subsets: ["latin"], variable: "--font-bangers" });

export const metadata: Metadata = {
  title: "4D Pocket PDF | Doraemon's Gadgets for PDFs",
  description: "100% Client-side, private, fast PDF tools straight out of the 4D Pocket.",
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bangers.variable} antialiased min-h-screen flex flex-col bg-[#f0f8ff]`}>
        <LanguageProvider>
          <Navbar />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: "font-[family-name:var(--font-bangers)] text-xl manga-border manga-shadow-sm rounded-2xl p-4 tracking-widest",
            }}
          />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
