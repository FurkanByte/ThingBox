'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ProjectForm() {
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    setLoading(true)
    
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, details })
    })
    
    setLoading(false)
    if (res.ok) {
      setName('')
      setDetails('')
      router.refresh()
    } else {
      alert('Eklerken bir hata oluştu.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Proje Adı</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} disabled={loading} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Proje Detayları</label>
        <textarea value={details} onChange={e => setDetails(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', minHeight: '80px', fontFamily: 'inherit' }} disabled={loading} />
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
        {loading ? 'Ekleniyor...' : 'Proje Başlat'}
      </button>
    </form>
  )
}
