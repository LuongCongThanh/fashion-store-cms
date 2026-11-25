# Chốt hợp đồng hiển thị category và lọc sản phẩm

Part of: [Hoàn thiện category xuyên suốt BE, CMS và store](../map.md)
Type: grilling
Labels: wayfinder:grilling
Status: open
Assignee:
Blocked by: 01, 02

## Question

Giữ quy tắc ẩn cha thì ẩn cả nhánh thế nào trên tree, URL trực tiếp, bộ lọc và sản phẩm trong nhánh? Lọc category cha lấy descendants; sản phẩm còn có thể xuất hiện ngoài nhánh ở search/all-products hay bị ẩn toàn cục?

BE hiện có tree visibility và findVisible; không suy ra category ẩn đồng nghĩa ẩn toàn bộ sản phẩm. Cần chốt semantics cho direct URL, category rỗng, chuyển category và dữ liệu cache cũ, sau đó xác định acceptance examples và đối chiếu product query thật.

## Dependencies

- [Chốt mô hình category và phạm vi bản hoàn thiện](01-taxonomy-scope.md)
- [Chốt trải nghiệm category trên store và nội dung CMS](02-store-content-scope.md)

## Implementation handoff

2026-11-19 — Người dùng chọn “Đồng ý đề xuất”: ẩn cha → URL cả nhánh trả 404, không lọc được nhánh đó; sản phẩm vẫn có thể hiện trong search/all-products. BE lọc category cha gồm descendants hiển thị, loại nhánh con ẩn; category rỗng trả trang sản phẩm rỗng. Đây là nội dung xác nhận và contract đã triển khai trong delivery spec BE; ticket giữ mở theo giới hạn một resolution mỗi phiên Wayfinder.
