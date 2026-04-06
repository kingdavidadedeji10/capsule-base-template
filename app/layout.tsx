import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geist = localFont({
  src: '../public/fonts/geist-latin.woff2',
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Capsule AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

