# Bỏ file dư và chuẩn hóa cây docs

Ngày: 26/11/2026. Yêu cầu: bỏ file dư và chuẩn hóa cây, không giữ thêm file chuyển tiếp để bảo toàn tên cũ.

## Kết quả tổ chức

```text
docs/
├── README.md
├── architecture/       # Tổng quan + navigation
├── guides/             # README + policy theo chủ đề
├── adr/                # Quyết định đã chấp nhận
├── plans/
│   ├── api-restructure/
│   ├── structure-migration/
│   └── ui-hardening/
├── research/cms-architecture/
├── archive/
│   ├── README.md
│   ├── scaffold/       # README, spec, reference/, hồ sơ từng bước
│   ├── auth-integration/
│   ├── cms-pages-components/
│   └── architecture-research/
└── agents/
```

Mỗi effort nhiều file có `README.md` tại đúng thư mục của nó. Không giữ thêm wrapper ở thư mục cha. Gốc docs chỉ còn README.

## File đã bỏ sau khi gộp nội dung còn giá trị

| Nhóm                                            | Cách xử lý                                                | File giảm ròng |
| ----------------------------------------------- | --------------------------------------------------------- | -------------- |
| 4 mảnh architecture + integration-status        | Gộp thành `architecture/README.md`                        | 4              |
| `FE_architecture.md`                            | Xóa wrapper; consumer đọc architecture README trực tiếp   | 1              |
| 3 bản review/reconciliation/decisions prototype | Gộp `archive/cms-pages-components/review.md`              | 2              |
| Hooks scaffold                                  | Gộp vào chapter Git                                       | 1              |
| SOLID scaffold                                  | Gộp vào chapter data flow                                 | 1              |
| Glossary scaffold chỉ có một liên kết           | Trỏ thẳng glossary của repo, xóa file trung gian          | 1              |
| 14 plan scaffold + 14 plan prototype            | Gộp chỉ dẫn riêng vào `spec.md`, bỏ đoạn trùng nguyên văn | 28             |
| **Tổng**                                        | **Không xóa bằng chứng hoặc số đo độc nhất**              | **38**         |

Trước đợt này: 190 Markdown + 2 JSON. Sau đợt này: 152 Markdown + 2 JSON. 87 đường dẫn cũ biến mất, gồm cả phần chuyển vị trí; giảm ròng 38 file, không gọi mọi lần chuyển đường dẫn là xóa nội dung.

## Những phần được chuyển đúng chỗ

- `CONVENTIONS.md` → `guides/README.md`; navigation vào `architecture/`.
- Mục lục các plan vào `README.md` của từng effort.
- Research Vue vào `research/cms-architecture/`.
- Scaffold reference về `archive/scaffold/reference/`, không nằm song song với scaffold.
- Research cũ về `archive/architecture-research/`; bỏ hai tầng tên trùng.
- Auth và prototype dùng README ngay tại gốc hồ sơ; catalog có README riêng.

## Consumer cùng thay đổi

Cập nhật đường dẫn trong docs, tracker, README/CLAUDE, Copilot instructions, PR template và project feature skill. Canonical feature skill và hai mirror giữ nội dung đồng nhất. Không thay quyền, hooks, workflow, application source hoặc cấu hình build/test.

## Kiểm tra

- 152 Markdown + 2 JSON; file Markdown dài nhất 168 dòng, không file nào vượt 180.
- Không có local target/heading link bị thiếu, self-link rỗng hoặc code fence lệch; tên file theo kebab-case hoặc README.md.
- Hai JSON metrics giữ nguyên byte; 29 report giữ nội dung, chỉ thay đường dẫn.
- 692 dòng nội dung kế hoạch/chương đã gộp đều tìm thấy ở owner mới; tiêu chí cũ của 28 spec con vẫn được giữ.
- Feature skill canonical và hai mirror giống nhau.
- Đường dẫn cũ đã được xóa, không có compatibility stub; gốc docs chỉ có README.
- Prettier và `git diff --check` đạt. Không sửa application source/config; không chạy application tests/build cho đợt docs này.
