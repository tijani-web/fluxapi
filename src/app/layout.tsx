import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "API Flow Studio - Build APIs Instantly",
  description: "All-in-one platform for designing, building, and testing APIs without backend setup",
  keywords: ["API", "development", "sandbox", "testing", "backend", "REST", "GraphQL"],
  authors: [{ name: "API Flow Studio Team" }],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}