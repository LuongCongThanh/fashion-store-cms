# 5. Backlog — ngoài phạm vi hiện tại

> Lịch sử prototype; giữ tiêu chí màn hình, không dùng API/quyền/Store switching mẫu như contract hiện hành.

Chưa có trong FE_architecture; chỉ làm khi BE và yêu cầu rõ:

- **Content**: Banners, Content Page (`content-pages`), Blog → cần `RichTextEditor`, preview
- **Settings**: payment (VNPay, MoMo, COD), shipping (GHN), email (SMTP/SES, templates)
- `AppNotifications`, `ActivityTimeline` dùng chung (audit log)
- Page builder, media library, translation manager, bulk import/export

---

## 6. Thứ tự build

| Phase | Tạo                                                                                       |
| ----- | ----------------------------------------------------------------------------------------- |
| P3    | `AppBreadcrumb`, `LanguageSwitcher`, `ThemeSwitcher`, `PageContainer`                     |
| P4    | dashboard                                                                                 |
| P5    | shared `list/`, `table/`, `form/`, `StatusBadge`, `LoadingState`; feature media; products |
| P6    | categories (`CategoryTree`, `CategorySelector`)                                           |
| P7    | `FilterDateRange`, `ActiveFilterTags`; orders                                             |
| P8    | `PageTabs`; customers                                                                     |
| P9    | inventory                                                                                 |
| P10   | promotions, users & roles, settings                                                       |

Mục tiêu: một list page mới chỉ cần ráp `PageHeader + FilterBar + DataTable + DataTablePagination` + composable của feature.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần trước](catalog-02.md)
