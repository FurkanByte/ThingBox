import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Lab & Atölye Envanteri',
  description: 'Premium Envanter Yönetim Sistemi',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <div className="app-container">
          <Sidebar />
          
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
