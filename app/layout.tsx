import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemePreferenceProvider } from '@/components/theme-preference-provider'

export const metadata: Metadata = {
  title: 'ShuleVerse',
  description: 'A parent portal for school updates, student progress, and family communication.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body className={GeistMono.variable}>
        <ThemePreferenceProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemePreferenceProvider>
      </body>
    </html>
  )
}
