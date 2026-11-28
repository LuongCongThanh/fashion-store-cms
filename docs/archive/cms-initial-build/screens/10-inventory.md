# P10 — Inventory

> Hồ sơ lịch sử màn hình; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: on-hold
Blocked by: 08
Nguồn: §4.7 trong [danh mục page & component](../catalog/README.md) · Phase: P9 · Spec tổng: [Phạm vi giai đoạn](../screens.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../screens.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Theo dõi tồn kho, điều chỉnh và lịch sử biến động.

### Phạm vi (Làm gì)

- Routes `inventory`, `inventory/movements` (`inventory:read`).
- Cột inventory: Variant/SKU · Current · Reserved · Available · Stock status.
- Cột movement: SKU · Type · Quantity · Reason · Reference · Created at/by.
- Components: `InventoryTable`, `InventoryFilters`, `StockStatusBadge`, `StockAdjustDialog` (`inventory:write`), `StockMovementTable`, `StockMovementFilters` (dùng `FilterDateRange`).

### Tiêu chí hoàn thành

- Adjust bắt buộc có reason, cập nhật list sau khi lưu.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng xem tồn kho, điều chỉnh có reason và kiểm tra lịch sử movement pass.

### Phụ thuộc

- Blocked by: 08

### Ngoài phạm vi

- Nhập kho từ nhà cung cấp.
- Những việc của các plan con khác trong [spec tổng](../screens.md#danh-sách-plan-con).

### Trạng thái 2026-11-09

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

| Hạng mục                                        | Tình trạng                    |
| ----------------------------------------------- | ----------------------------- |
| UI component và logic thuần                     | Đã làm, giữ nguyên            |
| Lớp dữ liệu tạm (API/model/HTTP giả trong test) | Có, giữ nguyên đến khi có API |
| Việc chờ API / BE                               | 4 mục                         |
| Vấn đề review cần sửa (không cần API)           | 4 mục                         |

Chi tiết: [Kết quả và review](#review-2026-11-09--đã-làm-và-chưa-làm). Việc còn lại: [Kế hoạch thực hiện](#tiếp-tục-khi-có-api).

### Kế hoạch thực hiện

#### Làm gì

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** `features/inventory/**`.

**Kiểm tra:**

#### Tiếp tục khi có API

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] **Ưu tiên cao:** form điều chỉnh không chặn tồn âm (vd. −100 khi tồn 5).
- [ ] **Ưu tiên cao:** ô 'Số lượng' không rõ là mức thay đổi hay tồn mới; dialog không hiện tồn hiện tại.
- [ ] `quantity = 0` báo 'Không được để trống'; 'SKU' hard-code; cột Variant thiếu tên; cột Type hiện enum thô.
- [ ] Key i18n `in-stock`, `low-stock`, `out-of-stock` chưa camelCase; sort `-createdAt` không có field tương ứng.

**Chờ API / BE:**

- [ ] 'Cập nhật list sau khi lưu' cần API thật.
- [ ] BE chặn tồn âm, idempotency/kiểm tồn hiện tại khi điều chỉnh.
- [ ] Lỗi 422 từ mutation đang bị nuốt (`catch {}`), người dùng không thấy gì — xử lý theo §O.4 khi có API.
- [ ] E2E tồn kho và lịch sử movement.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [Đặc tả và kế hoạch](#đặc-tả-và-kế-hoạch).

## Kết quả và review

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-10-inventory`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/33
Base hiện tại: `feat/cms-09-customers`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

### Đã làm

Tồn kho theo Variant/SKU, điều chỉnh bắt buộc lý do và lịch sử movement.

### Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 199 tests / 39 files PASS; +2 so với base PR |
| Coverage dòng                              | 85.25% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 83.02% / 81.26% / 73.97%                     |
| Production build                           | PASS                                         |
| Prettier format check                      | PASS                                         |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics/screens.md).

### Hành vi đã kiểm qua seam được duyệt

- `src/features/inventory/views/InventoryListView.spec.ts` — requires a reason before adjusting a variant and refreshes stock after saving (**passed**)
- `src/features/inventory/views/StockMovementListView.spec.ts` — loads auditable movements with date and type filters (**passed**)

### Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 670.57 kB. Đây không phải kích thước tải ban đầu của riêng feature.

### Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

### Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

### Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #33.

#### Đã làm (giữ nguyên)

- `InventoryTable`, `InventoryFilters`, `StockStatusBadge`, `StockAdjustDialog` (bắt buộc reason), `StockMovementTable`, `StockMovementFilters`.

#### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api/Inventory.api.ts` (query list, movement, mutation điều chỉnh), `types/Inventory.types.ts`.
- 2 test view dùng HTTP giả.

#### Chưa làm — chờ API / BE

- 'Cập nhật list sau khi lưu' cần API thật.
- BE chặn tồn âm, idempotency/kiểm tồn hiện tại khi điều chỉnh.
- Lỗi 422 từ mutation đang bị nuốt (`catch {}`), người dùng không thấy gì — xử lý theo §O.4 khi có API.
- E2E tồn kho và lịch sử movement.

#### Chưa làm — vấn đề review cần sửa (không cần API)

- **Ưu tiên cao:** form điều chỉnh không chặn tồn âm (vd. −100 khi tồn 5).
- **Ưu tiên cao:** ô 'Số lượng' không rõ là mức thay đổi hay tồn mới; dialog không hiện tồn hiện tại.
- `quantity = 0` báo 'Không được để trống'; 'SKU' hard-code; cột Variant thiếu tên; cột Type hiện enum thô.
- Key i18n `in-stock`, `low-stock`, `out-of-stock` chưa camelCase; sort `-createdAt` không có field tương ứng.
