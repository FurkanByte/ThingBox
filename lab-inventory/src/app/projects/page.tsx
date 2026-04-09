import prisma from '@/lib/prisma'
import { ProjectForm } from './ProjectForm'

export const revalidate = 0

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { stocks: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Projeler</h1>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="activity-card" style={{ flex: '1 1 500px', marginTop: 0 }}>
          <h3>Aktif Projeler</h3>
          {projects.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Henüz proje eklenmedi.</p>
          ) : (
            <div className="activity-list">
              {projects.map(proj => (
                <div key={proj.id} className="activity-item">
                  <div className="activity-dot" style={{ backgroundColor: proj.isActive ? 'var(--success)' : 'var(--text-muted)' }}></div>
                  <div className="activity-content">
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{proj.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{proj.details || 'Açıklama yok.'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>
                      {proj._count.stocks} Adet Malzeme Atıflı
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="activity-card" style={{ flex: '1 1 350px', maxWidth: '400px', marginTop: 0 }}>
          <h3>Yeni Proje Başlat</h3>
          <ProjectForm />
        </div>
      </div>
    </div>
  )
}
