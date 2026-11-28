# PWA và chặn index

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## PWA, chặn index

## Chặn công cụ tìm kiếm

CMS là trang admin, **không được index**. Ba lớp, làm cả ba:

| Lớp                 | Nội dung                                            | Ghi chú                                                                             |
| ------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `index.html`        | `<meta name="robots" content="noindex, nofollow">`  | Bot đọc HTML                                                                        |
| `public/robots.txt` | `User-agent: *` + `Disallow: /`                     | Bot ngoan chấp hành; không phải cơ chế bảo mật                                      |
| Header server/CDN   | `X-Robots-Tag: noindex, nofollow` trên mọi response | Chắc nhất, áp dụng cả file tĩnh/PDF; cấu hình ở hạ tầng deploy (ghi chú cho DevOps) |

Thêm vào manifest PWA không ảnh hưởng. SEO thật (slug, meta của sản phẩm) thuộc Customer Store, ngoài phạm vi plan này.

## PWA

Mục tiêu cho CMS (công cụ nội bộ, dữ liệu nhạy cảm): **cài được như app, mở nhanh, báo khi có bản mới**. **Không** làm offline dữ liệu.

| Hạng mục         | Quyết định                                                                                                                                                                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plugin           | `vite-plugin-pwa` (Workbox, `generateSW`)                                                                                                                                                                                                                                                                               |
| Cài đặt          | Manifest `display: standalone`, `start_url: /`, `theme_color` = `brand-600`, `background_color` = `--ui-bg` (sáng)                                                                                                                                                                                                      |
| Icon             | Sinh từ `src/assets/images/Logo.svg` (cấu hình `images` trong `pwa-assets.config.ts`) bằng `@vite-pwa/assets-generator` (`pwa-assets.config.ts`), gồm maskable + apple-touch — `pwaAssets.integration.publicDir` trỏ `src/assets/images` để icon xuất ra `dist/`; `public/favicon.svg` là bản sao logo cho thẻ link SVG |
| Cache            | **Chỉ precache app shell** (JS/CSS/font/icon). Không cache response API (`/api/**` trong `navigateFallbackDenylist`, không có `runtimeCaching` cho API) — tránh lộ dữ liệu sau logout và tránh dữ liệu cũ                                                                                                               |
| Cập nhật         | `registerType: 'prompt'`: có bản mới → toast "Đã có phiên bản mới" + nút **Tải lại**; không tự reload (mất dữ liệu form đang nhập)                                                                                                                                                                                      |
| Kiểm tra bản mới | Mỗi 60 phút và khi tab được focus lại                                                                                                                                                                                                                                                                                   |
| Offline          | Mất mạng → `OfflineBanner` cố định đầu trang; mutation bị chặn ở UI (nút lưu disabled), query giữ dữ liệu đang có                                                                                                                                                                                                       |
| Dev              | `devOptions.enabled: false` (tránh SW cache khi dev); kiểm tra bằng `npm run build && npm run preview`                                                                                                                                                                                                                  |
| Không làm        | Web push, background sync, offline CRUD                                                                                                                                                                                                                                                                                 |

> Nguồn: [`vite.config.ts`](../../vite.config.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/shared/composables/UsePwa.ts`](../../src/shared/composables/UsePwa.ts) — tài liệu không chép lại code, đọc file.

- `DashboardLayout.vue` theo dõi `needRefresh` → `useNotify()` hiện toast có action Tải lại.
- `tsconfig.app.json` thêm `"types": ["vite-plugin-pwa/vue", "vite-plugin-pwa/info"]`.
- Logout: không cần xoá cache SW vì không cache API; xoá Vue Query cache (`queryClient.clear()`) trong `session.logout()`.

---

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../README.md).
