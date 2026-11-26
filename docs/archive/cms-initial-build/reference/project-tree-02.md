# A. Cây thư mục đầy đủ — phần 2

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

```text
│   │   │   │   └── ApplyApiErrorToForm.spec.ts # (P5) test map lỗi API vào field form
│   │   │   ├── i18n/                       # vue-i18n
│   │   │   │   ├── I18n.ts                 # createAppI18n() (plugin sở hữu locale), useLocale()
│   │   │   │   └── I18n.spec.ts            # test đổi/lưu locale
│   │   │   └── session/                    # Session (xem GLOSSARY.md)
│   │   │       ├── Session.ts              # createSession(), useSession(), SESSION_KEY (§M.2)
│   │   │       ├── Session.store.ts        # useSessionStore — token + storeId, nội bộ
│   │   │       └── Session.spec.ts         # test refresh token, đổi Store, logout
│   │   ├── types/                          # kiểu dùng chung
│   │   │   └── Api.generated.ts            # sinh từ Swagger, KHÔNG sửa tay
│   │   └── utils/                          # hàm thuần, tạo khi có hàm đầu tiên
│   │       └── Money.ts                    # (P5) ví dụ
│   ├── test/                               # hạ tầng test dùng chung (không phải test của module)
│   │   ├── factories/                      # dữ liệu giả bằng faker (§S.2)
│   │   │   └── User.factory.ts             # sinh User giả
│   │   ├── Render.ts                       # renderWithPlugins() — gọi createAppRuntime() với fake
│   │   └── Setup.ts                        # vitest setupFiles: matcher, mock toàn cục, reset giữa các test
│   ├── App.vue                             # component gốc: <RouterView/> + UApp
│   ├── env.d.ts                            # ImportMetaEnv
│   └── main.ts                             # entry: createApp(App).use(createAppRuntime().plugin).mount()
├── .editorconfig                           # indent, xuống dòng thống nhất giữa editor
├── .env.example                            # mẫu biến môi trường VITE_*, copy thành .env.local
├── .gitignore                              # file không đưa vào git
├── .nvmrc                                  # phiên bản Node cố định
├── .prettierignore                         # file Prettier bỏ qua
├── .prettierrc.json                        # cấu hình Prettier
├── AGENTS.md                               # trỏ sang CLAUDE.md (cho agent không phải Claude)
├── CLAUDE.md                               # hướng dẫn cho agent: issue tracker, domain docs
├── GLOSSARY.md                             # thuật ngữ kỹ thuật dùng chung
├── README.md                               # giới thiệu dự án, cách cài và chạy
├── commitlint.config.ts                    # quy tắc commit message
├── eslint.config.ts                        # gồm bảng BOUNDARIES (D41)
├── eslint.config.spec.ts                   # test tự động bảng ranh giới
├── index.html                              # HTML gốc Vite nạp main.ts
├── lint-staged.config.ts                   # lệnh chạy cho file staged (eslint --fix, prettier)
├── package.json                            # dependency + scripts (dev, build, test, lint, gen:api)
├── playwright.config.ts                    # cấu hình e2e (trình duyệt, baseURL, webServer)
├── pwa-assets.config.ts                    # sinh icon PWA từ Logo.svg
├── tsconfig.app.json                       # TS cho src/ (alias @app, @shared…)
├── tsconfig.json                           # tsconfig gốc, tham chiếu app + node
├── tsconfig.node.json                      # TS cho file config chạy trên Node
├── vite.config.ts                          # Vite: plugin Vue, Nuxt UI, PWA, alias
└── vitest.config.ts                        # Vitest: môi trường jsdom, setup, coverage
```

Quy tắc phụ thuộc giữa các thư mục (chiều mũi tên = được import), một đường thẳng, không ngoại lệ:

```text
main.ts ──► app/ ──► layouts/ ──► features/ ──► shared/
                                  (feature khác chỉ qua Use*.ts / types/)

trong shared/:  components/ ──► composables/ ──► lib/ ──► types/, utils/
```

- `@app/*` chỉ được import từ `main.ts` (và `vite.config.ts` cho `Ui.config.ts`, test của chính `app/`, và `src/test/` để gọi `createAppRuntime()` — D37). Thứ UI cần dùng (locale, theme, PWA) nằm ở `shared/`, không ở `app/`.
- `layouts/` không import `app/`; `features/` không import `app/`, `layouts/`.
- `shared/` không import `app/`, `layouts/`, `features/` — điều kiện để tái sử dụng được (ESLint, §E).
- Code đưa vào `shared/` khi có **≥ 2 nơi** dùng thật; trước đó để trong feature. Không đưa code nghiệp vụ (biết `Product`, `Order`, endpoint riêng…) vào `shared/` — VD upload media nằm ở `features/media/` (`useMedia().upload()`).
- Trạng thái nghiệp vụ dùng chung giữa các feature (Store đang quản lý) là **một feature** (`StoreScope`), không phải store của `app/`.
- Trong `shared/`: `lib/` không import `components/`, `composables/`; `components/` không gọi API. Một component kèm composable mở nó (VD `confirm/`) đặt chung một thư mục.
- `shared/utils/`: mỗi file một chủ đề (`Money.ts`, `Slug.ts`), không có `Helpers.ts` gom linh tinh.
- `shared/types/Common.types.ts`, `Pagination.types.ts` chỉ tạo khi có type dùng chung thật, không tạo file chỉ re-export `Api.generated.ts`.
- `locales/` giữ một file mỗi ngôn ngữ; khi > ~500 dòng mới tách theo feature (§H).

Mục này là bản cho người đọc; bảng `BOUNDARIES` (§E) là bản được ESLint kiểm. Mỗi quy tắc import ở đây phải có dòng tương ứng trong `BOUNDARIES` và ít nhất một ca trong `eslint.config.spec.ts` — sửa một bên thì sửa cả bên kia.

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần tiếp](project-tree.md)
