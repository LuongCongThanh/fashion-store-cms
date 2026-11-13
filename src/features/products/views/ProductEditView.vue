<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import UButton from '@nuxt/ui/components/Button.vue'

import ProductImages from '@features/products/components/ProductImages.vue'
import ProductInfoForm from '@features/products/components/ProductInfoForm.vue'
import ProductStatusBadge from '@features/products/components/ProductStatusBadge.vue'
import ProductVariants from '@features/products/components/ProductVariants.vue'
import { useProductEditor } from '@features/products/composables/UseProductEditor'
import { useProductImages } from '@features/products/composables/UseProductImages'
import { useProductVariants } from '@features/products/composables/UseProductVariants'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'

const editor = useProductEditor()
const variants = useProductVariants(editor.id, editor.query.data)
const images = useProductImages(editor.id, editor.query.data)
const { t } = useT()
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="editor.query.data.value?.name ?? t('dashboard.products')">
      <template v-if="editor.query.data.value" #actions>
        <ProductStatusBadge :status="editor.query.data.value.status" data-testid="product-status" />
        <template v-if="editor.canWrite.value">
          <UButton
            v-if="editor.query.data.value.status === 'DRAFT'"
            icon="i-lucide-rocket"
            :disabled="!editor.hasActiveVariant.value"
            :loading="editor.status.isPending.value"
            data-action="publish"
            @click="editor.publish"
            >{{ t('products.publish') }}</UButton
          >
          <UButton
            v-if="editor.query.data.value.status === 'ACTIVE'"
            color="neutral"
            variant="outline"
            icon="i-lucide-archive"
            :loading="editor.status.isPending.value"
            data-action="archive"
            @click="editor.archive"
            >{{ t('products.archive') }}</UButton
          >
          <UButton
            v-if="editor.query.data.value.status === 'ARCHIVED'"
            icon="i-lucide-archive-restore"
            :loading="editor.unarchive.isPending.value"
            data-action="unarchive"
            @click="editor.restore"
            >{{ t('products.unarchive') }}</UButton
          >
        </template>
      </template>
    </PageHeader>
    <LoadingState v-if="editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <template v-else-if="editor.query.data.value">
      <UAlert
        v-if="editor.canWrite.value && editor.query.data.value.status === 'DRAFT' && !editor.hasActiveVariant.value"
        color="info"
        variant="subtle"
        icon="i-lucide-info"
        :title="t('products.publishNeedsVariant')"
      />
      <ProductInfoForm
        v-model="editor.model.value"
        :errors="editor.errors.value"
        :pending="editor.update.isPending.value"
        :categories="editor.categories.data.value ?? []"
        :readOnly="!editor.canWrite.value"
        :slug="editor.query.data.value.slug"
        @submit="editor.save"
        @cancel="editor.back"
      />
      <FormSection :title="t('products.variants')" :description="t('products.variantsHint')">
        <ProductVariants
          :variants="editor.query.data.value.variants"
          :sizes="variants.selectableSizes.value"
          :colors="variants.selectableColors.value"
          :draft="variants.draft"
          :errors="variants.errors.value"
          :prices="variants.prices"
          :canWrite="editor.canWrite.value"
          :adding="variants.create.isPending.value"
          :updating="variants.update.isPending.value"
          @draft="(key, value) => Object.assign(variants.draft, { [key]: value })"
          @sku="variants.setSku"
          @add="variants.add"
          @price="(variantId, value) => (variants.prices[variantId] = value)"
          @savePrice="variants.savePrice"
          @archive="variants.setArchived"
        />
      </FormSection>
      <FormSection :title="t('products.images')" :description="t('products.imagesHint')">
        <ProductImages
          :galleries="images.galleries.value"
          :canWrite="editor.canWrite.value"
          :busy="images.busy.value"
          :uploadState="images.state"
          @select="images.select"
          @cancel="images.cancel"
          @retry="images.retry"
          @primary="images.makePrimary"
          @remove="images.remove"
        />
      </FormSection>
    </template>
  </div>
</template>
