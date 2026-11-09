import { isApiError } from '@shared/lib/api/errors/ApiError'
export function applyApiErrorToForm(error: unknown, setErrors: (errors: Record<string, string>) => void) {
  if (!isApiError(error) || error.status !== 422 || !error.fields) return false
  setErrors(Object.fromEntries(Object.entries(error.fields).map(([field, messages]) => [field, messages[0] ?? ''])))
  return true
}
