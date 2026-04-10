import prisma from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 0

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  MATERIAL_CREATED:  { label: 'Malzeme Eklendi',       color: '#22c55e' },
  MATERIAL_UPDATED:  { label: 'Malzeme Güncellendi',   color: '#3b82f6' },
  MATERIAL_USED:     { label: 'Projeye Çekildi',        color: '#f59e0b' },
  MATERIAL_RETURNED: { label: 'Depoya İade Edildi',    color: '#6366f1' },
  MATERIAL_CONSUMED: { label: 'Tüketildi (Arşiv)',     color: '#ef4444' },
  STOCK_ADDED:       { label: 'Stok Artırıldı',        color: '#10b981' },
  FIXTURE_CREATED:   { label: 'Demirbaş Eklendi',      color: '#22c55e' },
  FIXTURE_UPDATED:   { label: 'Demirbaş Güncellendi',  color: '#3b82f6' },
  LOCATION_CREATED:  { label: 'Konum Oluşturuldu',     color: '#22c55e' },
  LOCATION_UPDATED:  { label: 'Konum Güncellendi',     color: '#3b82f6' },
  PROJECT_CREATED:   { label: 'Proje Başlatıldı',      color: '#22c55e' },
  PROJECT_UPDATED:   { label: 'Proje Güncellendi',     color: '#3b82f6' },
}

export default async function LogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hareket Geçmişi (Tüm Loglar)</h1>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {logs.length} kayıt
        </span>
      </div>

      <div className="activity-card" style={{ marginTop: 0 }}>
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>Henüz hiç hareket kaydedilmedi.</div>
        ) : (
          <div className="activity-list">
            {logs.map(log => {
              const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: 'var(--text-muted)' }
              return (
                <div key={log.id} className="activity-item">
                  <div className="activity-dot" style={{ backgroundColor: meta.color, flexShrink: 0 }} />
                  <div className="activity-content" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: meta.color, background: `${meta.color}20`, padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                        {meta.label}
                      </span>
                      <span style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {log.details || '—'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Hedef ID: #{log.targetId.slice(-8).toUpperCase()} · {log.targetType}
                    </div>
                  </div>
                  <div className="activity-time" style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>
                    {new Date(log.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                    <br />
                    <span style={{ color: 'var(--text-muted)' }}>
                      {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
