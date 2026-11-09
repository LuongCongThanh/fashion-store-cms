# Fashion Store CMS

Admin Dashboard (Vue 3 + Vite + TypeScript) cho hệ thống Fashion Store.

## Chạy dự án

Cần Node 22 (`nvm use`).

```bash
npm ci
cp .env.example .env.local   # sửa VITE_API_BASE_URL nếu cần
npm run dev
```

| Lệnh                                                    | Việc                                                  |
| ------------------------------------------------------- | ----------------------------------------------------- |
| `npm run dev`                                           | Dev server (có overlay lỗi vue-tsc + ESLint)          |
| `npm run build` / `npm run preview`                     | Build production / xem bản build (PWA chỉ chạy ở đây) |
| `npm test` / `npm run test:coverage`                    | Unit + component test (Vitest)                        |
| `npm run test:e2e`                                      | E2E (Playwright)                                      |
| `npm run lint` / `npm run format` / `npm run typecheck` | Kiểm tra code                                         |
| `npm run gen:api`                                       | Sinh kiểu API từ Swagger (`OPENAPI_URL`)              |
| `npm run knip` / `npm run analyze`                      | Tìm code thừa / xem kích thước bundle                 |

## Tài liệu

- Kiến trúc frontend: [docs/FE_architecture.md](docs/FE_architecture.md)
- Quy ước code (cây thư mục, đặt tên, lint, test, HTTP, lỗi, i18n, design system): [docs/CONVENTIONS.md](docs/CONVENTIONS.md)
- Thuật ngữ: [GLOSSARY.md](GLOSSARY.md)
- Giao diện: `DESIGN.md` (chưa tạo) sẽ là nguồn chuẩn về visual direction và quy tắc UI, thay cho phần design system trong CONVENTIONS §L — xem [UI/UX hardening plan](docs/plans/ui-ux-hardening-plan.md)
