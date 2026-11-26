# Chuẩn hóa tài liệu theo chủ đề

Ngày: 26/11/2026. Tiếp nối cleanup theo yêu cầu “chuẩn hóa tài liệu riêng ra từng file, mỗi file vừa phải, dễ đọc”. Chỉ sửa Markdown và vị trí tài liệu/metrics; không sửa source/config ứng dụng.

## Cách tổ chức

| Nhóm                                                             | Vai trò                                                                    |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `docs/README.md`                                                 | Chọn tài liệu theo công việc                                               |
| `docs/guides/README.md`                                          | Mục lục guide, bảng tra ký hiệu § cũ                                       |
| `docs/architecture/README.md`                                    | Mục lục tổng quan kiến trúc                                                |
| `docs/guides/`                                                   | Một policy/chủ đề trên mỗi file; có quy chuẩn viết docs                    |
| `docs/architecture/`                                             | Tổng quan source, auth/state, form/media, môi trường/xác minh              |
| `docs/plans/{structure-migration,api-restructure,ui-hardening}/` | Các phần thiết kế/acceptance còn tiếp tục, giữ index tại đường dẫn plan cũ |
| `docs/research/vue-cms/`                                         | Bằng chứng, cây đích, runtime và migration; ADR vẫn là nguồn quyết định    |
| `docs/archive/`                                                  | Bằng chứng lịch sử; có mục lục riêng và chương ngắn                        |

## Thay đổi chính

- Tách CONVENTIONS gần 1.000 dòng theo owner: naming, boundary, feature, Git, tooling, i18n, testing, UI, HTTP/Session, errors, PWA, capabilities và data flow.
- Bỏ dàn 34 mục chủ yếu trỏ link của FE_architecture; giữ nội dung tổng quan trong các file ngắn.
- Tách migration, API-first và UI hardening theo câu hỏi/công việc, giữ trạng thái đã duyệt/chưa triển khai.
- Đổi câu UI “sẽ tạo DESIGN” thành nguồn chuẩn đã có, phân biệt vấn đề ghi nhận khi lập plan với hiện trạng chưa được đo lại.
- Bỏ code mẫu DTO/endpoint scaffold khỏi guide data flow, thay bằng link implementation. Sửa mô tả HttpClient: HasPaths còn false, generator không tự bật caller typing; upload hiện là XHR POST, không còn presigned PUT/fetch. Sửa owner client state, wording coverage và lựa chọn Intl.
- Tách research và scaffold lịch sử dài thành chương; phần code/tree quá dài có code fence và link trước/sau khi tiếp tục qua trang.
- Chuyển `docs/plans/auth-backend-integration/` → `docs/archive/auth-integration/`.
- Chuyển `docs/plans/cms-pages-components/` → `docs/archive/cms-pages-components/`.
- Giữ báo cáo/spec/quyết định và JSON metrics; sửa incoming/outgoing links, không ghi lại số đo cũ.
- Giữ các entrypoint được repo yêu cầu đọc; không thay CLAUDE/AGENTS hoặc workflow.

## Quy tắc độ dài

Nhắm 50–150 dòng/chủ đề, tối đa 180 dòng Markdown; mục lục, báo cáo và ADR ngắn không bị kéo dài để đủ dòng. Một chủ đề chỉ có một nơi giữ nội dung chuẩn. File cũ là index, không giữ thêm bản sao toàn bộ nội dung.

## Kiểm tra

- 190 file Markdown trong `docs/`; file dài nhất 167 dòng, không có file vượt trần 180.
- 0 local file target thiếu; 0 heading link không khớp; code fences cân bằng.
- 2 JSON metrics khớp byte với snapshot trước chuẩn hóa.
- 61 report/spec/decisions giữ nguyên wording sau khi loại khác biệt link/path; không sửa số liệu/nghiệm thu.
- 3.033 dòng payload research/plan/archive được đối chiếu với đích, không mất nội dung. Thay đổi wording về owner của mục lục đã được đối chiếu riêng.
- Guide hiện hành có các chỉnh sửa biên tập được nêu ở trên, không chỉ cắt/chia cơ học; đoạn mẫu DTO tạm thay bằng link source.
- Prettier chạy riêng trên các file được tạo/viết lại, `git diff --check` đạt.
- Không sửa source/config ứng dụng; không chạy application tests/build vì phạm vi chỉ là tài liệu. Không tuyên bố runtime được kiểm lại.

## Giới hạn

Đây là chuẩn hóa tài liệu, không phải báo cáo đã migrate source, xác nhận merge/PR trên remote hoặc kiểm production. Các số đo trong archive vẫn thuộc lần chạy lịch sử tương ứng.

## Đợt tiếp theo

Các đường dẫn/cách giữ entrypoint trong báo cáo này thuộc thời điểm chuẩn hóa ban đầu. Yêu cầu tiếp theo đã bỏ wrapper, gộp file dư và chuyển entrypoint vào README của nhóm; xem [báo cáo cây cuối](tree-pruning.md).
