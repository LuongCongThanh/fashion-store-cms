import { useMutation } from '@tanstack/vue-query'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'
import { ApiError } from '@shared/lib/api/errors/ApiError'
import { ErrorCode } from '@shared/lib/api/errors/ErrorCode'

import type { CurrentUser, LoginPayload, ResetPasswordPayload } from '@features/auth/types/Auth.types'
import type { HttpClient } from '@shared/lib/api/client/HttpClient'
import type { components } from '@shared/types/Api.generated'

import { toCurrentUser } from './Auth.mapper'

import type { MeResponseDto } from './Auth.mapper'

type LoginDto = components['schemas']['LoginDto']
type LoginResponseDto = components['schemas']['LoginResponseDto']
type ForgotPasswordDto = components['schemas']['ForgotPasswordDto']
type ResetPasswordDto = components['schemas']['ResetPasswordDto']

function assertCmsUser(user: CurrentUser) {
  if (user.role === 'CUSTOMER') {
    throw new ApiError(403, ErrorCode.FORBIDDEN, 'Customer accounts cannot access the CMS.')
  }
  return user
}

/**
 * API boundary: chỉ nơi này biết endpoint và DTO OpenAPI của auth.
 * HttpClient chưa bật kiểu theo `paths` (HasPaths = false) nên response được gán kiểu DTO tại đây — một lần mỗi endpoint.
 */
export function createAuthApi(http: HttpClient) {
  return {
    login: async (payload: LoginPayload) => {
      const body: LoginDto = payload
      const result = (await http.post('/auth/login', body, { skipAuth: true })) as LoginResponseDto
      // Response login không có Quyền: UseAuth nạp user qua `me()` ngay sau khi có access token.
      return { accessToken: result.accessToken }
    },
    me: async (signal?: AbortSignal) => {
      const dto = (await http.get('/auth/me', { signal })) as MeResponseDto
      return assertCmsUser(toCurrentUser(dto))
    },
    forgotPassword: async (payload: ForgotPasswordDto) => {
      await http.post('/auth/forgot-password', payload, { skipAuth: true })
    },
    resetPassword: async (payload: ResetPasswordPayload) => {
      const body: ResetPasswordDto = payload
      await http.post('/auth/reset-password', body, { skipAuth: true })
    },
    logout: async () => {
      await http.post('/auth/logout', undefined, { noRefresh: true })
    },
  }
}

export type AuthApi = ReturnType<typeof createAuthApi>

/** Dùng trong UseAuth; không dùng trực tiếp từ view. */
export function useAuthApi() {
  return createAuthApi(useHttpClient())
}

/** Mọi mutation auth tự xử lý lỗi tại view (form), không qua notifier toàn cục. */
function useLocalMutation<TInput, TOutput>(fn: (input: TInput) => Promise<TOutput>) {
  return useMutation({ meta: { errorHandling: 'local' }, mutationFn: fn })
}

export function useAuthMutations(api: AuthApi) {
  return {
    login: useLocalMutation(api.login),
    forgotPassword: useLocalMutation(api.forgotPassword),
    resetPassword: useLocalMutation(api.resetPassword),
    // Logout là best-effort: lỗi không toast, state cục bộ luôn được xoá (UseAuth.endSession).
    logout: useLocalMutation(api.logout),
  }
}
