<script setup lang="ts">
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'

// Khung — form đăng nhập thật làm ở P2.
const { t } = useT()
</script>

<template>
  <PageHeader :title="t('auth.login.title')" />
</template>
