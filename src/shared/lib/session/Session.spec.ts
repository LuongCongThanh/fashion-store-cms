import { QueryClient } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@shared/lib/api/errors/ApiError'
import { ErrorCode } from '@shared/lib/api/errors/ErrorCode'

import { createSession } from './Session'

import type { AuthTokens, SessionSnapshot } from './Session'

function setup(
  opts: {
    callRefresh?: () => Promise<AuthTokens>
    initial?: SessionSnapshot
    onAuthFailure?: () => void
    onLoggedOut?: () => void
  } = {},
) {
  const queryClient = new QueryClient()
  const callRefresh = vi.fn(opts.callRefresh ?? (async () => ({ accessToken: 'new-at' })))
  const session = createSession({
    pinia: createPinia(),
    queryClient,
    callRefresh,
    onAuthFailure: opts.onAuthFailure,
    onLoggedOut: opts.onLoggedOut,
    initial: opts.initial,
  })
  return { session, queryClient, callRefresh }
}

/** BE từ chối refresh token. */
const rejected = () => new ApiError(401, ErrorCode.UNAUTHORIZED, 'Invalid refresh token')

describe('Session', () => {
  it('keeps only the access token in memory after sign-in', () => {
    const { session } = setup()
    session.signIn({ accessToken: 'at-1' })

    expect(session.getAccessToken()).toBe('at-1')
    expect(localStorage.getItem('cms.session.accessToken')).toBeNull()
    expect(sessionStorage.getItem('cms.session.accessToken')).toBeNull()
  })

  it('shares one cookie-refresh request between concurrent 401 recoveries', async () => {
    const { session, callRefresh } = setup({ initial: { accessToken: 'old' } })

    expect(await Promise.all([session.refresh(), session.refresh(), session.refresh()])).toEqual([
      'new-at',
      'new-at',
      'new-at',
    ])
    expect(callRefresh).toHaveBeenCalledTimes(1)
    expect(session.getAccessToken()).toBe('new-at')
  })

  it('attempts cookie restoration only once and does not report a missing session as an auth failure', async () => {
    const onFailure = vi.fn()
    const { session, callRefresh } = setup({
      callRefresh: async () => Promise.reject(rejected()),
      onAuthFailure: onFailure,
    })

    expect(await session.restore()).toBeNull()
    expect(await session.restore()).toBeNull()
    expect(callRefresh).toHaveBeenCalledTimes(1)
    expect(onFailure).not.toHaveBeenCalled()
  })

  it('clears the token and emits authFailure when a retry refresh fails', async () => {
    const onFailure = vi.fn()
    const { session } = setup({
      callRefresh: async () => Promise.reject(rejected()),
      initial: { accessToken: 'old' },
      onAuthFailure: onFailure,
    })

    expect(await session.refresh()).toBeNull()
    expect(session.getAccessToken()).toBeNull()
    expect(onFailure).toHaveBeenCalledTimes(1)
  })

  it('emits authFailure when a 401 recovery joins a failing restore', async () => {
    const onFailure = vi.fn()
    const { session, callRefresh } = setup({
      callRefresh: async () => Promise.reject(rejected()),
      onAuthFailure: onFailure,
    })

    const [restored, refreshed] = await Promise.all([session.restore(), session.refresh()])

    expect(restored).toBeNull()
    expect(refreshed).toBeNull()
    expect(callRefresh).toHaveBeenCalledTimes(1)
    expect(onFailure).toHaveBeenCalledTimes(1)
  })

  it('keeps the session and reports the network error when refresh cannot reach BE', async () => {
    const onFailure = vi.fn()
    const offline = new ApiError(0, ErrorCode.NETWORK_ERROR, 'Network Error')
    const { session } = setup({
      callRefresh: async () => Promise.reject(offline),
      initial: { accessToken: 'old' },
      onAuthFailure: onFailure,
    })

    await expect(session.refresh()).rejects.toBe(offline)
    expect(session.getAccessToken()).toBe('old')
    expect(onFailure).not.toHaveBeenCalled()
  })

  it('clears query cache and emits loggedOut on logout', async () => {
    const onLoggedOut = vi.fn()
    const { session, queryClient } = setup({ initial: { accessToken: 'at' }, onLoggedOut })
    queryClient.setQueryData(['products'], ['cached'])

    await session.logout()

    expect(session.getAccessToken()).toBeNull()
    expect(queryClient.getQueryData(['products'])).toBeUndefined()
    expect(onLoggedOut).toHaveBeenCalledTimes(1)
  })
})
