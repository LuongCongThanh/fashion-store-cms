<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LoginForm from '@features/auth/components/LoginForm.vue'
import { safeRedirect } from '@features/auth/SafeRedirect'
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

const submitting = ref(false)
const invalidCredentials = ref(false)

async function onSubmit(credentials: LoginInput) {
  submitting.value = true
  invalidCredentials.value = false
  try {
    await auth.login(credentials)
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
      v-if="invalidCredentials"
      role="alert"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('auth.login.invalidCredentials')"
    />

    <LoginForm :submitting="submitting" @submit="onSubmit" />
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
