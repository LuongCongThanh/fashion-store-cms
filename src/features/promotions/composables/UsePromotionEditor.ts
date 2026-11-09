import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { usePromotionQuery, useSavePromotionMutation } from '@features/promotions/api/Promotions.api'
import { promotionSchema } from '@features/promotions/schemas/Promotion.schema'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { PromotionInput } from '@features/promotions/schemas/Promotion.schema'
export function usePromotionEditor() {
  const route = useRoute()
  const router = useRouter()
  const { can } = useAuth()
  const { t } = useT()
  const notify = useNotify()
  const id = computed(() => String(route.params.id ?? ''))
  const query = usePromotionQuery(id)
  const mutation = useSavePromotionMutation(id)
  const initial: PromotionInput = {
    name: '',
    type: 'coupon',
    code: '',
    discountType: 'percent',
    value: 0,
    minimumOrder: 0,
    usageLimit: 100,
    startAt: '',
    endAt: '',
    status: 'draft',
  }
  const { values, setValues, setErrors, errors, resetForm, meta } = useForm({
    initialValues: initial,
  })
  const model = computed({
    get: () => values,
    set: (value: PromotionInput) => {
      setValues(value)
    },
  })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (data) => {
      resetForm({
        values: { ...data, startAt: data.startAt.slice(0, 16), endAt: data.endAt.slice(0, 16) },
      })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (!can('promotion:write') || mutation.isPending.value) return
    const parsed = promotionSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('promotions.invalid')])))
      return
    }
    setErrors({})
    try {
      await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      await router.push('/promotions')
    } catch (error) {
      if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  return { model, errors, query, mutation, id, submit, cancel: () => router.push('/promotions') }
}
