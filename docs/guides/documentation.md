# Quy chuẩn tài liệu

Áp dụng cho `docs/`. Mục tiêu là tìm đúng chủ đề nhanh, hiểu trạng thái và tránh nhiều bản quy định cùng một việc.

## Cấu trúc và tên file

| Nhóm            | Giữ nội dung gì?                                                |
| --------------- | --------------------------------------------------------------- |
| `architecture/` | Tổng quan, owner và luồng chính của source hiện tại             |
| `guides/`       | Quy tắc và cách làm theo từng chủ đề                            |
| `adr/`          | Quyết định xuyên module, phương án và đánh đổi                  |
| `plans/`        | Thiết kế/acceptance còn tiếp tục; tracker sở hữu tiến độ        |
| `research/`     | Nguồn, bằng chứng và phương án hỗ trợ quyết định                |
| `archive/`      | Bằng chứng và quyết định lịch sử không còn làm policy hiện hành |
| `agents/`       | Cách agent dùng tracker và glossary                             |

Dùng tên file tiếng Anh kebab-case, tiêu đề/nội dung tiếng Việt. Tên thể hiện chủ đề như `http-session.md`, không dùng `misc.md` hoặc `notes-final.md`. Khi một effort có nhiều chủ đề, dùng thư mục riêng với `README.md` bên trong. Không giữ thêm một file mục lục tên cũ ở thư mục cha.

## Độ dài và cách trình bày

- Nhắm 50–150 dòng cho một chủ đề; tối đa 180 dòng Markdown. Mục lục, ADR hoặc báo cáo ngắn không cần thêm nội dung để đủ dòng.
- Nếu quá dài, chia ở ranh giới nhiệm vụ hoặc câu hỏi người đọc cần trả lời. Không chia chỉ để đạt số dòng khi các phần vẫn phụ thuộc nhau.
- Bắt đầu bằng mục đích và trạng thái; dùng heading rõ, đoạn ngắn, bảng khi thật sự cần so sánh.
- Ví dụ code chỉ giữ phần giúp hiểu quy tắc. Trỏ source thay vì chép cả implementation, cây file hoặc danh sách dependency.
- Code/tree lịch sử quá dài có thể chia phần, giữ code fence cân bằng và liên kết trước/sau.
- File mục lục chỉ định tuyến, không chép lại quyết định hoặc policy của file con.
- Không tạo file chuyển tiếp để giữ tên cũ: cập nhật consumer và xóa đường dẫn cũ trong cùng thay đổi.
- Archive mỗi bước ưu tiên một file có phần đặc tả/kế hoạch và kết quả/review tách rõ. Nếu quá 180 dòng, tách ở ranh giới chủ đề; không gộp trạng thái hoặc cộng số đo giữa các đợt. Không giữ plan chỉ lặp spec.

## Một nội dung, một owner

- Visual rules thuộc `DESIGN.md`; guide UI giải thích cách áp vào source.
- Policy hiện hành thuộc guide; tổng quan kiến trúc chỉ liên kết tới policy.
- ADR giữ quyết định và lý do; plan giữ thiết kế/acceptance; tracker giữ việc còn mở và kết quả thực hiện.
- Glossary chỉ định nghĩa thuật ngữ; không thay ADR hoặc spec.
- Dependency, script, route và enforcement theo file source/config tương ứng.
- Sửa policy ở file sở hữu nó, rồi sửa các liên kết; không copy sang nhiều plan.

## Trạng thái và cập nhật

Phân biệt rõ `hiện hành`, `thiết kế đã duyệt/chưa triển khai`, `research` và `lịch sử`. Khi khảo sát một checkout, ghi ngày và giới hạn của bằng chứng; không biến đề xuất thành tuyên bố đã làm.

Báo cáo và metrics là dữ liệu lịch sử: giữ kết quả cũ, ghi thêm đợt kiểm tra mới riêng. Khi chuyển vào archive, giữ nguồn/lý do, cập nhật liên kết và bỏ hướng dẫn đã được owner hiện hành thay thế nếu không còn giá trị độc nhất.

## Kiểm tra trước khi bàn giao

1. Đọc lại từ [mục lục docs](../README.md) theo công việc cụ thể.
2. Kiểm đường dẫn tương đối, heading anchors và code fences, kể cả tài liệu bị chuyển thư mục.
3. Kiểm độ dài từng file, policy trùng, câu “sẽ tạo” cho phần đã tồn tại và trạng thái migration.
4. Sửa liên kết bên trong repo và tracker cùng thay đổi; giữ các entrypoint repo còn sử dụng.
5. Chạy `git diff --check`; khi cần format Markdown, dùng Prettier với ignore path riêng vì cấu hình repo chỉ format source.
6. Chỉ báo những kiểm tra thực sự đã chạy. Thay đổi docs không tự chứng minh runtime hoặc production đã được kiểm lại.

Tra cứu: [Mục lục docs](../README.md), [quy ước CMS](README.md).
