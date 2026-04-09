import prisma from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 0

export default async function DashboardPage() {
  const [projectCount, fixtureCount, materialCount, recentLogs] = await Promise.all([
    prisma.project.count({ where: { isActive: true } }),
    prisma.fixture.count(),
    prisma.material.count(),
    prisma.auditLog.findMany({ 
      orderBy: { createdAt: 'desc' }, 
      take: 5 
    })
  ])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sistem Özeti</h1>
        <Link href="/projects" className="btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Projeleri Yönet
        </Link>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Aktif Projeler</span>
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
          </div>
          <div className="stat-value">{projectCount}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Sarf Malzemesi Çeşidi</span>
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
          </div>
          <div className="stat-value">{materialCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Demirbaşlar</span>
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>
            </div>
          </div>
          <div className="stat-value">{fixtureCount}</div>
        </div>
      </div>

      <div className="activity-card">
        <h3>Son Hareketler (Log)</h3>
        {recentLogs.length > 0 ? (
          <div className="activity-list">
            {recentLogs.map(log => (
              <div key={log.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                    {log.details || log.action}
                  </div>
                </div>
                <div className="activity-time">
                  {new Date(log.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#94a3b8' }}>Henüz sistemde hiç hareket kaydedilmedi.</div>
        )}
      </div>
    </div>
  )
}
