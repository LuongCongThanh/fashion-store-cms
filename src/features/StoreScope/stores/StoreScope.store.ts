import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { StoreSummary } from '../types/StoreScope.types'

/** STUB — danh sách cố định cho tới khi có API Store (P3). storeId nằm ở Session (D34). */
const STUB_STORES: StoreSummary[] = [
  { id: 'store-1', name: 'Cửa hàng Quận 1' },
  { id: 'store-2', name: 'Cửa hàng Hà Nội' },
]

export const useStoreScopeStore = defineStore('StoreScope', () => {
  const stores = ref<StoreSummary[]>(STUB_STORES)
  return { stores }
})
