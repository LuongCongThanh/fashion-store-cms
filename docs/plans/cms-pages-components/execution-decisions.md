# Quyết định thực hiện — 2026-11-09

- Người phụ trách yêu cầu 14 PR riêng. Việc triển khai ban đầu trên một nhánh là sai quy trình; đã sửa bằng 14 nhánh/PR nối tiếp trong worktree riêng, giữ nguyên workspace của người phụ trách.
- Người phụ trách đã chọn base PR sau là nhánh PR trước; khi đến lượt merge thì restack và đổi base về `dev`. Không tự merge.
- Ranh giới kiểm thử được xác nhận: View qua runtime/router/Pinia/Vue Query thật với HTTP giả, cộng logic thuần. E2E được hoãn.
- Người phụ trách xác nhận backend chưa tồn tại. Giữ `Api.generated.ts` placeholder và công khai hợp đồng tạm; không giả số liệu API integration.
- Token đo từ Codex session counters thật, gồm hai phiên review con. Không có phân bổ chính xác riêng từng plan cho phần làm chung; không bịa số hoặc chi phí USD.
- Mỗi report có kết quả kiểm trên nhánh riêng. `Status: in-progress` giữ nguyên khi PR còn draft/chưa merge; không archive folder như một nỗ lực đã đóng.

Các thay đổi cấu hình/format không thuộc task trong workspace ban đầu không được đưa vào các nhánh này.
