import React from 'react'

export function renderOptions(items: any[], parentId: string | null = null, depth = 0): React.ReactNode[] {
  return items
    .filter(item => (item.parentId || null) === parentId)
    .flatMap(item => [
      <option key={item.id} value={item.id}>
        {'— '.repeat(depth)}{item.name}
      </option>,
      ...renderOptions(items, item.id, depth + 1)
    ])
}
