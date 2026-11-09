import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { CurrentUser, LoginPayload } from '@features/auth/types/Auth.types'
import type { AuthTokens } from '@shared/lib/session/Session'

/** Hàm HTTP của feature auth. Khi có Swagger thật, kiểu lấy từ `paths` và map DTO → Model ở đây. */
export function useAuthApi() {
  const http = useHttpClient()
  return {
    login: (payload: LoginPayload) => http.post('/auth/login', payload, { skipAuth: true }) as Promise<AuthTokens>,
    forgotPassword: (email: string) =>
      http.post('/auth/forgot-password', { email }, { skipAuth: true }) as Promise<void>,
    me: () => http.get('/auth/me') as Promise<CurrentUser>,
  }
}
