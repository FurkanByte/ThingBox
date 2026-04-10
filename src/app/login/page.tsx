'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from './actions'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const res = await login(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div style={{ height: 'calc(100vh + 80px)', width: 'calc(100vw + 112px)', margin: '-40px -56px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', zIndex: 50, position: 'relative' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo.png" alt="ThingBox" style={{ width: '80px', height: '80px', borderRadius: '16px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>ThingBox</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Envanter Yönetim Sistemine Giriş</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Kullanıcı Adı</label>
            <input name="username" type="text" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="Oturum adınızı girin" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Şifre</label>
            <input name="password" type="password" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} placeholder="••••••••" />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px 12px', borderRadius: '8px' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px', transition: 'background-color 0.2s' }}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
