'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { renderOptions } from '@/lib/hierarchy'

export function LocationForm({ locations }: { locations: any[] }) {
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    setLoading(true)
    
    const res = await fetch('/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId: parentId || undefined })
    })
    
    setLoading(false)
    if (res.ok) {
      setName('')
      router.refresh()
    } else {
      alert('Eklerken bir hata oluştu veya bu konum zaten var.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Bağlı Üst Konum (Opsiyonel)</label>
        <select value={parentId} onChange={e => setParentId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', marginBottom: '16px' }} disabled={loading}>
          <option value="">(Ana Konum Olarak Ekle)</option>
          {renderOptions(locations)}
        </select>
        
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>
          Konum Adı
        </label>
        <input 
          type="text" 
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Örn: Elektronik Dolabı" 
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
          disabled={loading}
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
        {loading ? 'Ekleniyor...' : 'Konum Ekle'}
      </button>
    </form>
  )
}
