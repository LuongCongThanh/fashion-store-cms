<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UForm from '@nuxt/ui/components/Form.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import ULink from '@nuxt/ui/components/Link.vue'
import { computed, reactive, ref } from 'vue'

import type { FormSubmitEvent } from '@nuxt/ui'

import { useT } from '@shared/lib/i18n/I18n'

import { loginSchema } from '../schemas/Login.schema'

import type { LoginInput } from '../schemas/Login.schema'

defineProps<{ submitting: boolean }>()
const emit = defineEmits<{ submit: [credentials: LoginInput, opts: { remember: boolean }] }>()

const { t } = useT()
const schema = computed(() => loginSchema(t))
const state = reactive({ email: '', password: '' })
const remember = ref(true)
const showPassword = ref(false)

function onSubmit(event: FormSubmitEvent<LoginInput>) {
  emit('submit', event.data, { remember: remember.value })
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField name="email" :label="t('auth.login.email')">
      <UInput
        v-model="state.email"
        name="email"
        type="email"
        autocomplete="username"
        class="w-full"
        autofocus
      />
    </UFormField>

    <UFormField name="password" :label="t('auth.login.password')">
      <UInput
        v-model="state.password"
        name="password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
        class="w-full"
        :ui="{ trailing: 'pe-1' }"
      >
        <template #trailing>
          <UButton
            data-action="toggle-password"
            color="neutral"
            variant="link"
            size="sm"
            :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')"
            :aria-pressed="showPassword"
            @click="showPassword = !showPassword"
          />
        </template>
      </UInput>
    </UFormField>

    <div class="flex items-center justify-between">
      <UCheckbox v-model="remember" :label="t('auth.login.remember')" />
      <ULink :to="{ name: 'auth.forgot-password' }" class="text-sm text-primary">
        {{ t('auth.login.forgot') }}
      </ULink>
    </div>

    <UButton type="submit" block :loading="submitting" :disabled="submitting">
      {{ t('auth.login.submit') }}
    </UButton>
  </UForm>
</template>
