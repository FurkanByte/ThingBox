import prisma from '@/lib/prisma'
import { CategoryForm } from './CategoryForm'
import { getSession } from '@/lib/auth'

export const revalidate = 0

export default async function CategoriesPage() {
  const session = await getSession()
  const canManage = session?.isAdmin || session?.canManageSystem
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      _count: {
        select: { materials: true, fixtures: true, children: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  const renderCategoryTree = (parentId: string | null = null, depth = 0): React.ReactNode => {
    return categories.filter(cat => (cat.parentId || null) === parentId).map(cat => (
      <div key={cat.id} style={{ marginLeft: `${depth * 28}px`, borderLeft: depth > 0 ? '3px solid var(--border-color)' : 'none', paddingLeft: depth > 0 ? '16px' : '0', marginBottom: '12px', marginTop: depth === 0 ? '16px' : '8px' }}>
        <div className="activity-item" style={{ marginBottom: 0 }}>
          <div className="activity-dot" style={{ backgroundColor: 'var(--primary)' }}></div>
          <div className="activity-content">
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.name}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div>{cat._count.fixtures} Demirbaş</div>
            <div>{cat._count.materials} Malzeme</div>
          </div>
        </div>
        <div>
          {renderCategoryTree(cat.id, depth + 1)}
        </div>
      </div>
    ))
  }

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
             <div className="activity-list" style={{ gap: '0' }}>
              {renderCategoryTree(null, 0)}
            </div>
          )}
        </div>

        {canManage && (
          <div className="activity-card" style={{ flex: '1 1 350px', maxWidth: '400px', marginTop: 0 }}>
            <h3>Kategori Ekle</h3>
            <CategoryForm categories={categories} />
          </div>
        )}
      </div>
    </div>
  )
}
