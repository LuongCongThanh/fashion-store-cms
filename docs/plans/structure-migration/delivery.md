# Gate, Session, API typing và delivery

> Thiết kế đã duyệt ngày 26/11/2026; chưa triển khai source. ADR là nguồn quyết định, tracker sở hữu delivery.

## Kiểm soát chất lượng và lộ trình đã duyệt

1. Inventory file/import/consumer/test/config và hành vi trước khi di chuyển.
2. Cập nhật naming, alias, DTO/public boundary và glob cho workflow lồng; test cả import được phép và bị cấm.
3. Pilot một chức năng products cùng direct consumers; mỗi phần phải build và kiểm được.
4. Chạy lint/typecheck/test/build và E2E đúng flow bị ảnh hưởng; giữ URL, UI, contract, session và form behavior.
5. Mở rộng theo dependency/contract readiness, dọn path cũ và đồng bộ owner docs khi hoàn tất từng phần.

CONVENTIONS và FE_architecture là mục lục; các guide/chương được link từ đó mô tả source hiện hành cho tới migration. Không tắt gate để che import lỗi. Không gộp redesign UI, thay API Contract hoặc feature mới vào rename thiếu scope riêng. Chưa commit/push/PR hay chạy gate application trong phiên thiết kế này.

## Session và kiểm kiểu API đã chốt Q17–Q18

```text
integrations/backend/
├── session/
│   ├── session.ts                     # Token lifecycle, refresh, kết thúc phiên
│   └── session.store.ts               # Token trong bộ nhớ, không Web Storage
├── client/httpClient.ts
├── endpoints/products.api.ts
├── generated/                         # Contract Version đã pin
└── schemas/                           # Chỉ tạo khi có response cần kiểm lúc chạy (ADR 0003)

modules/auth/
├── composables/useAuth.ts             # Login/logout, tài khoản/quyền public
└── stores/auth.store.ts               # Thông tin người đăng nhập và quyền
```

Runtime nối session/HTTP/router/query cache; auth điều phối logout qua session để xoá token/cache và thu hồi phiên theo behavior hiện có. Giữ refresh single-flight, phân biệt 401 với lỗi mạng/5xx và cache isolation trong test.

Endpoint phải kiểm kiểu method/path/path params/query/body/response từ generated API Contract. Giữ Axios và lifecycle hiện tại; xác minh cách nối kiểu ở issue 06 (proof `POST /auth/login`, trước pilot products) bằng request hợp lệ và ca compile-time sai tương ứng, không chỉ đổi HasPaths rồi tuyên bố đã type-safe. Tách việc củng cố typing khỏi rename nếu cần để review và rollback rõ. Schema runtime chỉ thêm tại boundary có nhu cầu; cast as DTO không kiểm JSON. Không đoán endpoint hoặc DTO cho chức năng chưa có contract.

## Coverage kiểm kiểu API trong delivery

[Checklist operation](../tasks/todo/cms-architecture-design/api-contract-checklist.md) liệt kê mọi call site (67 dòng tại 4f44bb7, kể cả refresh tại runtime và upload storage). Thứ tự proof → retrofit → slice → reconcile 100% và các gate từng slice được định nghĩa một lần ở [gate chung cho slice](../tasks/todo/cms-architecture-design/spec.md#gate-chung-cho-slice); tài liệu này không lặp lại.

## Phạm vi còn lại trước triển khai

- Q19 đã được xác nhận; thiết kế được duyệt. Chưa triển khai source. [Spec delivery](../tasks/todo/cms-architecture-design/spec.md), [inventory ban đầu](../tasks/todo/cms-architecture-design/inventory.md) và các issue riêng sở hữu công việc triển khai.
- Inventory/spec delivery phải chốt mapping tất cả file/consumer, public symbols/import allowlist, generator output paths và thứ tự slice dựa trên checkout mới nhất. Đây là việc khảo sát triển khai, không phải yêu cầu người dùng tự tìm facts.
- Module tương lai như Đổi trả/Hoàn tiền/audit/compliance được theo dõi qua business và API Contract readiness trong tracker; không tạo folder rỗng hoặc coi research là quyền mở tính năng mới. Ranh giới chi tiết sẽ được thiết kế khi có scope/contract cụ thể.

Tham khảo [nghiên cứu Vue](../../research/cms-architecture/README.md), [nghiên cứu ban đầu](../../archive/architecture-research/README.md), [business](../../../../be-demo/docs/business/04-business-rules.md). Không ghi các quyết định thư mục kỹ thuật vào glossary nghiệp vụ.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
