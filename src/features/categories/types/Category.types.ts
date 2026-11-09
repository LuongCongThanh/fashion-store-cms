export interface Category {
  id: string
  name: string
  parentId: string | null
  slug?: string
  metaTitle?: string
  metaDescription?: string
  translations?: Record<string, { name: string; description: string }>
}
