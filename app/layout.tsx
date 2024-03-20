import './globals.css'

import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--next-text',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2,
}

export const metadata: Metadata = {
  title: 'Infinite-Lights-Next',
  description: 'Recreate the Infinite Lights demo from Three.js in React Three Fiber and Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
