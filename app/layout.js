import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FacebookPixel } from "@/components/facebook-pixel";
import { getSettings } from "@/actions/settings";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { SettingsProvider } from "@/providers/settings-provider";

export const metadata = {
  title: "Facebook E-commerce Shop",
  description: "Best products at best prices",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <SettingsProvider initialSettings={settings}>
          {children}
          <FacebookPixel />
          <Toaster richColors position="top-right" />
        </SettingsProvider>
      </body>
    </html>
  );
}
