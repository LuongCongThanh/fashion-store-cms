# Migration cấu trúc CMS theo trách nhiệm

Status: design-approved — Q19 được người dùng xác nhận ngày 26/11/2026; source implementation chưa bắt đầu.

## Nguồn quyết định

- [Thiết kế đích](../../../structure-migration/README.md)
- [ADR](../../../../adr/0001-domain-workflows-and-vue-naming.md)
- [Nhật ký Q1–Q19](map.md)
- [Inventory tĩnh ban đầu](inventory.md)

## Phạm vi

Tổ chức lại toàn repo Vue/Vite theo nghiệp vụ/workflow và trách nhiệm file; naming, API integration/query, state/runtime/session, shared/layout/i18n/config/testing. Giữ UI/URL/API behavior; nguồn chưa được migrate. Không mở tính năng mới, thay stack, thay API Contract hoặc bật module pending để phục vụ rename.

## Delivery

Một issue Markdown cho mỗi slice tại issues/. Issue 01 hoàn thiện mapping/baseline; các issue sau phải kiểm readiness lại trên source mới nhất. Dependency ghi theo số issue, không tự chạy mọi issue vì thiết kế đã duyệt. Chuỗi hiện tại ưu tiên tuần tự để kiểm mẫu. Q15 ghi thứ tự "inventory → naming/boundary → pilot products"; các issue 03–06 nằm trước pilot vì products phụ thuộc trực tiếp vào HTTP/generated (03), shared/i18n/testing (04), runtime/session (05) và cách nối typing (06). Pilot 07 kiểm mẫu cấu trúc module trên nền đó, nên vẫn là slice nghiệp vụ đầu tiên; issue 01 có thể chia nhỏ một slice hoặc cập nhật thứ tự theo dependency thực tế, bảo toàn quyết định thiết kế.

Source cũ/new có thể coexist tạm với allowlist/rule giới hạn; mỗi slice sửa đủ consumers để build/test. Chốt public symbols cụ thể bằng inventory, không cho phép mọi export. Giữ Generated API ở cùng Contract Version khi move file; generator/CI/imports cập nhật cùng thay đổi.

## Coverage typed API bắt buộc

[Checklist operation](api-contract-checklist.md) là bằng chứng coverage. Bảng đã liệt kê 67 call site tại 4f44bb7 (55 operation Backend có trong contract đã pin, 10 call site không có path, 1 request external); issue 01 xác nhận lại trên source mới nhất và bổ sung evidence gating; issue 05 bàn giao legacy auth/session; issue 06 proof rồi retrofit mọi auth/session operation đã phát hành, kể cả refresh trong runtime. Mỗi issue 07–14 phải typed mọi operation đã phát hành thuộc scope. Issue 15 đối chiếu source ngược checklist và yêu cầu 100% operation đã phát hành/còn dùng đạt typed, không còn unverified/legacy-untyped. Pending phải có gating/ticket, external không tính như Backend typed. Generated diff chỉ kiểm đồng bộ contract, không chứng minh caller typing.

## Gate chung cho slice

Mỗi issue 07–14 phải đạt đủ bốn mục dưới; issue 03–06 áp dụng mục 2–3 cho phần đã chuyển.

1. **Coverage API.** Mọi dòng có cột Slice trùng số issue trong checklist đạt `typed`, hoặc `blocked-no-contract`/`external`/`removed` có evidence. Evidence phủ method/path/path params/query/body/success response; cast hoặc annotation DTO đơn thuần không đủ.
2. **Owner docs/rules đồng bộ (Q10).** Phần source đã chuyển trong slice phải được cập nhật cùng lúc trong `docs/guides/README.md`, `docs/architecture/README.md`, `GLOSSARY.md` (vị trí kỹ thuật của thuật ngữ), ESLint boundary glob và test. Không dồn việc đồng bộ docs tới issue 15; issue 15 chỉ rà phần sót.
3. **Public entry (Q11).** Module/integration đã chuyển có public entry được ghi trong docs và được lint chặn import private; danh sách symbol lấy từ inventory public symbols của issue 01.
4. **Draft dirty (Q12).** Với màn hình có form: refetch/invalidation không ghi đè draft đang dirty, có test chứng minh. Màn hình không có form ghi rõ "không áp dụng".

## Trạng thái kiểm chứng

Phiên này chỉ viết docs và khảo sát tĩnh. Chưa chạy lint/typecheck/application tests/build/E2E hoặc xác nhận remote CI. CMS local dev tại aa5fa92, behind remote-tracking 3; trước implementation phải kiểm checkout/worktree/dirty files và cập nhật inventory. Không tự pull hoặc ghi đè sửa đổi khác. Khi chuẩn bị PR ngày 26/11/2026 đã fetch và tạo task branch từ origin/dev tại 4f44bb7; đã ghi bổ sung contract-bump workflow/script vào inventory và issue 03. Đối chiếu aa5fa92 với 4f44bb7: `src/` không đổi, thay đổi config đã ghi trong inventory. Issue 01 vẫn refresh trước source implementation; kết quả kiểm tra phục vụ PR được ghi tại PR Evidence, không suy ra toàn bộ migration đã được kiểm chứng.

## Tiêu chí kết thúc

Source khớp cây đã duyệt; owner docs/rules/config đồng bộ; không path compatibility/private import/cycle còn sót; gates ứng với thay đổi được chạy và báo thật; chưa có API thì vẫn giữ gating/nhu cầu riêng. Không tuyên bố migration hoàn tất chỉ vì có tài liệu hoặc inventory.
