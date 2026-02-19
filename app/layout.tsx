import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fraud Detection Platform",
  description: "Interactive fraud detection and investigation system with graph analysis",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
