import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Town Scout",
  description: "Discovering the heart of your town, one landmark at a time.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
  appleWebApp: {
    capable: true,
    title: "Town Scout",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

/** Mobile / PWA: theme color in browser chrome & when installed as standalone. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#002d5b" },
    { media: "(prefers-color-scheme: dark)", color: "#002d5b" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#f7f9fc]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased flex flex-col min-h-screen bg-[#f7f9fc] text-neutral-900`}
      >
        <SessionProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
