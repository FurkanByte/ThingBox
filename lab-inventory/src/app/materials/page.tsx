import prisma from '@/lib/prisma'
import { MaterialClientPage } from './MaterialClientPage'

export const revalidate = 0

export default async function MaterialsPage() {
  const [materials, categories, locations, projects] = await Promise.all([
    prisma.material.findMany({
      include: { category: true, defaultLoc: true, stocks: { include: { project: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany(),
    prisma.location.findMany(),
    prisma.project.findMany({ where: { isActive: true } })
  ])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sarf Malzemeleri Kataloğu</h1>
      </div>

      <MaterialClientPage materials={materials} categories={categories} locations={locations} projects={projects} />
    </div>
  )
}
