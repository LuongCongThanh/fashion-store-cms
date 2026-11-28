# Quality gates, motion và nghiệm thu

> Kế hoạch UI còn hiệu lực; DESIGN đã có, tracker giữ tiến độ. Không coi các Phase dưới đây là báo cáo hoàn thành.

## Quality checklist bắt buộc

### Responsive

- Không có hành động thiết yếu chỉ xuất hiện khi hover.
- Table có chiến lược overflow/column priority rõ ràng.
- Dialog, drawer và sticky actions không vượt viewport.
- Mobile layout ưu tiên task, không chỉ thu nhỏ desktop.

### Accessibility

- Keyboard order hợp lý và focus indicator rõ.
- Focus trap/restore hoạt động cho modal và drawer.
- Color contrast đạt yêu cầu và màu không phải tín hiệu duy nhất.
- Form error có label, message và summary phù hợp.
- Drag-and-drop có alternative không phụ thuộc pointer.
- Motion tôn trọng `prefers-reduced-motion`.

### Data và content

- Kiểm tra chuỗi tiếng Việt/Anh dài, giá trị tiền lớn, nhiều tag và missing image.
- Loading, empty, error, offline và partial-data states có thiết kế riêng.
- Numeric/currency/date alignment và formatting nhất quán.
- Destructive và bulk actions có confirmation/undo policy rõ.

### Performance

- Không thêm animation/WebGL dependency nếu chưa có đo lường.
- Theo dõi route chunk, initial load và main-thread cost trước/sau thay đổi.
- Không regression so với baseline đã duyệt; mục tiêu giảm bundle được đặt sau khi xác định nguồn chi phí.

## Guardrail cho external tools

- Pin tag hoặc commit SHA; không chạy trực tiếp từ `main` trong workflow ổn định.
- Review `SKILL.md`, install script, binary, network access và file diff trước khi chạy.
- Ghi lại nguồn, version và license của technique/asset được sử dụng.
- Không cho external agent/tool tự ý thay design contract.
- Không cấp credential hoặc inherited environment nếu không thật sự cần.
- Không chạy audit tool ở chế độ vô hiệu hóa approvals/sandbox.
- Không biến output của audit tool thành CI blocking trước khi triage false positive.
- Asset hoặc source có license hạn chế phải legal review trước khi copy/distribute.

## Rủi ro và cách giảm thiểu

| Rủi ro                                     | Hệ quả                               | Giảm thiểu                                                            |
| ------------------------------------------ | ------------------------------------ | --------------------------------------------------------------------- |
| Nhiều skill đưa ra style mâu thuẫn         | UI thiếu nhất quán                   | `DESIGN.md` là nguồn chuẩn duy nhất; external tools chỉ audit/advice. |
| Redesign toàn bộ cùng lúc                  | Diff lớn, khó review, regression cao | Làm theo archetype và reference implementation.                       |
| Snapshot test nhiều noise                  | CI bị bỏ qua hoặc update mù quáng    | Fixture ổn định, reporting trước, blocking sau.                       |
| Fashion aesthetic làm giảm usability       | CMS đẹp nhưng thao tác chậm          | Operational clarity và task completion là acceptance gate.            |
| Animation làm tăng bundle/main-thread cost | UI chậm, khó bảo trì                 | CSS/Vue first; đo baseline; GSAP on demand.                           |
| Schema DESIGN.md alpha thay đổi            | Tooling churn                        | Pin version, giữ runtime độc lập, review migration.                   |
| Asset/reference không rõ license           | Rủi ro pháp lý                       | Không sao chép mặc định; provenance và license review bắt buộc.       |

## Definition of Done

Effort UI/UX hardening được xem là hoàn tất khi:

- `DESIGN.md` được review và phản ánh trong Nuxt UI/Tailwind tokens.
- Page/component inventory khớp với code và liên kết đúng tới design contract.
- Các reference archetype cho list, form, detail, tree/matrix và dashboard đạt acceptance criteria.
- Mobile navigation và responsive page anatomy hoạt động trên route chính.
- Baseline representative screens có visual regression ổn định.
- Accessibility và performance gates đã qua giai đoạn reporting; các check đáng tin cậy được chuyển sang blocking.
- Không có external tool hoặc visual dependency nào trở thành nguồn luật không được kiểm soát.
- Motion production đáp ứng policy về mục đích, reduced motion và performance.

## Tiếp tục triển khai

Đọc [tracker UI/UX hardening](../../tasks/todo/ui-ux-hardening/spec.md) và các issue của effort để chọn phần chưa làm. Mockup và [DESIGN.md](../../../../DESIGN.md) đã có; không lặp lại chuỗi merge plan → dựng mockup → tạo contract ban đầu. Giữ từng reference archetype và quality gate theo tiêu chí bên trên; không coi kế hoạch là báo cáo đã chạy visual/accessibility/performance checks.

Tra cứu: [Mục lục chủ đề](map.md) · [Toàn bộ tài liệu](../../../README.md).
