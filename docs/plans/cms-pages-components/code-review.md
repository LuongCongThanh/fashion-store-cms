# Review theo Standards và Spec

Base: `97875842ec6cd774a5c1439929a31842a3680746`. Dùng skill `code-review`, hai reviewer độc lập, không chỉnh file. Sau sửa đã được kiểm lại.

## Standards

- **Đã sửa:** upload chuyển sang presign → storage PUT → complete; có byte progress, hủy và retry. XHR riêng thay fetch được ghi rõ tại FE_architecture §17.1, không mang Session headers.
- **Đã sửa:** query key không lặp Store ID; Session vẫn sở hữu việc xoá cache khi đổi Store (§18).
- **Đã sửa/ghi quyết định:** Variants dùng useFieldArray; adapter @vee-validate/zod hiện yêu cầu Zod 3, còn repo dùng Zod 4 nên safeParse + vee-validate được ghi tại §19.
- **Heuristic:** các editor có chung hình dạng; phần hydration đã gom vào useHydrateForm, không tạo generic CRUD engine.

## Spec

- **Đã sửa:** lịch sử đơn khách hàng có phân trang theo URL, không dừng ở 20 đơn.
- **Đã sửa:** refetch nền không ghi đè draft dirty; đổi record trên cùng route cũng có xác nhận rồi hydrate entity mới.
- **Đã sửa:** parent choices loại cả subtree con và submit từ chối parent tạo vòng lặp.
- Không phát hiện scope creep đáng kể trong lượt review.

Kết quả reviewer kiểm lại: không còn finding đáng kể trong các bản sửa nêu trên. Backend/Swagger chưa có và E2E hoãn là giới hạn đã được người phụ trách xác nhận, không phải kiểm tra đã pass.
