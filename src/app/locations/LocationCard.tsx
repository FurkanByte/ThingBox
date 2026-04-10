'use client'
import { useState } from 'react'
import Link from 'next/link'
import { updateLocation, deleteLocation } from './actions'
import { useSession } from '@/context/SessionContext'

export function LocationCard({ loc }: { loc: any }) {
  const session = useSession()
  const canManage = session?.isAdmin || session?.canManageSystem
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

  const handleDelete = async () => {
    if (!confirm(`"${loc.name}" konumunu silmek istediğinize emin misiniz?\nBu konumdaki demirbaşlar ve malzeme bağlantıları etkilenebilir.`)) return
    setLoading(true)
    try {
      await deleteLocation(loc.id)
    } catch(err: any) {
      alert(err.message || 'Silinemedi.')
    }
    setLoading(false)
  }

  if (isEditing && canManage) {
    return (
      <div className="stat-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input type="text" value={name} onChange={e=>setName(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--primary)', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleUpdate} disabled={loading} className="btn-primary" style={{ flex: 1, padding: '6px', justifyContent: 'center' }}>Kaydet</button>
          <button onClick={() => setIsEditing(false)} disabled={loading} style={{ flex: 1, padding: '6px', background: 'var(--text-muted)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>İptal</button>
          <button onClick={handleDelete} disabled={loading} style={{ padding: '6px 12px', background: 'var(--danger)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Sil</button>
        </div>
      </div>
    )
  }

  return (
    <div className="activity-item" style={{ position: 'relative' }}>
      {canManage && (
        <button onClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>Düzenle</button>
      )}
      <div className="activity-dot" style={{ backgroundColor: 'var(--primary)' }}></div>
      <div className="activity-content">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <Link href={`/locations/${loc.id}`} style={{ color: 'var(--primary)', fontSize: '1.2rem', textTransform: 'none', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
            {loc.name} ↗
          </Link>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{loc.id.slice(-6).toUpperCase()}</span>
        </div>
        {loc.parent && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Bağlı Bulunduğu Üst Konum: <strong>{loc.parent.name}</strong></div>}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', paddingRight: '50px' }}>
          {loc._count.fixtures} Demirbaş, {loc._count.materials} Ana Malzeme Noktası
        </div>
      </div>
    </div>
  )
}
