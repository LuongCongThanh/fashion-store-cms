# P14 — Đối chiếu và chốt

> Hồ sơ lịch sử màn hình; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: on-hold
Blocked by: 01–13
Nguồn: §6 trong [danh mục page & component](../catalog/README.md) · Phase: — · Spec tổng: [Phạm vi giai đoạn](../screens.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../screens.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Mọi page/component trong danh mục đã có hoặc có lý do bỏ; tài liệu khớp code.

### Phạm vi (Làm gì)

- Đối chiếu từng mục trong file nguồn với code; ghi lệch vào report.
- Chạy `knip` bỏ code thừa; `npm run analyze` ghi bundle size.
- Cập nhật `FE_architecture.md`, `CONVENTIONS.md`, `GLOSSARY.md`, `navigation-flow.md` nếu lệch.
- Điền đủ `metrics.md`; chuyển folder sang `docs/archive/`.

### Tiêu chí hoàn thành

- Definition of Done (FE_architecture §31) đạt cho từng feature.
- `test:e2e` pass toàn bộ.

### Phụ thuộc

- Blocked by: 01–13

### Ngoài phạm vi

- Backlog §5.
- Những việc của các plan con khác trong [spec tổng](../screens.md#danh-sách-plan-con).

### Trạng thái 2026-11-09

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

| Hạng mục                                        | Tình trạng                    |
| ----------------------------------------------- | ----------------------------- |
| UI component và logic thuần                     | Đã làm, giữ nguyên            |
| Lớp dữ liệu tạm (API/model/HTTP giả trong test) | Có, giữ nguyên đến khi có API |
| Việc chờ API / BE                               | 2 mục                         |
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

**Output:** Tài liệu cập nhật, metrics đầy đủ.

**Kiểm tra:**

#### Tiếp tục khi có API

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] PR gắn type `docs` nhưng có test và script — nên tách hoặc đổi type.
- [ ] `CodexUsage.ts` đọc mọi `*.jsonl` cùng thư mục session, `JSON.parse` không có guard, so sánh timestamp dạng chuỗi (`--since` có offset sẽ sai).
- [ ] `code-review.md` ghi 'không phát hiện scope creep' và thiếu bug của settings — xem kết quả review trong report từng plan.
- [ ] CONVENTIONS ghi model nằm trong `features/*/types` nhưng settings không có `types/`; `@vee-validate/zod` còn được liệt kê ở FE_architecture §2 và CONVENTIONS K.2 dù chưa cài.

**Chờ API / BE:**

- [ ] `test:e2e` toàn bộ; Definition of Done §31 cho từng feature.
- [ ] Chuyển folder sang `docs/archive/` sau khi chuỗi PR được duyệt.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [Đặc tả và kế hoạch](#đặc-tả-và-kế-hoạch).

## Kết quả và review

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-14-reconcile-finalize`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/37
Base hiện tại: `feat/cms-13-settings`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

### Đã làm

Đối chiếu toàn bộ, tài liệu, metrics, token usage và báo cáo review/tích hợp.

### Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                       |
| ------------------------------------------ | --------------------------------------------- |
| Typecheck                                  | PASS                                          |
| Lint                                       | PASS                                          |
| Vitest                                     | 221 tests / 52 files PASS; +10 so với base PR |
| Coverage dòng                              | 85.67% (toàn nhánh tại checkpoint)            |
| Coverage statements / branches / functions | 83.54% / 81.04% / 74.35%                      |
| Production build                           | PASS                                          |
| Prettier format check                      | PASS                                          |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách        |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận     |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics/screens.md).

### Hành vi đã kiểm qua seam được duyệt

- `src/app/views/CmsRouting.spec.ts` — blocks write route /products/new for a user with only product:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /categories/new for a user with only category:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /promotions/new for a user with only promotion:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /users/new for a user with only user:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /roles/new for a user with only role:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /settings/store for a user with only settings:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /settings/localization for a user with only settings:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — redirects settings to the Store editor for an authorized user (**passed**)
- `src/app/views/CmsRouting.spec.ts` — shows the product ancestor in breadcrumbs for a create route (**passed**)
- `src/app/views/CmsRouting.spec.ts` — keeps an unsaved product form open when the user cancels leaving (**passed**)

### Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 692.01 kB. Đây không phải kích thước tải ban đầu của riêng feature.

### Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

### Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

### Kiểm toán cuối

- Knip và analyze: PASS. Các chart và Tiptap nằm trong chunk tải động; số đo bundle ở validation-metrics.json.
- Đã đối chiếu danh mục, cập nhật FE_architecture, CONVENTIONS, GLOSSARY, navigation flow, report của 14 plan và chuỗi PR.
- Token task tại snapshot `2026-11-09T00:29:01.527Z`: **45,363,631**, trong đó cached input là 44,854,144 (đã nằm trong input).
- Không có số token triển khai độc lập từng plan hoặc hóa đơn USD; không ước lượng thay dữ liệu thật.
- Backend chưa có, E2E hoãn, PR chưa merge: giữ in-progress và chưa archive.

### Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #37.

#### Đã làm (giữ nguyên)

- `src/app/views/CmsRouting.spec.ts` (7 case chặn route ghi, redirect, breadcrumb, unsaved form).
- Đối chiếu tài liệu: `reconciliation.md`, `code-review.md`, `api-contracts.md`, bổ sung GLOSSARY; script `metrics:tokens` (`scripts/CodexUsage.ts`).
- Ghi trạng thái on-hold và kết quả review ngày 2026-11-09 vào spec/plan/report của 14 plan và `metrics.md`.

#### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api-contracts.md` mô tả contract tạm; thay bằng Swagger khi có API.

#### Chưa làm — chờ API / BE

- `test:e2e` toàn bộ; Definition of Done §31 cho từng feature.
- Chuyển folder sang `docs/archive/` sau khi chuỗi PR được duyệt.

#### Chưa làm — vấn đề review cần sửa (không cần API)

- PR gắn type `docs` nhưng có test và script — nên tách hoặc đổi type.
- `CodexUsage.ts` đọc mọi `*.jsonl` cùng thư mục session, `JSON.parse` không có guard, so sánh timestamp dạng chuỗi (`--since` có offset sẽ sai).
- `code-review.md` ghi 'không phát hiện scope creep' và thiếu bug của settings — xem kết quả review trong report từng plan.
- CONVENTIONS ghi model nằm trong `features/*/types` nhưng settings không có `types/`; `@vee-validate/zod` còn được liệt kê ở FE_architecture §2 và CONVENTIONS K.2 dù chưa cài.
