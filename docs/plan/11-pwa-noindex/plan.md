# 11 — Chặn index và PWA

Status: in-progress
Blocked by: 09
Nguồn: Step 5b (phần 1) trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41, trong đó D24, D32 đã huỷ), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 5b (phần 1) — Chặn index và PWA

**Làm gì**

- Chặn index theo §R.1 (meta, `robots.txt`; header ghi vào checklist deploy).
- PWA theo §R: `vite-plugin-pwa`, `pwa-assets.config.ts`, `UsePwa.ts`, `OfflineBanner.vue`.

**Kiểm tra:** `curl /robots.txt` trả `Disallow: /`, HTML có meta `noindex`; `npm run build && npm run preview` → Chrome báo cài được, Lighthouse PWA "installable"; build lại → tab cũ hiện toast Tải lại; DevTools Offline → hiện banner, app shell vẫn mở.

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

### R. PWA, chặn index

#### R.1. Chặn công cụ tìm kiếm

CMS là trang admin, **không được index**. Ba lớp, làm cả ba:

| Lớp                 | Nội dung                                            | Ghi chú                                                                             |
| ------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `index.html`        | `<meta name="robots" content="noindex, nofollow">`  | Bot đọc HTML                                                                        |
| `public/robots.txt` | `User-agent: *` + `Disallow: /`                     | Bot ngoan chấp hành; không phải cơ chế bảo mật                                      |
| Header server/CDN   | `X-Robots-Tag: noindex, nofollow` trên mọi response | Chắc nhất, áp dụng cả file tĩnh/PDF; cấu hình ở hạ tầng deploy (ghi chú cho DevOps) |

Thêm vào manifest PWA không ảnh hưởng. SEO thật (slug, meta của sản phẩm) thuộc Customer Store, ngoài phạm vi plan này.

#### R.2. PWA

Mục tiêu cho CMS (công cụ nội bộ, dữ liệu nhạy cảm): **cài được như app, mở nhanh, báo khi có bản mới**. **Không** làm offline dữ liệu.

| Hạng mục         | Quyết định                                                                                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plugin           | `vite-plugin-pwa` (Workbox, `generateSW`)                                                                                                                                                                 |
| Cài đặt          | Manifest `display: standalone`, `start_url: /admin`, `theme_color` = `brand-600`, `background_color` = `--ui-bg` (sáng)                                                                                   |
| Icon             | Sinh từ `src/assets/images/Logo.svg` (cấu hình `images` trong `pwa-assets.config.ts`) bằng `@vite-pwa/assets-generator` (`pwa-assets.config.ts`), gồm maskable + apple-touch                              |
| Cache            | **Chỉ precache app shell** (JS/CSS/font/icon). Không cache response API (`/api/**` trong `navigateFallbackDenylist`, không có `runtimeCaching` cho API) — tránh lộ dữ liệu sau logout và tránh dữ liệu cũ |
| Cập nhật         | `registerType: 'prompt'`: có bản mới → toast "Đã có phiên bản mới" + nút **Tải lại**; không tự reload (mất dữ liệu form đang nhập)                                                                        |
| Kiểm tra bản mới | Mỗi 60 phút và khi tab được focus lại                                                                                                                                                                     |
| Offline          | Mất mạng → `OfflineBanner` cố định đầu trang; mutation bị chặn ở UI (nút lưu disabled), query giữ dữ liệu đang có                                                                                         |
| Dev              | `devOptions.enabled: false` (tránh SW cache khi dev); kiểm tra bằng `npm run build && npm run preview`                                                                                                    |
| Không làm        | Web push, background sync, offline CRUD                                                                                                                                                                   |

```ts
// vite.config.ts (phần pwa)
import { VitePWA } from 'vite-plugin-pwa'

VitePWA({
  registerType: 'prompt',
  injectRegister: false, // tự đăng ký trong UsePwa.ts
  manifest: {
    name: 'Fashion Store CMS',
    short_name: 'CMS',
    lang: 'vi',
    start_url: '/admin',
    display: 'standalone',
    theme_color: '#e11d48',
    background_color: '#ffffff',
  },
  pwaAssets: { config: true }, // đọc pwa-assets.config.ts
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
    navigateFallback: '/index.html',
    navigateFallbackDenylist: [/^\/api\//],
    cleanupOutdatedCaches: true,
  },
})
```

```ts
// src/shared/composables/UsePwa.ts — interface: usePwa()
import { useRegisterSW } from 'virtual:pwa-register/vue'

export function usePwa() {
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      if (reg) setInterval(() => reg.update(), 60 * 60 * 1000)
    },
  })
  return { needRefresh, reload: () => updateServiceWorker(true) }
}
```

- `DashboardLayout.vue` theo dõi `needRefresh` → `useNotify()` hiện toast có action Tải lại.
- `tsconfig.app.json` thêm `"types": ["vite-plugin-pwa/vue", "vite-plugin-pwa/info"]`.
- Logout: không cần xoá cache SW vì không cache API; xoá Vue Query cache (`queryClient.clear()`) trong `session.logout()`.
