<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UForm from '@nuxt/ui/components/Form.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import ULink from '@nuxt/ui/components/Link.vue'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { FormSubmitEvent } from '@nuxt/ui'

import { resetPasswordSchema } from '@features/auth/schemas/Login.schema'
import { useAuth } from '@features/auth/UseAuth'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { useT } from '@shared/lib/i18n/I18n'

import type { ResetPasswordInput } from '@features/auth/schemas/Login.schema'

const { t } = useT()
const route = useRoute()
const auth = useAuth()
const notifier = useNotify()
const schema = computed(() => resetPasswordSchema(t))
const token = typeof route.query.token === 'string' ? route.query.token : ''
const state = reactive({ token, password: '', confirmPassword: '' })
const submitting = ref(false)
const complete = ref(false)

async function onSubmit(event: FormSubmitEvent<ResetPasswordInput>) {
  submitting.value = true
  try {
    await auth.resetPassword(event.data)
    complete.value = true
  } catch (error) {
    notifier.error(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('auth.resetPassword.title')" :description="t('auth.resetPassword.subtitle')" />

    <UAlert
      v-if="complete"
      color="success"
      variant="subtle"
      icon="i-lucide-circle-check"
      :title="t('auth.resetPassword.complete')"
    />

    <UForm v-else :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField name="password" :label="t('auth.resetPassword.password')" required>
        <UInput v-model="state.password" name="password" type="password" autocomplete="new-password" class="w-full" />
      </UFormField>
      <UFormField name="confirmPassword" :label="t('auth.resetPassword.confirmPassword')" required>
        <UInput
          v-model="state.confirmPassword"
          name="confirmPassword"
          type="password"
          autocomplete="new-password"
          class="w-full"
        />
      </UFormField>
      <UButton type="submit" block :loading="submitting" :disabled="submitting || !token">
        {{ t('auth.resetPassword.submit') }}
      </UButton>
    </UForm>

    <ULink :to="{ name: 'auth.login' }" class="flex items-center gap-1 text-sm text-primary">
      {{ t('auth.forgotPassword.backToLogin') }}
    </ULink>
  </div>
</template>
