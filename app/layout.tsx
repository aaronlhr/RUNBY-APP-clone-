import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RUNBY - Find Your Running Partner',
  description: 'Connect with running partners based on pace, location, and schedule.',
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
