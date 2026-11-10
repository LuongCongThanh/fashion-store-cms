<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import { computed } from 'vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Role } from '@features/roles/types/Role.types'
import type { StoreSummary } from '@features/StoreScope/types/StoreScope.types'
import type { UserInput } from '@features/users/schemas/User.schema'

import UserRoleSelector from './UserRoleSelector.vue'
import UserStoreSelector from './UserStoreSelector.vue'
const props = defineProps<{
  modelValue: UserInput
  roles: Role[]
  stores: StoreSummary[]
  errors: Record<string, string | undefined>
  pending: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: UserInput]; submit: []; cancel: [] }>()
const { t } = useT()

const FIELDS = ['name', 'email', 'status', 'roleIds', 'storeIds']
/** Lỗi không gắn được vào field nào vẫn phải hiện. */
const otherErrors = computed(() =>
  Object.entries(props.errors).filter(([key, error]) => error && !FIELDS.includes(key)),
)

function set<K extends keyof UserInput>(key: K, value: UserInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('users.title')">
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField :label="t('common.name')" name="name" :error="errors.name">
          <UInput
            name="name"
            :modelValue="modelValue.name"
            class="w-full"
            @update:modelValue="set('name', String($event))"
          />
        </UFormField>
        <UFormField :label="t('auth.login.email')" name="email" :error="errors.email">
          <UInput
            name="email"
            type="email"
            autocomplete="off"
            :modelValue="modelValue.email"
            class="w-full"
            @update:modelValue="set('email', String($event))"
          />
        </UFormField>
      </div>
      <UFormField :label="t('common.status')" name="status" :error="errors.status">
        <USelect
          :modelValue="modelValue.status"
          :items="[
            { label: t('common.active'), value: 'active' },
            { label: t('common.inactive'), value: 'inactive' },
          ]"
          class="w-full sm:w-60"
          @update:modelValue="set('status', $event as UserInput['status'])"
        />
      </UFormField>
      <UFormField name="roleIds" :error="errors.roleIds">
        <UserRoleSelector
          :options="roles"
          :modelValue="modelValue.roleIds"
          @update:modelValue="set('roleIds', $event)"
        />
      </UFormField>
      <UFormField name="storeIds" :error="errors.storeIds">
        <UserStoreSelector
          :options="stores"
          :modelValue="modelValue.storeIds"
          @update:modelValue="set('storeIds', $event)"
        />
      </UFormField>
      <p v-for="[key, error] in otherErrors" :key="key" :data-error="key" role="alert" class="text-sm">
        {{ error }}
      </p>
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
