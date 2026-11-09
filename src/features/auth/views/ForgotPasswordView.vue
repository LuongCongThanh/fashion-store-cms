<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UForm from '@nuxt/ui/components/Form.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import ULink from '@nuxt/ui/components/Link.vue'
import { computed, reactive, ref } from 'vue'

import type { FormSubmitEvent } from '@nuxt/ui'

import { forgotPasswordSchema } from '@features/auth/schemas/Login.schema'
import { useAuth } from '@features/auth/UseAuth'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { useT } from '@shared/lib/i18n/I18n'

import type { ForgotPasswordInput } from '@features/auth/schemas/Login.schema'

const { t } = useT()
const auth = useAuth()
const notifier = useNotify()

const schema = computed(() => forgotPasswordSchema(t))

const state = reactive({ email: '' })
const submitting = ref(false)
const sent = ref(false)

async function onSubmit(event: FormSubmitEvent<ForgotPasswordInput>) {
  submitting.value = true
  try {
    await auth.requestPasswordReset(event.data.email)
    sent.value = true
  } catch (err) {
    // 4xx (vd email không tồn tại) vẫn báo như thành công → không lộ email nào có trong hệ thống.
    if (isApiError(err) && err.status >= 400 && err.status < 500) sent.value = true
    else notifier.error(err)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('auth.forgotPassword.title')" :description="t('auth.forgotPassword.subtitle')" />

    <UAlert
      v-if="sent"
      color="success"
      variant="subtle"
      icon="i-lucide-mail-check"
      :title="t('auth.forgotPassword.sent')"
    />

    <UForm v-else :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField name="email" :label="t('auth.login.email')">
        <UInput v-model="state.email" name="email" type="email" autocomplete="email" class="w-full" autofocus />
      </UFormField>
      <UButton type="submit" block :loading="submitting" :disabled="submitting">{{
        t('auth.forgotPassword.submit')
      }}</UButton>
    </UForm>

    <ULink :to="{ name: 'auth.login' }" class="flex items-center gap-1 text-sm text-primary">
      {{ t('auth.forgotPassword.backToLogin') }}
    </ULink>
  </div>
</template>
