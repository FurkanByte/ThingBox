import prisma from '@/lib/prisma'
import { CategoryForm } from './CategoryForm'

export const revalidate = 0

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      _count: {
        select: { materials: true, fixtures: true, children: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Kategori Yönetimi</h1>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="activity-card" style={{ flex: '1 1 500px', marginTop: 0 }}>
          <h3>Mevcut Kategoriler</h3>
          {categories.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Henüz kategori oluşturulmadı.</p>
          ) : (
             <div className="activity-list">
              {categories.map(cat => (
                <div key={cat.id} className="activity-item">
                  <div className="activity-dot" style={{ backgroundColor: 'var(--primary)' }}></div>
                  <div className="activity-content">
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.name}</div>
                    {cat.parent && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Alt Kategorisi: {cat.parent.name}</div>}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div>{cat._count.fixtures} Demirbaş</div>
                    <div>{cat._count.materials} Malzeme</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="activity-card" style={{ flex: '1 1 350px', maxWidth: '400px', marginTop: 0 }}>
          <h3>Kategori Ekle</h3>
          <CategoryForm categories={categories} />
        </div>
      </div>
    </div>
  )
}
