<script setup lang="ts">
/**
 * Link ở cột tên của bảng (DESIGN.md mục Bảng): điều hướng bằng router (không tải lại trang),
 * cắt còn 1 dòng để dòng bảng cao đều, `title` giữ tên đầy đủ.
 */
defineProps<{ to: string; label: string }>()
</script>

<template>
  <RouterLink
    :to="to"
    :title="label"
    class="line-clamp-1 max-w-80 font-medium text-highlighted hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
  >
    {{ label }}
  </RouterLink>
</template>
