import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { getSession } from '@/lib/auth'
import { SessionProvider } from '@/context/SessionContext'

export const metadata: Metadata = {
  title: 'Lab & Atölye Envanteri',
  description: 'Premium Envanter Yönetim Sistemi',
  icons: {
    icon: '/logo.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="tr">
      <body>
        <SessionProvider session={session}>
          <div className="app-container">
            {session && <Sidebar session={session} />}
            
            <main className="main-content" style={{ padding: session ? '40px 56px' : '0' }}>
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
