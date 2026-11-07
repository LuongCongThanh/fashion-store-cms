import { computed, readonly } from 'vue'

import { useSession } from '@shared/lib/session/Session'

import { useStoreScopeStore } from './stores/StoreScope.store'

/** Store đang quản lý. Bọc Session: đổi Store (persist + xoá cache) do Session làm (§M.3). */
export function useStoreScope() {
  const session = useSession()
  const store = useStoreScopeStore()

  const storeId = computed(() => session.getStoreId())
  const stores = computed(() => store.stores)
  const current = computed(() => store.stores.find((s) => s.id === storeId.value) ?? null)

  return {
    storeId: readonly(storeId),
    stores: readonly(stores),
    current,
    switchStore: (id: string) => session.switchStore(id),
  }
}
