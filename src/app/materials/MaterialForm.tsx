'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { renderOptions } from '@/lib/hierarchy'

export function MaterialForm({ categories, locations }: { categories: any[], locations: any[] }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [initialQuantity, setInitialQuantity] = useState(1)
  const [defaultLocId, setDefaultLocId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    setLoading(true)
    
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, initialQuantity, defaultLocId, categoryId })
    })
    
    setLoading(false)
    if (res.ok) {
      setName('')
      setDescription('')
      setInitialQuantity(1)
      router.refresh()
    } else {
      alert('Eklerken bir hata oluştu.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Malzeme Adı</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: 10K Direnç" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} disabled={loading} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Açıklama (Opsiyonel)</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} disabled={loading} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Başlangıç Adedi (Depoya Eklenecek Stok)</label>
        <input type="number" min="1" value={initialQuantity} onChange={e => setInitialQuantity(Number(e.target.value))} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} disabled={loading} />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Kategori</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}>
            <option value="">Seçiniz...</option>
            {renderOptions(categories)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Ana Konum</label>
          <select value={defaultLocId} onChange={e => setDefaultLocId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}>
            <option value="">Seçiniz...</option>
            {renderOptions(locations)}
          </select>
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
        {loading ? 'Ekleniyor...' : 'Kataloğa Ekle'}
      </button>
    </form>
  )
}
