# Chốt thao tác quản trị và sắp xếp category

Part of: [Hoàn thiện category xuyên suốt BE, CMS và store](../map.md)
Type: grilling
Labels: wayfinder:grilling
Status: open
Assignee:
Blocked by: 01, 02

## Question

CMS cần giữ nhập sortOrder và kéo đổi cha hay bổ sung kéo reorder giữa siblings? Thao tác với nhánh ẩn, chuyển cha, xóa bị 409 và STAFF chỉ đọc cần phản hồi nào?

Hiện CategoryTree emit move(id,parentId), không persist thứ tự kéo. Chốt kỳ vọng atomicity và xử lý stale data nếu bổ sung reorder; giữ chặn cycle ở BE dù CMS có guard. Chốt việc cache CMS/store được cập nhật hoặc revalidate sau mutation theo hành vi mong muốn, không hứa đồng bộ tức thời khi chưa có cơ chế.

## Dependencies

- [Chốt mô hình category và phạm vi bản hoàn thiện](01-taxonomy-scope.md)
- [Chốt trải nghiệm category trên store và nội dung CMS](02-store-content-scope.md)

## Implementation handoff

2026-11-19 — Người dùng chọn “Đồng ý đề xuất”: tiếp tục nhập sortOrder và kéo đổi cha, chưa thêm batch reorder. BE giữ quyền hiện tại, chặn cycle và RESTRICT; bổ sung serialization cho move đồng thời. CMS/store cache và phản hồi UI cần nghiệm thu trong phần consumer; phiên này chỉ implement BE.
