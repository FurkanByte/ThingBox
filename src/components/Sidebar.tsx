'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logout } from '@/app/login/actions'

export function Sidebar({ session }: { session: any }) {
  const pathname = usePathname()
  const [showOther, setShowOther] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  useEffect(() => {
    const savedTheme = (localStorage.getItem('thingbox-theme') as 'light' | 'dark' | 'system') || 'system'
    setTheme(savedTheme)
    if (savedTheme !== 'system') {
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('thingbox-theme', newTheme)
    if (newTheme === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <aside className="sidebar">
      <div className="logo-container" style={{ gap: '8px' }}>
        <div className="logo-icon" style={{ background: 'transparent', width: '56px', height: '56px' }}>
          <img src="/logo.png" alt="ThingBox" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
        </div>
        <span style={{ fontSize: '1.45rem', letterSpacing: '-0.03em' }}>ThingBox</span>
      </div>
      
      <nav className="nav-links">
        <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Özet Paneli
        </Link>
        <Link href="/materials" className={`nav-item ${pathname.startsWith('/materials') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          Malzemeler
        </Link>
        <Link href="/fixtures" className={`nav-item ${pathname.startsWith('/fixtures') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
          Demirbaşlar
        </Link>
        <Link href="/projects" className={`nav-item ${pathname.startsWith('/projects') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          Projeler
        </Link>
        <Link href="/locations" className={`nav-item ${pathname.startsWith('/locations') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Konumlar
        </Link>
        
        <div onClick={() => setShowOther(!showOther)} className="nav-item" style={{ cursor: 'pointer', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle><circle cx="5" cy="12" r="1.5"></circle></svg>
            Diğer Seçenekler
          </div>
          <span style={{ transform: showOther ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '0.8rem' }}>▼</span>
        </div>
        
        {showOther && (
          <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
            <Link href="/categories" className={`nav-item ${pathname.startsWith('/categories') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
              Kategoriler
            </Link>
            <Link href="/archive" className={`nav-item ${pathname.startsWith('/archive') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
              Arşiv (Tüketim)
            </Link>
            <Link href="/logs" className={`nav-item ${pathname.startsWith('/logs') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Tüm Loglar
            </Link>
          </div>
        )}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
        {session?.isAdmin && (
          <Link href="/admin/users" className={`nav-item ${pathname.startsWith('/admin') ? 'active' : ''}`} style={{ marginBottom: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Kullanıcı Yönetimi
          </Link>
        )}

        <div onClick={() => setShowSettings(!showSettings)} className="nav-item" style={{ cursor: 'pointer', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: session?.isAdmin ? '8px' : 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={`https://ui-avatars.com/api/?name=${session?.username}&background=random`} alt="Avatar" style={{ width: 24, height: 24, borderRadius: '50%' }} />
            {session?.username || 'Ayarlar'}
          </div>
          <span style={{ transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '0.8rem' }}>▼</span>
        </div>

        {showSettings && (
          <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--sidebar-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TEMA TERCİHİ</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button onClick={() => handleThemeChange('light')} style={{ flex: 1, padding: '8px', background: theme === 'light' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>Açık</button>
              <button onClick={() => handleThemeChange('dark')} style={{ flex: 1, padding: '8px', background: theme === 'dark' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>Koyu</button>
              <button onClick={() => handleThemeChange('system')} style={{ flex: 1, padding: '8px', background: theme === 'system' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>Oto</button>
            </div>
            
            <button onClick={handleLogout} className="nav-item" style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', color: 'var(--danger)', marginTop: '8px', padding: '12px 16px', justifyContent: 'flex-start' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Çıkış Yap
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
