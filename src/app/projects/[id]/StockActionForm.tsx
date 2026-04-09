'use client'
import { useState } from 'react'
import { returnToDepot, consumeMaterial } from './actions'

export function StockActionForm({ stockId, maxQuantity }: { stockId: string, maxQuantity: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'RETURN' | 'CONSUME'>('RETURN')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  if (!isOpen) {
    return (
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button onClick={() => { setMode('RETURN'); setIsOpen(true) }} style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Depoya İade Et</button>
        <button onClick={() => { setMode('CONSUME'); setIsOpen(true) }} style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--warning)', background: 'transparent', color: 'var(--warning)', cursor: 'pointer', fontWeight: 600 }}>Kalıcı Sarf Et (Tüket)</button>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (quantity <= 0 || quantity > maxQuantity) return alert('Geçersiz miktar')
    setLoading(true)
    try {
      if (mode === 'RETURN') {
        await returnToDepot(stockId, quantity)
      } else {
        await consumeMaterial(stockId, quantity)
      }
      setIsOpen(false)
      setQuantity(1)
    } catch(e) {
      alert('İşlem başarısız oldu')
    }
    setLoading(false)
  }

  return (
    <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{mode === 'RETURN' ? 'İade Miktarı:' : 'Tüketim Miktarı:'}</span>
      <input type="number" min="1" max={maxQuantity} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: '80px', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} disabled={loading} />
      <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ background: mode === 'RETURN' ? 'var(--primary)' : 'var(--warning)', color: 'white', padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem' }}>Onayla</button>
      <button onClick={() => setIsOpen(false)} disabled={loading} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>İptal</button>
    </div>
  )
}
