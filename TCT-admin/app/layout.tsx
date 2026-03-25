import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Sidebar } from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Trinity Chapel Admin',
  description: 'Content management for Trinity Chapel Thika',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="lg:ml-56 pt-14 lg:pt-0 min-h-screen">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
