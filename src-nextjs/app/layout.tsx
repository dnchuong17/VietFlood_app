'use client'

import { useEffect } from 'react'
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Merriweather } from "next/font/google";
import { GlobalAlertProvider } from "@/components/feedback/global-alert-provider";
import { ErrorHandlerProvider } from "@/lib/providers/ErrorHandlerProvider";
import { LocalizationProvider } from "@/lib/providers/LocalizationProvider";
import { initializeApp } from "@/lib/init";
import { getSentryDSN, logConfigInit } from "@/lib/config";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["Segoe UI", "Arial", "Helvetica", "sans-serif"],
});

const merriweather = Merriweather({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["700", "900"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// Note: metadata cannot be used in client components
// export const metadata: Metadata = { ... };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const setupApp = async () => {
      try {
        // Initialize configuration
        logConfigInit()

        // Initialize app infrastructure
        await initializeApp({
          sentryDSN: getSentryDSN(),
          enableLogging: true,
          environment: (process.env.NODE_ENV || 'development') as 'development' | 'staging' | 'production',
        })
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }

    setupApp()
  }, [])

  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.variable} ${merriweather.variable} min-h-screen bg-slate-100 [font-family:var(--font-body)] text-slate-900 antialiased`}
      >
        {/* Error handling provider - catches all render errors */}
        <ErrorHandlerProvider sentryDSN={getSentryDSN()}>
          {/* Localization provider - enables i18n */}
          <LocalizationProvider>
            {/* Global alerts provider - provides feedback UI */}
            <GlobalAlertProvider>
              {children}
            </GlobalAlertProvider>
          </LocalizationProvider>
        </ErrorHandlerProvider>
      </body>
    </html>
  );
}
