import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "PasturePro | The Premium Livestock & Pets Marketplace",
    template: "%s | PasturePro",
  },
  description: "The world's premier digital marketplace for trading high-quality cattle, exotic pets, and commercial livestock. Secure, verified, and professional.",
  keywords: ["livestock marketplace", "buy cattle online", "pet trade", "commercial livestock", "PasturePro", "animal trading platform"],
  authors: [{ name: "PasturePro Global" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pasturepro.com",
    siteName: "PasturePro",
    title: "PasturePro | The Premium Livestock & Pets Marketplace",
    description: "The world's premier digital marketplace for trading high-quality cattle, exotic pets, and commercial livestock.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PasturePro Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PasturePro | The Premium Livestock & Pets Marketplace",
    description: "The world's premier digital marketplace for trading high-quality cattle, exotic pets, and commercial livestock.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
