import { z } from 'zod'

import type { MessageKey } from '@shared/lib/i18n/I18n'

type Translate = (key: MessageKey) => string

/** Schema form đăng nhập; nhận `t` để thông báo lỗi theo locale hiện tại. */
export const loginSchema = (t: Translate) =>
  z.object({
    email: z.email(t('auth.validation.emailInvalid')),
    password: z.string().min(1, t('auth.validation.required')),
  })
export type LoginInput = z.infer<ReturnType<typeof loginSchema>>

/** Schema form quên mật khẩu: chỉ email, cùng thông báo lỗi với form đăng nhập. */
export const forgotPasswordSchema = (t: Translate) => loginSchema(t).pick({ email: true })
export type ForgotPasswordInput = z.infer<ReturnType<typeof forgotPasswordSchema>>

export const resetPasswordSchema = (t: Translate) =>
  z
    .object({
      token: z.string().min(1, t('auth.validation.required')),
      password: z.string().min(1, t('auth.validation.required')),
      confirmPassword: z.string().min(1, t('auth.validation.required')),
    })
    .refine((value) => value.password === value.confirmPassword, {
      message: t('auth.validation.passwordMismatch'),
      path: ['confirmPassword'],
    })
export type ResetPasswordInput = z.infer<ReturnType<typeof resetPasswordSchema>>
