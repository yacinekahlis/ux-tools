import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LayoutWrapper } from "@/components/layout-wrapper"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Free UX Tools for Designers, Builders & Founders",
    template: "%s",
  },
  description:
    "A free hub of UX and UI design tools to audit usability, improve conversion, accessibility, mobile experience, and onboarding.",
  metadataBase: new URL("https://uxtools.dev"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://uxtools.dev",
    siteName: "UxTools",
    title: "Free UX Tools for Designers, Builders & Founders",
    description:
      "A free hub of UX and UI design tools to audit usability, improve conversion, accessibility, mobile experience, and onboarding.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free UX Tools for Designers, Builders & Founders",
    description:
      "A free hub of UX and UI design tools to audit usability, improve conversion, accessibility, mobile experience, and onboarding.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#08090a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}
