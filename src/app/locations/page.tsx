import prisma from '@/lib/prisma'
import { LocationForm } from './LocationForm'
import { LocationCard } from './LocationCard'

export const revalidate = 0

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    include: {
      parent: true,
      _count: {
        select: { fixtures: true, materials: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  const renderLocationTree = (parentId: string | null = null, depth = 0): React.ReactNode => {
    return locations.filter(loc => (loc.parentId || null) === parentId).map(loc => (
      <div key={loc.id} style={{ marginLeft: `${depth * 28}px`, borderLeft: depth > 0 ? '3px solid var(--border-color)' : 'none', paddingLeft: depth > 0 ? '16px' : '0', marginBottom: '12px', marginTop: depth === 0 ? '16px' : '8px' }}>
        <LocationCard loc={loc} />
        <div>
          {renderLocationTree(loc.id, depth + 1)}
        </div>
      </div>
    ))
  }

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
            <div className="activity-list" style={{ gap: '0' }}>
              {renderLocationTree(null, 0)}
            </div>
          )}
        </div>

        <div className="activity-card" style={{ flex: '1 1 350px', maxWidth: '400px', marginTop: 0 }}>
          <h3>Yeni Konum Ekle</h3>
          <LocationForm locations={locations} />
        </div>
      </div>
    </div>
  )
}
