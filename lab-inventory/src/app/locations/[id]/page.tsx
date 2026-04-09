import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      fixtures: { include: { category: true } },
      materials: { include: { category: true, stocks: true } }
    }
  })

  if (!location) return notFound()

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <Link href="/locations" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block', marginBottom: '8px' }}>← Konumlara Dön</Link>
          <h1 className="page-title">{location.name} Paneli</h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="activity-card" style={{ flex: '1 1 400px', marginTop: 0 }}>
          <h3>Kayıtlı Demirbaşlar ({location.fixtures.length})</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Bu konuma fiziksel olarak atanmış kalıcı araç, sensör, vb. donanımlar.</p>
          {location.fixtures.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Bu konumda demirbaş bulunmuyor.</p>
          ) : (
            <div className="activity-list">
              {location.fixtures.map(fix => (
                <div key={fix.id} className="activity-item">
                  <div className="activity-dot" style={{ background: 'var(--warning)' }}></div>
                  <div className="activity-content">
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{fix.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{fix.description || 'Detay yok'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="activity-card" style={{ flex: '1 1 400px', marginTop: 0 }}>
          <h3>Ana Deposu Olunan Malzemeler ({location.materials.length})</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Stoku bölünebilir, çekmeceler veya raflarda duran sarf malzemeler.</p>
          {location.materials.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Bu alan ana depo olarak listelenmemiş.</p>
          ) : (
            <div className="activity-list">
              {location.materials.map(mat => {
                const totalStock = mat.stocks.reduce((acc, stock) => acc + stock.quantity, 0)
                const inDepot = mat.stocks.filter(s => s.status === 'DEPODA').reduce((acc, s) => acc + s.quantity, 0)

                return (
                  <div key={mat.id} className="activity-item">
                    <div className="activity-dot" style={{ background: 'var(--primary)' }}></div>
                    <div className="activity-content">
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{mat.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Mevcut Depo: {inDepot} / Toplam: {totalStock}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
