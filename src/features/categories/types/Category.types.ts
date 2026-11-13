export interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  description: string | null
  sortOrder: number
  isVisible: boolean
}
