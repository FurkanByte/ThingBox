import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StockActionForm } from './StockActionForm'

export const revalidate = 0

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      stocks: {
        where: { status: 'KULLANIMDA' },
        include: { material: true }
      }
    }
  })

  if (!project) return notFound()

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <Link href="/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block', marginBottom: '8px' }}>← Projelere Dön</Link>
          <h1 className="page-title">{project.name}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{project.details || 'Açıklama yok.'}</p>
        </div>
        <div style={{ padding: '8px 16px', borderRadius: '8px', background: project.isActive ? 'var(--success)' : 'var(--text-muted)', color: 'white', fontWeight: 600 }}>
          {project.isActive ? 'Aktif' : 'Pasif/Tamamlanmış'}
        </div>
      </div>

      <div className="activity-card" style={{ marginTop: 0 }}>
        <h3>Projeye Tahsis Edilmiş Malzemeler</h3>
        {project.stocks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Bu projeye tahsis edilmiş hiçbir malzeme bulunmuyor.</p>
        ) : (
          <div className="activity-list">
            {project.stocks.map(stock => (
              <div key={stock.id} className="activity-item">
                <div className="activity-dot" style={{ backgroundColor: 'var(--primary)' }}></div>
                <div className="activity-content">
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{stock.material.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stock.material.description}</div>
                </div>
                <div>
                  <span style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {stock.quantity} Adet Atanmış / Kullanımda
                  </span>
                  <StockActionForm stockId={stock.id} maxQuantity={stock.quantity} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
