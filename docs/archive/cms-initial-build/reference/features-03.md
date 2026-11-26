# Q. Cấu trúc từng module — phần 3

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

```text
    ├── Media.routes.ts
    └── UseMedia.ts                         # pickImages(): Promise<Media[]>, upload(files) → { progress, cancel }
```

### Q.3. Interface công khai của các module

Bảng gồm shared module (`shared/`) và interface công khai của feature / `app/` mà nơi khác gọi tới. Chỉ các dòng `shared/` là shared module theo [GLOSSARY.md](../../../../GLOSSARY.md).

| Module                                               | Interface                                                                                                                   | Giấu bên trong                                                                                            |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `shared/lib/api/client/HttpClient.ts`                | `createHttpClient(deps): HttpClient` (get/post/put/patch/delete có kiểu theo Swagger), `HTTP_CLIENT_KEY`, `useHttpClient()` | axios, gắn header (token, locale, `X-Store-Id`), path param mặc định, gom refresh, timeout, chuẩn hoá lỗi |
| `shared/lib/session/Session.ts`                      | `createSession()`, `useSession()`                                                                                           | token, storeId, refresh (1 lần đồng thời), xoá cache khi logout/đổi Store, sự kiện `authFailure`          |
| `features/auth/UseAuth.ts`                           | `useAuth()`                                                                                                                 | user, login/logout qua Session                                                                            |
| `shared/lib/api/errors/ApiError.ts` + `ErrorCode.ts` | `ApiError`, `isApiError`, `ErrorCode`, `codeFromStatus`                                                                     | — (kiểu dữ liệu)                                                                                          |
| `features/StoreScope/UseStoreScope.ts`               | `useStoreScope()` → `{ storeId, stores, switchStore }`                                                                      | danh sách Store; đổi Store ủy quyền cho Session                                                           |
| `shared/composables/UsePwa.ts`                       | `usePwa()` → `{ needRefresh, reload }`                                                                                      | Đăng ký SW, kiểm tra định kỳ                                                                              |
| `shared/lib/form/ApplyApiErrorToForm.ts`             | `applyApiErrorToForm(error, form): boolean`                                                                                 | Map `fields`, phân biệt 400/422                                                                           |
| `shared/composables/UseNotify.ts`                    | `useNotify()` → `{ success, error }`; `createNotifier()` dùng ngoài setup                                                   | Hiển thị toast; key lấy từ `ErrorPolicy.messageKeyOf`                                                     |
| `shared/lib/api/errors/ErrorPolicy.ts`               | `isRetryable`, `messageKeyOf`, `isSilent`, `routeMutationError`                                                             | Toàn bộ quy tắc §O.4                                                                                      |
| `shared/components/confirm/UseConfirm.ts`            | `useConfirm()` → `(opts) => Promise<boolean>`                                                                               | `useOverlay`, `ConfirmDialog.vue`                                                                         |
| `app/providers/ErrorHandling.ts`                     | `installErrorHandling(app, deps)`                                                                                           | errorHandler, unhandledrejection, chunk reload                                                            |
| `shared/lib/query/QueryClient.ts`                    | `createAppQueryClient(onMutationError)`                                                                                     | Nối ErrorPolicy vào Vue Query (retry, MutationCache)                                                      |
| `shared/lib/i18n/I18n.ts`                            | `createAppI18n()`, `useLocale()`                                                                                            | persist, `<html lang>`, locale Nuxt UI — do instance sở hữu                                               |
| `shared/composables/UseTheme.ts`                     | `useTheme()` → `{ mode, setMode }`                                                                                          | storage key, đồng bộ script chống nháy                                                                    |

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần trước](features-02.md) · [Phần tiếp](features.md)
