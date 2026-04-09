'use client'
import { useState } from 'react'
import { useMaterial } from './actions'

export function UseMaterialForm({ materialId, maxAvailable, projects }: { materialId: string, maxAvailable: number, projects: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [projectId, setProjectId] = useState(projects[0]?.id || '')
  const [loading, setLoading] = useState(false)

  if (maxAvailable <= 0) return null
  if (projects.length === 0) return <span style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '8px', display: 'block' }}>Kullanım için önce aktif bir Proje oluşturun.</span>

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '8px' }}>Paya Ayır / Projeye Ata</button>
  }

  const handleUse = async () => {
    if (quantity > maxAvailable || quantity <= 0) return alert('Geçersiz miktar')
    if (!projectId) return alert('Lütfen proje seçiniz')
    
    setLoading(true)
    try {
      await useMaterial(materialId, quantity, projectId)
      setIsOpen(false)
      setQuantity(1)
    } catch(err: any) {
      alert(err.message || 'Stok ataması sırasında hata oluştu')
    }
    setLoading(false)
  }

  return (
    <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Hangi proje için ayrılacak?</label>
      <select value={projectId} onChange={e => setProjectId(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Kaç Adet?</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input type="number" min="1" max={maxAvailable} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: '80px', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
        <button onClick={handleUse} disabled={loading} style={{ flex: 1, background: 'var(--success)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Onayla</button>
        <button onClick={() => setIsOpen(false)} disabled={loading} style={{ background: 'var(--text-muted)', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>İptal</button>
      </div>
    </div>
  )
}
