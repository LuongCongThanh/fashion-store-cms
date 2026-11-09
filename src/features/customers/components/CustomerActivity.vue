<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'

import type { Customer } from '../types/Customer.types'
defineProps<{ activity: Customer['activity'] }>()
const { t } = useT()
</script>
<template>
  <ol v-if="activity.length">
    <li v-for="event in activity" :key="event.id">
      <time>{{ event.createdAt }}</time> {{ event.label }}
    </li>
  </ol>
  <p v-else>{{ t('common.empty') }}</p>
</template>
