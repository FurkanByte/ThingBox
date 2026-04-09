import prisma from '@/lib/prisma'
import { MaterialForm } from './MaterialForm'
import { UseMaterialForm } from './UseMaterialForm'

export const revalidate = 0

export default async function MaterialsPage() {
  const [materials, categories, locations, projects] = await Promise.all([
    prisma.material.findMany({
      include: { category: true, defaultLoc: true, stocks: { include: { project: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany(),
    prisma.location.findMany(),
    prisma.project.findMany({ where: { isActive: true } })
  ])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sarf Malzemeleri</h1>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="activity-card" style={{ flex: '1 1 500px', marginTop: 0 }}>
          <h3>Envanterdeki Malzemeler</h3>
          {materials.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Henüz sarf malzemesi eklenmedi.</p>
          ) : (
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
              {materials.map(mat => {
                const totalStock = mat.stocks.reduce((acc, stock) => acc + stock.quantity, 0)
                const inDepot = mat.stocks.filter(s => s.status === 'DEPODA').reduce((acc, s) => acc + s.quantity, 0)
                
                return (
                  <div key={mat.id} className="stat-card" style={{ padding: '20px' }}>
                    <div className="stat-header">
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem' }}>{mat.name}</span>
                      <span style={{ fontSize: '0.85rem', color: 'white', background: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontWeight: 500 }}>
                        Toplam: {totalStock} Adet
                      </span>
                    </div>
                    {mat.description && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>{mat.description}</div>}
                    
                    <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>
                          <strong>Depodaki Miktar:</strong> <span style={{ color: 'var(--success)' }}>{inDepot} Adet</span>
                        </span>
                        {mat.defaultLoc && <span style={{ color: 'var(--text-muted)' }}>📍 Ana Konum: {mat.defaultLoc.name}</span>}
                      </div>
                      
                      <UseMaterialForm materialId={mat.id} maxAvailable={inDepot} projects={projects} />
                      {mat.stocks.filter(s => s.status === 'KULLANIMDA').length > 0 && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '12px' }}>
                          <strong style={{ color: 'var(--warning)' }}>Sahada (Kullanımda):</strong>
                          <ul style={{ paddingLeft: '0', listStyle: 'none', marginTop: '6px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {mat.stocks.filter(s => s.status === 'KULLANIMDA').map(s => (
                              <li key={s.id} style={{ background: 'var(--bg-color)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                {s.quantity} adet ➔ <strong>{s.project?.name || 'Bilinmeyen Proje'}</strong> projesinde kullanılıyor
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

        <div className="activity-card" style={{ flex: '1 1 350px', maxWidth: '400px', marginTop: 0 }}>
          <h3>Yeni Malzeme Ekle</h3>
          <MaterialForm categories={categories} locations={locations} />
        </div>
      </div>
    </div>
  )
}
