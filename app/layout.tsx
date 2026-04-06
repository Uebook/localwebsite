import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import AIChatWidget from "@/components/AIChatWidget";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LOKALL - Find Cheapest Near You",
  description: "India's first local price intelligence app. Compare prices, find cheapest markets and shops near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Footer />
          <AIChatWidget />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
