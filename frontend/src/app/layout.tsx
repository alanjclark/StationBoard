import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StationBoard - Vintage Flap Display',
  description: 'Real-time UK train departure and arrival board with authentic flap animation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

