import { useHttpClient } from '@shared/lib/api/client/HttpClient'

interface PresignedUpload {
  mediaId: string
  uploadUrl: string
  headers?: Record<string, string>
}

export function useMediaApi() {
  const http = useHttpClient()
  return {
    presign: (file: File, signal: AbortSignal) =>
      http.post(
        '/media/presign',
        { fileName: file.name, mimeType: file.type, size: file.size },
        { signal },
      ) as Promise<PresignedUpload>,
    complete: (id: string, signal: AbortSignal) =>
      http.post(`/media/${encodeURIComponent(id)}/complete`, {}, { signal }) as Promise<{
        id?: string
        name?: string
        url: string
      }>,
  }
}
