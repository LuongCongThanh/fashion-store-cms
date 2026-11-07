<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PageHeader from '@shared/components/page/PageHeader.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { useT } from '@shared/lib/i18n/I18n'

import LoginForm from '../components/LoginForm.vue'
import { safeRedirect } from '../SafeRedirect'
import { MOCK_ACCOUNT } from '../types/MockAccount'
import { useAuth } from '../UseAuth'

import type { LoginInput } from '../schemas/Login.schema'

const { t } = useT()
const auth = useAuth()
const notifier = useNotify()
const route = useRoute()
const router = useRouter()

const submitting = ref(false)
const invalidCredentials = ref(false)

// Điều kiện DEV đứng trước → MOCK_ACCOUNT bị loại khỏi bản build production.
const mockHint =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true'
    ? t('auth.login.mockHint', MOCK_ACCOUNT)
    : null

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

    <LoginForm :submitting="submitting" @submit="onSubmit" />
  </div>
</template>
