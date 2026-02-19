import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "RIFT - Fraud Detection Dashboard",
  description: "Advanced fraud detection and analysis system with cycle detection, smurfing patterns, and shell chain identification",
  keywords: "fraud detection, financial crime, graph analysis, anomaly detection",
  authors: [{ name: "RIFT Team" }],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0e27",
  colorScheme: "dark",
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
