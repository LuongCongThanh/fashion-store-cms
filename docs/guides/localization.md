# Ngôn ngữ giao diện

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Cấu hình i18n (vue-i18n)

- Dùng Composition API (`legacy: false`), locale mặc định `vi`, fallback `en`.
- Locale do **instance** sở hữu: `createAppI18n()` trả về plugin; khi `app.use()` nó đọc/persist `localStorage` (key `cms.locale`), đồng bộ `<html lang>` và locale Nuxt UI. `useLocale()` → `{ locale, uiLocale, setLocale }` inject chính instance đó. Không store nào khác giữ locale.
- **Không** export singleton `i18n`, **không** side effect lúc import. Mỗi app/test có đúng một instance do `createAppRuntime()` tạo (D37). Code ngoài setup (HttpClient) nhận `getLocale` do runtime truyền vào, đọc đúng instance đó.
- Một file JSON cho mỗi ngôn ngữ ở `src/locales/`; tách theo feature khi file > ~500 dòng (`locales/vi/products.json`).
- Key theo [§B.2](naming.md) (`feature.scope.key`); nhóm dùng chung là `common.*` (nút, trạng thái), `validation.*` (lỗi Zod), `errors.*` (mã lỗi API).
- Type-safe key: `MessageSchema = typeof vi`; component dùng `useT()` (trong `I18n.ts`) thay `useI18n()` — `t(key: MessageKey)` chỉ nhận key có thật nên `t('sai.key')` báo lỗi typecheck (`t` của vue-i18n nhận mọi `string`). Key động (`errors.<code>`) ép `as MessageKey` sau khi qua `messageKeyOf`.
- Nuxt UI: truyền locale tương ứng (`vi`, `en` từ `@nuxt/ui/locale`) vào `<UApp :locale>`.
- Format số/tiền/ngày: `numberFormats` (`currency: 'VND'`), `datetimeFormats`; không tự ghép chuỗi.
- Không hard-code text tiếng Việt/Anh trong `.vue` (kiểm tra khi review; có thể thêm `@intlify/eslint-plugin-vue-i18n` sau).

> Nguồn: [`src/shared/lib/i18n/I18n.ts`](../../src/shared/lib/i18n/I18n.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/App.vue`](../../src/App.vue) — tài liệu không chép lại code, đọc file.

---

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../README.md).
