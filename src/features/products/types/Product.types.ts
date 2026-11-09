export interface Product {
  id: string
  name: string
  status: 'draft' | 'published' | 'archived'
  price: number
  categoryId?: string
  updatedAt?: string
}

export interface ProductCategoryOption {
  id: string
  name: string
  parentId: string | null
}
