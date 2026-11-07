import { MutationCache, QueryClient } from '@tanstack/vue-query'

import { isRetryable, routeMutationError } from '@shared/lib/api/errors/ErrorPolicy'

/** QueryClient của app — chỉ là adapter của ErrorPolicy (§O.4), không tự quyết định gì. */
export function createAppQueryClient(opts: {
  onMutationError: (e: unknown) => void
  /** Test truyền false. */
  retry?: false
}) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: opts.retry ?? ((count, e) => count < 2 && isRetryable(e)),
        staleTime: 30_000,
      },
    },
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => {
        if (routeMutationError(error, mutation.meta) === 'toast') opts.onMutationError(error)
      },
    }),
  })
}
