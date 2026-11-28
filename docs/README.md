# Tài liệu CMS

Đối chiếu ngày 26/11/2026. Mỗi file giữ một chủ đề; file mục lục giúp chọn phần cần đọc. Source/config chứng minh hành vi hiện tại; ADR giữ quyết định; tracker giữ tiến độ.

## Bắt đầu theo công việc

| Bạn đang làm gì?                 | Đọc trước                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Làm quen kiến trúc CMS           | [Tổng quan](architecture/README.md), [cấu trúc source](guides/project-structure.md)                               |
| Thêm hoặc sửa một feature        | [Naming](guides/naming.md), [khung feature](guides/feature-structure.md), [boundary](guides/module-boundaries.md) |
| Sửa API, Session hoặc cache      | [HTTP/Session](guides/http-session.md), [luồng dữ liệu](guides/data-flow.md), [xử lý lỗi](guides/api-errors.md)   |
| Sửa form hoặc upload ảnh         | [Form và ảnh](architecture/README.md#form-và-ảnh-sản-phẩm), [luồng dữ liệu](guides/data-flow.md)                  |
| Sửa route hoặc quyền truy cập    | [Navigation flow](architecture/navigation.md), [auth và state](architecture/README.md#auth-permission-và-state)   |
| Sửa giao diện                    | [DESIGN.md](../DESIGN.md), [UI/token/theme](guides/ui-components.md)                                              |
| Viết test hoặc kiểm tra thay đổi | [Testing](guides/testing.md), [scripts và CI](architecture/README.md#môi-trường-scripts-và-xác-minh)              |
| Chuẩn bị commit hoặc PR          | [Git workflow](guides/git-workflow.md), [CLAUDE.md](../CLAUDE.md)                                                 |
| Sửa hoặc thêm tài liệu           | [Quy chuẩn tài liệu](guides/documentation.md)                                                                     |

## Quy ước hiện hành

[Hướng dẫn phát triển](guides/README.md) định tuyến theo naming, boundary, Git, tooling, i18n, testing, UI, HTTP/Session, lỗi, PWA và luồng dữ liệu. [Kiến trúc CMS](architecture/README.md) giữ tổng quan source, auth/state, form/media và tích hợp. Các hướng dẫn repo đọc trực tiếp hai đường dẫn này; không giữ file chuyển tiếp tên cũ.

- Phiên bản dependency/scripts: [package.json](../package.json), lockfile và [CI](../.github/workflows/ci.yml).
- Thuật ngữ kỹ thuật: [GLOSSARY.md](../GLOSSARY.md); nghĩa nghiệp vụ lấy từ Backend.
- Agent: [issue tracker](agents/issue-tracker.md), [domain docs](agents/domain.md).
- API readiness: [trạng thái tích hợp](architecture/README.md#trạng-thái-tài-liệu-và-tích-hợp--2026-11-26). Không dùng ví dụ prototype thay API Contract đã pin.

## Quyết định và công việc tiếp theo

| Chủ đề                                              | Nguồn                                                    |
| --------------------------------------------------- | -------------------------------------------------------- |
| Ownership và naming đích                            | [ADR 0001](adr/0001-domain-workflows-and-vue-naming.md)  |
| State, runtime và Session đích                      | [ADR 0002](adr/0002-state-runtime-and-session.md)        |
| Backend boundary và API typing đích                 | [ADR 0003](adr/0003-backend-api-boundary.md)             |
| Migration cấu trúc đã duyệt, chưa triển khai source | [Mục lục migration](plans/structure-migration/README.md) |
| Nối API nghiệp vụ theo tier, quyết định C1–C17      | [Mục lục API-first](plans/api-restructure/README.md)     |
| UI/UX hardening còn tiếp tục; DESIGN đã có          | [Mục lục UI](plans/ui-hardening/README.md)               |
| Nguồn và đánh đổi của thiết kế Vue                  | [Mục lục research](research/cms-architecture/README.md)  |

Source chưa chuyển theo guide hiện hành; source đã chuyển theo ADR và policy được cập nhật cùng slice. Không coi thiết kế được duyệt là báo cáo migration đã xong.

## Lịch sử

[Archive](archive/README.md) giữ quyết định, tiêu chí và bằng chứng còn giá trị của giai đoạn dựng CMS ban đầu, auth và research cũ. Tên quyền, API mẫu, số đo và trạng thái PR trong đó là snapshot của đợt tương ứng.

Hồ sơ mới nhất: [bỏ file dư và chuẩn hóa cây](../.scratch/cms-docs-cleanup/tree-pruning.md). Các đợt trước: [audit cleanup](../.scratch/cms-docs-cleanup/audit.md), [chuẩn hóa theo chủ đề](../.scratch/cms-docs-cleanup/normalization.md).

## Cây thư mục

```text
docs/
├── README.md
├── architecture/       # README + navigation
├── guides/             # README + hướng dẫn theo chủ đề
├── adr/                # quyết định đã chấp nhận
├── plans/              # api-restructure, structure-migration, ui-hardening
├── research/           # cms-architecture
├── archive/            # cms-initial-build, auth-integration, architecture-research
└── agents/             # cách dùng tracker và glossary
```

Mỗi effort nhiều file dùng `README.md` bên trong thư mục của nó. Tài liệu hiện hành không trộn với lịch sử; archive mỗi bước ưu tiên một hồ sơ gồm đặc tả/kế hoạch và kết quả/review, không giữ bản plan lặp.

Hồ sơ archive mới nhất: [hợp nhất nền tảng và màn hình CMS](../.scratch/cms-docs-cleanup/archive-unification.md).
