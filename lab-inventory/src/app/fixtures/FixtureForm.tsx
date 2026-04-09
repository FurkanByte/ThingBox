'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function FixtureForm({ categories, locations }: { categories: any[], locations: any[] }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [locationId, setLocationId] = useState(locations[0]?.id || '')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !locationId) return
    setLoading(true)
    
    const res = await fetch('/api/fixtures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, locationId, categoryId })
    })
    
    setLoading(false)
    if (res.ok) {
      setName('')
      setDescription('')
      router.refresh()
    } else {
      alert('Eklerken bir hata oluştu.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Demirbaş Adı / Seri No</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} disabled={loading} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Detaylar (Marka, Model vb.)</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} disabled={loading} />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Kategori</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}>
            <option value="">Seçiniz...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Bulunduğu Konum</label>
          <select value={locationId} onChange={e => setLocationId(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
        {loading ? 'Kaydediliyor...' : 'Sisteme Ekle'}
      </button>
    </form>
  )
}
