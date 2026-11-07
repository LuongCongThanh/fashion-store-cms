<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'

// Khung — form đăng nhập thật làm ở P2.
const { t } = useT()
</script>

<template>
  <h1 class="font-display text-2xl font-semibold text-highlighted">{{ t('auth.login.title') }}</h1>
</template>
