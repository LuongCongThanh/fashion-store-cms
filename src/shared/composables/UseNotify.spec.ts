import { CanceledError } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@shared/lib/api/errors/ApiError'

import { createNotifier } from './UseNotify'

const MESSAGES: Record<string, string> = {
  'errors.SERVER_ERROR': 'Lỗi máy chủ',
  'errors.UNKNOWN': 'Có lỗi xảy ra',
  'common.save': 'Đã lưu sản phẩm',
}

function setup() {
  const toast = { add: vi.fn() }
  const notifier = createNotifier({
    toast,
    t: (key) => MESSAGES[key] ?? key,
    te: (key) => key in MESSAGES,
  })
  return { notifier, toast }
}

describe('createNotifier', () => {
  it('shows an error toast translated by error policy', () => {
    const { notifier, toast } = setup()

    notifier.error(new ApiError(500, 'SOME_BE_CODE', 'stack trace from BE'))

    expect(toast.add).toHaveBeenCalledWith(
      expect.objectContaining({ color: 'error', title: 'Lỗi máy chủ' }),
    )
  })

  it('stays silent for aborted requests', () => {
    const { notifier, toast } = setup()

    notifier.error(new CanceledError())

    expect(toast.add).not.toHaveBeenCalled()
  })

  it('shows a translated success toast', () => {
    const { notifier, toast } = setup()

    notifier.success('common.save')

    expect(toast.add).toHaveBeenCalledWith(
      expect.objectContaining({ color: 'success', title: 'Đã lưu sản phẩm' }),
    )
  })

  it('shows a persistent prompt with a translated action', () => {
    const { notifier, toast } = setup()
    const onClick = vi.fn()

    notifier.prompt('common.save', { label: 'common.save', onClick })

    const shown = toast.add.mock.calls[0]?.[0]
    expect(shown).toMatchObject({ color: 'info', title: 'Đã lưu sản phẩm', duration: 0 })
    shown.actions[0].onClick()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
