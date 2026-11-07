import { QueryClient } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import { createSession } from './Session'

import type { AuthTokens, SessionSnapshot } from './Session'

function setup(
  opts: { callRefresh?: (rt: string) => Promise<AuthTokens>; initial?: SessionSnapshot } = {},
) {
  const queryClient = new QueryClient()
  const callRefresh = vi.fn(
    opts.callRefresh ?? (async () => ({ accessToken: 'new-at', refreshToken: 'new-rt' })),
  )
  const session = createSession({
    pinia: createPinia(),
    queryClient,
    callRefresh,
    initial: opts.initial,
  })
  return { session, queryClient, callRefresh }
}

describe('Session', () => {
  it('exposes the access token after signIn', () => {
    const { session } = setup()

    session.signIn({ accessToken: 'at-1', refreshToken: 'rt-1' })

    expect(session.getAccessToken()).toBe('at-1')
  })

  it('shares one refresh call between concurrent refresh() calls', async () => {
    const { session, callRefresh } = setup({
      initial: { accessToken: 'old', refreshToken: 'rt-1' },
    })

    const results = await Promise.all([session.refresh(), session.refresh(), session.refresh()])

    expect(callRefresh).toHaveBeenCalledTimes(1)
    expect(callRefresh).toHaveBeenCalledWith('rt-1')
    expect(results).toEqual(['new-at', 'new-at', 'new-at'])
    expect(session.getAccessToken()).toBe('new-at')
  })

  it('clears tokens and emits authFailure when refresh fails', async () => {
    const { session } = setup({
      callRefresh: async () => Promise.reject(new Error('refresh rejected')),
      initial: { accessToken: 'old', refreshToken: 'rt-1' },
    })
    const onFailure = vi.fn()
    session.on('authFailure', onFailure)

    const result = await session.refresh()

    expect(result).toBeNull()
    expect(session.getAccessToken()).toBeNull()
    expect(onFailure).toHaveBeenCalledTimes(1)
  })

  it('does not call the refresh endpoint when there is no refresh token', async () => {
    const { session, callRefresh } = setup()
    const onFailure = vi.fn()
    session.on('authFailure', onFailure)

    expect(await session.refresh()).toBeNull()
    expect(callRefresh).not.toHaveBeenCalled()
    expect(onFailure).toHaveBeenCalledTimes(1)
  })

  it('logout clears tokens, clears the query cache and emits loggedOut', async () => {
    const { session, queryClient } = setup({ initial: { accessToken: 'at', refreshToken: 'rt' } })
    queryClient.setQueryData(['products', 'list'], ['cached'])
    const onLoggedOut = vi.fn()
    session.on('loggedOut', onLoggedOut)

    await session.logout()

    expect(session.getAccessToken()).toBeNull()
    expect(queryClient.getQueryData(['products', 'list'])).toBeUndefined()
    expect(onLoggedOut).toHaveBeenCalledTimes(1)
  })

  it('switchStore changes the store id and clears the query cache', async () => {
    const { session, queryClient } = setup({ initial: { accessToken: 'at', storeId: 'store-1' } })
    queryClient.setQueryData(['products', 'list'], ['store-1 data'])

    await session.switchStore('store-2')

    expect(session.getStoreId()).toBe('store-2')
    expect(queryClient.getQueryData(['products', 'list'])).toBeUndefined()
    expect(session.getAccessToken()).toBe('at')
  })

  it('restores tokens and store id after a page reload', async () => {
    const before = setup()
    before.session.signIn({ accessToken: 'at-1', refreshToken: 'rt-1' })
    await before.session.switchStore('store-9')

    const after = setup()

    expect(after.session.getAccessToken()).toBe('at-1')
    expect(after.session.getStoreId()).toBe('store-9')
  })
})
