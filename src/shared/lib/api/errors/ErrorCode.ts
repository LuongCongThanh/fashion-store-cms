export const ErrorCode = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED', // 401
  FORBIDDEN: 'FORBIDDEN', // 403
  NOT_FOUND: 'NOT_FOUND', // 404
  CONFLICT: 'CONFLICT', // 409
  VALIDATION_FAILED: 'VALIDATION_FAILED', // 400
  BUSINESS_RULE: 'BUSINESS_RULE', // 422
  RATE_LIMITED: 'RATE_LIMITED', // 429
  SERVER_ERROR: 'SERVER_ERROR', // 5xx
  UNKNOWN: 'UNKNOWN',
} as const
export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode]

const BY_STATUS: Record<number, ErrorCodeValue> = {
  400: ErrorCode.VALIDATION_FAILED,
  401: ErrorCode.UNAUTHORIZED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  409: ErrorCode.CONFLICT,
  422: ErrorCode.BUSINESS_RULE,
  429: ErrorCode.RATE_LIMITED,
}

/** Mã mặc định khi BE không trả `code`. */
export function codeFromStatus(status: number): ErrorCodeValue {
  if (status >= 500) return ErrorCode.SERVER_ERROR
  return BY_STATUS[status] ?? ErrorCode.UNKNOWN
}
