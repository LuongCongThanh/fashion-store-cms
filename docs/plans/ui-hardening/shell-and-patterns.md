# App shell và pattern dùng chung

> Acceptance của kế hoạch UI; đọc tracker để biết phần đã làm. Mockup/Design contract đã có, không dựng lại chỉ vì mô tả Phase gốc.

### Phase 2 — App shell và responsive foundation

**Mục tiêu:** ổn định navigation, page frame và responsive behavior trước khi polish từng feature.

**Công việc**

- Thiết kế mobile navigation drawer và hành vi đóng/mở/focus trap.
- Rework header để breadcrumb, Store switcher, locale, theme và User menu reflow có thứ tự ưu tiên.
- Chuẩn hóa `PageContainer`, `PageHeader`, page actions và responsive spacing.
- Xử lý overflow, sticky region và safe-area trên mobile.
- Bổ sung app-shell states vào Design System view.

**Acceptance criteria**

- Toàn bộ route chính truy cập được bằng keyboard và mobile navigation.
- Không có horizontal page overflow ngoài vùng table được chỉ định.
- Focus được trả về trigger sau khi drawer/dialog đóng.
- Primary action vẫn rõ ràng ở viewport nhỏ.

### Phase 3 — Shared component và state coverage

**Mục tiêu:** giảm style cục bộ và làm shared patterns phản ánh design contract.

**Công việc**

- Chuẩn hóa input/select/textarea/date/upload thông qua Nuxt UI hoặc wrapper thực sự cần dùng lại.
- Hoàn thiện form section, validation summary, help/error text và sticky actions.
- Chuẩn hóa table density, alignment, overflow, numeric formatting, row action và pagination.
- Hoàn thiện loading, skeleton, empty, error, offline và disabled states.
- Mở rộng Design System view thành catalog cho state và pattern, không chỉ là color/type demo.

**Acceptance criteria**

- Không tạo primitive thay thế Nuxt UI nếu không có gap được chứng minh.
- Form và table representative chạy được với keyboard, zoom và text dài.
- Shared component không chứa business status mapping hoặc feature knowledge.
- Mỗi shared pattern có demo cho light/dark và state quan trọng.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
