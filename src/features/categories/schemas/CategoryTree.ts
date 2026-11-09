import type { Category } from '../types/Category.types'

export function categoryParentOptions(categories: Category[], id: string) {
  const excluded = new Set([id])
  let changed = true
  while (changed) {
    changed = false
    for (const category of categories) {
      if (category.parentId && excluded.has(category.parentId) && !excluded.has(category.id)) {
        excluded.add(category.id)
        changed = true
      }
    }
  }
  return categories.filter((category) => !excluded.has(category.id))
}
