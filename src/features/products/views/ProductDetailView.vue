<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import DOMPurify from 'dompurify'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'

import { useProductQuery } from '../api/ProductEditor.api'
import ProductStatusBadge from '../components/ProductStatusBadge.vue'

const route = useRoute()
const { can } = useAuth()
const { t } = useT()
const query = useProductQuery(() => String(route.params.id ?? ''))
const description = computed(() => DOMPurify.sanitize(query.data.value?.description ?? ''))
</script>

<template>
  <LoadingState v-if="query.isPending.value" />
  <ErrorState v-else-if="query.isError.value" :error="query.error.value" @retry="query.refetch()" />
  <div v-else-if="query.data.value" class="space-y-5">
    <PageHeader :title="query.data.value.name">
      <template #actions>
        <UButton
          v-if="can('product:write')"
          :to="`/products/${encodeURIComponent(query.data.value.id)}/edit`"
          >{{ t('common.edit') }}</UButton
        >
      </template>
    </PageHeader>
    <ProductStatusBadge :status="query.data.value.status" />
    <p>{{ t('products.price') }}: {{ query.data.value.price.toLocaleString() }}</p>
    <!-- eslint-disable-next-line vue/no-v-html -- Sanitized through DOMPurify immediately above. -->
    <div data-description v-html="description" />
    <div class="flex gap-3">
      <img
        v-for="image in query.data.value.images"
        :key="image.id"
        :src="image.url"
        :alt="image.name"
        class="h-32 w-32 object-cover"
      />
    </div>
    <table class="w-full">
      <thead>
        <tr>
          <th>SKU</th>
          <th>{{ t('products.variant') }}</th>
          <th>{{ t('products.price') }}</th>
          <th>{{ t('products.stock') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="variant in query.data.value.variants" :key="variant.sku">
          <td>{{ variant.sku }}</td>
          <td>{{ variant.size }} {{ variant.color }}</td>
          <td>{{ variant.price }}</td>
          <td>{{ variant.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <EmptyState v-else :title="t('common.empty')" />
</template>
