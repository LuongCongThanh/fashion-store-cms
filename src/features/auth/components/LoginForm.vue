<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UForm from '@nuxt/ui/components/Form.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UIcon from '@nuxt/ui/components/Icon.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import ULink from '@nuxt/ui/components/Link.vue'
import { computed, reactive, ref } from 'vue'

import type { FormSubmitEvent } from '@nuxt/ui'

import { loginSchema } from '@features/auth/schemas/Login.schema'
import { useT } from '@shared/lib/i18n/I18n'

import type { LoginInput } from '@features/auth/schemas/Login.schema'

defineProps<{ submitting: boolean }>()
const emit = defineEmits<{ submit: [credentials: LoginInput, opts: { remember: boolean }] }>()

const { t } = useT()
const schema = computed(() => loginSchema(t))
const state = reactive({ email: '', password: '' })
const remember = ref(true)
const showPassword = ref(false)
const capsLock = ref(false)

function trackCapsLock(event: KeyboardEvent) {
  capsLock.value = event.getModifierState('CapsLock')
}

/** Cho trang cha điền sẵn (vd. tài khoản demo ở chế độ mock). */
function fill(credentials: LoginInput) {
  Object.assign(state, credentials)
}
defineExpose({ fill })

function onSubmit(event: FormSubmitEvent<LoginInput>) {
  emit('submit', event.data, { remember: remember.value })
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField name="email" :label="t('auth.login.email')" required>
      <UInput
        v-model="state.email"
        name="email"
        type="email"
        inputmode="email"
        autocomplete="username"
        autocapitalize="off"
        spellcheck="false"
        icon="i-lucide-mail"
        size="xl"
        placeholder="you@example.com"
        class="w-full"
        autofocus
      />
    </UFormField>

    <UFormField name="password" :label="t('auth.login.password')" required>
      <template #hint>
        <ULink
          :to="{ name: 'auth.forgot-password' }"
          class="text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {{ t('auth.login.forgot') }}
        </ULink>
      </template>
      <UInput
        v-model="state.password"
        name="password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
        icon="i-lucide-lock"
        size="xl"
        class="w-full"
        :ui="{ trailing: 'pe-1.5' }"
        @keydown="trackCapsLock"
        @keyup="trackCapsLock"
        @blur="capsLock = false"
      >
        <template #trailing>
          <UButton
            data-action="toggle-password"
            color="neutral"
            variant="ghost"
            size="sm"
            class="cursor-pointer"
            :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')"
            :aria-pressed="showPassword"
            @click="showPassword = !showPassword"
          />
        </template>
      </UInput>
      <template v-if="capsLock" #help>
        <span role="status" class="flex items-center gap-1.5 text-default">
          <UIcon name="i-lucide-arrow-big-up-dash" class="size-4 text-default" aria-hidden="true" />
          {{ t('auth.login.capsLock') }}
        </span>
      </template>
    </UFormField>

    <UCheckbox
      v-model="remember"
      :label="t('auth.login.remember')"
      :ui="{ base: 'cursor-pointer', label: 'cursor-pointer' }"
    />

    <UButton
      type="submit"
      block
      size="xl"
      :trailingIcon="submitting ? undefined : 'i-lucide-arrow-right'"
      class="cursor-pointer justify-center"
      :loading="submitting"
      :disabled="submitting"
    >
      {{ submitting ? t('auth.login.submitting') : t('auth.login.submit') }}
    </UButton>
  </UForm>
</template>
