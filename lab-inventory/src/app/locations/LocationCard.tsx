'use client'
import { useState } from 'react'
import Link from 'next/link'
import { updateLocation } from './actions'

export function LocationCard({ loc }: { loc: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(loc.name)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!name) return alert('İsim boş olamaz')
    setLoading(true)
    try {
      await updateLocation(loc.id, name)
      setIsEditing(false)
    } catch(err) {
      alert('Güncellenirken hata oluştu')
    }
    setLoading(false)
  }

  if (isEditing) {
    return (
      <div className="stat-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input type="text" value={name} onChange={e=>setName(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--primary)', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleUpdate} disabled={loading} className="btn-primary" style={{ flex: 1, padding: '6px', justifyContent: 'center' }}>Kaydet</button>
          <button onClick={() => setIsEditing(false)} disabled={loading} style={{ flex: 1, padding: '6px', background: 'var(--text-muted)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>İptal</button>
        </div>
      </div>
    )
  }

  return (
    <div className="stat-card" style={{ padding: '16px', position: 'relative' }}>
      <button onClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>Düzenle</button>
      <Link href={`/locations/${loc.id}`} className="stat-title" style={{ color: 'var(--primary)', fontSize: '1.1rem', textTransform: 'none', paddingRight: '40px', textDecoration: 'none', fontWeight: 700, display: 'inline-block' }}>
        {loc.name} ↗
      </Link>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
        {loc._count.fixtures} Demirbaş, {loc._count.materials} Ana Malzeme Noktası
      </div>
    </div>
  )
}
