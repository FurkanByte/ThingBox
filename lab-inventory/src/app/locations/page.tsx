import prisma from '@/lib/prisma'
import { LocationForm } from './LocationForm'
import { LocationCard } from './LocationCard'

export const revalidate = 0

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    include: {
      _count: {
        select: { fixtures: true, materials: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Konum Yönetimi</h1>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="activity-card" style={{ flex: '1 1 500px', marginTop: 0 }}>
          <h3>Kayıtlı Konumlar</h3>
          {locations.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Henüz konum eklenmedi.</p>
          ) : (
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {locations.map(loc => (
                <LocationCard key={loc.id} loc={loc} />
              ))}
            </div>
          )}
        </div>

        <div className="activity-card" style={{ flex: '1 1 350px', maxWidth: '400px', marginTop: 0 }}>
          <h3>Yeni Konum Ekle</h3>
          <LocationForm />
        </div>
      </div>
    </div>
  )
}
