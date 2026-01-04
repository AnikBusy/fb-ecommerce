import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FacebookPixel } from "@/components/facebook-pixel";
import { GoogleAnalytics } from "@/components/google-analytics";
import { getSettings } from "@/actions/settings";
import { Toaster } from "sonner";
import { SettingsProvider } from "@/providers/settings-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const settings = await getSettings();

  return {
    title: {
      default: settings?.siteName || "Facebook E-commerce Shop",
      template: `%s | ${settings?.siteName || "Shop"}`
    },
    description: "Best products at best prices",
    icons: {
      icon: settings?.faviconUrl || '/favicon.ico',
      shortcut: settings?.faviconUrl || '/favicon.ico',
      apple: settings?.faviconUrl || '/favicon.ico',
    }
  };
}

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
          <GoogleAnalytics />
          <Toaster richColors position="top-right" />
        </SettingsProvider>
      </body>
    </html>
  );
}
