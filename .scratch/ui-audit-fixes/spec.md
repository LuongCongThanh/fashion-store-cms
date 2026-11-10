# Spec — Sửa lỗi giao diện theo audit 2026-11-10

Status: completed

Nguồn: audit `/impeccable` ngày 2026-11-10 (điểm 13/20), báo cáo đầy đủ ở `audit.md`. Spec này chỉ gồm các lỗi **chưa** có ticket. Dashboard theo archetype đã nằm ở `ui-ux-hardening/issues/12`, rollout archetype List ở `ui-ux-hardening/issues/08`; không làm lại ở đây.

## Problem Statement

User vận hành Store gặp một số chỗ giao diện lệch `DESIGN.md`:

- Banner offline có chữ trắng trên nền amber (~2.1:1), khó đọc đúng lúc mất mạng.
- Icon cảnh báo Caps Lock ở màn đăng nhập quá nhạt (< 3:1).
- Trên màn list, phân trang vẫn hiện khi bảng đang tải hoặc đang báo lỗi, gây cảm giác có dữ liệu.
- Dashboard không có widget nào (thiếu quyền) vẫn render lưới trống dưới EmptyState.
- Gallery ảnh của Product có 4 nút solid trên mỗi ảnh, nên không rõ hành động nào là chính. Nút xoá không hỏi xác nhận. Ảnh không theo tỉ lệ 3:4, không lazy-load, và tràn ở 375px.
- Trang chi tiết Product có hàng ảnh tràn ngang trên mobile và bảng Variant là `<table>` thô: header viết cứng, SKU không mono, giá không căn phải.
- Cỡ số KPI và tiêu đề section không thống nhất với thang chữ trong `DESIGN.md`.

## Solution

Sửa trong 3 lát nhỏ, mỗi lát một PR vào `dev`:

1. **Tương phản và trạng thái**: banner và icon dùng màu đạt AA; phân trang chỉ hiện khi có dữ liệu; dashboard rỗng chỉ hiện EmptyState.
2. **Gallery ảnh và chi tiết Product**: mỗi ảnh có một menu `⋯`, xoá phải xác nhận, ảnh 3:4 lazy-load trên lưới responsive; bảng Variant dùng pattern bảng dùng chung.
3. **Thang chữ**: KPI có hai cỡ hero/phụ; tiêu đề section thống nhất một kiểu.

## User Stories

1. Là User, tôi muốn banner offline đọc được rõ, để biết ngay mình đã mất kết nối.
2. Là User thị lực kém, tôi muốn chữ banner offline đạt tương phản AA ở cả light và dark, để không phải phóng to.
3. Là User, tôi muốn banner offline vẫn nhận ra là cảnh báo, để không nhầm với thông tin thường.
4. Là User đang gõ mật khẩu, tôi muốn thấy rõ cảnh báo Caps Lock, để không gõ sai mật khẩu.
5. Là người dùng trình đọc màn hình, tôi muốn cảnh báo Caps Lock được đọc như một status, để nhận cùng thông tin với người nhìn.
6. Là User, tôi không muốn thấy phân trang khi list đang tải, để không bị hiểu sai về số trang.
7. Là User, tôi không muốn thấy phân trang khi list bị lỗi, để tập trung vào thông báo lỗi và nút thử lại.
8. Là User, tôi muốn phân trang hiện lại khi dữ liệu đã tải xong, để tiếp tục điều hướng.
9. Là User không có quyền với widget nào, tôi muốn dashboard chỉ hiện một empty state, để trang không trông như bị lỗi.
10. Là User quản lý ảnh Product, tôi muốn mỗi ảnh chỉ có một menu thao tác, để gallery dễ quét.
11. Là User, tôi muốn đặt ảnh làm ảnh chính từ menu, để kiểm soát ảnh đại diện.
12. Là User, tôi muốn nhận ra ảnh chính qua badge có chữ, để không phải dựa vào màu.
13. Là User, tôi muốn chuyển ảnh sang trái/phải từ menu, để đổi thứ tự hiển thị.
14. Là User, tôi muốn "chuyển trái" bị vô hiệu ở ảnh đầu và "chuyển phải" bị vô hiệu ở ảnh cuối, để không bấm vào thao tác không có tác dụng.
15. Là User, tôi muốn xác nhận trước khi xoá ảnh, để không mất ảnh vì bấm nhầm.
16. Là User, tôi muốn huỷ được việc xoá ảnh, để ảnh được giữ nguyên.
17. Là User dùng bàn phím, tôi muốn mở menu ảnh và chọn mọi thao tác bằng phím, để không cần chuột.
18. Là người dùng trình đọc màn hình, tôi muốn nút menu ảnh có nhãn chứa tên ảnh, để biết mình đang thao tác trên ảnh nào.
19. Là User trên điện thoại 375px, tôi muốn gallery xuống dòng thành lưới, không cuộn ngang, để làm việc được trên mobile.
20. Là User, tôi muốn ảnh hiển thị tỉ lệ 3:4 nhất quán với catalog thời trang, để gallery gọn gàng.
21. Là User mạng chậm, tôi muốn ảnh được tải lười (lazy), để trang mở nhanh.
22. Là User, tôi muốn gallery rỗng hiện empty state rõ ràng, để biết cần tải ảnh lên.
23. Là User xem chi tiết Product trên mobile, tôi muốn hàng ảnh không tràn ngang, để đọc được cả trang.
24. Là User, tôi muốn bảng Variant ở trang chi tiết giống các bảng khác trong CMS, để quen mắt và dễ quét.
25. Là User, tôi muốn SKU hiển thị bằng font mono, để phân biệt các mã gần giống nhau.
26. Là User, tôi muốn giá và tồn kho căn phải với `tabular-nums`, để so sánh số theo cột dọc.
27. Là User, tôi muốn header bảng Variant hiển thị theo ngôn ngữ của mình, để giao diện nhất quán với i18n.
28. Là User, tôi muốn bảng Variant rộng cuộn ngang trong khung của nó, để trang không bị cuộn ngang.
29. Là User xem dashboard, tôi muốn KPI chính lớn hơn KPI phụ, để biết con số nào quan trọng nhất.
30. Là User, tôi muốn mọi tiêu đề section trong form và card dùng cùng một kiểu, để giao diện nhất quán.
31. Là developer, tôi muốn trang design system hiển thị KPI đúng cỡ, để tài liệu tham chiếu chính xác.

## Implementation Decisions

### Lát 1: tương phản và trạng thái

- Banner offline: giữ `color="warning"`, đổi variant từ `solid` sang `subtle` (được `DESIGN.md` cho phép). Giữ sticky, `z-10`.
- Icon Caps Lock: đổi từ màu warning sang `text-default`. Ý nghĩa do icon kèm chữ truyền tải; giữ `role="status"`.
- Phân trang: view list chỉ render `DataTablePagination` khi query không pending, không lỗi và có `meta`. Đặt điều kiện ở từng view list (9 list) thay vì trong `DataTablePagination`, vì component chỉ nhận `meta`. Phương án khác: thêm prop cho `DataTablePagination` để mọi list dùng chung một điều kiện; chọn phương án này nếu diff nhỏ hơn.
- Dashboard: lưới widget chỉ render khi có ít nhất một card.

### Lát 2: gallery và chi tiết Product

- Gallery giữ nguyên interface công khai (props `images`, `mainId`; events `remove`, `main`, `move`) để không phải sửa nơi gọi.
- Mỗi ảnh có một `UDropdownMenu`, mở bằng nút icon ghost `xs` có `aria-label` chứa tên ảnh. Các mục: đặt làm ảnh chính, chuyển trái, chuyển phải, xoá. Mục xoá dùng màu `error`.
- Xoá gọi `useConfirm` trước khi emit `remove`; nếu huỷ thì không emit gì.
- Ảnh chính có `UBadge` kèm chữ, không đánh dấu chỉ bằng màu.
- Lưới `grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4`; ảnh `aspect-[3/4] rounded-lg object-cover`, `loading="lazy"`.
- Trang chi tiết Product dùng lại cùng lưới ảnh ở chế độ chỉ xem (không có menu). Thêm chế độ chỉ xem qua prop, hoặc tách component hiển thị riêng; chọn cách cần ít seam hơn.
- Bảng Variant ở trang chi tiết dùng bảng Variant/`DataTable` sẵn có; header lấy từ i18n, SKU dùng `font-mono`, giá và tồn kho căn phải với `tabular-nums`.

### Lát 3: thang chữ

- `StatCard` thêm prop `size`: `hero` (`font-display text-4xl font-bold`) và `secondary` (`font-display text-2xl font-semibold`). Mặc định là `secondary`.
- Tiêu đề `FormSection`: `text-base font-semibold` (Inter), nền khối `bg-default`.
- Trong card dashboard: `space-y-4`.
- Cập nhật ví dụ KPI ở trang design system cho khớp.
- Không đổi token hay `DESIGN.md`; việc này chỉ đưa code về đúng contract.

## Testing Decisions

- Test tốt kiểm tra hành vi người dùng thấy được (DOM, role, nhãn, event được emit, lời gọi HTTP), không kiểm class hay state nội bộ. Chỉ được assert class khi chính class đó là contract (ví dụ `variant` của banner, `loading="lazy"`).
- Dùng seam sẵn có: render view/component bằng `renderWithPlugins` và mock HTTP qua `http` trả về kèm theo. Không thêm seam mới.
- Test theo từng lát:
  - Lát 1: spec banner offline kiểm tra không dùng `solid`. Spec view list (lấy list Order làm đại diện) kiểm tra không có phân trang khi pending hoặc lỗi, và có phân trang khi dữ liệu đã về. Spec DashboardView kiểm tra khi không có widget thì chỉ có EmptyState, không có lưới.
  - Lát 2: spec gallery kiểm tra menu có 4 thao tác, "chuyển trái" của ảnh đầu bị vô hiệu, xoá chỉ emit `remove` sau khi xác nhận, huỷ thì không emit gì. Spec ProductDetailView kiểm tra header bảng Variant lấy từ i18n.
  - Lát 3: spec StatCard kiểm tra `hero` và `secondary` render cỡ khác nhau (ở đây class là contract). Các spec hiện có vẫn xanh.
- Tham khảo: `DashboardView.spec.ts`, `ProductDetailView.spec.ts`, `ProductListView.spec.ts`, `ErrorState.spec.ts`.
- Tràn layout ở 375px được kiểm thủ công trên trình duyệt (hoặc bằng viewport e2e nếu dễ đưa vào `e2e/`); không assert trong unit test.

## Out of Scope

- Dựng lại dashboard theo archetype (KPI hero, hàng đợi "Cần xử lý", chart): `ui-ux-hardening/issues/12`.
- Thêm `DataTableToolbar`, nút chọn cột, thanh thao tác hàng loạt và tab bộ lọc đã lưu cho các list còn lại: `ui-ux-hardening/issues/08`.
- Tạo `PRODUCT.md` (`/impeccable init`).
- Đổi token brand hoặc font.
- Sắp xếp ảnh bằng kéo-thả.

## Further Notes

- Luồng nhánh: mỗi lát một nhánh riêng, squash-merge vào `dev`.
- Nếu lát 3 merge trước ticket 12, ticket 12 dùng thẳng `StatCard size="hero"`.

## Implementation notes — 2026-11-10

- Hoàn thành 3 ticket bằng các vòng red → green tại seam được user xác nhận.
- Nuxt UI warning/subtle vẫn dùng chữ warning nhạt ở light: override title/icon bằng text-default. Tương phản đo trong Chromium: 9,51:1 light; 12,12:1 dark.
- 9 vị trí phân trang thực tế là 8 list và danh sách Order trong chi tiết Customer. Category là cây và không phân trang.
- Validation: 277 unit test (58 file), build/vue-tsc, ESLint, Prettier; 4 cấu hình Chromium (375/1280 × light/dark) cho Product detail/editor.
- Chạy browser regression: `npm run test:e2e`. Playwright webServer cố định API /api và tắt mock auth DEV; smoke test tự cung cấp HTTP fixture. Cả 6 e2e test đều qua.
- Delivery theo yêu cầu ship của user: gom thay đổi vào PR #56 đang mở trên nhánh feat/form-controls, target dev; không merge.
