import axios from 'axios'
import { describe, expect, it } from 'vitest'

import { MOCK_ACCOUNT } from '@features/auth/types/MockAccount'

import { createMockAuthTransport } from './MockAuth'

function client() {
  return axios.create({
    adapter: createMockAuthTransport({ delayMs: 0 }) as never,
    baseURL: '/api',
  })
}

describe('createMockAuthTransport', () => {
  it('returns tokens for the dummy account', async () => {
    const res = await client().post('/auth/login', MOCK_ACCOUNT)

    expect(res.data).toEqual({ accessToken: expect.any(String), refreshToken: expect.any(String) })
  })

  it('rejects a wrong password with 401', async () => {
    const err = await client()
      .post('/auth/login', { ...MOCK_ACCOUNT, password: 'nope' })
      .catch((e: unknown) => e)

    expect(axios.isAxiosError(err) && err.response?.status).toBe(401)
  })

  it('returns a user holding every permission declared on routes', async () => {
    const res = await client().get('/auth/me')

    expect(res.data).toMatchObject({ email: MOCK_ACCOUNT.email })
    expect(Array.isArray(res.data.permissions)).toBe(true)
  })

  it('accepts refresh and forgot-password', async () => {
    await expect(client().post('/auth/refresh', { refreshToken: 'x' })).resolves.toMatchObject({
      status: 200,
    })
    await expect(client().post('/auth/forgot-password', { email: 'a@b.c' })).resolves.toMatchObject(
      { status: 204 },
    )
  })
})
