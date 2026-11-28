# Fashion Store CMS

Admin Dashboard (Vue 3 + Vite + TypeScript) cho hệ thống Fashion Store.

## Chạy dự án

Cần Node 22 (`nvm use`).

```bash
npm ci
cp .env.example .env.local   # sửa VITE_API_BASE_URL nếu cần
npm run dev                  # http://localhost:3001, cần Backend ở cổng 8080
```

| Lệnh                                                    | Việc                                                  |
| ------------------------------------------------------- | ----------------------------------------------------- |
| `npm run dev`                                           | Dev server (có overlay lỗi vue-tsc + ESLint)          |
| `npm run build` / `npm run preview`                     | Build production / xem bản build (PWA chỉ chạy ở đây) |
| `npm test` / `npm run test:coverage`                    | Unit + component test (Vitest)                        |
| `npm run test:e2e`                                      | E2E (Playwright)                                      |
| `npm run lint` / `npm run format` / `npm run typecheck` | Kiểm tra code                                         |
| `npm run gen:api`                                       | Sinh kiểu API từ tag OpenAPI của BE (`OPENAPI_URL`)   |
| `npm run knip` / `npm run analyze`                      | Tìm code thừa / xem kích thước bundle                 |

## Tài liệu

- Kiến trúc frontend: [docs/architecture/README.md](docs/architecture/README.md)
- Quy ước code (cây thư mục, đặt tên, lint, test, HTTP, lỗi, i18n, design system): [docs/conventions/README.md](docs/conventions/README.md)
- Thuật ngữ: [GLOSSARY.md](GLOSSARY.md)
- Giao diện: [`DESIGN.md`](DESIGN.md) là nguồn chuẩn về visual direction và quy tắc UI (thay cho phần design system trong CONVENTIONS §L) — xem thêm [UI/UX hardening plan](docs/plan/initiatives/ui-hardening/map.md)
