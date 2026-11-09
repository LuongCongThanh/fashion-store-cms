import { computed, onScopeDispose } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { LocationQueryRaw } from 'vue-router'
import type { z } from 'zod'

/** The URL is the only list state. Invalid fields fall back independently. */
export function useListState<S extends z.ZodObject>(schema: S) {
  const route = useRoute()
  const router = useRouter()
  const params = computed<z.output<S>>(() => {
    const values: Record<string, unknown> = {}
    for (const [key, field] of Object.entries(schema.shape)) {
      const parsed = (field as z.ZodType).safeParse(route.query[key] ?? undefined)
      if (parsed.success) values[key] = parsed.data
      else {
        const fallback = (field as z.ZodType).safeParse(undefined)
        if (fallback.success) values[key] = fallback.data
      }
    }
    return schema.parse(values)
  })
  function update(values: Record<string, unknown>) {
    const query: LocationQueryRaw = { ...route.query }
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null || value === '') query[key] = undefined
      else query[key] = String(value)
    }
    return router.push({ query })
  }
  let timer: ReturnType<typeof setTimeout> | undefined
  onScopeDispose(() => clearTimeout(timer))
  function setFilter(key: string, value: unknown) {
    if (key === 'search') {
      clearTimeout(timer)
      timer = setTimeout(() => void update({ [key]: value, page: 1 }), 300)
      return Promise.resolve()
    }
    return update({ [key]: value, page: 1 })
  }
  return {
    params,
    setFilter,
    setPage: (page: number) => update({ page }),
    setSort: (sort: string) => update({ sort, page: 1 }),
    reset: () => {
      clearTimeout(timer)
      return router.push({
        query: Object.fromEntries(
          Object.entries(route.query).filter(([key]) => !(key in schema.shape)),
        ),
      })
    },
  }
}
