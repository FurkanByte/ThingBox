import prisma from '@/lib/prisma'
import { ProjectForm } from './ProjectForm'
import { ProjectCard } from './ProjectCard'

export const revalidate = 0

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      stocks: {
        include: { material: true }
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
                <ProjectCard key={proj.id} project={proj} />
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
