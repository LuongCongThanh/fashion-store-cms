import type { ErrorCodeValue } from './ErrorCode'

/** Kiểu lỗi duy nhất đi ra khỏi HttpClient (§O.1). `message` là message thô của BE — KHÔNG hiển thị. */
export class ApiError extends Error {
  /** 0 = không có response (mạng / timeout). */
  readonly status: number
  /** Mã BE (PRODUCT_SLUG_TAKEN) hoặc mã client (§O.2). */
  readonly code: ErrorCodeValue | (string & {})
  /** details.fields → form. */
  readonly fields?: Record<string, string[]>
  /** Header x-request-id, để báo lỗi. */
  readonly requestId?: string

  constructor(
    status: number,
    code: ErrorCodeValue | (string & {}),
    message: string,
    fields?: Record<string, string[]>,
    requestId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
    this.requestId = requestId
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError
