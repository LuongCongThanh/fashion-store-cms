<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UForm from '@nuxt/ui/components/Form.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import ULink from '@nuxt/ui/components/Link.vue'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'

import type { FormSubmitEvent } from '@nuxt/ui'

import PageHeader from '@shared/components/page/PageHeader.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { useT } from '@shared/lib/i18n/I18n'

import { safeRedirect } from '../SafeRedirect'
import { useAuth } from '../UseAuth'

const { t } = useT()
const auth = useAuth()
const notifier = useNotify()
const route = useRoute()
const router = useRouter()

const schema = computed(() =>
  z.object({
    email: z.email(t('auth.validation.emailInvalid')),
    password: z.string().min(1, t('auth.validation.required')),
  }),
)
type Schema = z.infer<typeof schema.value>

const state = reactive({ email: '', password: '' })
const remember = ref(true)
const showPassword = ref(false)
const submitting = ref(false)
const invalidCredentials = ref(false)

// Điều kiện DEV đứng trước → chuỗi tài khoản giả bị loại khỏi bản build production.
const mockHint =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true'
    ? t('auth.login.mockHint', { email: 'admin@cms.local', password: 'admin123' })
    : null

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true
  invalidCredentials.value = false
  try {
    await auth.login(event.data, { remember: remember.value })
    await router.push(safeRedirect(route.query.redirect))
  } catch (err) {
    if (isApiError(err) && err.status === 401) invalidCredentials.value = true
    else notifier.error(err)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('auth.login.title')" :description="t('auth.login.subtitle')" />

    <UAlert
      v-if="mockHint"
      color="info"
      variant="subtle"
      icon="i-lucide-flask-conical"
      :title="mockHint"
    />
    <UAlert
      v-if="invalidCredentials"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('auth.login.invalidCredentials')"
    />

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
              :aria-label="
                showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')
              "
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

      <UButton type="submit" block :loading="submitting">{{ t('auth.login.submit') }}</UButton>
    </UForm>
  </div>
</template>
