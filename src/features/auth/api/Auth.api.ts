import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { AuthTokens } from '@shared/lib/session/Session'

import type { CurrentUser, LoginPayload } from '../types/Auth.types'

/** Hàm HTTP của feature auth. Khi có Swagger thật, kiểu lấy từ `paths` và map DTO → Model ở đây. */
export function useAuthApi() {
  const http = useHttpClient()
  return {
    login: (payload: LoginPayload) =>
      http.post('/auth/login', payload, { skipAuth: true }) as Promise<AuthTokens>,
    me: () => http.get('/auth/me') as Promise<CurrentUser>,
  }
}
