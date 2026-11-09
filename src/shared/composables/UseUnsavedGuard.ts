import { useEventListener } from '@vueuse/core'
import { toValue } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

import type { MaybeRefOrGetter } from 'vue'

import { useConfirm } from '@shared/components/confirm/UseConfirm'
import { useT } from '@shared/lib/i18n/I18n'
export function useUnsavedGuard(dirty: MaybeRefOrGetter<boolean>) {
  const confirm = useConfirm()
  const { t } = useT()
  const canLeave = () => !toValue(dirty) || confirm({ title: t('common.unsaved'), color: 'error' })
  onBeforeRouteLeave(canLeave)
  onBeforeRouteUpdate((to, from) => to.path === from.path || canLeave())
  useEventListener(window, 'beforeunload', (event) => {
    if (toValue(dirty)) {
      event.preventDefault()
      event.returnValue = ''
    }
  })
}
