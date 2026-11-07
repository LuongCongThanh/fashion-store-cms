# 08 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/i18n` (stacked trên `feat/css-design-system`)
Ngày hoàn thành: 2026-11-07

## Đã làm

Làm theo TDD, chỉ test ở seam `I18n.spec` (chạy qua `renderWithPlugins()`) và `ErrorState.spec`.

- `shared/lib/i18n/I18n.ts`:
  - `createAppI18n()` là plugin sở hữu locale. Khi `app.use()` chạy, nó đọc và lưu `cms.locale`, đồng bộ `<html lang>`, và cung cấp `getLocale`, `translate`, `has` cho code chạy ngoài setup.
  - `useLocale()` trả `{ locale, uiLocale, setLocale }`.
  - `useT()` là hàm `t` có kiểu chặt theo `MessageKey`.
  - Không export singleton, và import file không gây side effect.
- `locales/vi.json`, `en.json` có nhóm `common` (nút, theme, ngôn ngữ) và `errors.*` (đủ các mã ở §O.2).
- `I18n.spec.ts` có 4 ca:
  - `setLocale('en')` đổi text hiển thị.
  - `<html lang>`, `localStorage` và `Accept-Language` của `runtime.http` đổi theo.
  - F5 vẫn giữ ngôn ngữ đã chọn.
  - Component Nuxt UI đổi ngôn ngữ theo (nhãn đóng của `UAlert` đổi từ "Đóng" sang "Close").
- `ErrorState.spec.ts` có thêm 1 ca: hiển thị text đã dịch theo ErrorPolicy.
- Nối i18n vào Runtime: thứ tự tạo là pinia → i18n → router. `getLocale` truyền cho HttpClient; `translate` và `has` truyền cho notifier.
- `App.vue` và `Render.ts` dùng `<UApp :locale="uiLocale">`.
- Chuyển text viết cứng ở plan 06 và 07 (ConfirmDialog, ErrorState, UserMenu) sang i18n. UserMenu có thêm phần đổi ngôn ngữ.
- `Setup.ts` bật `enableAutoUnmount(afterEach)`.

## Kết quả kiểm tra

| Mục kiểm tra                                  | Kết quả | Ghi chú                                                                                                |
| --------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| Chuyển vi/en đổi cả text và component Nuxt UI | Pass    | `I18n.spec.ts`                                                                                         |
| F5 vẫn giữ ngôn ngữ                           | Pass    | Có ca trong spec; trên browser (Playwright): sau F5 `lang=en`, UserMenu hiện "Account menu"            |
| `t('sai.key')` báo lỗi typecheck              | Pass    | TS2345: `'"sai.key"' is not assignable to parameter of type 'MessageKey'` (kiểm bằng file thử, đã xoá) |
| Không còn `app/stores/`                       | Pass    |                                                                                                        |
| Không có export singleton `i18n`              | Pass    | Đã grep                                                                                                |
| test, lint, typecheck, build                  | Pass    | 101/101                                                                                                |

## Lệch so với plan / quyết định mới

- **Thêm `useT()` thay cho `useI18n()`**: `t` của vue-i18n v11 nhận mọi `string`. Khai `DefineLocaleMessage` chỉ có tác dụng gợi ý autocomplete, không làm `t('sai.key')` báo lỗi (đã thử cả `useScope: 'global'`). Vì vậy component dùng `useT()`, có `t(key: MessageKey)`. Key động (`errors.<code>`) phải ép kiểu `as MessageKey` sau khi qua `messageKeyOf`. Chưa có rule ESLint chặn import `useI18n` trực tiếp; có thể thêm sau.
- **Bật `enableAutoUnmount`**: `useLocale` và toast của Nuxt UI dùng `createSharedComposable`, nên nếu không unmount thì state rò giữa các test. Test UI locale đã phát hiện lỗi này.
- **Regex tên thư mục cho phép chữ số** (`+([a-z0-9])`): cây §A có thư mục `i18n/`, nhưng regex ở §E không cho phép tên này.
- Chưa khai `numberFormats` và `datetimeFormats`. Sẽ thêm khi có chỗ format tiền hoặc ngày đầu tiên (P5), vì hiện chưa có code nào dùng.

## Việc còn tồn

- Plan 07 yêu cầu "`localStorage` chỉ có key `cms.colorMode`". Từ plan này localStorage có thêm `cms.locale`, đúng theo §H. Hiểu tiêu chí của plan 07 là chỉ áp cho phần theme.
- Token usage: chưa điền.
