<script setup lang="ts">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { Role } from '@features/roles/types/Role.types'

defineProps<{ options: Role[]; assigned: string[]; disabled: boolean; pendingRoleId?: string }>()
const emit = defineEmits<{ toggle: [roleId: string, assigned: boolean] }>()
const { t } = useT()
</script>

<template>
  <fieldset class="space-y-3">
    <legend class="sr-only">{{ t('roles.title') }}</legend>
    <p class="text-sm text-muted">{{ t('internalAccounts.rolesHint') }}</p>
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <!-- Vai trò Admin chỉ thuộc tài khoản Admin duy nhất: không gán được từ đây. -->
      <UCheckbox
        v-for="option in options"
        :id="`role:${option.id}`"
        :key="option.id"
        :label="option.name"
        :disabled="disabled || option.isReadOnly || pendingRoleId === option.id"
        :modelValue="assigned.includes(option.id)"
        @update:modelValue="emit('toggle', option.id, $event === true)"
      />
    </div>
  </fieldset>
</template>
