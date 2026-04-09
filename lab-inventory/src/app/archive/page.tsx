import prisma from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 0

export default async function ArchivePage() {
  const consumedStocks = await prisma.materialStock.findMany({
    where: { status: 'TUKETILDI' },
    include: { material: true, project: true },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sarf Arşivi</h1>
      </div>

      <div className="activity-card" style={{ marginTop: 0 }}>
        <h3>Tamamen Tüketilen Malzemeler (Arşiv)</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Bu listedeki malzemeler depodan tamamen çıkmış ve projelere harcanmış, kalıcı stoktan düşülmüş olarak kabul edilir.</p>
        
        {consumedStocks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Henüz sarf edilen (arşivlenen) hiçbir kayıt bulunmuyor.</p>
        ) : (
          <div className="activity-list">
            {consumedStocks.map(stock => (
               <div key={stock.id} className="activity-item">
                 <div className="activity-dot" style={{ backgroundColor: 'var(--text-muted)' }}></div>
                 <div className="activity-content">
                   <div style={{ fontWeight: 600, color: 'var(--text-main)', textDecoration: 'line-through' }}>{stock.material.name}</div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                     {stock.project ? (
                       <span>
                         <Link href={`/projects/${stock.project.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{stock.project.name}</Link> projesinde harcandı.
                       </span>
                     ) : 'Bilinmeyen veya silinmiş bir projede harcandı.'}
                   </div>
                 </div>
                 <div>
                   <span style={{ fontSize: '0.9rem', color: 'var(--warning)', fontWeight: 600 }}>
                     Tüketildi ({stock.quantity} Adet)
                   </span>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
