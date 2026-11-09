import { flushPromises } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { renderWithPlugins } from '@test/Render'

import ImageUploader from '../components/ImageUploader.vue'
import { useMedia } from '../UseMedia'

class StorageRequest extends EventTarget {
  upload = new EventTarget()
  status = 200
  method = ''
  url = ''
  headers: Record<string, string> = {}
  body?: File
  static requests: StorageRequest[] = []
  open(method: string, url: string) {
    this.method = method
    this.url = url
  }
  setRequestHeader(key: string, value: string) {
    this.headers[key] = value
  }
  send(file: File) {
    this.body = file
    StorageRequest.requests.push(this)
    queueMicrotask(() =>
      this.upload.dispatchEvent(
        new ProgressEvent('progress', { lengthComputable: true, loaded: 2, total: 4 }),
      ),
    )
  }
  abort() {
    this.dispatchEvent(new Event('abort'))
  }
  finish() {
    this.dispatchEvent(new Event('load'))
  }
}
afterEach(() => {
  vi.unstubAllGlobals()
  StorageRequest.requests = []
})

it('rejects invalid images before HTTP and shows a successfully uploaded preview', async () => {
  vi.stubGlobal('XMLHttpRequest', StorageRequest)
  const Host = defineComponent({
    setup() {
      const media = useMedia()
      return () =>
        h(ImageUploader, {
          uploading: media.uploading.value,
          error: media.error.value,
          image: media.image.value,
          progress: media.progress.value,
          onSelect: (file: File) => void media.upload(file),
        })
    },
  })
  const { wrapper, http } = renderWithPlugins(Host)
  http
    .onPost(/\/media\/presign$/)
    .reply(200, { mediaId: 'image-1', uploadUrl: 'https://storage.test/upload' })
  http
    .onPost(/\/media\/image-1\/complete$/)
    .reply(200, { id: 'image-1', url: 'https://store.test/image.png', name: 'photo.png' })
  const input = wrapper.find('input[type="file"]')
  Object.defineProperty(input.element, 'files', {
    configurable: true,
    value: [new File(['text'], 'file.txt', { type: 'text/plain' })],
  })
  await input.trigger('change')
  expect(wrapper.find('[role="alert"]').text()).toContain('định dạng')
  expect(http.history.post).toHaveLength(0)
  const tooLarge = new File(['png'], 'large.png', { type: 'image/png' })
  Object.defineProperty(tooLarge, 'size', { value: 6 * 1024 * 1024 })
  Object.defineProperty(input.element, 'files', { configurable: true, value: [tooLarge] })
  await input.trigger('change')
  expect(wrapper.find('[role="alert"]').text()).toContain('5 MB')
  expect(http.history.post).toHaveLength(0)
  Object.defineProperty(input.element, 'files', {
    configurable: true,
    value: [new File(['png'], 'photo.png', { type: 'image/png' })],
  })
  await input.trigger('change')
  await flushPromises()
  expect(StorageRequest.requests[0]?.method).toBe('PUT')
  expect(StorageRequest.requests[0]?.url).toBe('https://storage.test/upload')
  expect(StorageRequest.requests[0]?.headers).not.toHaveProperty('Authorization')
  expect(wrapper.find('progress').attributes('value')).toBe('50')
  expect(http.history.post).toHaveLength(1)
  StorageRequest.requests[0]?.finish()
  await flushPromises()
  expect(http.history.post.at(-1)?.url).toBe('/media/image-1/complete')
  expect(wrapper.find('img').attributes('src')).toBe('https://store.test/image.png')
})

it('cancels a storage upload without completing it and retries the original image', async () => {
  vi.stubGlobal('XMLHttpRequest', StorageRequest)
  const Host = defineComponent({
    setup() {
      const media = useMedia()
      return () =>
        h(ImageUploader, {
          uploading: media.uploading.value,
          error: media.error.value,
          image: media.image.value,
          progress: media.progress.value,
          canRetry: media.canRetry.value,
          onSelect: (file: File) => void media.upload(file),
          onCancel: media.cancel,
          onRetry: () => void media.retry(),
        })
    },
  })
  const { wrapper, http } = renderWithPlugins(Host)
  http
    .onPost(/\/media\/presign$/)
    .reply(200, { mediaId: 'image-1', uploadUrl: 'https://storage.test/upload' })
  http
    .onPost(/\/media\/image-1\/complete$/)
    .reply(200, { id: 'image-1', url: 'https://store.test/image.png', name: 'photo.png' })
  const input = wrapper.find('input[type="file"]')
  Object.defineProperty(input.element, 'files', {
    configurable: true,
    value: [new File(['png'], 'photo.png', { type: 'image/png' })],
  })
  await input.trigger('change')
  await flushPromises()
  await wrapper.find('[data-action="cancel-upload"]').trigger('click')
  await flushPromises()
  expect(http.history.post.some((request) => request.url?.endsWith('/complete'))).toBe(false)
  await wrapper.find('[data-action="retry-upload"]').trigger('click')
  await flushPromises()
  expect(StorageRequest.requests).toHaveLength(2)
  StorageRequest.requests[1]?.finish()
  await flushPromises()
  expect(wrapper.find('img').attributes('src')).toBe('https://store.test/image.png')
  expect(http.history.post.filter((request) => request.url?.endsWith('/complete'))).toHaveLength(1)
})
