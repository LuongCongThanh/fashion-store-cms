import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { components } from '@shared/types/Api.generated'

import { productDetailKey } from './ProductEditor.api'

type PresignImageDto = components['schemas']['PresignImageDto']
type PresignedImageUploadResponseDto = components['schemas']['PresignedImageUploadResponseDto']
type CreateImageDto = components['schemas']['CreateImageDto']
type UpdateImageDto = components['schemas']['UpdateImageDto']

const imagesPath = (id: string) => `/admin/products/${encodeURIComponent(id)}/images`

export interface UploadImageInput {
  file: File
  colorId: string
  isPrimary: boolean
  signal: AbortSignal
  onProgress: (percent: number) => void
}

/**
 * Upload hai bước (API không nhận byte ảnh): xin chữ ký → gửi form POST
 * thẳng lên kho ảnh (`fields` + `file`) → gắn `storageKey` vào Sản phẩm theo
 * màu. API kiểm lại file thật (định dạng, ≤ 5 MB) ở bước gắn.
 */
export function useUploadProductImageMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: async ({ file, colorId, isPrimary, signal, onProgress }: UploadImageInput) => {
      const base = imagesPath(toValue(id))
      const presignBody: PresignImageDto = { contentType: file.type as PresignImageDto['contentType'], size: file.size }
      const signed = (await http.post(`${base}/presign`, presignBody, { signal })) as PresignedImageUploadResponseDto
      await postToStorage(signed, file, signal, onProgress)
      const body: CreateImageDto = { colorId, storageKey: signed.storageKey, isPrimary }
      return http.post(base, body, { signal })
    },
    onSuccess: () => client.invalidateQueries({ queryKey: productDetailKey(toValue(id)) }),
  })
}

export function useUpdateProductImageMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (imageId: string) => {
      const body: UpdateImageDto = { isPrimary: true }
      return http.patch(`${imagesPath(toValue(id))}/${encodeURIComponent(imageId)}`, body)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: productDetailKey(toValue(id)) }),
  })
}

export function useRemoveProductImageMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (imageId: string) => http.delete(`${imagesPath(toValue(id))}/${encodeURIComponent(imageId)}`),
    onSuccess: () => client.invalidateQueries({ queryKey: productDetailKey(toValue(id)) }),
  })
}

/** Kho ảnh nằm ngoài API: không gắn token, dùng XHR để có tiến độ upload. */
function postToStorage(
  signed: PresignedImageUploadResponseDto,
  file: File,
  signal: AbortSignal,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    for (const [key, value] of Object.entries(signed.fields)) form.append(key, value)
    form.append('file', file)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', signed.uploadUrl)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new StorageUploadError(xhr.status))
    }
    xhr.onerror = () => {
      reject(new StorageUploadError(0))
    }
    signal.addEventListener('abort', () => {
      xhr.abort()
      reject(new DOMException('Upload cancelled', 'AbortError'))
    })
    xhr.send(form)
  })
}

export class StorageUploadError extends Error {
  readonly status: number
  constructor(status: number) {
    super(`Image storage answered HTTP ${status}`)
    this.status = status
  }
}
