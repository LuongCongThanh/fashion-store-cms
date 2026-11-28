# Hợp nhất archive dựng CMS ban đầu

Ngày: 26/11/2026. Người phụ trách đã chọn **một bộ archive, nhiều file ngắn** sau khi biết hai bộ nguồn có gần 7.500 dòng. Giữ trần 180 dòng/file; không gom toàn bộ thành file lớn.

## Cây cuối

```text
docs/archive/cms-initial-build/
├── README.md              # Mục lục chung và cách phân biệt giai đoạn
├── foundation.md          # Phạm vi Foundation ban đầu
├── screens.md             # Phạm vi/acceptance Pages ban đầu
├── foundation/            # F01–F14: một file mỗi bước
├── screens/               # P01–P14: một file mỗi bước
├── reference/             # Quyết định/lý do và chương kỹ thuật scaffold
├── catalog/               # Danh mục màn hình prototype
├── metrics/               # Hai báo cáo + hai JSON giữ nguyên số đo
├── api-contracts.md        # Contract tạm lịch sử
├── pull-requests.md        # Chuỗi PR/base lịch sử
└── review.md               # Review, reconciliation và giới hạn
```

Hai thư mục cũ `scaffold/` và `cms-pages-components/` đã được bỏ sau khi chuyển mọi file về owner mới. Không giữ stub.

## Chuẩn hóa hồ sơ

- Gộp 28 cặp spec/report thành 28 hồ sơ, mỗi hồ sơ có **Đặc tả và kế hoạch** cùng **Kết quả và review**.
- Dùng F/P để không trộn ID, trạng thái hoặc số đo của hai giai đoạn.
- Gộp chú thích template vào hướng dẫn chung; bỏ heading rỗng và banner lặp.
- Giữ riêng phần phạm vi theo giai đoạn, quyết định/đánh đổi, catalog, API snapshot, PR trace và metrics.
- Cập nhật incoming/outgoing links, anchors, archive index, docs index, quy chuẩn docs và tracker instructions theo schema mới.

## Kết quả kiểm tra

- Hai bộ archive: **100 → 72 file**, giảm 28 file. Cả docs còn 124 Markdown + 2 JSON.
- File dài nhất: **174 dòng**; không vượt 180.
- Hai JSON metrics khớp byte trước/sau.
- Nội dung 28 báo cáo giữ nguyên sau khi bỏ khác biệt heading/banner/đường dẫn; không thay kết quả hoặc số đo.
- 842 dòng nội dung spec được đối chiếu với hồ sơ mới, không mất nội dung riêng/tiêu chí.
- Local file targets và heading links hợp lệ; không có self-link rỗng, code fence lệch hoặc tên file sai convention.
- Project feature skill canonical và hai mirror vẫn giống nhau.
- Prettier và `git diff --check` được kiểm ở bước bàn giao. Không sửa source/config ứng dụng, không chạy app tests/build, không commit/push/PR.
