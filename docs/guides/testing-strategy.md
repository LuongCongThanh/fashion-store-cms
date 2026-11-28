# Chiến lược kiểm thử CMS

**Trạng thái:** thiết kế đã duyệt, chưa triển khai (2026-11-28). Luật chung cho ba ứng dụng (mức rủi ro, ma trận trách nhiệm FE/BE, hành trình E2E full-stack, gate, audit) nằm ở `docs/testing/` của repo workspace [fashion-store](https://github.com/LuongCongThanh/fashion-store/tree/main/docs/testing). Cách dựng test (runtime, `renderWithPlugins()`, fake HTTP) nằm ở `docs/CONVENTIONS.md` (sau khi PR sắp xếp lại docs merge: `docs/guides/testing.md`); file này nói **test gì, ở tầng nào**. Danh sách kịch bản: [testing-traceability.md](testing-traceability.md).

## CMS bảo vệ gì

CMS không sở hữu luật nghiệp vụ. Backend quyết định mọi quyền, giá, Tồn kho và chuyển trạng thái. CMS chịu trách nhiệm:

1. **Hiển thị đúng theo quyền**: menu, route, nút hành động theo `permissions` từ `/auth/me`. Ẩn nút là UX, không phải bảo mật; Backend vẫn trả 403.
2. **Không để Staff làm sai một cách vô tình**: form bắt buộc (lý do huỷ, mã giao dịch hoàn), hộp xác nhận thao tác phá huỷ, chặn bấm hai lần, khoá trường không được sửa theo trạng thái.
3. **Hiển thị đúng điều Backend trả**: loading, rỗng, lỗi, thành công; map lỗi API vào đúng field; hiện số tối đa giảm được, Biến thể thiếu, xung đột khi sửa cùng lúc.
4. **Phiên làm việc**: refresh một lần cho nhiều request 401, hết phiên thì về đăng nhập và quay lại đúng trang an toàn (`SafeRedirect`).

## Tầng test

| Tầng                 | Công cụ và seam                                                          | Dùng cho                                                                                         |
| -------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Unit                 | Vitest, không fake                                                       | Schema form (zod), định dạng VND và ngày giờ Việt Nam, `buildNavigation` theo quyền, `SafeRedirect`, map lỗi API |
| Component / view     | `renderWithPlugins()` + `axios-mock-adapter`; seam duy nhất là HTTP      | Trạng thái màn hình, form, quyền trên nút, xác nhận, double submit, lỗi Backend                  |
| Integration feature  | Như component, nhiều component + router + cache Vue Query thật           | Sau khi lưu thì danh sách làm mới; lọc, phân trang đồng bộ URL; request cũ không ghi đè mới     |
| E2E giao diện        | Playwright + `e2e/MockApi.ts` (API giả theo vai trò)                     | Điều hướng, đăng nhập, menu theo vai trò, một luồng chính mỗi màn hình P1                        |
| E2E full-stack       | Repo workspace, Backend thật                                             | J5 (Staff xử lý đơn), J7 (quyền Staff), J9 (Đổi trả → Hoàn tiền)                                 |
| Contract             | CI `gen:api` + `git diff --exit-code` client sinh + `vue-tsc`             | CMS dùng field đã đổi hoặc bị bỏ                                                                 |

Lowest effective level: luật quyền được Backend kiểm ở API test; CMS chỉ kiểm nút hiện đúng theo danh sách quyền nhận được, bằng component test với vài tổ hợp đại diện (Admin, Staff, không quyền), không lặp đủ ma trận.

## Quy ước

- Dữ liệu fake trong component test lấy kiểu từ client sinh (`Api.generated.ts`); không tự viết kiểu response.
- Danh sách quyền trong `e2e/MockApi.ts` phải khớp seed Vai trò hệ thống của Backend. Khi Backend đổi seed quyền, cập nhật file này trong cùng đợt.
- Tên test bắt đầu bằng mã luật hoặc mã kịch bản khi có, ví dụ `it('CMS-ORD-02: huỷ đơn bắt buộc nhập lý do')`.
- Assertion theo hành vi người dùng thấy (text, role, trạng thái disabled, request đã gửi), không theo class CSS hay state nội bộ; không snapshot cả component.
- Locator E2E theo role, label hoặc `data-testid`; không `waitForTimeout`.
- Accessibility: form huỷ đơn, ghi nhận Hoàn tiền và Đổi trả kiểm được bằng bàn phím, có label, lỗi được đọc ra.

## CI

| Giai đoạn | Chạy                                                                                  |
| --------- | ------------------------------------------------------------------------------------- |
| PR        | `lint`, `format:check`, `typecheck`, `test:coverage`, contract diff, `build`, `test:e2e` (API mock), `knip` |
| Nightly   | E2E full-stack ở repo workspace (J5, J7, J9 khi đã build)                             |

Sàn coverage 50% theo `quality-gates.md` của workspace **chưa bật**: `vitest.config.ts` hiện chỉ báo cáo. Bật ngưỡng là một việc trong roadmap; coverage không phải mục tiêu.

## Thứ tự làm

1. P0: phân quyền theo vai trò ở menu, route và nút (CMS-AUTH, CMS-PERM).
2. P0 khi Backend có tính năng: huỷ đơn, ghi nhận Hoàn tiền, Đổi trả (task 33, 34 của Backend).
3. P1: Tồn kho, Kiểm kê, Giá khuyến mãi, Voucher, Sản phẩm, danh mục.
4. P2: dashboard, bộ lọc, giao diện.
