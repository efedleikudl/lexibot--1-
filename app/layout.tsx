import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { LanguageProvider } from "@/lib/language-context"
import { DarkModeProvider } from "@/components/dark-mode-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Civitas AI - Your AI Legal Guide",
  description: "Transform complex legal documents into clear, actionable insights with our AI-powered legal assistant",
  keywords: "legal AI, document analysis, legal assistant, contract review, legal translation",
  authors: [{ name: "Civitas AI Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <DarkModeProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </DarkModeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
