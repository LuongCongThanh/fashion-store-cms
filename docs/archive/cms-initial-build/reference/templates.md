# F. Template

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

### F.1. GitHub

`.github/pull_request_template.md`:

```md
## Mục đích

<!-- Ticket: CMS-xxx -->

## Thay đổi chính

-

## Cách test

-

## Ảnh chụp (nếu có UI)

## Checklist

- [ ] Tiêu đề PR theo Conventional Commits
- [ ] Đã thêm/cập nhật test
- [ ] Đã thêm i18n key (vi + en)
- [ ] Không import chéo feature
- [ ] Không có DTO ngoài `api/`; component không gọi API (§T)
- [ ] Chỉ dùng màu ngữ nghĩa, không mã màu / palette thô (§L)
- [ ] Đã kiểm tra quyền (RBAC) nếu có màn hình mới
```

`.github/ISSUE_TEMPLATE/bug_report.md`: Mô tả · Các bước tái hiện · Kết quả mong đợi · Kết quả thực tế · Môi trường · Ảnh/log.

`.github/ISSUE_TEMPLATE/feature_request.md`: Bối cảnh · Yêu cầu · Tiêu chí chấp nhận · Quyền (role nào dùng) · Thiết kế (link Figma).

### F.2. Khung feature mới (copy tay, chưa có generator)

```text
features/<name>/
├── api/<Feature>.api.ts
├── schemas/<Entity>.schema.ts
├── types/<Entity>.types.ts
├── components/<Entity>Table.vue
├── views/<Entity>ListView.vue
└── Use<Feature>.ts            # chỉ khi feature khác cần dùng
```

Component mẫu:

```vue
<script setup lang="ts">
import type { Product } from '@features/products/types/Product.types'

const props = defineProps<{ items: Product[]; loading?: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <UTable :data="props.items" :loading="props.loading" />
</template>
```

Spec mẫu (`<File>.spec.ts`): `describe` theo tên module, `it` mô tả hành vi bằng tiếng Anh (`it('redirects to login when unauthenticated')`).

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
