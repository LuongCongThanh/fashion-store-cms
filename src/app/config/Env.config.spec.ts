import { describe, expect, it } from 'vitest'

import { parseEnv } from './Env.config'

describe('parseEnv', () => {
  it('returns the API base URL when env is valid', () => {
    const env = parseEnv({ VITE_API_BASE_URL: 'https://api.example.com' })

    expect(env.VITE_API_BASE_URL).toBe('https://api.example.com')
  })

  it('throws an error naming the missing variable', () => {
    expect(() => parseEnv({})).toThrow(/VITE_API_BASE_URL/)
  })

  it('throws an error pointing to .env.local so devs know where to fix it', () => {
    expect(() => parseEnv({ VITE_API_BASE_URL: 'not-a-url' })).toThrow(/\.env\.local/)
  })

  it('accepts a same-origin path behind a reverse proxy', () => {
    expect(parseEnv({ VITE_API_BASE_URL: '/api' }).VITE_API_BASE_URL).toBe('/api')
  })

  it('rejects a relative path without a leading slash', () => {
    expect(() => parseEnv({ VITE_API_BASE_URL: 'api' })).toThrow(/VITE_API_BASE_URL/)
  })
})
