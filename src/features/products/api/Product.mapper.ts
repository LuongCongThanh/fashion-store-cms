import type {
  ProductDetail,
  ProductImage,
  ProductListItem,
  ProductVariant,
} from '@features/products/types/Product.types'
import type { components } from '@shared/types/Api.generated'

export type ProductResponseDto = components['schemas']['ProductResponseDto']
export type ProductDetailResponseDto = components['schemas']['ProductDetailResponseDto']
type VariantResponseDto = components['schemas']['VariantResponseDto']
type ImageResponseDto = components['schemas']['ImageResponseDto']

/** DTO → Model (§T.3). */
export function toProductListItem(dto: ProductResponseDto): ProductListItem {
  return { id: dto.id, name: dto.name, categoryId: dto.categoryId, status: dto.status, updatedAt: dto.updatedAt }
}

function toVariant(dto: VariantResponseDto): ProductVariant {
  return { id: dto.id, sku: dto.sku, price: dto.price, status: dto.status, size: dto.size, color: dto.color }
}

export function toProductImage(dto: ImageResponseDto): ProductImage {
  return {
    id: dto.id,
    colorId: dto.colorId,
    url: dto.url,
    altText: dto.altText,
    isPrimary: dto.isPrimary,
    sortOrder: dto.sortOrder,
  }
}

export function toProductDetail(dto: ProductDetailResponseDto): ProductDetail {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description ?? '',
    categoryId: dto.categoryId,
    weightGrams: dto.weightGrams,
    status: dto.status,
    publishedAt: dto.publishedAt,
    variants: dto.variants.map(toVariant),
    images: dto.images.map(toProductImage),
  }
}
