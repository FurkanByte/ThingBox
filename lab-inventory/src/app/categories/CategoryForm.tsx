'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { renderOptions } from '@/lib/hierarchy'

export function CategoryForm({ categories }: { categories: any[] }) {
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    setLoading(true)
    
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId: parentId || null })
    })
    
    setLoading(false)
    if (res.ok) {
      setName('')
      setParentId('')
      router.refresh()
    } else {
      alert('Eklerken bir hata oluştu.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Kategori Adı</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} disabled={loading} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Bağlı Olduğu Ana Kategori (İsteğe Bağlı)</label>
        <select value={parentId} onChange={e => setParentId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }} disabled={loading}>
          <option value="">(Sıfırdan Ana Kategori Oluştur)</option>
          {renderOptions(categories)}
        </select>
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
        {loading ? 'Ekleniyor...' : 'Kategori Oluştur'}
      </button>
    </form>
  )
}
