import { describe, expect, it } from 'vitest'

import { forgotPasswordSchema, loginSchema } from './Login.schema'

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
