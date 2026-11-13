import { computed, toValue, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { MaybeRefOrGetter } from 'vue'

/** Refetches may update pristine forms, but must never discard a dirty draft. */
export function useHydrateForm<T>(
  data: MaybeRefOrGetter<T | undefined>,
  dirty: MaybeRefOrGetter<boolean>,
  hydrate: (data: T) => void,
) {
  const route = useRoute()
  const context = computed(() => JSON.stringify([route.name ?? route.path, route.params]))
  let hydratedContext: string | undefined
  watch(
    [() => toValue(data), context],
    ([value, currentContext]) => {
      if (value !== undefined && (!toValue(dirty) || hydratedContext !== currentContext)) {
        hydrate(value)
        hydratedContext = currentContext
      }
    },
    { immediate: true },
  )
}
