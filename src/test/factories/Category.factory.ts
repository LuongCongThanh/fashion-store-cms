/** JSON một trang `GET /admin/categories` (test chỉ mô tả dữ liệu trên dây, §T.3). */
interface CategoryJson {
  id: string
  name: string
  parentId: string | null
  slug?: string
  description?: string | null
  sortOrder?: number
  isVisible?: boolean
}

export function categoryPage(items: CategoryJson[]) {
  return {
    data: items.map((item, index) => ({
      slug: item.id,
      description: null,
      sortOrder: index,
      isVisible: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      ...item,
    })),
    meta: { page: 1, limit: 100, total: items.length, totalPages: 1 },
  }
}
