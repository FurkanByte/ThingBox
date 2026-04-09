'use client'
import { useState } from 'react'
import { addStock } from './actions'

export function AddStockForm({ materialId }: { materialId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)} style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '8px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Stok Ekle</button>
  }

  const handleAdd = async () => {
    if (quantity <= 0) return alert('Geçersiz miktar')
    setLoading(true)
    try {
      await addStock(materialId, quantity)
      setIsOpen(false)
      setQuantity(1)
    } catch(err: any) {
      alert(err.message || 'Hata oluştu')
    }
    setLoading(false)
  }

  return (
    <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Kaç Adet Yeni Miktar Eklenecek?</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: '80px', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
        <button onClick={handleAdd} disabled={loading} style={{ flex: 1, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Ekle</button>
        <button onClick={() => setIsOpen(false)} disabled={loading} style={{ background: 'var(--text-muted)', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>İptal</button>
      </div>
    </div>
  )
}
