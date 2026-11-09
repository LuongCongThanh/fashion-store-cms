<script setup lang="ts">
import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Role } from '@features/roles/types/Role.types'
import type { StoreSummary } from '@features/StoreScope/types/StoreScope.types'
import type { UserInput } from '@features/users/schemas/User.schema'

import UserRoleSelector from './UserRoleSelector.vue'
import UserStoreSelector from './UserStoreSelector.vue'
defineProps<{
  modelValue: UserInput
  roles: Role[]
  stores: StoreSummary[]
  errors: Record<string, string | undefined>
  pending: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: UserInput]; submit: []; cancel: [] }>()
const { t } = useT()
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('users.title')">
      <label
        >{{ t('common.name')
        }}<input
          name="name"
          :value="modelValue.name"
          @input="
            emit('update:modelValue', {
              ...modelValue,
              name: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
      <label
        >{{ t('auth.login.email')
        }}<input
          name="email"
          type="email"
          :value="modelValue.email"
          @input="
            emit('update:modelValue', {
              ...modelValue,
              email: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
      <label
        >{{ t('common.status')
        }}<select
          name="status"
          :value="modelValue.status"
          @change="
            emit('update:modelValue', {
              ...modelValue,
              status: ($event.target as HTMLSelectElement).value as UserInput['status'],
            })
          "
        >
          <option value="active">{{ t('common.active') }}</option>
          <option value="inactive">{{ t('common.inactive') }}</option>
        </select>
      </label>
      <UserRoleSelector
        :options="roles"
        :modelValue="modelValue.roleIds"
        @update:modelValue="emit('update:modelValue', { ...modelValue, roleIds: $event })"
      />
      <UserStoreSelector
        :options="stores"
        :modelValue="modelValue.storeIds"
        @update:modelValue="emit('update:modelValue', { ...modelValue, storeIds: $event })"
      />
      <p v-for="(error, key) in errors" :key="key" :data-error="key" role="alert">
        {{ error }}
      </p>
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
