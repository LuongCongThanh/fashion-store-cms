# Ranh giới Backend ở integrations, query ở module, endpoint kiểm kiểu theo API Contract

Status: accepted — Q10/Q11/Q18 duyệt ngày 26/11/2026. Chưa triển khai source. Tách ra từ [ADR 0001](0001-domain-workflows-and-vue-naming.md).

`integrations/backend` sở hữu transport, endpoints, Generated API (`integrations/backend/generated`) và mapping dữ liệu API. `queries` trong module sở hữu Vue Query/cache/refetch/invalidation. Schema form thuộc chức năng. Type đi theo owner, không khai báo trùng DTO chỉ để đủ tầng.

Module chỉ dùng public entry được ghi nhận và lint; không import private internals hoặc tạo barrel toàn module.

Endpoint kiểm kiểu method/path/params/body/response theo Generated API của Contract Version đã pin, giữ Axios/session hiện có; cách nối typing được chứng minh ở issue 06 trước pilot products. Cast DTO không thay kiểm dữ liệu lúc chạy. Chức năng chưa có API Contract theo dõi riêng, không đoán API.

## Các phương án đã cân nhắc

- **Giữ `features/<x>/api/*.api.ts` gộp request, mapping và Vue Query**: ít file, nhưng một file đổi vì cả contract lẫn chiến lược cache.
- **Model độc lập bắt buộc cho mọi DTO (CONVENTIONS §T.3)**: cách ly hoàn toàn Backend, nhưng sinh type trùng khi DTO khớp model.
- **Runtime schema (Zod) cho mọi response**: kiểm dữ liệu lúc chạy đầy đủ, nhưng tốn công khi contract đã sinh kiểu và Backend nằm trong cùng workspace.
- **Integration sở hữu request/mapping, module sở hữu query, typing theo Generated API (chọn)**: contract đổi chỉ chạm integration; cache đổi chỉ chạm module.

## Hệ quả

- Thay thế policy model độc lập bắt buộc của CONVENTIONS §T.3 và whitelist §B.3 cho source đã chuyển (bảng thay thế ở ADR 0001).
- `integrations/backend/schemas` **không tạo sẵn**: chỉ thêm khi một response cần kiểm lúc chạy có lý do cụ thể (ví dụ dữ liệu ngoài contract). Chỉ có một Backend nhưng giữ tên `integrations/backend` để tách khỏi request external như storage upload.
- Coverage typing đo bằng [checklist operation](../plan/tasks/todo/cms-architecture-design/api-contract-checklist.md); Generated API diff chỉ chứng minh contract đồng bộ, không chứng minh caller typing.
- `scripts/contract-bump.sh`, generator và CI phải đổi đường dẫn Generated API cùng issue 03; không bump Contract Version khi chỉ di chuyển file.
- GLOSSARY cập nhật vị trí của Generated API khi issue 03 chuyển source.
