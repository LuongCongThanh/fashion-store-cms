# Nguyên tắc và cây tổng thể

> Thiết kế đã duyệt ngày 26/11/2026; chưa triển khai source. ADR là nguồn quyết định, tracker sở hữu delivery.

## Nguyên tắc chia file

Một file có một nhiệm vụ chính và một lý do thay đổi rõ. Có thể chứa các hàm/type liên quan trực tiếp đến cùng nhiệm vụ; không bắt mỗi hàm/type thành một file. Component nhỏ vẫn được giữ local state; chỉ tách khi có trách nhiệm khác, logic đủ lớn hoặc consumer dùng lại thật.

- View ghép màn hình và nối các thành phần; không tự gọi HTTP/map DTO.
- Component nhận props, phát emits và quản lý UI local; component dùng lại không phụ thuộc API/router/store nghiệp vụ.
- Composable `useX` quản lý state và tương tác Vue của chức năng.
- Query quản lý server state, query keys, loading/refetch/invalidation; không chứa form/toast/điều hướng màn hình.
- Endpoint gọi Backend, chuẩn bị request và chuyển response; không import module nghiệp vụ hoặc Vue Query.
- Mapper chỉ tách khi chuyển đổi dữ liệu đủ ý nghĩa/phức tạp; không tạo để copy field 1:1.
- Schema form kiểm input chức năng; schema API kiểm dữ liệu ở boundary khi có nhu cầu runtime validation. Generated types không thay runtime validation.
- Service xử lý quy trình nhiều bước khi cần độc lập Vue; không thêm lớp chỉ chuyển tiếp một endpoint. Helper thuần có thể mang tên hành động trực tiếp.
- Types đi theo owner; type/props một file dùng đặt cạnh consumer. Không nhân bản contract chỉ để đủ tầng.
- Test cạnh source kiểm hành vi, không chỉ kiểm tên file, export hoặc suffix.

Đây là cách làm clean code của CMS: trách nhiệm rõ, dependency có hướng, ít state trùng, tên cụ thể và kiểm thử hành vi. Cây folder tự nó không chứng minh chất lượng code.

## Cây tổng thể

```text
cms/
├── src/
│   ├── app/
│   │   ├── runtime.ts                  # Tạo/nối runtime chung production và test
│   │   ├── config/
│   │   │   ├── env.config.ts           # Kiểm cấu hình môi trường
│   │   │   └── ui.config.ts            # Mặc định Nuxt UI
│   │   ├── providers/                  # Cài plugin và xử lý lỗi global
│   │   ├── router/
│   │   │   ├── router.ts               # Tạo router
│   │   │   ├── routes.ts               # Ghép route nghiệp vụ/layout/fallback
│   │   │   └── guards.ts               # Kiểm đăng nhập và quyền truy cập
│   │   └── views/
│   │       ├── NotFoundView.vue
│   │       └── ForbiddenView.vue
│   ├── layouts/
│   │   ├── DashboardLayout.vue
│   │   ├── AuthLayout.vue
│   │   └── components/                 # Header/sidebar/navigation của layout
│   ├── modules/
│   │   ├── products/                   # Chi tiết ở cây bên dưới
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── inventory/
│   │   ├── vouchers/
│   │   ├── customers/
│   │   ├── accounts/
│   │   ├── roles/
│   │   ├── auth/
│   │   ├── settings/
│   │   ├── dashboard/
│   │   ├── sizes/
│   │   └── colors/
│   ├── integrations/
│   │   └── backend/
│   │       ├── client/                 # HTTP, headers, refresh seam
│   │       ├── session/                # Token, refresh, kết thúc phiên (Q17)
│   │       ├── endpoints/              # Request/response theo API Backend
│   │       ├── generated/              # Output generator, không sửa tay
│   │       ├── schemas/                # Kiểm dữ liệu API khi cần
│   │       ├── mappers/                # Đề xuất, chỉ tách khi mapping cần file riêng
│   │       └── errors/                 # Đề xuất, kiểu lỗi và phân loại lỗi Backend
│   ├── shared/
│   │   ├── components/                 # UI không biết nghiệp vụ
│   │   ├── composables/                # Xử lý trạng thái/tương tác Vue dùng chung
│   │   ├── form/                       # Gắn lỗi API vào form và helper form
│   │   └── formatting/                 # Tiền, ngày, số theo locale
│   ├── i18n/                           # Cấu hình và bản dịch giao diện
│   ├── styles/                         # CSS, token giao diện
│   ├── assets/                         # Tài nguyên app
│   ├── pwa/                            # Đăng ký/cập nhật và trạng thái offline
│   ├── testing/                        # Setup/render/factory dùng chung
│   ├── App.vue
│   └── main.ts
├── e2e/                                # Hành trình toàn ứng dụng
└── docs/
```

Chỉ tạo folder khi có source thật; các module chưa có contract không tự được phép triển khai. Session/store token thuộc integrations/backend/session; thông tin tài khoản/quyền thuộc modules/auth. QueryClient factory và global error wiring thuộc app/providers; giữ một owner và test seam hiện tại. Tên/path output generated phải được map cùng generator và CI trước khi đổi, không sửa generated symbols để ép naming.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
