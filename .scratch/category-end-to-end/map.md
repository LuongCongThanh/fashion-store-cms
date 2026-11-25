# Hoàn thiện category xuyên suốt BE, CMS và store

Labels: wayfinder:map

## Destination

Chốt đặc tả và lộ trình hoàn thiện luồng category BE → CMS quản trị → store điều hướng, hiển thị và lọc sản phẩm, tái sử dụng phần đã có. Đích đạt khi không còn quyết định chặn việc viết các delivery spec ở từng repo.

## Notes

- Người dùng xác nhận phạm vi hoàn thiện luồng hiện có ngày 2026-11-19.
- Phiên charting ban đầu chỉ lập kế hoạch. Ngày 2026-11-19 người dùng yêu cầu hoàn plan và implement BE; cho phép lập delivery spec, sửa BE và kiểm tra trong phạm vi category. CMS/store chỉ cập nhật tracker, không sửa ứng dụng.
- Canonical map đặt tại tracker Markdown CMS theo `docs/agents/issue-tracker.md`; ticket cross-repo giữ một bản tại đây. Chưa phải task giao cho delivery runner.
- Mỗi phiên tiếp theo đọc skill wayfinder, grilling và domain-modeling; đọc AGENTS.md của repo bị ảnh hưởng. Domain nghiệp vụ do BE sở hữu.
- Ticket chỉ có label Wayfinder; open + chưa claim + mọi blocker resolved tạo frontier. Đã resolve mô hình, phạm vi nội dung và slug; các xác nhận khác của phiên BE ghi trong ticket tương ứng, giữ mở theo quy tắc mỗi phiên một resolution.
- Trả lời của người dùng trong các câu hỏi đang mở phải được ghi nhận trước khi resolve; đề xuất trong ticket không phải quyết định.
- Hiện trạng tại thời điểm charting, chưa phải kết luận nghiệm thu: BE đã có CRUD/tree và visibility; CMS có CRUD/tree/move parent; store có tree, category page và breadcrumb. Không tạo lại các phần này nếu không tìm được gap.
- Bằng chứng: [BE nested categories](../../../be-demo/docs/plan/tasks/05-nested-categories/spec.md), [quy tắc xóa](../../../be-demo/docs/adr/0001-category-delete-restrict.md), [business rules](../../../be-demo/docs/business/04-business-rules.md), [domain glossary](../../../be-demo/GLOSSARY.md), [CMS tree](../../src/features/categories/components/CategoryTree.vue), [CMS schema](../../src/features/categories/schemas/Category.schema.ts), [store breadcrumb](../../../fe-ecommerce-nike-style/docs/plan/tasks/01-category-breadcrumb-trail/spec.md).
- Đường dẫn CMS source trong Notes được tính từ map; tất cả facts là static inspection, chưa kiểm tra runtime hay chạy test.
- Hướng bàn giao dự kiến sau khi chốt các ticket: BE contract/rules → CMS management → store integration → nghiệm thu xuyên suốt. Đây là thứ tự phối hợp, không phải delivery backlog đã được duyệt.

- Kết quả phiên BE: [spec/contract](../../../be-demo/docs/plan/tasks/21-category-content/spec.md), [report kiểm chứng](../../../be-demo/docs/plan/tasks/21-category-content/report.md). Chưa nghiệm thu UI xuyên ba repo.

## Decisions so far

- [Chốt mô hình category và phạm vi bản hoàn thiện](issues/01-taxonomy-scope.md): người dùng xác nhận giữ mô hình và quy tắc hiện tại.

- [Chốt trải nghiệm category trên store và nội dung CMS](issues/02-store-content-scope.md): gồm bản dịch tên category và hai ảnh tùy chọn trong bản hoàn thiện.

- [Chốt vòng đời slug và URL category](issues/03-slug-lifecycle.md): slug chung vi/en ổn định sau tạo, không đổi khi rename/move.

## Not yet specified

- Nghiệm thu consumer CMS/store: locale trên request/cache key, UI sửa bản Anh và trạng thái/retry, upload/chọn ảnh, fallback/crop ở các breakpoint. BE đã giữ hai ảnh tùy chọn, không áp tỉ lệ bắt buộc.
- Delivery CMS/store và rollout/cache invalidation cụ thể thuộc phiên tiếp theo. Hợp đồng, migration additive, thứ tự rollout và test BE đã ghi tại [Hoàn thiện hợp đồng category cho CMS và store](../../../be-demo/docs/plan/tasks/21-category-content/spec.md).

## Out of scope

- Deploy, tạo PR và thay ứng dụng CMS/store trong phiên BE này. Giới hạn charting ban đầu đã được người dùng mở rộng để triển khai BE.
- Viết lại toàn bộ catalog hoặc mở rộng nghiệp vụ ngoài category. Ảnh/banner và bản dịch tên category đã được xác nhận trong phạm vi; chi tiết ở ticket nội dung CMS/store.
