# V. Lý do các quyết định D25, D34, D37–D41

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

Ghi lại **vì sao** plan cũ được sửa (review kiến trúc 2026-11-07). Phần "làm gì" đã nằm ở các mục được dẫn; mục này chỉ giữ vấn đề, hướng sửa và các lỗi cần tránh.

### V.1. Composition root + Session (D37, D34 — §M.2)

**Vấn đề:** `main.ts` tự nối dây theo "thứ tự cố định" và bị loại khỏi coverage, nên wiring prod không có test. `src/test/Render.ts` tự ráp plugin theo cách khác, nên test có thể pass trong khi app thật hỏng. "Token + Store hiện tại + xoá cache khi đổi" bị chia ra 5 nơi: `HttpClientDeps` (7 tham số, 5 callback), `createAuthAdapter`, `createStoreScopeAdapter`, `switchStore` và `logout` đều tự gọi `queryClient.clear()`, còn `onAuthFailure` nằm trong `main.ts`.

```text
TRƯỚC                                        SAU
main.ts ── ráp tay ──┐                       main.ts ──┐
                     ├─► HttpClient (7 deps) Render.ts ┴─► createAppRuntime(overrides)
Render.ts ─ ráp khác ┘                                        ├─► Session (token, storeId, cache)
auth adapter ─┐                                               └─► HttpClient { baseURL, session, getLocale }
StoreScope adapter ┴─► queryClient.clear() ×2
```

**Vì sao Session ở `shared/lib`:** cả auth và StoreScope cùng dùng, mà feature không được import lẫn nhau.

**Lưu ý triển khai:**

- `useSessionStore` persist bằng `useLocalStorage`, key `cms.session`.
- Refresh đồng thời: giữ một biến `pendingRefresh: Promise | null` để mọi lời gọi dùng chung.
- `on()` dùng event emitter tối giản (`Map<event, Set<fn>>`).
- Thứ tự tạo trong `Runtime.ts`: `pinia → i18n → router → notifier → queryClient → session → http`. `http` được gán lazy để tránh vòng phụ thuộc.
- Viết `Session.spec.ts` trước khi nối vào app (Pinia thật, `new QueryClient()`, `callRefresh` giả).
- ❌ Không gọi `queryClient.clear()` ngoài `Session.ts`. ❌ Không import `useSessionStore` ngoài `session/`. ❌ Không tạo Pinia / QueryClient / i18n riêng trong test, luôn đi qua `renderWithPlugins()`.

### V.2. i18n: instance sở hữu locale (D25 — §H)

**Vấn đề (bug thật):** `I18n.ts` export singleton `i18n = createAppI18n()`, và `useLocale()` cập nhật singleton đó qua `watchEffect` chạy lúc import. `main.ts` lại gọi `createAppI18n()` lần nữa nên app dùng **instance thứ hai**. Kết quả: bấm đổi ngôn ngữ thì `<html lang>` và localStorage đổi, nhưng chữ trên UI không đổi, `Accept-Language` vẫn là ngôn ngữ cũ.

```text
TRƯỚC                                   SAU
useLocale ─► singleton #1 ◄─ watchEffect  main/Render ─► createAppRuntime ─► createAppI18n() (1 instance)
main.ts   ─► instance #2 ◄─ App, Http                     useLocale ─inject─┘   Http.getLocale ─┘
```

`useLocale()` ném lỗi rõ ràng nếu chưa `app.use`. Sau khi sửa, grep `from '@shared/lib/i18n/I18n'` chỉ còn thấy `createAppI18n`, `useLocale` và type.

### V.3. Navigation module (D38 — §S.1)

**Vấn đề:** cùng một khái niệm "người dùng được đi đâu / bấm gì" bị suy ra riêng ở `Guards.ts`, `Router.ts` (title), `AppSidebar`, `CommandPalette`, `Shortcuts.ts`, `ShortcutsHelpModal`, nên thêm một route phải kiểm 5–6 chỗ. Palette và phím tắt được dựng ở Foundation trong khi lúc đó chỉ có route auth, chưa có gì để hiển thị, nên hoãn tới P5.

**Vì sao ở `layouts/`:** module cần `useAuth().can`, mà `shared/` không được import `features/`. `buildNavigation` là hàm thuần nên viết spec trước được.

### V.4. Error policy (D39 — §O.4)

**Vấn đề:** bảng §O.4 chỉ là tài liệu, còn code bị rải ở `QueryClient.ts` (retry, MutationCache), `UseNotify.ts` (`messageOf`), `ErrorHandling.ts`, `ApplyApiErrorToForm.ts`, nên không có chỗ nào test được cả bảng. Sau khi sửa, `messageOf` bị xoá khỏi `UseNotify`, và grep không còn thấy chỗ nào tự kiểm `status === 5xx` hay tự tra `errors.*`.

### V.5. HttpClient một file (D40 — §M.1, §O.3)

**Vấn đề:** refresh token gọi bằng một axios trần thứ hai nên thiếu `Accept-Language`, và lỗi không được chuẩn hoá thành `ApiError`. `getDefaultPathParams` là seam cho một câu trả lời BE còn "chờ xác nhận" nhưng đã chiếm chỗ trong interface. `client/` bị tách thành 4 file, kèm rule `noClientInternals` và hàm test riêng `createHttpClientWithAdapter`, cho một phần mà chính plan gọi là "vài dòng".

Upload S3 dùng `fetch` riêng là **đúng**, nên giữ: khác origin và không gắn token.

### V.6. Bảng ranh giới import (D41 — §E)

**Vấn đề:** 10 block ESLint, mỗi block lặp lại toàn bộ pattern (vì flat config thay giá trị chứ không gộp). Step 2 kiểm khoảng 17 ca import **bằng tay**, nên nếu sửa config sai thì không ai phát hiện. Khi thêm rule: thêm 1 dòng vào `BOUNDARIES` và ít nhất 1 ca vào `CASES`.

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
