import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'RUNBY - Find Your Running Partner',
  description: 'Connect with runners in your area and find your perfect running partner. Join the running community and stay motivated together.',
  keywords: 'running, running partner, running app, fitness, social running, running community',
  authors: [{ name: 'RUNBY Team' }],
  creator: 'RUNBY',
  publisher: 'RUNBY',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://runby.app'),
  openGraph: {
    title: 'RUNBY - Find Your Running Partner',
    description: 'Connect with runners in your area and find your perfect running partner',
    url: 'https://runby.app',
    siteName: 'RUNBY',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RUNBY - Find Your Running Partner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RUNBY - Find Your Running Partner',
    description: 'Connect with runners in your area and find your perfect running partner',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RUNBY',
  },
  applicationName: 'RUNBY',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'RUNBY',
    'msapplication-TileColor': '#0ea5e9',
    'msapplication-config': '/browserconfig.xml',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="theme-color" content="#0ea5e9" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <ClerkProvider
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: '#2563eb',
              colorBackground: '#ffffff',
              colorInputBackground: '#ffffff',
              colorInputText: '#1f2937',
              colorText: '#1f2937',
              colorTextSecondary: '#6b7280',
              borderRadius: '8px',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl border-0 rounded-lg',
              headerTitle: 'text-2xl font-bold text-gray-900',
              headerSubtitle: 'text-gray-600',
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full',
              formFieldInput: 'border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full',
              footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
              formFieldLabel: 'text-sm font-medium text-gray-700 mb-1',
              formFieldLabelRow: 'mb-2',
              dividerLine: 'bg-gray-200',
              dividerText: 'text-gray-500 text-sm',
              socialButtonsBlockButton: 'border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors',
              socialButtonsBlockButtonText: 'text-gray-700 font-medium',
            },
          }}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
          {children}
        </ClerkProvider>
        
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
