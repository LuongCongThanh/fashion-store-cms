# Fashion Store CMS — Style Reference

Đây là design contract của CMS và là nguồn chuẩn duy nhất cho giao diện. Thứ tự quyền lực như sau:

`DESIGN.md` → token trong code (`main.css`, `Ui.config.ts`) → inventory page/component → code → công cụ audit bên ngoài.

Khi đổi token, sửa file này trước, rồi sửa code **trong cùng PR**.

**Hướng thiết kế:** _Fashion editorial + operational clarity_. Khi hai bên xung đột thì **operational clarity thắng**:

- Màn list, form, detail ưu tiên mật độ thông tin, khả năng quét và tốc độ thao tác.
- Chất editorial chỉ thể hiện qua chữ, khoảng trắng và accent, và chỉ ở login, empty state, page header và dashboard.

> **Tạm thời:** palette `brand` (rose) và cặp font hiện tại chỉ là lựa chọn tạm, chờ brand guideline chính thức. Khi có guideline thì chỉ đổi **giá trị** token, giữ nguyên **tên**.

## Tokens — Colors

Có ba tầng token. Component chỉ được dùng **tầng 2**.

| Tầng           | Ví dụ                                                          | Ai dùng                                 |
| -------------- | -------------------------------------------------------------- | --------------------------------------- |
| 1. Palette thô | `--color-brand-600`, `slate-200`                               | Chỉ `main.css`, `Ui.config.ts`          |
| 2. Ngữ nghĩa   | `primary`, `error`, `bg-default`, `text-muted`                 | Mọi component, layout                   |
| 3. Nghiệp vụ   | `OrderStatus → color`                                          | Badge component của feature             |

**Màu ngữ nghĩa** được khai báo trong `src/app/config/Ui.config.ts`:

| Token       | Palette   | Light / Dark   | Dùng cho                                                     |
| ----------- | --------- | -------------- | ------------------------------------------------------------ |
| `primary`   | `brand`   | 600 / 400      | **Một** hành động chính mỗi màn, link, focus, item nav active, điểm nhấn chart |
| `neutral`   | `slate`   | —              | Nền, chữ, viền, nút phụ, trạng thái nháp. Là màu chủ đạo của UI dày dữ liệu |
| `success`   | `emerald` | —              | Thành công, đã giao, còn hàng, delta tăng (qua badge)        |
| `info`      | `sky`     | —              | Thông tin, đã xác nhận, đang giao                            |
| `warning`   | `amber`   | —              | Cảnh báo, chờ xác nhận, sắp hết hàng                         |
| `error`     | `red`     | —              | Lỗi, xoá, huỷ, hết hàng, delta giảm (qua badge)              |
| `secondary` | `indigo`  | —              | Hầu như không dùng. Cần review trước khi dùng                 |

**Palette `brand` (tạm), định nghĩa trong `main.css` `@theme`:**

`50 #fff1f2 · 100 #ffe4e6 · 200 #fecdd3 · 300 #fda4af · 400 #fb7185 · 500 #f43f5e · 600 #e11d48 · 700 #be123c · 800 #9f1239 · 900 #881337 · 950 #4c0519`

**Bề mặt, chữ, viền** (biến Nuxt UI, tự đổi theo dark mode):

| Vai trò             | Class                          | Khi nào dùng                                        |
| ------------------- | ------------------------------ | --------------------------------------------------- |
| Nền trang, card     | `bg-default`                   | Mặc định                                            |
| Nền phụ             | `bg-muted`                     | Sidebar, vùng nền lùi                               |
| Header bảng, hover  | `bg-elevated`                  | `<thead>`, hover dòng (`bg-elevated/50`)            |
| Thanh / cột phụ chart | `bg-accented`                | Cột chart không nổi bật, chấm timeline cũ           |
| Chữ nổi bật         | `text-highlighted`             | Tiêu đề trang, giá trị đang active                  |
| Chữ thường          | `text-default`                 | Body                                                |
| Chữ phụ             | `text-muted` · `text-dimmed`   | Nhãn, mô tả, metadata · chỉ cho chữ trang trí có `aria-hidden` |
| Viền                | `border-default`               | Mọi viền card, bảng, divider (`divide-default`)     |

**Màu theo trạng thái nghiệp vụ.** Map màu đặt trong badge component của feature (ví dụ `OrderStatusBadge.vue`). Badge **luôn có chữ**, không dùng màu làm tín hiệu duy nhất.

**Tương phản của màu trạng thái.** Ở light mode, `success`/`warning`/`info`/`error` là bước 500, chỉ đạt khoảng 2.1–3.8:1 trên nền trắng. Vì vậy:

- **Không** dùng `text-success|warning|info|error` cho chữ.
- Màu trạng thái chỉ dùng làm nền, viền hoặc badge `subtle`/`soft`. Chữ của các badge này dùng bước đậm, nên đạt AA.
- Delta (▲/▼ %), tồn kho và số đếm phải hiển thị **qua badge `subtle`**, hoặc dùng chữ `text-default` kèm ký hiệu ▲/▼.
- Ngoại lệ là `text-primary` (đã đẩy lên bước 600, ≈ 4.7:1). Chỉ dùng nó cho link và chữ ≥ `text-sm`.
- Chữ lỗi dưới field (`UFormField :error`) dùng bước đậm `red-700` / dark `red-400` (≈ 6.5:1), khai báo một lần ở slot `formField.error` trong `Ui.config.ts`. Trong `.vue` vẫn không viết class màu lỗi trực tiếp.

| Đối tượng | Map                                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------- |
| Order     | `pending` warning · `confirmed` info · `processing` primary · `shipped` info · `delivered` success · `cancelled` error · `refunded` neutral |
| Payment   | `unpaid` warning · `paid` success · `refunded` neutral                                                                      |
| Product   | `draft` neutral · `published` success · `archived` warning                                                                  |
| Tồn kho   | còn hàng success · sắp hết (< 5) warning · hết hàng error                                                                   |

## Tokens — Typography

| Token            | Giá trị                                               | Dùng cho                                              |
| ---------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `--font-sans`    | `'Inter Variable', ui-sans-serif, system-ui`          | Mọi chữ mặc định                                      |
| `--font-display` | `'Plus Jakarta Sans Variable'`                        | Tiêu đề và số nổi bật, **chỉ khi chữ ≥ 18px**         |
| `--font-mono`    | `ui-monospace, SFMono-Regular`                        | SKU, mã đơn, mã tracking, mã giao dịch                |

| Vai trò                              | Class                                                 |
| ------------------------------------ | ----------------------------------------------------- |
| Tiêu đề trang                        | `font-display text-2xl font-semibold text-highlighted` (qua `PageHeader`) |
| Câu tóm tắt editorial (chỉ dashboard) | `text-base text-muted`, tối đa 1 câu, nằm dưới tiêu đề |
| KPI hero                             | `font-display text-4xl font-bold tabular-nums`        |
| KPI phụ                              | `font-display text-2xl font-semibold tabular-nums`    |
| Tiêu đề section / card               | `text-base font-semibold` (Inter)                     |
| Nhãn nhóm (eyebrow)                  | `text-xs font-semibold uppercase tracking-wider text-muted` |
| Body, bảng, form, nút, badge         | `text-sm` · 400/500                                   |
| Metadata, header bảng                | `text-xs text-muted`                                  |
| Tiền, số lượng, %                    | luôn `tabular-nums`, căn phải trong bảng              |

**Thang cỡ:** 12 · **14 (mặc định)** · 16 · 18 · 20 · 24 · 30 · 36. **Độ đậm:** 400 · 500 · 600. Chỉ KPI và logo được dùng 700.

## Tokens — Spacing & Shapes

| Nhóm          | Giá trị                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| Spacing       | Thang Tailwind, bội 4px. Trong card dùng `p-4`/`p-5`, giữa các khối `gap-4`. **Trong khối dùng `space-y-4`, giữa section dùng `space-y-6`; không dùng `space-y-5`.** Padding trang `p-4 lg:p-6` (`PageContainer`) |
| Mật độ        | **Không có nút chuyển chế độ.** Màn chung dùng **comfortable**: dòng `py-2.5` ≈ 40px. Bảng nghiệp vụ cố định **compact**: `py-1.5` ≈ 36px, control `sm` |
| Radius        | `--ui-radius: 0.375rem`. Control: `rounded-md`. Card/khối: **`rounded-lg`, không dùng `rounded-xl`**. Badge tròn/avatar: `rounded-full` |
| Viền          | 1px `border-default`. Ưu tiên viền thay cho bóng                                                          |
| Shadow        | `shadow-xs` cho card nổi nhẹ (hiếm). Dropdown và modal dùng shadow của Nuxt UI. Không thêm bóng trang trí |
| Control size  | Nuxt UI mặc định `md`. Trong bảng và toolbar dày dùng `sm`/`xs`                                           |
| Motion        | `transition-colors duration-150` cho hover. Mọi transition phải có `motion-reduce:transition-none`. Motion chỉ để báo trạng thái hoặc quan hệ không gian, không để trang trí |

## Components

Ưu tiên Nuxt UI primitive (`UButton`, `UInput`, `UBadge`, `UCheckbox`, `UTable`…). Chỉ viết wrapper khi đã chứng minh có khoảng trống mà Nuxt UI không đáp ứng.

- **Button.** Chính: `UButton` mặc định (solid primary), **tối đa 1 nút mỗi vùng**. Phụ: `color="neutral" variant="outline"`. Nút nhẹ trong bảng: `variant="ghost"`/`soft`, size `xs`. Huỷ/xoá: `color="error" variant="ghost"`, và phải xác nhận qua `useConfirm`. Nút đang chạy dùng prop `loading`. Nút chỉ có icon phải có `aria-label`.
- **Badge.** `UBadge variant="subtle"` cho trạng thái. Đếm hàng đợi dùng `variant="soft"` kèm `tabular-nums`. `solid` chỉ được dùng với `primary`, `error` và `neutral`; **không** dùng `solid` cho `warning`/`info`/`success`, vì chữ trắng trên nền bước 500 chỉ đạt khoảng 2.1–2.8:1.
- **Page header** (`PageHeader`). Tiêu đề, tuỳ chọn mô tả, slot `actions` bên phải. Nút chính nằm phải cùng.
- **Hàng đợi "Cần xử lý"** (pattern từ dashboard). Một hàng link ô (`grid sm:grid-cols-2 xl:grid-cols-4`), mỗi ô gồm nhãn, badge đếm và `›`. Bấm vào sẽ mở list đã lọc sẵn. Hover/focus đổi viền sang `primary`.
- **Bảng nghiệp vụ.** Có viền ngoài `rounded-lg`. `thead` dùng `bg-elevated text-xs text-muted` và dính (`sticky top-0 z-10`). Cột đầu là checkbox. Cột "Sản phẩm" gồm ảnh nhỏ 40px, tên (`line-clamp-1`, có `title`) và SKU mono. Tiền căn phải. Cuối dòng có menu `⋯`. Khi chọn dòng, **thanh thao tác hàng loạt thay vào chỗ tiêu đề bảng** (nền `bg-primary/10`), hiện số đã chọn và các action. Bảng cuộn ngang trong khung của nó, trang không bị cuộn ngang. Component: `DataTable` (compact, thead dính), `DataTableToolbar` (tiêu đề + nút chọn cột; đổi thành thanh hàng loạt khi chọn dòng), `TableLink` (link tên qua router), `sortHeader()` (nút sắp xếp có focus ring; cột tiền căn phải), `DataTablePagination`. Bảng rỗng/đang tải dùng `EmptyState`/`LoadingState`. Khung bảng cao tối đa `100dvh - 16rem` (tạm, chốt ở ticket 07).
- **Ưu tiên cột ở `sm`.** Dưới `sm` chỉ giữ: checkbox, cột tên/mã, một cột giá trị chính (tiền hoặc trạng thái) và menu `⋯`. Các cột còn lại thêm `meta.class` `hidden sm:table-cell` (cả `th` và `td`). Cột ẩn ở `sm` vẫn chọn lại được qua nút "Cột hiển thị".
- **Tab bộ lọc đã lưu.** Tab gạch chân (`border-b-2 border-primary` khi active), mỗi tab kèm số đếm. Đặt phía trên thanh lọc. Mỗi tab đổi URL nên làm bằng `<nav>` chứa các `RouterLink` có `aria-current="page"`. **Không** dùng `role="tab"` tự viết. Tab đổi nội dung tại chỗ thì dùng `UTabs`, vì nó đã có điều hướng bằng phím mũi tên.
- **Thanh lọc.** Nằm trên một dòng gồm: ô tìm kiếm (`w-72`), các nút lọc `outline sm`, chip lọc đang bật (`UBadge soft primary` có nút `×`) và nút "Xoá lọc". Select lọc dùng `FilterSelect` (`UFormField` + `USelect` size `sm`, có option "Tất cả" ứng với không lọc); ô số/ngày/text dùng `UFormField` + `UInput` size `sm`. Mọi control có label truy cập được (label hiển thị hoặc `aria-label`).
- **Thanh tiến trình trạng thái** (order). Các bước bằng nhau. Bước đã qua và bước hiện tại tô `bg-primary`, bước sau tô `bg-accented`. Bước hiện tại có `aria-current="step"`. Đi kèm **một** nút hành động tiếp theo, đặt bên phải header.
- **Section / card.** `rounded-lg border border-default bg-default`. Tiêu đề section nằm trong khối.
- **Chart.** Cột hoặc đường. Điểm cần chú ý tô `primary`, phần còn lại tô `accented`. Luôn có tóm tắt bằng chữ (`figcaption`/`sr-only`). Không dùng legend chỉ có màu.
- **Ảnh sản phẩm.** Thumbnail 40px `rounded`, ảnh lưới tỉ lệ 3:4. **Khi thiếu ảnh**: viền nét đứt, nền `bg-elevated` và chữ viết tắt `text-dimmed`.
- **Trạng thái dùng chung.** `LoadingState`/`USkeleton`, `EmptyState`, `ErrorState` (có nút thử lại), `OfflineBanner`. Mỗi list, detail và widget phải xử lý đủ loading, empty và error.

## Layout

- **App shell:** dựng bằng `UDashboardGroup` + `UDashboardSidebar` + `UDashboardPanel` + `UDashboardNavbar` của Nuxt UI (cách ghép theo template `nuxt-ui-templates/dashboard`), không tự dựng sidebar/header. Sidebar rộng cố định 256px (thu gọn 64px, không kéo đổi độ rộng), từ `lg` trở lên. Dưới `lg` sidebar thành slideover từ trái (không phải `drawer` bottom sheet của Nuxt UI), mở bằng nút toggle trong navbar, tự đóng khi đổi route. Store switcher nằm ở đầu sidebar, nút thu gọn ở chân sidebar, User menu ở bên phải navbar. Navbar chứa breadcrumb (dưới `lg` rút gọn còn trang hiện tại), locale, theme (chỉ từ `lg`; dưới `lg` nằm trong User menu) và User menu. Navbar không lặp tiêu đề trang; tiêu đề nằm ở `PageHeader`. Header và page dùng `px-4 lg:px-6`.
- **Vùng nội dung:** `PageContainer` = `mx-auto max-w-screen-2xl p-4 lg:p-6`.
- **Breakpoint:** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Màn đích là desktop ≥ 1280, nhưng mọi route phải dùng được ở 375px.
- **z-index:** `z-10` cho header bảng sticky, `z-20` cho sidebar mobile. Overlay để Nuxt UI quản lý.
- **Archetype màn hình** (đã duyệt ở Phase 0.5, xem `.scratch/ui-ux-hardening/mockup-decision.md`):
  - **Dashboard:** header kèm 1 câu tóm tắt → hàng đợi "Cần xử lý" → lưới `lg:grid-cols-3` (KPI hero + chart chiếm 2 cột, 3 KPI phụ xếp dọc 1 cột) → đơn gần đây (2 cột) + sắp hết hàng (1 cột).
  - **List:** page header → tab bộ lọc đã lưu → thanh lọc 1 dòng → bảng compact → phân trang.
  - **Detail:** header gồm link quay lại, mã, badge và nút hành động tiếp theo → thanh tiến trình trạng thái → `lg:grid-cols-[1fr_22rem]`: nội dung chính bên trái, sidebar dính bên phải (`lg:sticky lg:top-4`).

## Do's and Don'ts

- **Do** chỉ dùng token tầng 2. **Don't** dùng hex/rgb hay class palette thô (`bg-rose-500`, `text-slate-700`, `dark:bg-…`) trong `.vue`.
- **Do** giữ đúng một nút `primary` solid mỗi màn. **Don't** tô `primary` lên thứ không phải hành động chính hoặc điểm nhấn dữ liệu.
- **Do** để rõ ràng thao tác thắng ở list/form/detail. **Don't** mang chữ cỡ lớn, câu tóm tắt hay lưới ảnh vào màn thao tác hàng loạt.
- **Do** dùng `font-display` cho chữ ≥ 18px. **Don't** dùng nó trong bảng hay form.
- **Do** dùng `tabular-nums` cho mọi con số và căn phải cột tiền. **Don't** cắt chữ mà không có `title` hoặc cách khác để xem đủ nội dung.
- **Do** cho mọi tiền, số và ngày đi qua formatter dùng chung ở `shared/lib/format/`, theo locale của app: tiền dạng `1.890.000 ₫`, ngày theo `Intl.DateTimeFormat`. **Don't** dùng `toLocaleString()` trần (nó lấy locale trình duyệt) hay render số/ISO thô.
- **Do** chọn cách xử lý chuỗi dài theo từng trường:
  - Tên trong bảng: cắt còn 1 dòng (`line-clamp-1` + `title`), hiện đầy đủ ở Detail.
  - Email, mã tracking, mã giao dịch ở Detail: xuống dòng (`break-all`).
  - Tiền và ngày: không bao giờ cắt.
- **Do** cho mọi hành động thiết yếu luôn hiển thị hoặc truy cập được bằng bàn phím. **Don't** để hành động chỉ hiện khi hover.
- **Do** giữ focus ring `focus-visible` của Nuxt UI. Element tự viết (link ô, `<button>`, dòng bảng bấm được) phải dùng `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`. Ring phải đạt ≥ 3:1 so với nền và hiện ngay lập tức, không có animation. **Don't** dùng `outline-none` trần, hay control native (`<select>`, `<input>`) không có style khi đã có primitive Nuxt UI tương ứng.
- **Do** dùng viền để phân tách. **Don't** thêm bóng, gradient hay hiệu ứng trang trí. Ngoại lệ duy nhất là ảnh giả khi thiếu ảnh.
- **Do** đảm bảo tương phản chữ ≥ 4.5:1 ở cả light và dark.

## Agent Prompt Guide

Đây là CMS nghiệp vụ, không phải landing page. Hãy đọc file này trước khi sửa UI. Chỉ dùng Nuxt UI và token ngữ nghĩa (`primary`, `neutral`, `bg-default`, `text-muted`, `border-default`). Mỗi màn chỉ có một nút chính. Bảng mặc định compact, có thead dính, tiền căn phải với `tabular-nums`. Chọn bố cục theo archetype ở mục Layout, không tự tạo bố cục mới. Mọi màn phải xử lý loading, empty và error, chạy được ở light/dark và ở 375px. Skill thiết kế bên ngoài chỉ được dùng để gợi ý hoặc audit. Nếu muốn đổi palette, font, mật độ hay pattern component thì phải sửa file này trước và qua review.

## Open questions

1. **Màu brand chính thức** và quyết định giữ hay đổi font: tạm giữ rose + Plus Jakarta Sans/Inter. Chờ brand guideline; khi có thì chỉ đổi giá trị token.

## Đã quyết (2026-11-09)

- Mật độ: không có nút chuyển chế độ. Màn chung comfortable, bảng nghiệp vụ compact.
- Radius card: `rounded-lg`. Phase 3 sửa 2 chỗ đang dùng `rounded-xl` (`FormSection`, card dashboard).
- Khoảng cách: `space-y-4` trong khối, `space-y-6` giữa section. Phase 3 dọn các chỗ đang dùng `space-y-5`.
- Tên trạng thái theo code (`processing`/`shipped`, `published`). Bảng cũ ở `CONVENTIONS.md` §L.4 đã bỏ.
- Formatter tiền/ngày dùng chung ở `shared/lib/format/`. Chuỗi dài: tên trong bảng cắt còn 1 dòng, email/mã ở Detail xuống dòng.
