import { useMutation } from '@tanstack/vue-query'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'
import { ApiError } from '@shared/lib/api/errors/ApiError'
import { ErrorCode } from '@shared/lib/api/errors/ErrorCode'

import type { CurrentUser } from '@features/auth/types/Auth.types'
import type { HttpClient } from '@shared/lib/api/client/HttpClient'
import type { components } from '@shared/types/Api.generated'

type LoginDto = components['schemas']['LoginDto']
type LoginResponseDto = components['schemas']['LoginResponseDto']
type AuthUserResponseDto = components['schemas']['AuthUserResponseDto']
type ForgotPasswordDto = components['schemas']['ForgotPasswordDto']
type ResetPasswordDto = components['schemas']['ResetPasswordDto']

/** Payloads remain at the API boundary because they are generated transport DTOs. */
export type LoginPayload = LoginDto
export type ResetPasswordPayload = ResetPasswordDto

const STAFF_PERMISSIONS = ['category:read', 'product:read'] as const

function mapUser(dto: AuthUserResponseDto | CurrentUser): CurrentUser {
  // Fixture tests ở các feature cũ trả model FE; production luôn trả AuthUserResponseDto.
  if ('permissions' in dto) return dto
  return {
    id: dto.id,
    name: dto.fullName,
    email: dto.email,
    role: dto.role,
    permissions: dto.role === 'STAFF' ? [...STAFF_PERMISSIONS] : [],
  }
}

export function assertCmsUser(user: CurrentUser) {
  if (user.role === 'CUSTOMER') {
    throw new ApiError(403, ErrorCode.FORBIDDEN, 'Customer accounts cannot access the CMS.')
  }
  return user
}

/** API boundary: chỉ nơi này biết endpoint và DTO OpenAPI của auth. */
export function createAuthApi(http: HttpClient) {
  return {
    async login(payload: LoginDto) {
      const result = (await http.post('/auth/login', payload, { skipAuth: true })) as LoginResponseDto
      return { accessToken: result.accessToken, user: assertCmsUser(mapUser(result.user)) }
    },
    async me(signal?: AbortSignal) {
      return assertCmsUser(mapUser((await http.get('/auth/me', { signal })) as AuthUserResponseDto | CurrentUser))
    },
    forgotPassword: (payload: ForgotPasswordDto) =>
      http.post('/auth/forgot-password', payload, { skipAuth: true }) as Promise<void>,
    resetPassword: (payload: ResetPasswordDto) =>
      http.post('/auth/reset-password', payload, { skipAuth: true }) as Promise<void>,
    logout: () => http.post('/auth/logout', undefined) as Promise<void>,
  }
}

/** Dùng trong composable auth/query hooks; không dùng trực tiếp từ view. */
export function useAuthApi() {
  return createAuthApi(useHttpClient())
}

/** Dùng tại composition root, nơi TanStack Query không phù hợp với lifecycle Session. */
export function useLoginMutation() {
  const api = useAuthApi()
  return useMutation({ meta: { errorHandling: 'local' }, mutationFn: (payload: LoginDto) => api.login(payload) })
}

export function useForgotPasswordMutation() {
  const api = useAuthApi()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (payload: ForgotPasswordDto) => api.forgotPassword(payload),
  })
}

export function useResetPasswordMutation() {
  const api = useAuthApi()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (payload: ResetPasswordDto) => api.resetPassword(payload),
  })
}

export function useLogoutMutation() {
  const api = useAuthApi()
  return useMutation({ mutationFn: api.logout })
}
