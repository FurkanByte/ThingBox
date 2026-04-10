'use client'
import { useState } from 'react'
import { updateFixture, deleteFixture } from './actions'
import { renderOptions } from '@/lib/hierarchy'
import { useSession } from '@/context/SessionContext'

export function FixtureCard({ fix, categories, locations }: { fix: any, categories: any[], locations: any[] }) {
  const session = useSession()
  const canManage = session?.isAdmin || session?.canManageSystem
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(fix.name)
  const [editDesc, setEditDesc] = useState(fix.description || '')
  const [editLocId, setEditLocId] = useState(fix.locationId)
  const [editCatId, setEditCatId] = useState(fix.categoryId || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!editName) return
    setLoading(true)
    try {
      await updateFixture(fix.id, editName, editDesc, editLocId, editCatId)
      setIsEditing(false)
    } catch(e) {
      alert('Hata oluştu')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm(`"${fix.name}" isimli demirbaşı silmek istediğinize emin misiniz?`)) return
    setLoading(true)
    try {
      await deleteFixture(fix.id)
    } catch(e) {
      alert('Silinemedi.')
    }
    setLoading(false)
  }

  return (
    <div className="stat-card" style={{ padding: '16px', position: 'relative' }}>
      {!isEditing && canManage && (
        <button onClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>Düzenle</button>
      )}

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <input type="text" value={editName} onChange={e=>setEditName(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--primary)', outline: 'none' }} disabled={loading} />
          <input type="text" value={editDesc} onChange={e=>setEditDesc(e.target.value)} placeholder="Model, Açıklama" style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--primary)', outline: 'none' }} disabled={loading} />
          <select value={editCatId} onChange={e=>setEditCatId(e.target.value)} disabled={loading} style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--primary)', outline: 'none', background: 'white' }}>
            <option value="">Kategori Seçiniz</option>
            {renderOptions(categories)}
          </select>
          <select value={editLocId} onChange={e=>setEditLocId(e.target.value)} disabled={loading} style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--primary)', outline: 'none', background: 'white' }}>
            {renderOptions(locations)}
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} disabled={loading} style={{ background: 'var(--success)', padding: '6px 12px', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Kaydet</button>
            <button onClick={() => setIsEditing(false)} disabled={loading} style={{ background: 'var(--text-muted)', padding: '6px 12px', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>İptal</button>
            <button onClick={handleDelete} disabled={loading} style={{ background: 'var(--danger)', padding: '6px 12px', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>Sil</button>
          </div>
        </div>
      ) : (
        <>
          <div className="stat-title" style={{ color: 'var(--text-main)', fontSize: '1.05rem', textTransform: 'none', paddingRight: '40px' }}>
            {fix.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{fix.id.slice(-6).toUpperCase()}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {fix.description || 'Açıklama yok'}
          </div>
        </>
      )}
      
      <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ color: 'var(--primary)', fontWeight: 500 }}>📍 {fix.location.name}</span>
        {fix.category && <span style={{ color: 'var(--text-muted)' }}>📁 {fix.category.name}</span>}
      </div>
    </div>
  )
}
