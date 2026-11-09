/** Object-storage transport: no API client, Session headers or credentials. XHR provides byte progress. */
export function uploadToStorage(
  url: string,
  file: File,
  options: {
    signal: AbortSignal
    headers?: Record<string, string>
    onProgress: (percent: number) => void
  },
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (options.signal.aborted) {
      reject(new DOMException('Upload cancelled', 'AbortError'))
      return
    }
    const request = new XMLHttpRequest()
    const abort = () => request.abort()
    const cleanup = () => options.signal.removeEventListener('abort', abort)
    request.open('PUT', url)
    for (const [key, value] of Object.entries(options.headers ?? { 'Content-Type': file.type }))
      request.setRequestHeader(key, value)
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && event.total > 0)
        options.onProgress(Math.round((event.loaded / event.total) * 100))
    })
    request.addEventListener(
      'load',
      () => {
        cleanup()
        if (request.status >= 200 && request.status < 300) resolve()
        else reject(new Error('Storage upload failed'))
      },
      { once: true },
    )
    request.addEventListener(
      'error',
      () => {
        cleanup()
        reject(new Error('Storage upload failed'))
      },
      { once: true },
    )
    request.addEventListener(
      'abort',
      () => {
        cleanup()
        reject(new DOMException('Upload cancelled', 'AbortError'))
      },
      { once: true },
    )
    options.signal.addEventListener('abort', abort, { once: true })
    request.send(file)
  })
}
