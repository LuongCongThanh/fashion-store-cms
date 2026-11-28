# Hướng dẫn phát triển CMS

Quy ước hiện hành được chia theo chủ đề bên dưới; không cần đọc toàn bộ để sửa một tính năng. Source chưa chuyển theo các guide này; source đã chuyển theo [ADR 0001–0003](../adr/0001-domain-workflows-and-vue-naming.md). Thiết kế được duyệt không đồng nghĩa source đã migrate. Các ký hiệu §A–§U trong tài liệu cũ được đối chiếu sang file chủ đề ở bảng cuối trang.

## Theo chủ đề

- [Quy chuẩn tài liệu](documentation.md)

- [Cấu trúc source và import alias](project-structure.md)
- [Quy tắc đặt tên](naming.md)
- [Ranh giới module và ESLint](module-boundaries.md)
- [Tổ chức một feature](feature-structure.md)
- [Git, commit và pull request](git-workflow.md)
- [Toolchain và dependency](tooling.md)
- [Ngôn ngữ giao diện](localization.md)
- [Kiểm thử và runtime dùng chung](testing.md)
- [Chiến lược kiểm thử](testing-strategy.md) và [traceability](testing-traceability.md)
- [UI, token và theme](ui-components.md)
- [HTTP client và Session](http-session.md)
- [Lỗi API, dialog và toast](api-errors.md)
- [PWA và chặn index](pwa.md)
- [Navigation và tiện ích vận hành](app-capabilities.md)
- [Luồng dữ liệu và trách nhiệm code](data-flow.md)

- [Trạng thái tài liệu và tích hợp](../architecture/README.md)

Mỗi chủ đề có một nơi giữ nội dung chuẩn. Khi sửa policy, cập nhật file chủ đề và source/config thực thi trong cùng thay đổi.

## Tra tham chiếu cũ

| Mục cũ          | Nơi giữ nội dung hiện hành                                    |
| --------------- | ------------------------------------------------------------- |
| §A, §N          | [Cấu trúc và alias](project-structure.md)                     |
| §B.1–§B.2       | [Naming](naming.md)                                           |
| §B.3, §E, §Q.3  | [Boundary và public API](module-boundaries.md)                |
| §C, §D, §F.1    | [Git workflow](git-workflow.md)                               |
| §F.2, §Q.1–§Q.2 | [Khung feature](feature-structure.md)                         |
| §G, §K          | [Toolchain](tooling.md)                                       |
| §H              | [i18n](localization.md)                                       |
| §I              | [Testing](testing.md)                                         |
| §J, §L          | [UI/token/theme](ui-components.md); visual rules thuộc DESIGN |
| §M              | [HTTP/Session](http-session.md)                               |
| §O, §P          | [Lỗi và feedback](api-errors.md)                              |
| §R              | [PWA](pwa.md)                                                 |
| §S              | [Navigation và capabilities](app-capabilities.md)             |
| §T, §U          | [Luồng dữ liệu và trách nhiệm](data-flow.md)                  |

Đây chỉ là bảng điều hướng, không phải bản policy thứ hai. Các mục chưa chuyển source vẫn giữ nội dung hiện hành trong guide; ADR sở hữu đích migration.
