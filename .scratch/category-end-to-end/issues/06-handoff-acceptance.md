# Chốt tiêu chí nghiệm thu và lộ trình bàn giao ba repo

Part of: [Hoàn thiện category xuyên suốt BE, CMS và store](../map.md)
Type: grilling
Labels: wayfinder:grilling
Status: open
Assignee:
Blocked by: 03, 04, 05, 07

## Question

Những kịch bản nào chứng minh luồng category hoạt động xuyên BE/CMS/store và triển khai theo thứ tự nào để không làm hỏng consumer hiện có?

Chốt ma trận create root/child, rename, move, sort, hide parent, blocked delete, empty leaf delete, staff forbidden, parent-filter descendants, breadcrumb và URL cũ theo quyết định slug; thêm desktop/mobile và vi/en theo phạm vi đã chốt. Đối chiếu test hiện có trước khi đề xuất bổ sung. Đầu ra: tiêu chí đo được, seams cần test (API/UI/E2E), thay đổi contract/generated clients nếu có và delivery specs theo tracker riêng từng repo. Không coi static audit là nghiệm thu runtime.

## Dependencies

- [Chốt vòng đời slug và URL category](03-slug-lifecycle.md)
- [Chốt hợp đồng hiển thị category và lọc sản phẩm](04-visibility-product-contract.md)
- [Chốt thao tác quản trị và sắp xếp category](05-cms-management.md)

- [Chốt vận hành tự dịch tên category](07-translation-lifecycle.md)

## Implementation handoff

2026-11-19 — Người dùng yêu cầu hoàn plan và implement BE. Đã tạo [Hoàn thiện hợp đồng category cho CMS và store](../../../../be-demo/docs/plan/tasks/21-category-content/spec.md), plan/guide/report cùng thư mục. BE phát hành contract additive trước; CMS và store cần regenerate client và tích hợp locale/media/trạng thái dịch sau đó. Test HTTP BE không được xem là nghiệm thu UI xuyên ba repo.
