import { CanceledError } from 'axios'
import { describe, expect, it } from 'vitest'

import { ApiError } from './ApiError'
import { isRetryable, isSilent, messageKeyOf, routeMutationError } from './ErrorPolicy'

const err = (status: number, code: string, fields?: Record<string, string[]>) =>
  new ApiError(status, code, 'raw', fields)

describe('ErrorPolicy.isRetryable', () => {
  it.each([
    ['network error', err(0, 'NETWORK_ERROR'), true],
    ['timeout', err(0, 'TIMEOUT'), true],
    ['500', err(500, 'SERVER_ERROR'), true],
    ['503 with BE code', err(503, 'MAINTENANCE'), true],
    ['401', err(401, 'UNAUTHORIZED'), false],
    ['403', err(403, 'FORBIDDEN'), false],
    ['404', err(404, 'NOT_FOUND'), false],
    ['422', err(422, 'BUSINESS_RULE'), false],
    ['aborted request', new CanceledError(), false],
    ['non-API error', new Error('boom'), false],
  ])('%s → %s', (_label, error, expected) => {
    expect(isRetryable(error)).toBe(expected)
  })
})

describe('ErrorPolicy.messageKeyOf', () => {
  const known = new Set(['errors.PRODUCT_SLUG_TAKEN', 'errors.CONFLICT', 'errors.SERVER_ERROR', 'errors.UNKNOWN'])
  const has = (key: string) => known.has(key)

  it('uses the BE code when a translation exists', () => {
    expect(messageKeyOf(err(409, 'PRODUCT_SLUG_TAKEN'), has)).toBe('errors.PRODUCT_SLUG_TAKEN')
  })

  it('falls back to the status code when the BE code has no translation', () => {
    expect(messageKeyOf(err(409, 'SOMETHING_NEW'), has)).toBe('errors.CONFLICT')
    expect(messageKeyOf(err(502, 'GATEWAY'), has)).toBe('errors.SERVER_ERROR')
  })

  it('falls back to UNKNOWN when nothing matches or the error is not an ApiError', () => {
    expect(messageKeyOf(err(418, 'TEAPOT'), has)).toBe('errors.UNKNOWN')
    expect(messageKeyOf(new TypeError('x is undefined'), has)).toBe('errors.UNKNOWN')
  })
})

describe('ErrorPolicy.isSilent', () => {
  it('is silent only for aborted requests', () => {
    expect(isSilent(new CanceledError())).toBe(true)
    expect(isSilent(err(0, 'NETWORK_ERROR'))).toBe(false)
    expect(isSilent(new Error('boom'))).toBe(false)
  })
})

// Mỗi dòng "Mutation …" của bảng §O.4 là một ca.
describe('ErrorPolicy.routeMutationError', () => {
  it.each([
    ['400 with fields → form', err(400, 'VALIDATION_FAILED', { name: ['required'] }), 'form'],
    ['422 with fields → form', err(422, 'BUSINESS_RULE', { sku: ['taken'] }), 'form'],
    ['409 without fields → toast', err(409, 'CONFLICT'), 'toast'],
    ['422 without fields → toast', err(422, 'BUSINESS_RULE'), 'toast'],
    ['400 with empty fields → toast', err(400, 'VALIDATION_FAILED', {}), 'toast'],
    ['403 → toast', err(403, 'FORBIDDEN'), 'toast'],
    ['429 → toast', err(429, 'RATE_LIMITED'), 'toast'],
    ['500 → toast', err(500, 'SERVER_ERROR'), 'toast'],
    ['network → toast', err(0, 'NETWORK_ERROR'), 'toast'],
    ['unknown JS error → toast', new Error('boom'), 'toast'],
    ['aborted → silent', new CanceledError(), 'silent'],
  ] as const)('%s', (_label, error, expected) => {
    expect(routeMutationError(error)).toBe(expected)
  })

  it('lets the screen handle it when meta.errorHandling is local', () => {
    expect(routeMutationError(err(409, 'CONFLICT'), { errorHandling: 'local' })).toBe('local')
    expect(routeMutationError(err(500, 'SERVER_ERROR'), { errorHandling: 'local' })).toBe('local')
  })

  it('keeps aborted requests silent even when meta is local', () => {
    expect(routeMutationError(new CanceledError(), { errorHandling: 'local' })).toBe('silent')
  })
})
