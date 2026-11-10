import { describe, expect, it } from 'vitest'

import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from './Login.schema'

const t = (key: string) => key

describe('loginSchema', () => {
  it('accepts a valid email and a non-empty password', () => {
    expect(loginSchema(t).safeParse({ email: 'lan@shop.vn', password: 'x' }).success).toBe(true)
  })

  it('reports an invalid email and an empty password', () => {
    const result = loginSchema(t).safeParse({ email: 'nope', password: '' })

    expect(result.error?.issues.map((i) => i.message)).toEqual([
      'auth.validation.emailInvalid',
      'auth.validation.required',
    ])
  })
})

describe('forgotPasswordSchema', () => {
  it('only needs an email', () => {
    expect(forgotPasswordSchema(t).safeParse({ email: 'lan@shop.vn' }).success).toBe(true)
    expect(forgotPasswordSchema(t).safeParse({ email: '' }).success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  it('accepts matching passwords with a token', () => {
    const input = { token: 't', password: 'a', confirmPassword: 'a' }
    expect(resetPasswordSchema(t).safeParse(input).success).toBe(true)
  })

  it('reports a mismatch on confirmPassword', () => {
    const result = resetPasswordSchema(t).safeParse({ token: 't', password: 'a', confirmPassword: 'b' })

    expect(result.error?.issues).toEqual([
      expect.objectContaining({ path: ['confirmPassword'], message: 'auth.validation.passwordMismatch' }),
    ])
  })
})
