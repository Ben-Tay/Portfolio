import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { AdminProvider } from "@/lib/admin-context"
import { AdminToggle } from "@/components/ui/admin-toggle"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Benedict Tay",
  description:
    "Information Systems student with strengths in product, design, business analysis, and AI applications.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AdminProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AdminToggle />
        </AdminProvider>
      </body>
    </html>
  )
}
