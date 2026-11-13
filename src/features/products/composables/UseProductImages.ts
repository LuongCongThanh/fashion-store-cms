import { computed, reactive, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import {
  StorageUploadError,
  useRemoveProductImageMutation,
  useUpdateProductImageMutation,
  useUploadProductImageMutation,
} from '@features/products/api/ProductImages.api'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import { useNotify } from '@shared/composables/UseNotify'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { useT } from '@shared/lib/i18n/I18n'

import type { ColorGallery, ProductDetail, ProductImage } from '@features/products/types/Product.types'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024

interface UploadState {
  uploading: boolean
  progress: number
  error: string
  canRetry: boolean
  file?: File
  controller?: AbortController
}

/** Ảnh theo màu (BR-CAT-05): mỗi màu đang có Biến thể có một khung upload và bộ ảnh riêng. */
export function useProductImages(id: MaybeRefOrGetter<string>, product: MaybeRefOrGetter<ProductDetail | undefined>) {
  const { t } = useT()
  const notify = useNotify()
  const confirm = useConfirm()
  const upload = useUploadProductImageMutation(id)
  const setPrimary = useUpdateProductImageMutation(id)
  const remove = useRemoveProductImageMutation(id)
  const uploads = reactive<Record<string, UploadState>>({})

  const galleries = computed<ColorGallery[]>(() => {
    const detail = toValue(product)
    if (!detail) return []
    const colors = new Map(detail.variants.map((variant) => [variant.color.id, variant.color]))
    return [...colors.values()]
      .sort((a, b) => a.name.localeCompare(b.name, 'vi'))
      .map((color) => ({
        color,
        images: detail.images
          .filter((image) => image.colorId === color.id)
          .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder),
      }))
  })

  const state = (colorId: string): UploadState =>
    (uploads[colorId] ??= { uploading: false, progress: 0, error: '', canRetry: false })

  async function select(colorId: string, file: File) {
    const current = state(colorId)
    if (!ALLOWED_TYPES.includes(file.type))
      return Object.assign(current, { error: t('media.invalidType'), canRetry: false })
    if (file.size > MAX_BYTES) return Object.assign(current, { error: t('media.tooLarge'), canRetry: false })
    const isPrimary = !galleries.value.find((gallery) => gallery.color.id === colorId)?.images.length
    const controller = new AbortController()
    Object.assign(current, { uploading: true, progress: 0, error: '', canRetry: false, file, controller })
    try {
      await upload.mutateAsync({
        file,
        colorId,
        isPrimary,
        signal: controller.signal,
        onProgress: (percent) => (current.progress = percent),
      })
      Object.assign(current, { file: undefined })
    } catch (error) {
      if (controller.signal.aborted) Object.assign(current, { error: t('media.cancelled'), canRetry: true })
      else if (isApiError(error) && error.status === 422)
        Object.assign(current, { error: t('media.rejected'), canRetry: false })
      else if (error instanceof StorageUploadError || isApiError(error))
        Object.assign(current, { error: t('media.failed'), canRetry: true })
      else throw error
    } finally {
      Object.assign(current, { uploading: false, controller: undefined })
    }
  }

  async function confirmRemove(image: ProductImage) {
    const accepted = await confirm({
      title: t('media.deleteTitle'),
      description: t('products.imageDeleteDescription'),
      confirmLabel: t('common.delete'),
      color: 'error',
    })
    if (accepted)
      remove.mutate(image.id, {
        onError: (error) => {
          notify.error(error)
        },
      })
  }

  return {
    galleries,
    state,
    select,
    cancel: (colorId: string) => state(colorId).controller?.abort(),
    retry: (colorId: string) => {
      const file = state(colorId).file
      if (file) void select(colorId, file)
    },
    makePrimary: (image: ProductImage) => {
      setPrimary.mutate(image.id, {
        onError: (error) => {
          notify.error(error)
        },
      })
    },
    remove: confirmRemove,
    busy: computed(() => setPrimary.isPending.value || remove.isPending.value),
  }
}
