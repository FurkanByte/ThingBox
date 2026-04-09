'use client'
import { useState } from 'react'
import Link from 'next/link'
import { updateProject } from './actions'

export function ProjectCard({ project }: { project: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(project.name)
  const [details, setDetails] = useState(project.details || '')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!name) return alert('İsim boş olamaz')
    setLoading(true)
    try {
      await updateProject(project.id, name, details)
      setIsEditing(false)
    } catch(err) {
      alert('Güncellenirken hata oluştu')
    }
    setLoading(false)
  }

  if (isEditing) {
    return (
      <div className="activity-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
        <input type="text" value={name} onChange={e=>setName(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--primary)', outline: 'none' }} />
        <textarea value={details} onChange={e=>setDetails(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--primary)', outline: 'none', minHeight: '60px', fontFamily: 'inherit' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleUpdate} disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '6px' }}>Kaydet</button>
          <button onClick={() => setIsEditing(false)} disabled={loading} style={{ flex: 1, padding: '6px', background: 'var(--text-muted)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>İptal</button>
        </div>
      </div>
    )
  }

  return (
    <div className="activity-item" style={{ position: 'relative' }}>
      <button onClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>Düzenle</button>
      <div className="activity-dot" style={{ backgroundColor: project.isActive ? 'var(--success)' : 'var(--text-muted)' }}></div>
      <div className="activity-content">
        <Link href={`/projects/${project.id}`} style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', fontSize: '1.2rem', display: 'inline-block', marginBottom: '4px' }}>
          {project.name} ↗
        </Link>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', paddingRight: '50px' }}>{project.details || 'Açıklama yok.'}</div>
        
        {project.stocks && project.stocks.length > 0 && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '8px' }}>Kullanılan Malzemeler:</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {project.stocks.map((stock: any) => (
                <li key={stock.id} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{stock.quantity} Adet</span> {stock.material?.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
