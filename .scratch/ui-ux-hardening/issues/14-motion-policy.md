# 14 — Phase 7: motion có chọn lọc

Status: done
Blocked by: 13

Mỗi đề xuất motion phải trả lời đủ 5 câu hỏi của plan §8 Phase 7. Dùng CSS/Vue transition trước, GSAP chỉ khi đã chứng minh cần.

Để `needs-triage` cho đến khi có đề xuất cụ thể.

## Triage 2026-11-10

Không thêm motion production mới trong effort này. Các proposal tiềm năng (animate
dashboard chart, stagger card/list, animate progress/order transition) đều bị loại:

1. **State/spatial relationship:** không có state change nào đang khó hiểu nếu thiếu
   animation; loading, dialog/slideover, selection và status đã có feedback rõ.
2. **CSS/Vue đủ không:** nếu sau này cần, transition CSS/Vue 150ms đã đủ; không có
   lý do dùng GSAP.
3. **Reduced motion:** mọi transition mới phải có `motion-reduce:transition-none`;
   gate hiện không cần thêm animation để kiểm.
4. **Chi phí:** lợi ích chưa chứng minh nên bundle/main-thread/maintenance dù nhỏ
   vẫn không đáng; giữ baseline hiện tại.
5. **Bulk workflow/feedback:** stagger/chart animation có thể trì hoãn khả năng quét
   và che dữ liệu vừa cập nhật, trái với operational clarity.

Hover color transition hiện có tiếp tục theo `DESIGN.md`; đây là feedback tức thời,
không phải motion trang trí.
