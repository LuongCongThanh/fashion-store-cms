import { onScopeDispose, ref } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'

import { useMediaApi } from './api/Media.api'
import { uploadToStorage } from './MediaUpload'

import type { MediaImage } from './types/Media.types'

/** Public lifecycle: validate → presign → storage PUT → complete; cancellation/retry stay inside media. */
export function useMedia() {
  const api = useMediaApi()
  const { t } = useT()
  const uploading = ref(false)
  const error = ref('')
  const image = ref<MediaImage>()
  const progress = ref(0)
  const canRetry = ref(false)
  let controller: AbortController | undefined
  let lastFiles: File[] = []

  function upload(file: File): Promise<MediaImage | undefined>
  function upload(files: File[]): Promise<string[]>
  async function upload(input: File | File[]): Promise<MediaImage | undefined | string[]> {
    const files = Array.isArray(input) ? input : [input]
    if (uploading.value) return Array.isArray(input) ? [] : undefined
    error.value = ''
    canRetry.value = false
    if (!files.length || files.length > 10) {
      error.value = t('media.tooMany')
      return Array.isArray(input) ? [] : undefined
    }
    if (files.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      error.value = t('media.invalidType')
      return Array.isArray(input) ? [] : undefined
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      error.value = t('media.tooLarge')
      return Array.isArray(input) ? [] : undefined
    }
    lastFiles = files
    controller = new AbortController()
    const signal = controller.signal
    uploading.value = true
    progress.value = 0
    image.value = undefined
    const completed: MediaImage[] = []
    try {
      for (const [index, file] of files.entries()) {
        lastFiles = files.slice(index)
        const signed = await api.presign(file, signal)
        await uploadToStorage(signed.uploadUrl, file, {
          signal,
          headers: signed.headers,
          onProgress: (percent) => {
            progress.value = Math.round(((index + percent / 100) / files.length) * 100)
          },
        })
        const result = await api.complete(signed.mediaId, signal)
        const uploaded = {
          id: result.id ?? signed.mediaId,
          url: result.url,
          name: result.name ?? file.name,
        }
        completed.push(uploaded)
        image.value = uploaded
        lastFiles = files.slice(index + 1)
      }
      progress.value = 100
      return Array.isArray(input) ? completed.map((item) => item.id) : completed[0]
    } catch {
      error.value = t(signal.aborted ? 'media.cancelled' : 'media.failed')
      canRetry.value = true
      return Array.isArray(input) ? completed.map((item) => item.id) : undefined
    } finally {
      uploading.value = false
      controller = undefined
    }
  }
  const cancel = () => controller?.abort()
  const retry = () => (canRetry.value ? upload(lastFiles) : Promise.resolve([]))
  onScopeDispose(cancel)
  return { uploading, error, image, progress, canRetry, upload, cancel, retry }
}
