import prisma from '@/lib/prisma'
import { FixtureForm } from './FixtureForm'

export const revalidate = 0

export default async function FixturesPage() {
  const [fixtures, categories, locations] = await Promise.all([
    prisma.fixture.findMany({
      include: { location: true, category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany(),
    prisma.location.findMany()
  ])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Demirbaşlar</h1>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="activity-card" style={{ flex: '1 1 500px', marginTop: 0 }}>
          <h3>Envanterdeki Demirbaşlar</h3>
          {fixtures.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Henüz demirbaş eklenmedi.</p>
          ) : (
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {fixtures.map(fix => (
                <div key={fix.id} className="stat-card" style={{ padding: '16px' }}>
                  <div className="stat-title" style={{ color: 'var(--text-main)', fontSize: '1.05rem', textTransform: 'none' }}>
                    {fix.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{fix.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {fix.description || 'Açıklama yok'}
                  </div>
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 500 }}>📍 {fix.location.name}</span>
                    {fix.category && <span style={{ color: 'var(--text-muted)' }}>📁 {fix.category.name}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="activity-card" style={{ flex: '1 1 350px', maxWidth: '400px', marginTop: 0 }}>
          <h3>Yeni Demirbaş Ekle</h3>
          {locations.length > 0 ? (
            <FixtureForm categories={categories} locations={locations} />
          ) : (
             <div style={{ padding: '16px', background: '#fffbeb', color: '#b45309', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.9rem' }}>
              Demirbaş ekleyebilmek için önce en az bir 'Konum' oluşturmalısınız. (Konumlar sekmesine gidin)
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
