# 02 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `chore/lint-format-hooks` (stacked trên `chore/init-project`)
Ngày hoàn thành: 2026-11-07

## Đã làm

- `eslint.config.ts`: dùng typescript-eslint strict, vue `flat/recommended`, perfectionist, unused-imports, check-file, prettier. Có các rule ở §E, bảng `BOUNDARIES` và hàm `toFlatConfig`.
- `eslint.config.spec.ts` viết theo TDD: viết test trước và thấy nó fail, sau đó mới viết config cho pass. Test có 27 ca ranh giới import (mọi ca ở Step 2 và thêm vài ca) và 2 ca đặt tên file.
- `.prettierrc.json` và `.prettierignore`. Đã chạy `prettier --write` cho toàn repo; docs chỉ đổi định dạng (`*x*` thành `_x_`, căn lại bảng), nội dung giữ nguyên.
- Husky có 3 hook theo §D. Thêm `lint-staged.config.ts` và `commitlint.config.ts` (`scope-enum`, `header-max-length: 72`).
- Thêm `.vscode/settings.json`. File `extensions.json` đã có từ plan 01.
- Thêm các script `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:watch`, `prepare`.

## Kết quả kiểm tra

| Mục kiểm tra                                                       | Kết quả | Ghi chú                                                     |
| ------------------------------------------------------------------ | ------- | ----------------------------------------------------------- |
| `npm run lint`, `npm run format:check`                             | Pass    |                                                             |
| `eslint.config.spec.ts` (`npm test`)                               | Pass    | 29/29                                                       |
| Mọi ca import ở Step 2                                             | Pass    | Kiểm tự động trong spec                                     |
| `src/foo-bar.ts` báo sai tên                                       | Pass    | Ca trong spec                                               |
| Commit `"update stuff"` bị chặn, `"chore(config): add eslint"` qua | Pass    | commitlint trả exit code 1 và 0                             |
| Push khi có lỗi type bị chặn                                       | Pass    | `.husky/pre-push` trả exit code khác 0 khi có file lỗi type |

## Lệch so với plan / quyết định mới

- **`featureBoundary` viết bằng `regex`, không dùng `group`**: với cú pháp gitignore, pattern `@features/**` loại luôn thư mục `@features/auth`, nên các phần tử `!@features/*/Use*` không mở lại được file bên trong. Kết quả là `@features/auth/UseAuth` và `views/` trong `Routes.ts` bị chặn sai; test đã phát hiện ra lỗi này. Đã đổi sang regex lookahead, ESLint ≥ 9 hỗ trợ cách này. Cần cập nhật đoạn mẫu §E.
- `noApp` và `noLayouts` thêm pattern `/**` để chặn được cả đường dẫn nhiều cấp.
- `scope-enum` lấy danh sách scope ở §C.2 và thêm `store`, `i18n`, `pwa`, `test`, `ci`, `docs`.
- Script `test` (`vitest run`) thêm ngay ở plan này vì cần nó để chạy `eslint.config.spec.ts`. Cấu hình Vitest đầy đủ để ở plan 04.

## Việc còn tồn

- Token usage: chưa điền.
