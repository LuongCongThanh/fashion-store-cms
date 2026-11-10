<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import { ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LoginForm from '@features/auth/components/LoginForm.vue'
import { safeRedirect } from '@features/auth/SafeRedirect'
import { MOCK_ACCOUNT } from '@features/auth/types/MockAccount'
import { useAuth } from '@features/auth/UseAuth'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { useT } from '@shared/lib/i18n/I18n'

import type { LoginInput } from '@features/auth/schemas/Login.schema'

const { t } = useT()
const auth = useAuth()
const notifier = useNotify()
const route = useRoute()
const router = useRouter()

const form = useTemplateRef<InstanceType<typeof LoginForm>>('form')
const submitting = ref(false)
const invalidCredentials = ref(false)

// Điều kiện DEV đứng trước → MOCK_ACCOUNT bị loại khỏi bản build production.
// Tài khoản demo cũng phải đứng sau điều kiện DEV để bị loại khỏi bản build production.
const demoAccount = import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true' ? MOCK_ACCOUNT : null
const mockHint =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true' ? t('auth.login.mockHint', MOCK_ACCOUNT) : null

async function onSubmit(credentials: LoginInput, opts: { remember: boolean }) {
  submitting.value = true
  invalidCredentials.value = false
  try {
    await auth.login(credentials, opts)
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
  <div class="auth-enter space-y-6">
    <PageHeader :title="t('auth.login.title')" :description="t('auth.login.subtitle')" />

    <UAlert
      v-if="mockHint"
      color="info"
      variant="subtle"
      icon="i-lucide-flask-conical"
      :title="mockHint"
      :actions="[
        {
          label: t('auth.login.useDemo'),
          color: 'info',
          variant: 'outline',
          size: 'xs',
          onClick: () => demoAccount && form?.fill({ ...demoAccount }),
        },
      ]"
      orientation="horizontal"
      class="rounded-xl"
    />
    <UAlert
      v-if="invalidCredentials"
      role="alert"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('auth.login.invalidCredentials')"
      class="rounded-xl"
    />

    <LoginForm ref="form" :submitting="submitting" @submit="onSubmit" />
  </div>
</template>

<style scoped>
@keyframes auth-enter {
  from {
    opacity: 0;
    translate: 0 12px;
  }
}
.auth-enter {
  animation: auth-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .auth-enter {
    animation: none;
  }
}
</style>
