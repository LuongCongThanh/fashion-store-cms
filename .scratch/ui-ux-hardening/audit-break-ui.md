# Audit Phase 1 — `break-ui` (chỉ báo cáo)

Ngày 2026-11-09. Phạm vi: `layouts/`, Dashboard, Product list, Order detail (code trên `dev`).

**Ghi chú về phương pháp:**

- **Suy luận từ code, chưa xem trên màn hình.** Lý do: không được sửa file nên không dựng toggle dữ liệu, và backend chưa chạy.
- Fixture xấu nhất nên dùng lại fixture của prototype (`prototype/ui-direction`): tên/địa chỉ/email dài, 15.500.000 ₫, thiếu ảnh, tồn 0.
- Bỏ qua các lỗi đã có trong `audit-hallmark.md`.

## Phần 1 — Chỗ vỡ

| #   | Mức     | Trường                             | Giá trị xấu nhất                                                               | Chuyện gì xảy ra                                                                                                                                    | Sửa                                                                                                                       |
| --- | ------- | ---------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | Broken  | `product.price`                    | `15500000`                                                                     | Cột giá không có hàm render: hiển thị `15500000`, không dấu phân cách, không ₫, căn trái                                                            | Thêm `cell` format tiền theo locale app + `text-right` (`ProductTable.vue:65`)                                            |
| 2   | Broken  | `product.name`                     | `Đầm midi lụa xếp ly cổ yếm phối nơ lưng — phiên bản giới hạn Thu Đông 2026`   | Ô `<td>` của UTable mặc định `whitespace-nowrap` nên bảng phình ngang. Ở 375px phải cuộn ngang mới tới menu `⋯`. Link là `<a href>` nên tải lại cả trang | `RouterLink` + `line-clamp-1 max-w-80` + `title` (`ProductTable.vue:63`)                                                  |
| 3   | Broken  | `customer.email`, `trackingNumber` | `minhkhai.phuong.nguyen@example-mail.com.vn`                                   | Trong `md:grid-cols-3`, chuỗi không có chỗ ngắt dòng nên tràn khỏi card (cột grid đang `min-width:auto`)                                            | `break-all`/`overflow-wrap:anywhere` cho email, mã (`OrderCustomerInfo.vue`, `OrderShippingInfo.vue`, `OrderPaymentInfo.vue`) |
| 4   | Broken  | `timeline.createdAt`               | `2026-11-09T08:42:00Z`                                                         | Hiển thị nguyên chuỗi ISO, không format, `<time>` thiếu `datetime`                                                                                   | Format bằng `Intl.DateTimeFormat` theo locale app (`OrderTimeline.vue:3`)                                                 |
| 5   | Ugly    | tiền / số                          | `1284560000` khi locale app là `en`                                            | `toLocaleString()` lấy locale của **trình duyệt**, không lấy locale của app. Không có ₫                                                               | Formatter dùng chung theo `useLocale()` (`StatCard.vue:6`, `OrderSummary.vue:13`, `ProductDetailView.vue:35`)             |
| 6   | Ugly    | giá trị list dashboard             | `12350000` trong Recent orders, `0` trong Low stock                            | `RecentOrders`/`TopProducts`/`LowStockList` hiển thị `{{ item.value }}` thô: không định dạng, không `tabular-nums`, tồn 0 hiện `0` thay vì "Hết"     | Formatter + nhãn trạng thái (`features/dashboard/components/*`)                                                           |
| 7   | Ugly    | `order.items` rỗng                 | `[]`                                                                           | Bảng chỉ còn header, không có empty state                                                                                                           | `EmptyState` khi rỗng (`OrderItems.vue`)                                                                                  |
| 8   | Ugly    | địa chỉ dài                        | `Tầng 12, Toà nhà Bitexco, 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh` | Xuống dòng được, nhưng 3 card trong `md:grid-cols-3` cao lệch nhau                                                                                  | Chấp nhận được. Archetype Detail mới đưa phần này sang sidebar                                                            |
| 9   | Fragile | `product.name`, `customer.name`    | —                                                                              | Không thấy giới hạn độ dài trong schema FE (chỉ có `pageSize`). Coi như không giới hạn                                                               | Lấy `maxLength` từ Swagger khi chạy `gen:api`, khớp ở form                                                                |
| 10  | Fragile | `meta.total`                       | `1`                                                                            | `vi` đúng ("1 kết quả"), nhưng chuỗi `en` ghép số + "results" cố định nên sẽ ra "1 results"                                                          | Dùng plural của i18n (`DataTablePagination.vue`)                                                                          |

## Phần 2 — Cần bạn quyết

- **Tên sản phẩm trong bảng: cắt hay xuống dòng?** Mình đề xuất cắt còn 1 dòng, kèm `title`, và hiện đầy đủ ở trang Detail. Lý do: bảng compact cần giữ chiều cao dòng đều.
- **Email trong Detail: cắt ở giữa hay xuống dòng?** Mình đề xuất cho xuống dòng (`break-all`), vì người dùng cần đọc được đủ email.
- **Formatter tiền và ngày dùng chung đặt ở đâu?** Mình đề xuất `shared/lib/format/` và ghi luật vào `DESIGN.md`: "mọi tiền/ngày đi qua formatter dùng chung".

## Phần 3 — Những gì đã ổn

- `id` trong URL đều qua `encodeURIComponent`.
- `pageSize` bị giới hạn tối đa 100 nên không có lỗi hiệu năng với 1.000 dòng.
- Badge trạng thái luôn có chữ.
- `DataTable` có error state và nút thử lại. Bảng sản phẩm có empty text.
- Sidebar dùng `min-w-0` cho cột nội dung nên trang không bị cuộn ngang, chỉ bảng cuộn.

**Không có toggle**, vì bạn yêu cầu chỉ báo cáo. Ở Phase 3–4 có thể thêm `?data=worst` dùng fixture của prototype.
