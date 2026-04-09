'use client'
import { useState } from 'react'
import { MaterialForm } from './MaterialForm'
import { UseMaterialForm } from './UseMaterialForm'
import { AddStockForm } from './AddStockForm'
import { updateMaterial } from './actions'

export function MaterialClientPage({ materials, categories, locations, projects }: { materials: any[], categories: any[], locations: any[], projects: any[] }) {
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    (m.description && m.description.toLowerCase().includes(search.toLowerCase())) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (mat: any) => {
    setEditingId(mat.id)
    setEditName(mat.name)
    setEditDesc(mat.description || '')
  }

  const handleSave = async (id: string) => {
    setLoading(true)
    try {
      await updateMaterial(id, editName, editDesc)
      setEditingId(null)
    } catch(err) {
      alert('Güncellenirken hata oluştu.')
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <input 
          type="text" 
          placeholder="Malzeme Adı, BARKOD ID veya Açıklama ile arayın..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--primary)', outline: 'none', width: '100%', maxWidth: '450px', fontSize: '1rem' }}
        />
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Ekleme Formunu Kapat' : '+ Yeni Malzeme Ekle'}
        </button>
      </div>

      {showAddForm && (
        <div className="activity-card" style={{ marginTop: 0, border: '2px dashed var(--primary)' }}>
          <h3>Sisteme Yeni Malzeme Kaydı Ekle</h3>
          <MaterialForm categories={categories} locations={locations} />
        </div>
      )}

      <div className="activity-card" style={{ marginTop: 0 }}>
        <h3>Envanter Kataloğu ({filteredMaterials.length} Sonuç)</h3>
        {filteredMaterials.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Aradığınız kritere uygun malzeme bulunamadı.</p>
        ) : (
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {filteredMaterials.map(mat => {
              const totalStock = mat.stocks.filter((s:any) => s.status !== 'TUKETILDI').reduce((acc:any, stock:any) => acc + stock.quantity, 0)
              const inDepot = mat.stocks.filter((s:any) => s.status === 'DEPODA').reduce((acc:any, s:any) => acc + s.quantity, 0)
              
              const isEditing = editingId === mat.id

              return (
                <div key={mat.id} className="stat-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {!isEditing && (
                    <button onClick={() => handleEdit(mat)} style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.8rem', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>Düzenle</button>
                  )}

                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      <input type="text" value={editName} onChange={e=>setEditName(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--primary)', outline: 'none' }} />
                      <input type="text" value={editDesc} onChange={e=>setEditDesc(e.target.value)} placeholder="Marka, model vs." style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--primary)', outline: 'none' }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleSave(mat.id)} disabled={loading} style={{ background: 'var(--success)', padding: '6px 12px', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Kaydet</button>
                        <button onClick={() => setEditingId(null)} disabled={loading} style={{ background: 'var(--text-muted)', padding: '6px 12px', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>İptal</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="stat-header">
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem', paddingRight: '40px' }}>
                          {mat.name} <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>#{mat.id.slice(-6).toUpperCase()}</span>
                        </span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'white', background: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontWeight: 500 }}>
                          Toplam Aktif: {totalStock} Adet
                        </span>
                      </div>
                      {mat.description ? (
                         <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>{mat.description}</div>
                      ) : (
                         <div style={{ fontSize: '0.9rem', color: 'transparent', marginTop: '8px' }}>-</div>
                      )}
                    </div>
                  )}
                  
                  <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        <strong>Mevcut Depo Stoğu:</strong> <span style={{ color: 'var(--success)' }}>{inDepot} Adet</span>
                      </span>
                    </div>
                    {mat.defaultLoc && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {mat.defaultLoc.name}</div>}
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <UseMaterialForm materialId={mat.id} maxAvailable={inDepot} projects={projects} />
                      <AddStockForm materialId={mat.id} />
                    </div>
                    
                    {mat.stocks.filter((s:any) => s.status === 'KULLANIMDA').length > 0 && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '12px' }}>
                        <strong style={{ color: 'var(--warning)' }}>Sahada (Kullanımda):</strong>
                        <ul style={{ paddingLeft: '0', listStyle: 'none', marginTop: '6px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {mat.stocks.filter((s:any) => s.status === 'KULLANIMDA').map((s:any) => (
                            <li key={s.id} style={{ background: 'var(--bg-color)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                              {s.quantity} adet ➔ <strong>{s.project?.name || 'Bilinmeyen Proje'}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
