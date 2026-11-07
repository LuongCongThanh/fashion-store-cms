# Quy ước dự án — Fashion Store CMS

Quy ước kỹ thuật đang áp dụng cho code trong repo. Mỗi mục giữ đúng ký hiệu mục (§A–§U) của plan scaffold cũ, nên link "§X" ở tài liệu khác vẫn trỏ được vào đây.

- Thuật ngữ: [GLOSSARY.md](../GLOSSARY.md). Kiến trúc tổng thể: [FE_architecture.md](./FE_architecture.md).
- Mã quyết định `D1`–`D41` và lý do (§V) nằm trong bản plan đã lưu trữ: [archive/scaffold-plan.md](./archive/scaffold-plan.md).
- Khi code đã có, tài liệu trỏ tới file nguồn thay vì chép code. File nguồn là chuẩn; mô tả ở đây là chuẩn cho những gì chưa có code.
- Đổi một quy ước thì sửa file này trong cùng PR với code.

## A. Cây thư mục đầy đủ

Ký hiệu: không đánh dấu = có từ Foundation · `(P2)`, `(P5)`… = tạo khi tới Phase tương ứng ở §30 FE_architecture. Thư mục chỉ được tạo khi có file đầu tiên bên trong (không tạo thư mục rỗng). Cấu trúc bên trong từng feature: xem §Q.

```text
cms/
├── .github/                                # cấu hình GitHub
│   ├── ISSUE_TEMPLATE/                     # mẫu tạo issue
│   │   ├── bug_report.md                   # mẫu báo lỗi
│   │   └── feature_request.md              # mẫu đề xuất tính năng
│   ├── workflows/                          # GitHub Actions
│   │   └── ci.yml                          # CI: lint, typecheck, test, build (+ knip không chặn); e2e thêm khi có login thật
│   ├── dependabot.yml                      # tự động mở PR cập nhật dependency
│   └── pull_request_template.md            # checklist mô tả PR
├── .husky/                                 # git hooks
│   ├── pre-commit                          # chạy lint-staged trên file đã stage
│   ├── commit-msg                          # kiểm tra message theo Conventional Commits (commitlint)
│   └── pre-push                            # chạy type-check trước khi push (test để CI chạy, §D)
├── .vscode/                                # cấu hình editor dùng chung cho team
│   ├── settings.json                       # format on save, ESLint/Prettier làm mặc định
│   └── extensions.json                     # extension VS Code khuyến nghị
├── docs/                                   # tài liệu kiến trúc + quy ước
│   ├── archive/                            # tài liệu đã xong, giữ để tra lý do
│   │   ├── scaffold/                       # 14 plan con của scaffold (spec, plan, report) — đã xong
│   │   └── scaffold-plan.md                # plan dựng khung: quyết định D1–D41, lý do §V
│   ├── CONVENTIONS.md                      # tài liệu này — quy ước kỹ thuật
│   └── FE_architecture.md                  # kiến trúc FE (nguồn quyết định)
├── e2e/                                    # test end-to-end Playwright
│   └── Smoke.spec.ts                       # smoke test: mở app, đăng nhập, vào dashboard
├── public/                                 # file tĩnh copy nguyên trạng vào bản build
│   ├── favicon.svg                         # icon tab trình duyệt
│   └── robots.txt                          # Disallow: / (§R.1)
├── scripts/                                # script tiện ích cho dev
│   └── GenApi.ts                           # chạy bằng tsx
├── src/                                    # mã nguồn ứng dụng
│   ├── app/                                # composition root — CHỈ main.ts (và src/test/) import
│   │   ├── Runtime.ts                      # createAppRuntime() — dựng toàn bộ runtime (D37)
│   │   ├── Runtime.spec.ts                 # test wiring prod
│   │   ├── config/                         # cấu hình đọc lúc khởi động
│   │   │   ├── Env.config.ts               # validate VITE_* bằng Zod
│   │   │   ├── Env.config.spec.ts          # test thiếu/sai biến env
│   │   │   └── Ui.config.ts                # nguồn duy nhất màu + mặc định component (vite.config.ts import)
│   │   ├── providers/                      # cài đặt plugin/handler toàn cục
│   │   │   ├── ErrorHandling.ts            # installErrorHandling() — lỗi global (§O.4)
│   │   │   └── ErrorHandling.spec.ts       # test bắt lỗi global
│   │   ├── router/                         # cấu hình vue-router
│   │   │   ├── Guards.ts                   # navigation guard: yêu cầu đăng nhập, kiểm tra quyền, chọn Store
│   │   │   ├── Guards.spec.ts              # test các guard
│   │   │   ├── RouteMeta.d.ts              # RouteMeta (§S.1)
│   │   │   ├── Router.ts                   # createRouter() + gắn guard
│   │   │   └── Routes.ts                   # gộp <Feature>.routes.ts, nơi duy nhất import views/
│   │   └── views/                          # trang cấp app không thuộc feature nào
│   │       ├── DesignSystemView.vue        # /design-system, chỉ dev (§L.10)
│   │       ├── ForbiddenView.vue           # 403
│   │       └── NotFoundView.vue            # 404
│   ├── assets/                             # tài nguyên được Vite xử lý (bundle)
│   │   ├── images/                         # ảnh dùng trong app
│   │   │   └── Logo.svg                    # bản logo duy nhất, PWA cũng sinh icon từ đây (§R)
│   │   └── styles/                         # CSS toàn cục
│   │       └── main.css                    # tailwind + nuxt ui + token (§L.9)
│   ├── features/                           # cấu trúc chi tiết: §Q
│   │   ├── auth/                           # feature đăng nhập / đăng xuất / thông tin user
│   │   │   ├── api/                        # hàm gọi API của feature
│   │   │   │   └── Auth.api.ts             # gọi API login, logout, me
│   │   │   ├── stores/                     # Pinia store nội bộ feature
│   │   │   │   └── Auth.store.ts           # Pinia store thông tin user hiện tại, nội bộ feature
│   │   │   ├── types/                      # kiểu dữ liệu feature (feature khác được import)
│   │   │   │   └── Auth.types.ts           # kiểu dữ liệu của auth (User, LoginPayload…)
│   │   │   ├── views/                      # trang (route component) của feature
│   │   │   │   └── LoginView.vue           # trang đăng nhập
│   │   │   ├── Auth.routes.ts              # khai báo route /login của feature
│   │   │   ├── UseAuth.ts                  # interface công khai duy nhất
│   │   │   └── UseAuth.spec.ts             # test interface useAuth()
│   │   └── StoreScope/                     # Store đang quản lý — mọi feature cần storeId
│   │       ├── api/                        # hàm gọi API của feature
│   │       │   └── StoreScope.api.ts       # danh sách Store user được truy cập
│   │       ├── stores/                     # Pinia store nội bộ feature
│   │       │   └── StoreScope.store.ts     # danh sách Store; storeId nằm ở Session (D34)
│   │       ├── types/                      # kiểu dữ liệu feature (feature khác được import)
│   │       │   └── StoreScope.types.ts     # kiểu dữ liệu Store
│   │       ├── UseStoreScope.ts            # useStoreScope() — bọc Session (§M.3)
│   │       └── UseStoreScope.spec.ts       # test useStoreScope()
│   ├── layouts/                            # khung trang bọc quanh view
│   │   ├── components/                     # chỉ layout dùng
│   │   │   ├── AppHeader.vue               # thanh trên: StoreSwitcher, UserMenu
│   │   │   ├── AppSidebar.vue              # trạng thái thu gọn: useLocalStorage
│   │   │   ├── CommandPalette.vue          # (P5) Ctrl/⌘+K — render useNavigation().commands (§S.1)
│   │   │   ├── ShortcutsHelpModal.vue      # (P5) render useNavigation().shortcuts
│   │   │   ├── StoreSwitcher.vue           # dùng useStoreScope() (§M.3)
│   │   │   └── UserMenu.vue                # đổi theme + ngôn ngữ + logout
│   │   ├── AuthLayout.vue                  # layout trang chưa đăng nhập (login)
│   │   ├── DashboardLayout.vue             # layout chính sau đăng nhập: header + sidebar + nội dung
│   │   ├── Navigation.ts                   # buildNavigation(routes, can) + useNavigation() (§S.1, D38)
│   │   └── Navigation.spec.ts              # test buildNavigation theo quyền
│   ├── locales/                            # bản dịch i18n
│   │   ├── en.json                         # tiếng Anh
│   │   └── vi.json                         # tiếng Việt
│   ├── shared/                             # tái sử dụng; KHÔNG import app/, layouts/, features/
│   │   ├── components/                     # UI dùng chung, KHÔNG gọi API, KHÔNG biết nghiệp vụ
│   │   │   ├── confirm/                    # module: interface duy nhất là useConfirm()
│   │   │   │   ├── ConfirmDialog.vue       # modal xác nhận, chỉ dùng qua useConfirm()
│   │   │   │   ├── UseConfirm.ts           # trả Promise<boolean>
│   │   │   │   └── UseConfirm.spec.ts      # test useConfirm()
│   │   │   ├── display/                    # (P5)
│   │   │   │   ├── CopyText.vue            # hiển thị text kèm nút copy
│   │   │   │   └── RelativeTime.vue        # hiển thị thời gian tương đối ("3 phút trước")
│   │   │   ├── feedback/                   # trạng thái rỗng / lỗi / offline
│   │   │   │   ├── EmptyState.vue          # §21
│   │   │   │   ├── ErrorState.vue          # §21, có nút Retry
│   │   │   │   ├── ErrorState.spec.ts      # test hiển thị lỗi + nút Retry
│   │   │   │   └── OfflineBanner.vue       # §R
│   │   │   ├── form/                       # (P5)
│   │   │   │   └── FormActions.vue         # cụm nút Lưu / Huỷ chuẩn ở cuối form
│   │   │   ├── page/                       # khung chung của một trang
│   │   │   │   └── PageHeader.vue          # tiêu đề trang, font-display (§L.5)
│   │   │   └── table/                      # (P5)
│   │   │       ├── DataTable.vue           # §22
│   │   │       └── DataTable.spec.ts       # (P5) test bảng: sort, phân trang, chọn dòng
│   │   ├── composables/                    # ≥ 2 nơi dùng, không nghiệp vụ
│   │   │   ├── UseListState.ts             # (P5) §6.1
│   │   │   ├── UseListState.spec.ts        # (P5)
│   │   │   ├── UseNotify.ts                # toast thành công / lỗi theo ApiError
│   │   │   ├── UseNotify.spec.ts           # test useNotify()
│   │   │   ├── UsePwa.ts                   # báo bản mới (§R)
│   │   │   └── UseTheme.ts                 # color mode, key cms.colorMode
│   │   ├── lib/                            # hạ tầng thuần, không import components/, composables/
│   │   │   ├── api/                        # giao tiếp HTTP
│   │   │   │   ├── client/                 # HTTP client duy nhất của app
│   │   │   │   │   ├── HttpClient.ts       # createHttpClient, useHttpClient, HTTP_CLIENT_KEY; bên trong: header, gom 401, chuẩn hoá lỗi (§M.1, §O.3)
│   │   │   │   │   └── HttpClient.spec.ts  # test MỌI hành vi qua interface, gồm các ca §O.3
│   │   │   │   └── errors/                 # kiểu lỗi + chính sách lỗi công khai
│   │   │   │       ├── ApiError.ts         # class ApiError, isApiError() (§O.1)
│   │   │   │       ├── ErrorCode.ts        # mã lỗi phía client (§O.2)
│   │   │   │       ├── ErrorPolicy.ts      # isRetryable, messageKeyOf, isSilent, routeMutationError (§O.4, D39)
│   │   │   │       └── ErrorPolicy.spec.ts # phủ toàn bộ bảng §O.4
│   │   │   ├── query/                      # TanStack Vue Query
│   │   │   │   ├── QueryClient.ts          # createAppQueryClient() — dùng ErrorPolicy
│   │   │   │   └── VueQuery.d.ts           # kiểu meta cho mutation (§O.4)
│   │   │   ├── export/                     # (P10)
│   │   │   │   └── ExportCsv.ts            # xuất dữ liệu ra file CSV
│   │   │   ├── form/                       # (P5) tiện ích xử lý form — tạo khi có form thứ hai (D33)
│   │   │   │   ├── ApplyApiErrorToForm.ts  # (P5) §6.1
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
├── .env.development                        # mặc định khi `npm run dev` (ghi đè bằng .env.local)
├── .env.example                            # mẫu biến môi trường VITE_*, copy thành .env.local
├── .env.production                         # mặc định khi build: VITE_API_BASE_URL=/api
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
├── knip.json                               # cấu hình knip (file/export/dependency thừa)
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

## B. Quy tắc đặt tên

### B.1. File và thư mục

| Loại                              | Quy tắc                                                                                                                                                 | Ví dụ                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Thư mục                           | Một từ: viết thường · nhiều từ: PascalCase · không kebab-case; feature số nhiều (trừ danh từ không đếm được: `auth`, `dashboard`, `inventory`, `media`) | `features/products/`, `features/AuditLogs/`, `test/factories/`                                   |
| Thư mục chức năng trong feature   | cố định, số nhiều: `api/`, `components/`, `composables/`, `schemas/`, `stores/`, `types/`, `views/` (riêng `api/` giữ nguyên)                           |                                                                                                  |
| Component                         | PascalCase, ≥ 2 từ                                                                                                                                      | `ProductTable.vue`, `ProductStatusBadge.vue`                                                     |
| View (gắn route)                  | PascalCase + hậu tố `View`                                                                                                                              | `ProductListView.vue`                                                                            |
| Layout                            | PascalCase + hậu tố `Layout`                                                                                                                            | `DashboardLayout.vue`                                                                            |
| Composable                        | `Use` + PascalCase                                                                                                                                      | `UseAuth.ts`, `UseListState.ts`                                                                  |
| Store                             | PascalCase + `.store.ts`                                                                                                                                | `Auth.store.ts`                                                                                  |
| API                               | PascalCase + `.api.ts`                                                                                                                                  | `Products.api.ts`                                                                                |
| Schema (Zod)                      | PascalCase + `.schema.ts`                                                                                                                               | `Product.schema.ts`                                                                              |
| Types                             | PascalCase + `.types.ts`                                                                                                                                | `Product.types.ts`                                                                               |
| Config                            | PascalCase + `.config.ts`                                                                                                                               | `Env.config.ts`                                                                                  |
| Module thường                     | PascalCase                                                                                                                                              | `HttpClient.ts`, `ApiError.ts`                                                                   |
| Test                              | tên file nguồn + `.spec.ts`                                                                                                                             | `Guards.spec.ts`, `ProductTable.spec.ts`                                                         |
| Route của feature                 | `<Feature>` + `.routes.ts`                                                                                                                              | `Products.routes.ts`                                                                             |
| Mapper                            | `<Entity>` + `.mapper.ts`, trong `api/`, chỉ khi DTO lệch Model (§T.3)                                                                                  | `Product.mapper.ts`                                                                              |
| Test factory                      | `<Entity>` + `.factory.ts`                                                                                                                              | `User.factory.ts`                                                                                |
| Khai báo kiểu                     | PascalCase + `.d.ts`                                                                                                                                    | `Router.d.ts`, `VueQuery.d.ts`                                                                   |
| File sinh tự động                 | PascalCase + `.generated.ts`                                                                                                                            | `Api.generated.ts`                                                                               |
| Asset tĩnh (`assets/`, `public/`) | PascalCase (trừ `favicon.svg`, `robots.txt` do trình duyệt/bot yêu cầu)                                                                                 | `Logo.svg`, `EmptyBox.svg`                                                                       |
| Ngoài `src/` (`e2e/`, `scripts/`) | PascalCase                                                                                                                                              | `Smoke.spec.ts`, `GenApi.ts`                                                                     |
| File do tool quy định             | Giữ nguyên tên tool yêu cầu                                                                                                                             | `package.json`, `vite.config.ts`, `.github/ISSUE_TEMPLATE/bug_report.md`, `pwa-assets.config.ts` |

Hậu tố hợp lệ (cấu hình cho `check-file`): `.api`, `.mapper`, `.routes`, `.store`, `.schema`, `.types`, `.config`, `.factory`, `.generated`, `.spec`, `.d`.

Ngoại lệ (giữ tên do tool quy định): `main.ts`, `main.css`, `env.d.ts`, `locales/*.json`, mọi file config ở thư mục gốc (`vite.config.ts`, `eslint.config.ts`…), `scripts/`.

Lưu ý: tên file `UseAuth.ts` khác hoa/thường với hàm `useAuth` là có chủ đích (D14). Khi đổi tên chỉ khác hoa/thường (VD file Vite sinh sẵn) phải dùng `git mv` — macOS/Windows không phân biệt hoa/thường nên git không nhận đổi tên.

### B.2. Trong code

| Loại                     | Quy tắc                                                                                                   | Ví dụ                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Biến, hàm                | camelCase                                                                                                 | `fetchProducts`, `isLoading`        |
| Boolean                  | tiền tố `is/has/can/should`                                                                               | `canEdit`                           |
| Hằng số module           | UPPER_SNAKE_CASE                                                                                          | `DEFAULT_PAGE_SIZE`                 |
| Type / interface         | PascalCase, không tiền tố `I`                                                                             | `Product`, `ProductListQuery`       |
| Enum-like                | `as const` object + union type, không dùng `enum`                                                         | `OrderStatus`                       |
| Composable export        | `useXxx`                                                                                                  | `export function useAuth()`         |
| Pinia store              | `useXxxStore`, id = tên feature                                                                           | `defineStore('auth', …)`            |
| Zod schema               | `xxxSchema`, type suy ra `XxxInput`                                                                       | `productSchema`                     |
| Component trong template | PascalCase                                                                                                | `<ProductTable />`                  |
| Props / emits            | camelCase cả script và template (`vue/attribute-hyphenation: never`, `vue/v-on-event-hyphenation: never`) | `:modelValue`, `@update:modelValue` |
| Route name               | `feature.action`                                                                                          | `products.list`, `products.edit`    |
| Route path               | chữ thường, nhiều từ nối `-` (URL, không phải tên file — giữ chuẩn web), số nhiều                         | `/products/:id/edit`, `/audit-logs` |
| i18n key                 | `feature.scope.key`, camelCase từng đoạn                                                                  | `products.form.titleCreate`         |
| Query key                | mảng bắt đầu bằng tên feature                                                                             | `['products', 'list', params]`      |
| Env                      | `VITE_` + UPPER_SNAKE                                                                                     | `VITE_API_BASE_URL`                 |

### B.3. Ranh giới feature

- **Whitelist**: code ngoài feature chỉ được import `@features/<x>/Use*` và `@features/<x>/types/*`; mọi đường dẫn khác vào `@features/**` bị chặn (bao gồm `api/`, `stores/`, `schemas/`, `components/`, `views/` và thư mục thêm sau).
- Trong cùng một feature: import nội bộ bằng đường dẫn tương đối `./` / `../` (không vượt ra ngoài thư mục feature); không dùng `@features/<chính-nó>/...`.
- `views/` chỉ được import từ `app/router/Routes.ts` (lazy `() => import(...)`).
- `types/` chỉ chứa type/const thuần dữ liệu. Map hành vi (VD `OrderStatus → color`) đặt trong `components/` của feature (§L.4), không đặt trong `types/` vì `types/` là interface công khai.
- Không dùng `index.ts` barrel.

---

## C. Git

### C.1. Nhánh

Hai nhánh dài hạn:

| Nhánh  | Vai trò                                                                    |
| ------ | -------------------------------------------------------------------------- |
| `main` | Bản đã phát hành. Chỉ nhận PR release từ `dev`. Release bằng tag `vX.Y.Z`. |
| `dev`  | Nhánh tích hợp. Mọi nhánh tính năng tách từ đây và merge về đây.           |

```text
main ──────────────●──────────────●──── (tag v0.1.0, v0.2.0…)
                  ╱              ╱
dev ──●──●──●──●─┴──●──●──●──●──┴──
       ╲  ╱  ╲  ╱
        feature/…  fix/…
```

- Nhánh tính năng tách từ `dev`, sống ngắn (≤ 3 ngày), merge lại `dev` qua PR.
- Release: mở PR `dev → main` (tiêu đề `chore(release): vX.Y.Z`), merge xong gắn tag trên `main`. PR release được miễn kiểm body (`pr-body.yml`).
- `hotfix/` tách từ `main`, merge vào `main`, rồi merge `main` ngược về `dev` để hai nhánh không lệch.
- Tên nhánh: `<type>/<TICKET>-<mo-ta-ngan>` (kebab-case, không dấu). Không có ticket thì bỏ phần `<TICKET>-`.

| type        | Dùng khi                        |
| ----------- | ------------------------------- |
| `feature/`  | Tính năng mới                   |
| `fix/`      | Sửa lỗi                         |
| `hotfix/`   | Sửa lỗi khẩn trên production    |
| `refactor/` | Đổi cấu trúc, không đổi hành vi |
| `chore/`    | Tooling, dependency, config     |
| `docs/`     | Tài liệu                        |
| `test/`     | Chỉ thêm/sửa test               |

Ví dụ: `feature/CMS-123-product-list`, `fix/CMS-210-refresh-token-loop`.

### C.2. Commit message — Conventional Commits

```text
<type>(<scope>): <subject>

[body — vì sao thay đổi]

[footer — Refs: CMS-123 | BREAKING CHANGE: ...]
```

- `type`: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`.
- `scope`: tên feature hoặc khu vực — `auth`, `products`, `orders`, `router`, `api`, `ui`, `deps`, `config`… (danh sách cấu hình trong `commitlint.config.ts`, sai scope thì báo lỗi).
- `subject`: tiếng Anh, thể mệnh lệnh, chữ thường đầu câu, không dấu chấm cuối, header ≤ 72 ký tự.
- Breaking change: `feat(api)!: ...` + footer `BREAKING CHANGE:`.
- Mỗi commit một ý; không commit code lỗi build.

Ví dụ: `feat(products): add server-side pagination to product table`.

### C.3. Pull Request

- Tiêu đề PR theo format commit (vì squash merge dùng tiêu đề PR làm commit message).
- ≤ ~400 dòng thay đổi (không tính file generated / lock); lớn hơn thì tách.
- Bắt buộc: CI xanh + ≥ 1 approve; resolve hết conversation.
- PR vào `dev`: **squash merge**; xoá nhánh sau khi merge.
- PR release `dev → main`: **merge commit** (không squash) để lịch sử của `dev` có trong `main`. Nếu squash thì `dev` và `main` lệch nhau sau mỗi lần release.
- Nhánh tính năng bị lệch thì rebase lên `dev`, không merge `dev` vào nhánh.

### C.4. Bảo vệ `main` và `dev` (làm tay trên GitHub)

- Cả hai nhánh: require PR, 1 approval, dismiss stale approvals; chặn force push và xoá nhánh.
- Require status checks: `lint`, `typecheck`, `test`, `build` (và `conventional-title`, `template-sections` khi đã có `pr-title.yml`, `pr-body.yml`).
- `dev`: require linear history (chỉ squash merge).
- `main`: không bật linear history, vì PR release dùng merge commit.
- Settings → bật "Allow squash merging" và "Allow merge commits", tắt "Allow rebase merging"; bật "Automatically delete head branches". Không xoá được `dev` vì đã chặn xoá nhánh.

---

## D. Git hooks (Husky)

| Hook         | Lệnh                                 | Mục đích                                   |
| ------------ | ------------------------------------ | ------------------------------------------ |
| `pre-commit` | `npx lint-staged`                    | ESLint `--fix` + Prettier trên file staged |
| `commit-msg` | `npx --no -- commitlint --edit "$1"` | Kiểm tra format commit                     |
| `pre-push`   | `npm run typecheck`                  | Chặn push code sai type                    |

`lint-staged.config.ts`:

> Nguồn: [`lint-staged.config.ts`](../lint-staged.config.ts) — tài liệu không chép lại code, đọc file.

`--no-verify` chỉ dùng khi khẩn cấp và phải ghi lý do trong PR. Test để CI chạy, không chạy trong hook.

---

## E. ESLint rules

Flat config `eslint.config.ts`, dựa trên `typescript-eslint` (strict), `eslint-plugin-vue` (`flat/recommended`), `eslint-config-prettier` (tắt rule format).

| Rule                                                      | Mức                                                  | Lý do                                                                                               |
| --------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `perfectionist/sort-imports`, `sort-named-imports`        | error                                                | Thứ tự import ổn định, auto-fix                                                                     |
| `unused-imports/no-unused-imports`                        | error                                                | Xoá import thừa khi fix                                                                             |
| `unused-imports/no-unused-vars`                           | warn (bỏ qua `_` prefix)                             |                                                                                                     |
| `@typescript-eslint/no-explicit-any`                      | error                                                | TypeScript strict thực sự                                                                           |
| `@typescript-eslint/consistent-type-imports`              | error                                                | `import type`, tree-shake tốt                                                                       |
| `@typescript-eslint/no-non-null-assertion`                | warn                                                 |                                                                                                     |
| `no-console`                                              | error, cho phép `warn`/`error`                       |                                                                                                     |
| `no-restricted-imports`                                   | error                                                | Ranh giới feature (§B.3, whitelist), ngoài `features/` cấm mọi `../`; trong feature cấm `../../`    |
| `vue/multi-word-component-names`                          | error                                                | Component ≥ 2 từ                                                                                    |
| `vue/component-name-in-template-casing`                   | error, `PascalCase`                                  | `<ProductTable />`                                                                                  |
| `vue/block-order`                                         | error, `script` → `template` → `style`               |                                                                                                     |
| `vue/define-macros-order`                                 | error, `defineProps` → `defineEmits` → `defineModel` |                                                                                                     |
| `vue/component-api-style`                                 | error, `script-setup`                                | Một kiểu viết duy nhất                                                                              |
| `vue/define-props-declaration`                            | error, `type-based`                                  |                                                                                                     |
| `vue/no-v-html`                                           | error                                                | Chỉ cho phép qua component sanitize DOMPurify                                                       |
| `vue/require-explicit-emits`                              | error                                                |                                                                                                     |
| `check-file/filename-naming-convention`                   | error                                                | `src/**/*.{ts,vue}` = PascalCase (bỏ qua phần hậu tố `.store`, `.api`…; ngoại lệ §B.1)              |
| `check-file/folder-naming-convention`                     | error                                                | `src/**/`, `e2e/**/`, `scripts/**/` = `^([a-z0-9]+                                                  | [A-Z][a-zA-Z0-9]*)$` (một từ thường hoặc PascalCase) |
| `check-file/filename-naming-convention` (ngoài src)       | error                                                | `e2e/**`, `scripts/**`, `src/assets/**`, `public/**` = PascalCase (trừ `favicon.svg`, `robots.txt`) |
| `vue/attribute-hyphenation`, `vue/v-on-event-hyphenation` | error, `never`                                       | Không kebab-case trong template                                                                     |

Ranh giới feature là whitelist (không cần thêm block khi có feature mới). `featureBoundary` viết bằng `regex` (lookahead), **không** dùng `group` cú pháp gitignore: với `group`, pattern `@features/**` loại luôn thư mục cha nên phần tử `!@features/*/Use*` không mở lại được file bên trong. Bảng `BOUNDARIES` và các pattern:

> Nguồn: [`eslint.config.ts`](../eslint.config.ts) — tài liệu không chép lại code, đọc file.

Ghi chú: trong flat config, block sau **thay** (không gộp) giá trị `no-restricted-imports` của block trước cho cùng file, nên mỗi block liệt kê đủ pattern của nó. Các pattern khác dùng `group` (cú pháp gitignore). Pattern `../../*` trong feature cho phép `features/x/components/A.vue` → `../api/X.api` nhưng chặn `../../products/...` (thoát khỏi `features/x/`). Hệ quả: trong feature chỉ lồng tối đa 1 cấp thư mục (`api/`, `components/`…), không tạo `components/sub/`. Mọi ca ranh giới có test tự động trong `eslint.config.spec.ts` (D41) — sửa bảng thì thêm ca vào đó.

> Nguồn: [`eslint.config.spec.ts`](../eslint.config.spec.ts) — tài liệu không chép lại code, đọc file.

Prettier (`.prettierrc.json`): `semi: false`, `singleQuote: true`, `printWidth: 100`, `trailingComma: "all"`, plugin `prettier-plugin-tailwindcss`.

---

## F. Template

### F.1. GitHub

`.github/pull_request_template.md`:

> Nguồn: [`.github/pull_request_template.md`](../.github/pull_request_template.md) — tài liệu không chép lại code, đọc file.

`.github/ISSUE_TEMPLATE/bug_report.md`: Mô tả · Các bước tái hiện · Kết quả mong đợi · Kết quả thực tế · Môi trường · Ảnh/log.

`.github/ISSUE_TEMPLATE/feature_request.md`: Bối cảnh · Yêu cầu · Tiêu chí chấp nhận · Quyền (role nào dùng) · Thiết kế (link Figma).

### F.2. Khung feature mới (copy tay, chưa có generator)

```text
features/<name>/
├── api/<Feature>.api.ts
├── schemas/<Entity>.schema.ts
├── types/<Entity>.types.ts
├── components/<Entity>Table.vue
├── views/<Entity>ListView.vue
└── Use<Feature>.ts            # chỉ khi feature khác cần dùng
```

Component mẫu:

```vue
<script setup lang="ts">
import type { Product } from '@features/products/types/Product.types'

const props = defineProps<{ items: Product[]; loading?: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <UTable :data="props.items" :loading="props.loading" />
</template>
```

Spec mẫu (`<File>.spec.ts`): `describe` theo tên module, `it` mô tả hành vi bằng tiếng Anh (`it('redirects to login when unauthenticated')`).

---

## G. Tooling

| Tool                | Vai trò                   | Package                                                                                                                                                                 |
| ------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EditorConfig        | Indent 2 space, LF, UTF-8 | —                                                                                                                                                                       |
| nvm                 | Ghim Node 22              | `.nvmrc` + `"engines": { "node": ">=22" }`                                                                                                                              |
| ESLint              | Lint                      | `eslint`, `typescript-eslint`, `eslint-plugin-vue`, `eslint-plugin-perfectionist`, `eslint-plugin-unused-imports`, `eslint-plugin-check-file`, `eslint-config-prettier` |
| Prettier            | Format                    | `prettier`, `prettier-plugin-tailwindcss`                                                                                                                               |
| Husky               | Git hooks                 | `husky`                                                                                                                                                                 |
| lint-staged         | Chạy trên file staged     | `lint-staged`                                                                                                                                                           |
| commitlint          | Kiểm tra commit           | `@commitlint/cli`, `@commitlint/config-conventional`                                                                                                                    |
| vue-tsc             | Typecheck                 | `vue-tsc`                                                                                                                                                               |
| Vitest / Playwright | Test                      | `vitest`, `@vue/test-utils`, `jsdom`, `@vitest/coverage-v8`, `axios-mock-adapter`, `@playwright/test` (§I)                                                              |
| openapi-typescript  | Sinh type API             | `npm run gen:api` (`scripts/GenApi.ts`)                                                                                                                                 |

npm scripts:

> Nguồn: [`package.json`](../package.json) — tài liệu không chép lại code, đọc file.

VS Code: `.vscode/settings.json` (format on save bằng Prettier, `source.fixAll.eslint: explicit`); `.vscode/extensions.json` gợi ý Vue - Official, ESLint, Prettier, Tailwind CSS IntelliSense, EditorConfig.

---

## H. Cấu hình i18n (vue-i18n)

- Dùng Composition API (`legacy: false`), locale mặc định `vi`, fallback `en`.
- Locale do **instance** sở hữu: `createAppI18n()` trả về plugin; khi `app.use()` nó đọc/persist `localStorage` (key `cms.locale`), đồng bộ `<html lang>` và locale Nuxt UI. `useLocale()` → `{ locale, uiLocale, setLocale }` inject chính instance đó. Không store nào khác giữ locale.
- **Không** export singleton `i18n`, **không** side effect lúc import. Mỗi app/test có đúng một instance do `createAppRuntime()` tạo (D37). Code ngoài setup (HttpClient) nhận `getLocale` do runtime truyền vào, đọc đúng instance đó.
- Một file JSON cho mỗi ngôn ngữ ở `src/locales/`; tách theo feature khi file > ~500 dòng (`locales/vi/products.json`).
- Key theo §B.2 (`feature.scope.key`); nhóm dùng chung là `common.*` (nút, trạng thái), `validation.*` (lỗi Zod), `errors.*` (mã lỗi API).
- Type-safe key: `MessageSchema = typeof vi`; component dùng `useT()` (trong `I18n.ts`) thay `useI18n()` — `t(key: MessageKey)` chỉ nhận key có thật nên `t('sai.key')` báo lỗi typecheck (`t` của vue-i18n nhận mọi `string`). Key động (`errors.<code>`) ép `as MessageKey` sau khi qua `messageKeyOf`.
- Nuxt UI: truyền locale tương ứng (`vi`, `en` từ `@nuxt/ui/locale`) vào `<UApp :locale>`.
- Format số/tiền/ngày: `numberFormats` (`currency: 'VND'`), `datetimeFormats`; không tự ghép chuỗi.
- Không hard-code text tiếng Việt/Anh trong `.vue` (kiểm tra khi review; có thể thêm `@intlify/eslint-plugin-vue-i18n` sau).

> Nguồn: [`src/shared/lib/i18n/I18n.ts`](../src/shared/lib/i18n/I18n.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/App.vue`](../src/App.vue) — tài liệu không chép lại code, đọc file.

---

## I. Cấu hình unit / component test (Vitest)

**Công cụ:** `vitest`, `@vue/test-utils`, `jsdom`, `@vitest/coverage-v8`, `axios-mock-adapter`.

**Chiến lược fake API (đã bỏ MSW):**

| Loại test                              | Cách fake                                                                                                                                        | Ví dụ                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Unit logic thuần (util, schema, guard) | Không fake                                                                                                                                       | `Product.schema.spec.ts`                                                                         |
| HTTP client                            | `createHttpClient({ session, transport: mock.adapter() })` trực tiếp trong `HttpClient.spec.ts` (Session dựng bằng `createSession({ initial })`) | N request 401 → 1 lần `session.refresh()`; mất mạng → `ApiError` `NETWORK_ERROR`                 |
| Session                                | Pinia thật + `axios-mock-adapter` cho endpoint refresh, `QueryClient` thật                                                                       | `Session.spec.ts`: signIn/logout, `switchStore` xoá cache, refresh thất bại → phát `authFailure` |
| Component / composable / view          | `axios-mock-adapter` trên HTTP client mà `renderWithPlugins()` cung cấp — **một seam duy nhất là HTTP**                                          | `ProductTable.spec.ts`                                                                           |
| Code dùng feature khác                 | Chỉ được mock interface công khai: `vi.mock('@features/x/UseX')`                                                                                 | Guard dùng `useAuth`                                                                             |

Cấm `vi.mock` vào file nội bộ của feature (`api/`, `stores/`…): test bị buộc vào cấu trúc file, đổi tên là vỡ.

**Quy tắc**

- Test đặt cạnh file nguồn (`*.spec.ts`); E2E ở `e2e/`, Vitest không quét `e2e/`.
- Mỗi test tự tạo Pinia (`createTestingPinia` hoặc `setActivePinia(createPinia())`), `QueryClient` mới (`retry: false`), i18n mới — tất cả do `createAppRuntime()` tạo trong `renderWithPlugins()`; không có singleton nào để rò giữa các test.
- `src/test/Setup.ts` bật `enableAutoUnmount(afterEach)` và xoá `localStorage`/`sessionStorage` sau mỗi test (Nuxt UI dùng shared composable cho locale/toast — không unmount là rò state).
- Helper `renderWithPlugins()` trong `src/test/Render.ts` gọi **chính** `createAppRuntime()` của app (D37) với override: transport mock (`axios-mock-adapter`), `notifier` giả, `session` khởi tạo sẵn trạng thái đã đăng nhập (override được), `retry: false`. Trả về `http` mock để khai báo response và `notifier` để assert toast. Không tự ráp plugin riêng → wiring test không lệch wiring prod.
- Không snapshot toàn component; assert theo hành vi (text, event, gọi API).
- Coverage: báo cáo, chưa đặt ngưỡng bắt buộc ở giai đoạn Foundation.

> Nguồn: [`vitest.config.ts`](../vitest.config.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/test/Setup.ts`](../src/test/Setup.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/test/Render.ts`](../src/test/Render.ts) — tài liệu không chép lại code, đọc file.

Script thêm: `"test:coverage": "vitest run --coverage"`.

---

## J. Cấu hình CSS (Tailwind v4 + Nuxt UI)

- Một entry duy nhất `src/assets/styles/main.css`, import trong `main.ts`. Không dùng SCSS, không CSS-in-JS.
- Tailwind v4 cấu hình bằng CSS (`@theme`), **không có** `tailwind.config.js`.
- Palette brand khai báo bằng `@theme` trong `main.css`; map màu ngữ nghĩa nằm duy nhất trong `Ui.config.ts` (D26, §L.9); component chỉ dùng màu ngữ nghĩa (`primary`, `neutral`, `error`…), không dùng mã màu cứng.
- Dark mode: class `dark` trên `<html>` do `useTheme()` gắn, mặc định theo hệ thống.
- Ưu tiên utility class trong template; `<style scoped>` chỉ khi không làm được bằng utility; cấm `<style>` không scoped (trừ `main.css`).
- Thứ tự class tự sắp xếp bằng `prettier-plugin-tailwindcss`.
- Không có `variables.css` riêng — token nằm trong `@theme` của `main.css`.
- Plugin `ui()` trong `vite.config.ts`: `autoImport: false`, `components: false` (import component tường minh: `import UButton from '@nuxt/ui/components/Button.vue'`), `colorMode: false` (chế độ màu do `useTheme()` quản lý, §L.11), `ui: uiConfig`.

Nội dung `main.css` đầy đủ: xem §L.9.

> Nguồn: [`vite.config.ts`](../vite.config.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/main.ts`](../src/main.ts) — tài liệu không chép lại code, đọc file.

`.vscode/settings.json` thêm `"files.associations": { "*.css": "tailwindcss" }` để IntelliSense hiểu `@theme`.

---

## K. Danh sách package

Nguyên tắc: chỉ cài khi có step/feature dùng đến; khoá version bằng `package-lock.json`; kiểm tra `npm audit` và license (cấm GPL) trước khi thêm package mới; mỗi package mới cần lý do trong PR.

### K.1. Dependencies — cài ở Foundation

TypeScript ghim `~5.9`: `typescript-eslint` cần `<6.1`, `openapi-typescript` cần `^5`. Nâng khi hai gói này hỗ trợ.

| Nhóm         | Package                                                                | Vai trò                                                    |
| ------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| Core         | `vue`, `vue-router`, `pinia`                                           | Framework, routing, client state                           |
| Server state | `@tanstack/vue-query`                                                  | Cache/fetch dữ liệu API                                    |
| HTTP         | `axios`                                                                | HTTP client + interceptor                                  |
| i18n         | `vue-i18n`                                                             | Đa ngôn ngữ (§H)                                           |
| UI           | `@nuxt/ui`, `tailwindcss`                                              | Component + styling (§J)                                   |
| Icon         | `@iconify-json/lucide`                                                 | Bộ icon offline cho Nuxt UI                                |
| Validation   | `zod`                                                                  | Schema env (`Env.config.ts`); sau này cả form, list params |
| Tiện ích     | `@vueuse/core`                                                         | Composable dùng chung (debounce, storage…)                 |
| Font         | `@fontsource-variable/inter`, `@fontsource-variable/plus-jakarta-sans` | Font self-host (§L.5)                                      |

> Nguồn: [`package.json`](../package.json) — tài liệu không chép lại code, đọc file.

### K.2. Dependencies — cài khi tới Phase tương ứng (§30)

| Package                                              | Khi nào                                     | Vai trò                                                                                            |
| ---------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `echarts`, `vue-echarts`                             | Phase 4 — Dashboard                         | Biểu đồ, import theo module, lazy-load                                                             |
| `@tiptap/vue-3`, `@tiptap/pm`, `@tiptap/starter-kit` | Phase 5 — Product (mô tả)                   | Rich text editor                                                                                   |
| `dompurify`                                          | Cùng lúc Tiptap                             | Sanitize HTML trước khi render (`vue/no-v-html`)                                                   |
| `vee-validate`, `@vee-validate/zod`                  | Form có validate đầu tiên (login thật / P5) | Form + map lỗi API; field array cho Variants (lý do chọn: FE_architecture §2)                      |
| `dayjs`                                              | P5 — `RelativeTime.vue`                     | Format ngày giờ, thời gian tương đối                                                               |
| `@internationalized/date`                            | DatePicker đầu tiên                         | Kiểu ngày cho DatePicker Nuxt UI (có thể đã có sẵn qua `@nuxt/ui` — chỉ thêm khi import trực tiếp) |

### K.3. DevDependencies

| Nhóm      | Package                                                                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build     | `vite`, `@vitejs/plugin-vue`, `typescript`, `vue-tsc`, `@types/node`, `@vue/tsconfig`                                                                                                                    |
| Lint      | `eslint`, `typescript-eslint`, `eslint-plugin-vue`, `eslint-plugin-perfectionist`, `eslint-plugin-unused-imports`, `eslint-plugin-check-file`, `eslint-config-prettier`, `jiti` (đọc `eslint.config.ts`) |
| Format    | `prettier`, `prettier-plugin-tailwindcss`                                                                                                                                                                |
| Git       | `husky`, `lint-staged`, `@commitlint/cli`, `@commitlint/config-conventional`                                                                                                                             |
| Unit test | `vitest`, `@vitest/coverage-v8`, `@vue/test-utils`, `jsdom`, `axios-mock-adapter`, `@pinia/testing`                                                                                                      |
| E2E       | `@playwright/test`                                                                                                                                                                                       |
| API types | `openapi-typescript`, `tsx` (chạy `scripts/GenApi.ts`)                                                                                                                                                   |
| Dev UX    | `vite-plugin-vue-devtools`, `vite-plugin-checker`, `@tanstack/vue-query-devtools`, `vite-tsconfig-paths`                                                                                                 |
| PWA       | `vite-plugin-pwa`, `@vite-pwa/assets-generator`                                                                                                                                                          |
| Test data | `@faker-js/faker`                                                                                                                                                                                        |
| Bảo trì   | `knip`, `rollup-plugin-visualizer`                                                                                                                                                                       |

> Nguồn: [`package.json`](../package.json) — tài liệu không chép lại code, đọc file.

### K.4. Lib bổ trợ — cân nhắc, chưa cài

| Package                           | Dùng khi                                   | Ghi chú                                             |
| --------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| `@intlify/eslint-plugin-vue-i18n` | Muốn ESLint bắt text hard-code / key thiếu | Bổ sung cho §H                                      |
| `@intlify/unplugin-vue-i18n`      | Locale tách nhiều file, muốn precompile    | Giảm bundle, bỏ runtime compiler                    |
| `pinia-plugin-persistedstate`     | Nhiều store cần persist                    | Hiện chỉ locale → dùng `useLocalStorage` của VueUse |
| `@sentry/vue`                     | Có môi trường production                   | Theo dõi lỗi runtime                                |
| `nprogress`                       | Muốn thanh tiến trình khi đổi route        | Có thể dùng `ULoadingIndicator`/tự làm              |

### K.5. Không dùng

| Package                                | Lý do                                            |
| -------------------------------------- | ------------------------------------------------ |
| `msw`                                  | Đã bỏ (D18)                                      |
| `lodash`                               | Dùng JS thuần + VueUse; nếu cần thì `es-toolkit` |
| `moment`                               | Đã chọn dayjs                                    |
| `sass`                                 | CSS-first Tailwind (§J)                          |
| `vuex`                                 | Đã chọn Pinia                                    |
| `unplugin-auto-import` cho code nội bộ | Quy định import tường minh (§2)                  |

---

## L. Design system (token CSS)

Nguồn sự thật: token trong `main.css` (`@theme`) + map màu ngữ nghĩa của Nuxt UI trong `vite.config.ts`. Khi có Figma thì đồng bộ giá trị từ Figma vào đây; **tên token giữ nguyên**.

> Giá trị màu `brand` dưới đây là **tạm thời**, chờ màu thương hiệu chính thức.

### L.1. Ba tầng token

| Tầng                     | Ví dụ                                                         | Ai được dùng                                            |
| ------------------------ | ------------------------------------------------------------- | ------------------------------------------------------- |
| 1. Palette (giá trị thô) | `--color-brand-500`, `--color-slate-200`                      | Chỉ `main.css` và `vite.config.ts`                      |
| 2. Ngữ nghĩa (Nuxt UI)   | `primary`, `neutral`, `success`, `--ui-bg`, `--ui-text-muted` | Component, layout                                       |
| 3. Nghiệp vụ             | `OrderStatus → color`                                         | Component nghiệp vụ, qua map trong `types/` của feature |

Quy tắc: component **không** dùng tầng 1 (`bg-brand-500`, `#e11d48`, `text-slate-700`); chỉ dùng tầng 2 (`bg-primary`, `text-muted`, `color="error"`).

### L.2. Bảng màu

**Palette brand (tạm):**

| Step | Hex       |
| ---- | --------- |
| 50   | `#fff1f2` |
| 100  | `#ffe4e6` |
| 200  | `#fecdd3` |
| 300  | `#fda4af` |
| 400  | `#fb7185` |
| 500  | `#f43f5e` |
| 600  | `#e11d48` |
| 700  | `#be123c` |
| 800  | `#9f1239` |
| 900  | `#881337` |
| 950  | `#4c0519` |

**Map ngữ nghĩa (Nuxt UI):**

| Màu ngữ nghĩa | Palette   | Dùng cho                                    |
| ------------- | --------- | ------------------------------------------- |
| `primary`     | `brand`   | Nút chính, link, focus, item sidebar active |
| `secondary`   | `indigo`  | Hành động phụ nổi bật (hiếm dùng)           |
| `success`     | `emerald` | Thành công, đã giao, còn hàng               |
| `info`        | `sky`     | Thông tin, đang xử lý                       |
| `warning`     | `amber`   | Cảnh báo, sắp hết hàng, chờ xác nhận        |
| `error`       | `red`     | Lỗi, xoá, huỷ, hết hàng                     |
| `neutral`     | `slate`   | Nền, chữ, viền, trạng thái nháp             |

Không thêm màu ngữ nghĩa mới nếu chưa thống nhất; cần màu mới thì bổ sung vào bảng này trước.

### L.3. Token nền / chữ / viền (Nuxt UI, tự đổi theo dark mode)

| Mục đích                     | Class                               | Biến                                  |
| ---------------------------- | ----------------------------------- | ------------------------------------- |
| Nền trang                    | `bg-default`                        | `--ui-bg`                             |
| Nền khối phụ (card, sidebar) | `bg-muted` / `bg-elevated`          | `--ui-bg-muted`, `--ui-bg-elevated`   |
| Chữ chính                    | `text-default` / `text-highlighted` | `--ui-text`, `--ui-text-highlighted`  |
| Chữ phụ                      | `text-muted` / `text-dimmed`        | `--ui-text-muted`, `--ui-text-dimmed` |
| Viền                         | `border-default` / `border-muted`   | `--ui-border`, `--ui-border-muted`    |

### L.4. Màu theo trạng thái nghiệp vụ

Map đặt trong component badge của feature (VD `features/orders/components/OrderStatusBadge.vue`), không đặt trong `types/` (§B.3). Feature khác cần hiển thị trạng thái thì dùng component đó qua `Use*.ts` hoặc nhận màu qua prop:

| Đối tượng | Trạng thái → màu                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Order     | `pending` → warning · `confirmed` → info · `shipping` → primary · `delivered` → success · `cancelled` → error · `refunded` → neutral |
| Product   | `draft` → neutral · `active` → success · `archived` → warning                                                                        |
| Tồn kho   | còn hàng → success · sắp hết → warning · hết hàng → error                                                                            |

(Tên trạng thái chính xác sẽ chốt khi làm domain model; bảng này chỉ cố định **nguyên tắc** và màu.)

### L.5. Typography

Kết hợp 2 font: **Plus Jakarta Sans** (display — tiêu đề, số nổi bật) + **Inter** (mọi thứ còn lại). Cùng họ sans, x-height gần nhau nên ghép không lệch.

| Token            | Giá trị                                                  | Class                  |
| ---------------- | -------------------------------------------------------- | ---------------------- |
| `--font-sans`    | `'Inter Variable', ui-sans-serif, system-ui, sans-serif` | mặc định (`font-sans`) |
| `--font-display` | `'Plus Jakarta Sans Variable', var(--font-sans)`         | `font-display`         |
| `--font-mono`    | `ui-monospace, SFMono-Regular, monospace`                | `font-mono`            |

**Phân vai**

| Vị trí                                      | Font              | Cỡ · độ đậm                       |
| ------------------------------------------- | ----------------- | --------------------------------- |
| Tiêu đề trang                               | Plus Jakarta Sans | `text-2xl` · 600                  |
| Tiêu đề card / section / modal              | Plus Jakarta Sans | `text-lg` · 600                   |
| Số KPI Dashboard                            | Plus Jakarta Sans | `text-3xl` · 700 · `tabular-nums` |
| Logo / tên store ở sidebar                  | Plus Jakarta Sans | `text-base` · 700                 |
| Body, bảng, form, nút, badge, menu, tooltip | Inter             | `text-sm` · 400/500               |
| Cột tiền, số lượng                          | Inter             | `tabular-nums`                    |
| SKU, mã đơn                                 | mono hệ thống     | `text-xs`                         |

**Quy tắc**

- `font-display` chỉ dùng cho chữ ≥ 18px hoặc số nổi bật; **không** dùng trong bảng, form.
- Tiêu đề trang đi qua component `PageHeader.vue` (gắn sẵn `font-display`), không tự gõ class ở từng view.
- Thang cỡ: `text-xs` 12 · `text-sm` 14 (mặc định) · `text-base` 16 · `text-lg` 18 · `text-xl` 20 · `text-2xl` 24 · `text-3xl` 30 (KPI).
- Độ đậm: 400 · 500 · 600; 700 chỉ cho KPI và logo.
- Tự host qua `@fontsource-variable/inter`, `@fontsource-variable/plus-jakarta-sans` (§K.1), chỉ subset `latin`, `latin-ext`, `vietnamese` (~60–80KB tổng), `font-display: swap`.
- Phương án thay thế nếu designer đổi: Be Vietnam Pro, Manrope — chỉ đổi giá trị token, không sửa code.

### L.6. Spacing, radius, shadow, kích thước

| Nhóm         | Quy tắc                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Spacing      | Thang Tailwind (bội 4px). Khoảng cách chuẩn: trong card `p-4`, giữa section `gap-6`, padding trang `p-6` (mobile `p-4`) |
| Radius       | `--ui-radius: 0.375rem`; dùng `rounded-md` (control), `rounded-lg` (card), `rounded-full` (avatar, badge tròn)          |
| Shadow       | Chỉ `shadow-xs` (card), `shadow-lg` (dropdown, modal); ưu tiên viền thay bóng                                           |
| Control size | Mặc định Nuxt UI `md`; bảng dày dùng `sm`                                                                               |
| Sidebar      | Rộng 256px, thu gọn 64px                                                                                                |
| Container    | Nội dung tối đa `max-w-screen-2xl`                                                                                      |

### L.7. Breakpoint, z-index, motion

- Breakpoint Tailwind mặc định: `sm 640` · `md 768` · `lg 1024` (sidebar cố định từ `lg`) · `xl 1280` · `2xl 1536`. Mục tiêu chính là desktop ≥ 1280.
- z-index: để Nuxt UI quản lý overlay; code tự viết chỉ dùng `z-10` (sticky header bảng), `z-20` (sidebar mobile). Không dùng số tuỳ ý.
- Motion: `transition-colors duration-150` cho hover; tôn trọng `motion-reduce:`.

### L.8. Dark mode & accessibility

- Hỗ trợ light/dark, mặc định theo hệ thống, cho người dùng chọn (lưu `localStorage`).
- Chỉ dùng token L.3 nên dark mode tự đúng; cấm `dark:` với mã màu thô.
- Độ tương phản chữ ≥ 4.5:1 (WCAG AA); không truyền đạt trạng thái **chỉ** bằng màu — badge luôn có chữ.
- Luôn giữ focus ring của Nuxt UI (`focus-visible`), không `outline-none` trần.

### L.9. Cấu hình

> Nguồn: [`src/assets/styles/main.css`](../src/assets/styles/main.css) — tài liệu không chép lại code, đọc file.

Map màu ngữ nghĩa (bảng §L.2) khai báo **một lần** trong `src/app/config/Ui.config.ts` (§L.11), `vite.config.ts` chỉ import (§J).

### L.10. Kiểm soát

- ESLint/review: cấm mã màu hex/rgb trong `.vue` và class palette thô (`bg-rose-*`, `text-slate-*`) — thêm rule `no-restricted-syntax` cho chuỗi class khi cần, trước mắt kiểm tra trong PR checklist.
- Trang `/design-system` (chỉ chạy ở dev) hiển thị toàn bộ màu ngữ nghĩa, badge trạng thái, nút, form — dùng để duyệt token với designer.

### L.11. Theme

**Chế độ màu**

- 3 lựa chọn: Sáng / Tối / Theo hệ thống; mặc định **Theo hệ thống**.
- Nút chuyển ở menu avatar (góc phải header); lưu `localStorage` key `cms.colorMode`.
- Dùng `useColorMode` của VueUse, không tự viết; **phải** cấu hình `storageKey: 'cms.colorMode'` (mặc định của VueUse là `vueuse-color-scheme`) cho khớp script chống nháy bên dưới. Bọc trong một composable `useTheme()` (đặt ở `shared/composables/UseTheme.ts`) để key chỉ khai báo một chỗ.
- Chống nháy trắng: script inline trong `<head>` của `index.html` gắn class `dark` trước khi Vue chạy.

> Nguồn: [`index.html`](../index.html) — tài liệu không chép lại code, đọc file.

**Dark mode**

- `primary` dùng step 400 (light dùng 600) — §L.9.
- Nền: `neutral` = slate → nền dark `slate-950`, khối phụ `slate-900` (token `--ui-bg`, `--ui-bg-muted` của Nuxt UI).
- ECharts: 2 theme `cms-light` / `cms-dark` đăng ký từ token, tự đổi theo `useColorMode` (làm ở Phase 4).

**Mặc định component**

Chỉnh tập trung trong `src/app/config/Ui.config.ts`, import vào `vite.config.ts` (thêm file này vào `tsconfig.node.json`). Không truyền lặp props size/variant ở từng chỗ dùng.

> Nguồn: [`src/app/config/Ui.config.ts`](../src/app/config/Ui.config.ts) — tài liệu không chép lại code, đọc file.

`vite.config.ts` import `uiConfig` như §J. `Ui.config.ts` không được import gì từ `src/` (chạy trong Node lúc build).

**Không làm (giai đoạn này)**

- Theme theo từng Store: cả CMS một màu thương hiệu; store hiện tại hiển thị bằng tên/badge ở header.
- Người dùng tự chọn màu primary, chế độ mật độ compact/comfortable (mặc định bảng gọn).

---

## M. HTTP client, seam với auth và StoreScope

`shared/lib/` không được import `features/`. HttpClient nhận auth/Store qua một collaborator `Session` (`shared/lib/session/`) và locale qua `getLocale`; mọi thứ được nối trong `createAppRuntime()` (`app/Runtime.ts`, D37).

### M.1. Interface: hẹp, có kiểu theo Swagger, không lộ axios

> Nguồn: [`src/shared/lib/api/client/HttpClient.ts`](../src/shared/lib/api/client/HttpClient.ts) — tài liệu không chép lại code, đọc file.

- Không trả `AxiosInstance`: caller không đổi được `validateStatus`, không gắn interceptor riêng, không đi vòng qua chuẩn hoá lỗi. Đổi thư viện HTTP chỉ sửa file này.
- `HTTP_CLIENT_KEY` và `useHttpClient()` nằm chung `HttpClient.ts` (một module, một file interface).
- `HttpClientDeps` không có kiểu axios. Test thay transport bằng `deps.transport` (qua `createAppRuntime({ transport })`), không có hàm nội bộ riêng cho test.
- **Một file** (`HttpClient.ts`, ~150 dòng): không tách `AxiosTransport` / `RefreshQueue` / `NormalizeError`, không cần rule ESLint `noClientInternals` (D40). Chỉ tách khi file > ~300 dòng **và** phần tách ra có spec riêng có ích.
- `skipAuth` là cách duy nhất để gọi API không kèm token; refresh vì thế vẫn có `Accept-Language` và lỗi vẫn là `ApiError`.
- Trước khi có Swagger thật, `paths` là placeholder → các helper kiểu rơi về `unknown`; khi `npm run gen:api` chạy (đọc `OPENAPI_URL` từ `.env.local` hoặc biến môi trường) thì URL, body, response tự có kiểu và path không có trong Swagger sẽ báo lỗi typecheck.
- Upload file lên S3 (presigned PUT) **không** đi qua HttpClient (khác origin, không gắn token) — `MediaUpload.ts` dùng `fetch` riêng.

### M.2. Session và composition root

**Session** = ai đang đăng nhập (token) và đang quản lý Store nào, cùng điều xảy ra khi chúng đổi. Một module sâu ở `shared/lib/session/Session.ts`, không phụ thuộc Vue context (interceptor gọi nó ngoài `setup`):

> Nguồn: [`src/shared/lib/session/Session.ts`](../src/shared/lib/session/Session.ts) — tài liệu không chép lại code, đọc file.

- State nằm trong `useSessionStore` (Pinia, nội bộ `session/`), chỉ gồm token + storeId. Thông tin user (`features/auth`) và danh sách Store (`features/StoreScope`) vẫn ở feature của mình.
- `features/auth` và `features/StoreScope` **bọc** Session: `useAuth().login()` gọi API rồi `session.signIn()`; `useAuth().logout()` = `session.logout()`; `useStoreScope().switchStore` = `session.switchStore`. Không còn `createAuthAdapter` / `createStoreScopeAdapter`.
- Xoá cache khi logout / đổi Store chỉ xảy ra **trong Session** — một chỗ duy nhất.
- Composable lấy Session qua `useSession()` (inject); Vue component không gọi `useSessionStore` trực tiếp.

**Composition root — `createAppRuntime()` (D37):**

> Nguồn: [`src/app/Runtime.ts`](../src/app/Runtime.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/main.ts`](../src/main.ts) — tài liệu không chép lại code, đọc file.

- `transport` là override nội bộ dành cho test (không lộ kiểu axios ra feature).
- Một cách duy nhất: `*.api.ts` lấy client bằng `useHttpClient()` trong composable; không nhận client làm tham số, không import singleton.
- `Runtime.spec.ts`: dựng runtime với transport mock → request có token + `X-Store-Id` + `Accept-Language`; `authFailure` điều hướng về `auth.login`. Đây là test cho wiring prod.

### M.3. StoreScope: feature không cần biết `storeId`

- `HttpClient` gắn header `X-Store-Id` từ `session.getStoreId()` vào mọi request (bỏ qua nếu null).
- `switchStore(id)` (Session) tự persist và gọi `queryClient.clear()` → cache Store cũ bị xoá, query đang mở tự fetch lại.
- Hệ quả: query key **không** chứa `storeId` (`['products', 'list', params]`); file `*.api.ts` không gọi `useStoreScope()`.
- **Chờ BE xác nhận** nhận header `X-Store-Id`. _Phương án dự phòng (chưa đưa vào interface, D40):_ nếu BE bắt buộc `storeId` trong path (`/stores/{storeId}/products`), thêm vào `HttpClientDeps` một `getDefaultPathParams()` do runtime cấp từ `session.getStoreId()` — chỉ làm khi BE chốt.
- `StoreSwitcher.vue` đặt ở `layouts/components/`, chỉ dùng `useStoreScope()`; composable không trả về component.

> Nguồn: [`src/features/StoreScope/UseStoreScope.ts`](../src/features/StoreScope/UseStoreScope.ts) — tài liệu không chép lại code, đọc file.

---

## N. Import alias

Mỗi thư mục cấp 1 trong `src/` có một alias (7 alias: `@app`, `@assets`, `@features`, `@layouts`, `@locales`, `@shared`, `@test`). Quy tắc import tương đối (ESLint, §E):

- **Ngoài `features/`**: chỉ được `./` (cùng thư mục). Mọi `../` đều bị chặn, kể cả trong cùng thư mục cấp 1 (`layouts/components/AppHeader.vue` → `../AuthLayout.vue` phải viết `@layouts/AuthLayout.vue`).
- **Trong một feature**: được `./` và `../` (một cấp, giữa `api/`, `components/`…); `../../` bị chặn.
- Còn lại luôn dùng alias.

| Alias         | Trỏ tới          | Ví dụ                                                                                                          |
| ------------- | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `@app/*`      | `src/app/*`      | `@app/router/Router` (chỉ `main.ts`)                                                                           |
| `@assets/*`   | `src/assets/*`   | `@assets/images/Logo.svg`                                                                                      |
| `@features/*` | `src/features/*` | `@features/auth/UseAuth`                                                                                       |
| `@layouts/*`  | `src/layouts/*`  | `@layouts/DashboardLayout.vue`                                                                                 |
| `@shared/*`   | `src/shared/*`   | `@shared/components/feedback/ErrorState.vue`, `@shared/lib/api/errors/ApiError`, `@shared/types/Api.generated` |
| `@locales/*`  | `src/locales/*`  | `@locales/vi.json`                                                                                             |
| `@test/*`     | `src/test/*`     | `@test/Render` (chỉ trong `*.spec.ts`)                                                                         |

- Không có alias gốc `@/` — mỗi import cho thấy ngay nó thuộc tầng nào, ESLint kiểm tra chiều phụ thuộc (§A) dễ hơn.
- **Nguồn duy nhất là `tsconfig.app.json`** (`paths` dạng `./src/...`, không cần `baseUrl`); Vite/Vitest đọc lại qua `vite-tsconfig-paths` với `loose: true` (thiếu `loose` thì import alias từ file `.vue` không resolve), không khai báo lặp `resolve.alias`.

> Nguồn: [`tsconfig.app.json`](../tsconfig.app.json) — tài liệu không chép lại code, đọc file.

> Nguồn: [`vite.config.ts`](../vite.config.ts) — tài liệu không chép lại code, đọc file.

Thứ tự nhóm import (`perfectionist/sort-imports`): built-in → package ngoài → alias nội bộ (`@app`, `@features`… theo bảng) → tương đối `./ ../` → `import type` cuối mỗi nhóm. Cấu hình `internalPattern: ['^@(app|assets|features|layouts|locales|shared|test)/']`.

---

## O. Lỗi API, mã lỗi, xử lý trong HttpClient

### O.1. `ApiError` — một kiểu lỗi duy nhất

Mọi lỗi đi ra khỏi HttpClient **luôn** là `ApiError` (kể cả mất mạng, timeout, lỗi parse). Code phía trên không bao giờ phải đọc `AxiosError`.

> Nguồn: [`src/shared/lib/api/errors/ApiError.ts`](../src/shared/lib/api/errors/ApiError.ts) — tài liệu không chép lại code, đọc file.

### O.2. Mã lỗi (`ErrorCode.ts`)

Hai nguồn mã:

| Nguồn                                | Ví dụ                                                                                                                                                             | Khai báo ở                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Client (mặc định theo status / mạng) | `NETWORK_ERROR`, `TIMEOUT`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED`, `CONFLICT`, `BUSINESS_RULE`, `RATE_LIMITED`, `SERVER_ERROR`, `UNKNOWN` | `shared/lib/api/errors/ErrorCode.ts`                                        |
| BE nghiệp vụ                         | `PRODUCT_SLUG_TAKEN`, `ORDER_ALREADY_SHIPPED`                                                                                                                     | Swagger (enum trong `Api.generated.ts`) khi BE cung cấp; trước đó là string |

> Nguồn: [`src/shared/lib/api/errors/ErrorCode.ts`](../src/shared/lib/api/errors/ErrorCode.ts) — tài liệu không chép lại code, đọc file.

**Hiển thị:** không bao giờ show `error.message` của BE. Text lấy từ i18n theo thứ tự: `errors.<code>` → `errors.<codeFromStatus(status)>` → `errors.UNKNOWN`. Mã nghiệp vụ của feature cũng nằm trong nhóm `errors.*` (`errors.PRODUCT_SLUG_TAKEN`). Thứ tự tra cứu này là `messageKeyOf(error)` trong `ErrorPolicy.ts` (§O.4); `UseNotify` chỉ gọi `t(messageKeyOf(e))`, không component nào tự tra.

### O.3. Xử lý trong HttpClient

Toàn bộ là **chi tiết nội bộ** trong `HttpClient.ts`; interface vẫn chỉ là `createHttpClient(deps)` (§M). Ba bước dưới là ba hàm private trong cùng file:

| Thứ tự | Hàm nội bộ (trong `HttpClient.ts`) | Loại                 | Việc làm                                                                                                                                                                  |
| ------ | ---------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | `attachHeaders(config)`            | request interceptor  | Gắn `Authorization` (bỏ nếu `skipAuth`), `Accept-Language`, `X-Store-Id` (bỏ nếu null)                                                                                    |
| 2      | `retryAfterRefresh(error)`         | response interceptor | 401 → chờ **một** `session.refresh()` đang chạy, gắn token mới, gửi lại request; refresh trả null → ném lỗi (Session đã phát `authFailure`); bỏ qua request có `skipAuth` |
| 3      | `toApiError(error)`                | response interceptor | Mọi lỗi còn lại → `throw ApiError` (bảng dưới); đăng ký **cuối cùng** để chạy sau bước 2                                                                                  |

Mọi ca dưới đây được test trong `HttpClient.spec.ts` qua interface (`createHttpClient({ transport: mock.adapter() })`), không test hàm private — refactor bên trong không làm vỡ test.

`HttpClientDeps` xem §M.1. Timeout mặc định 15s.

Bảng chuẩn hoá lỗi (`toApiError`, nội bộ):

| Đầu vào                                        | Kết quả                                                    |
| ---------------------------------------------- | ---------------------------------------------------------- |
| Có response, body `{ code, message, details }` | `ApiError(status, code, message, details.fields)`          |
| Có response, body không đúng chuẩn             | `ApiError(status, codeFromStatus(status), …)`              |
| `ECONNABORTED` / timeout                       | `ApiError(0, TIMEOUT)`                                     |
| Không có response                              | `ApiError(0, NETWORK_ERROR)`                               |
| Request bị huỷ (`AbortController`)             | Ném lại nguyên lỗi huỷ — **không** coi là lỗi, không toast |

### O.4. Xử lý lỗi: global hay internal

**Error policy** (`shared/lib/api/errors/ErrorPolicy.ts`, D39) là nơi duy nhất trả lời "lỗi này xử lý thế nào". Bảng dưới là đặc tả của nó; `ErrorPolicy.spec.ts` có một ca cho mỗi dòng.

> Nguồn: [`src/shared/lib/api/errors/ErrorPolicy.ts`](../src/shared/lib/api/errors/ErrorPolicy.ts) — tài liệu không chép lại code, đọc file.

Các module tiêu thụ chỉ là adapter mỏng:

- `shared/lib/query/QueryClient.ts` — `retry` dùng `isRetryable`; `MutationCache.onError` dùng `routeMutationError` (`'toast'` → `onMutationError`).
- `shared/composables/UseNotify.ts` — chỉ hiển thị: `error(e)` = toast `t(messageKeyOf(e, te))`; bỏ qua nếu `isSilent(e)`.
- `shared/lib/form/ApplyApiErrorToForm.ts` — được gọi khi `routeMutationError` trả `'form'`.
- `app/providers/ErrorHandling.ts` — chỉ glue Vue (`errorHandler`, `unhandledrejection`, `router.onError`), dùng `isSilent` + notifier.
- `toApiError` trong `HttpClient.ts` là bước transport (axios → `ApiError`), không phải policy.

Nguyên tắc: **lỗi đọc dữ liệu (query) hiển thị tại chỗ; lỗi hành động (mutation) mặc định toast global**, trừ khi màn hình tự xử lý được tốt hơn.

| Tình huống                                             | Ai xử lý                                                            | Hiển thị                                                                                                 |
| ------------------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 401                                                    | Global — `retryAfterRefresh` trong HttpClient + `Session.refresh()` | Refresh im lặng; thất bại → về `/login` + toast `errors.UNAUTHORIZED`                                    |
| Query lỗi (list, detail)                               | **Internal** — view                                                 | `ErrorState` + nút Retry (§21); không toast                                                              |
| Query 404                                              | Internal                                                            | `ErrorState` "không tìm thấy" trong trang, hoặc `router.replace({ name: 'not-found' })` với trang detail |
| Query 403                                              | Internal                                                            | `ErrorState` "không có quyền"; route bị guard chặn từ trước thì vào `ForbiddenView`                      |
| Mutation 400 / 422 có `fields`                         | **Internal** — form                                                 | `applyApiErrorToForm()` gắn lỗi vào field; trả `false` → toast global                                    |
| Mutation 409 / 422 không `fields`, 403, 429, 5xx, mạng | **Global** — `MutationCache.onError`                                | Toast lỗi theo §O.2                                                                                      |
| Mutation cần xử lý riêng (VD dialog xác nhận khi 409)  | Internal — khai báo `meta: { errorHandling: 'local' }`              | Màn hình tự quyết định                                                                                   |
| Lỗi JS không bắt (render, watcher, promise)            | Global — `app.config.errorHandler`, `unhandledrejection`            | Toast `errors.UNKNOWN` + `console.error` (sau này gửi Sentry)                                            |
| Lỗi tải chunk khi đổi route                            | Global — `router.onError`                                           | Reload trang một lần                                                                                     |

> Nguồn: [`src/shared/lib/query/QueryClient.ts`](../src/shared/lib/query/QueryClient.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/shared/lib/query/VueQuery.d.ts`](../src/shared/lib/query/VueQuery.d.ts) — tài liệu không chép lại code, đọc file.

`ErrorHandling.ts` có một interface: `installErrorHandling(app, { router, notifier })` — gắn `app.config.errorHandler`, `unhandledrejection`, `router.onError`. `main.ts` gọi một lần.

`notifier` tạo bằng `createNotifier({ toast, t, te })` trong `UseNotify.ts`, runtime truyền `useToast()` của Nuxt UI và `translate`/`has` của i18n — dùng được ngoài `setup`. Test truyền notifier giả (`createFakeNotifier()` trong `src/test/Render.ts`). `useNotify()` inject đúng instance đó.

Component **không** tự `try/catch` để toast lỗi mutation (đã có global); chỉ toast **thành công** qua `useNotify().success(...)`.

---

## P. Dialog, toast: global hay internal

| Loại                                                     | Phạm vi                  | Đặt ở                                           | Cách mở                                                                         |
| -------------------------------------------------------- | ------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| Toast (thành công / lỗi)                                 | Global                   | Nuxt UI `UApp` (đã có sẵn)                      | `useNotify()` → `{ success(key), error(e) }`                                    |
| Dialog xác nhận (xoá, huỷ đơn, bỏ thay đổi chưa lưu)     | **Global**, generic      | `shared/components/confirm/ConfirmDialog.vue`   | `await useConfirm()({ title, description, confirmLabel?, color? })` → `boolean` |
| Modal nghiệp vụ (sửa nhanh sản phẩm, chọn ảnh, gán role) | **Internal** của feature | `features/<x>/components/<Entity>Modal.vue`     | `useOverlay().create(Comp)` của Nuxt UI hoặc `<UModal v-model:open>` trong view |
| Slideover chi tiết (xem nhanh đơn hàng)                  | Internal                 | `features/<x>/components/<Entity>Slideover.vue` | Như trên                                                                        |

Quy tắc:

- Dialog global **không** chứa nghiệp vụ, không gọi API, chỉ nhận text / màu qua tham số. Text truyền vào là i18n key đã dịch.
- Feature không đăng ký dialog global mới. Cần dùng lại modal nghiệp vụ ở feature khác → export hàm mở từ `Use<Feature>.ts` (VD `useMedia().pickImages(): Promise<Media[]>`), không import component.
- Một dialog = một Promise: hàm mở trả về kết quả (`boolean`, dữ liệu đã chọn hoặc `null` khi đóng), caller `await`, không dùng event bus / store để điều khiển dialog.
- Rời trang khi form có thay đổi chưa lưu: `onBeforeRouteLeave` + `useConfirm()`.
- Mọi dialog phải đóng được bằng Esc, focus quay về nút mở (Nuxt UI lo sẵn, không tắt).

> Nguồn: [`src/shared/components/confirm/UseConfirm.ts`](../src/shared/components/confirm/UseConfirm.ts) — tài liệu không chép lại code, đọc file.

```ts
// dùng trong view
const confirm = useConfirm()
const { mutate } = useDeleteProduct()

async function onDelete(id: string) {
  if (!(await confirm({ title: t('products.delete.title'), color: 'error' }))) return
  mutate(id, { onSuccess: () => notify.success('products.delete.done') })
  // lỗi → toast global (§O.4)
}
```

---

## Q. Cấu trúc từng module

### Q.1. Khung chuẩn một feature

- `<Feature>`: tên feature dạng PascalCase, **số nhiều** như tên thư mục (`Products`, `Orders`) — dùng cho `api`, `routes`, `Use*`.
- `<Entity>`: tên thực thể **số ít** (`Product`, `Order`) — dùng cho `schemas`, `types`, `components`, `views`.
- Feature không đếm được giữ nguyên: `Auth`, `Dashboard`, `Inventory`, `Media`.

Mọi feature theo đúng khung này; thư mục con nào chưa có file thì chưa tạo.

```text
features/<name>/
├── api/
│   ├── <Entity>.mapper.ts         # CHỈ khi DTO lệch Model (§T.3)
│   ├── <Entity>.mapper.spec.ts
│   ├── <Feature>.api.ts           # hàm HTTP + query key (nội bộ) + composable Vue Query trả Model (export)
│   └── <Feature>.api.spec.ts      # test invalidate, map params
├── components/                 # presentational: props in / emits out, không gọi API (§T.1)
│   ├── <Entity>Form.vue
│   ├── <Entity>Form.spec.ts
│   ├── <Entity>StatusBadge.vue   # map trạng thái → màu (§L.4)
│   ├── <Entity>Table.vue
│   └── <Entity>Table.spec.ts
├── composables/                # logic màn hình (§T.1) — tách khi ≥ 2 view dùng hoặc logic đủ dày
│   ├── Use<Entity>Actions.ts     # xoá/đổi trạng thái: confirm + mutation + toast
│   ├── Use<Entity>Form.ts        # schema + mutation + applyApiErrorToForm
│   └── Use<Entity>Form.spec.ts
├── schemas/
│   ├── <Entity>.schema.ts        # Zod: form + list params
│   └── <Entity>.schema.spec.ts
├── types/
│   └── <Entity>.types.ts         # Model của FE — KHÔNG alias DTO (§T.3)
├── views/                      # container, gắn route, chỉ Routes.ts import
│   ├── <Entity>CreateView.vue
│   ├── <Entity>DetailView.vue
│   ├── <Entity>EditView.vue
│   └── <Entity>ListView.vue
├── <Feature>.routes.ts            # mảng RouteRecordRaw của feature, Routes.ts gộp lại
├── Use<Feature>.ts                # chỉ khi feature khác cần dùng
└── Use<Feature>.spec.ts
```

`<Feature>.routes.ts` thêm vào whitelist §B.3 (chỉ `app/router/Routes.ts` được import), để route của feature nằm cùng feature và lazy-import `./views/...` bằng đường dẫn tương đối.

**Feature tối thiểu** = `api/` + `types/` + `views/` (+ `<Feature>.routes.ts`); mọi thư mục khác thêm khi cần. Tầng tuỳ chọn: `composables/` và `*.mapper.ts` chỉ tạo khi có lý do (quy tắc ≥ 2 nơi dùng áp dụng cả trong feature; mapper khi DTO lệch Model). Ban đầu view gọi thẳng composable của `api/`.

Thứ tự phụ thuộc bên trong feature (§T.1): `views → components` (props/emits) và `views → [composables] → api → [mapper] → types`; `components` chỉ import `types/`, `schemas/`, `@shared/components`; `stores/` (nếu có) chỉ `api/` và `Use<Feature>.ts` dùng.

### Q.2. Từng feature

```text
features/
├── auth/                                   # Foundation (khung) · P2
│   ├── api/
│   │   └── Auth.api.ts                     # login, logout, refresh, me
│   ├── components/                         # P2
│   │   ├── LoginForm.vue
│   │   └── LoginForm.spec.ts
│   ├── schemas/                            # P2
│   │   └── Login.schema.ts
│   ├── stores/
│   │   └── Auth.store.ts                   # token + user, nội bộ
│   ├── types/
│   │   └── Auth.types.ts                   # CurrentUser, Permission
│   ├── views/
│   │   └── LoginView.vue
│   ├── Auth.routes.ts
│   ├── UseAuth.ts                          # useAuth() — bọc Session
│   └── UseAuth.spec.ts
├── StoreScope/                             # Foundation (stub) · P3
│   ├── api/
│   │   └── StoreScope.api.ts               # Store user được truy cập
│   ├── stores/
│   │   └── StoreScope.store.ts             # danh sách Store; storeId nằm ở Session (D34)
│   ├── types/
│   │   └── StoreScope.types.ts
│   ├── UseStoreScope.ts                    # useStoreScope() — bọc Session
│   └── UseStoreScope.spec.ts
├── dashboard/                              # P4
│   ├── api/
│   │   └── Dashboard.api.ts
│   ├── components/
│   │   ├── KpiCard.vue
│   │   ├── RevenueChart.vue                # echarts, lazy
│   │   └── TopProductsTable.vue
│   ├── types/
│   │   └── Dashboard.types.ts
│   ├── views/
│   │   └── DashboardView.vue
│   └── Dashboard.routes.ts
├── products/                               # P5
│   ├── api/
│   │   ├── Product.mapper.ts
│   │   ├── Product.mapper.spec.ts
│   │   ├── Products.api.ts
│   │   └── Products.api.spec.ts
│   ├── components/
│   │   ├── ProductForm.vue
│   │   ├── ProductForm.spec.ts
│   │   ├── ProductImagesField.vue          # dùng useMedia().pickImages()
│   │   ├── ProductStatusBadge.vue
│   │   ├── ProductTable.vue
│   │   ├── ProductTable.spec.ts
│   │   └── ProductVariantsField.vue
│   ├── composables/
│   │   ├── UseProductActions.ts
│   │   ├── UseProductForm.ts
│   │   └── UseProductForm.spec.ts
│   ├── schemas/
│   │   ├── Product.schema.ts
│   │   └── Product.schema.spec.ts
│   ├── types/
│   │   └── Product.types.ts
│   ├── views/
│   │   ├── ProductCreateView.vue
│   │   ├── ProductEditView.vue
│   │   └── ProductListView.vue
│   ├── Products.routes.ts
│   └── UseProducts.ts                      # orders/inventory cần chọn sản phẩm
├── categories/                             # P6
│   ├── api/
│   │   └── Categories.api.ts
│   ├── components/
│   │   ├── CategoryFormModal.vue           # modal internal (§P)
│   │   └── CategoryTree.vue
│   ├── schemas/
│   │   └── Category.schema.ts
│   ├── types/
│   │   └── Category.types.ts
│   ├── views/
│   │   └── CategoryListView.vue
│   ├── Categories.routes.ts
│   └── UseCategories.ts                    # products cần chọn danh mục
├── orders/                                 # P7
│   ├── api/
│   │   └── Orders.api.ts
│   ├── components/
│   │   ├── OrderItemsTable.vue
│   │   ├── OrderStatusBadge.vue
│   │   ├── OrderStatusActions.vue          # chuyển trạng thái + useConfirm
│   │   ├── OrderTable.vue
│   │   └── OrderTimeline.vue
│   ├── schemas/
│   │   └── OrderListParams.schema.ts
│   ├── types/
│   │   └── Order.types.ts
│   ├── views/
│   │   ├── OrderDetailView.vue
│   │   └── OrderListView.vue
│   └── Orders.routes.ts
├── customers/                              # P8
│   ├── api/
│   │   └── Customers.api.ts
│   ├── components/
│   │   ├── CustomerOrdersTable.vue         # gọi qua UseOrders nếu cần, không import orders/api
│   │   └── CustomerTable.vue
│   ├── types/
│   │   └── Customer.types.ts
│   ├── views/
│   │   ├── CustomerDetailView.vue
│   │   └── CustomerListView.vue
│   └── Customers.routes.ts
├── inventory/                              # P9
│   ├── api/
│   │   └── Inventory.api.ts
│   ├── components/
│   │   ├── StockAdjustModal.vue
│   │   ├── StockLevelBadge.vue
│   │   └── StockTable.vue
│   ├── schemas/
│   │   └── StockAdjust.schema.ts
│   ├── types/
│   │   └── Inventory.types.ts
│   ├── views/
│   │   └── InventoryListView.vue
│   └── Inventory.routes.ts
└── media/                                  # P5 (cùng Product, §17.1)
    ├── api/
    │   ├── Media.api.ts                    # presign, complete, list
    │   ├── MediaUpload.ts                  # 4 bước presign → PUT → complete, progress, huỷ, retry (§17.1)
    │   └── MediaUpload.spec.ts
    ├── components/
    │   ├── MediaGrid.vue
    │   └── MediaPickerModal.vue            # mở qua useMedia().pickImages()
    ├── types/
    │   └── Media.types.ts
    ├── views/
    │   └── MediaLibraryView.vue
    ├── Media.routes.ts
    └── UseMedia.ts                         # pickImages(): Promise<Media[]>, upload(files) → { progress, cancel }
```

### Q.3. Interface công khai của các module

Bảng gồm shared module (`shared/`) và interface công khai của feature / `app/` mà nơi khác gọi tới. Chỉ các dòng `shared/` là shared module theo [GLOSSARY.md](../GLOSSARY.md).

| Module                                               | Interface                                                                                                                   | Giấu bên trong                                                                                            |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `shared/lib/api/client/HttpClient.ts`                | `createHttpClient(deps): HttpClient` (get/post/put/patch/delete có kiểu theo Swagger), `HTTP_CLIENT_KEY`, `useHttpClient()` | axios, gắn header (token, locale, `X-Store-Id`), path param mặc định, gom refresh, timeout, chuẩn hoá lỗi |
| `shared/lib/session/Session.ts`                      | `createSession()`, `useSession()`                                                                                           | token, storeId, refresh (1 lần đồng thời), xoá cache khi logout/đổi Store, sự kiện `authFailure`          |
| `features/auth/UseAuth.ts`                           | `useAuth()` → `{ user, isAuthenticated, can, ensureUser, login, logout }`                                                   | user, login/logout qua Session                                                                            |
| `shared/lib/api/errors/ApiError.ts` + `ErrorCode.ts` | `ApiError`, `isApiError`, `ErrorCode`, `codeFromStatus`                                                                     | — (kiểu dữ liệu)                                                                                          |
| `features/StoreScope/UseStoreScope.ts`               | `useStoreScope()` → `{ storeId, stores, current, switchStore }`                                                             | danh sách Store; đổi Store ủy quyền cho Session                                                           |
| `shared/composables/UsePwa.ts`                       | `usePwa()` → `{ needRefresh, reload }`                                                                                      | Đăng ký SW, kiểm tra định kỳ                                                                              |
| `shared/lib/form/ApplyApiErrorToForm.ts`             | `applyApiErrorToForm(error, form): boolean`                                                                                 | Map `fields`, phân biệt 400/422                                                                           |
| `shared/composables/UseNotify.ts`                    | `useNotify()` → `{ success, error, prompt }`; `createNotifier(deps)` dùng ngoài setup                                       | Hiển thị toast; key lấy từ `ErrorPolicy.messageKeyOf`                                                     |
| `shared/lib/api/errors/ErrorPolicy.ts`               | `isRetryable`, `messageKeyOf`, `isSilent`, `routeMutationError`                                                             | Toàn bộ quy tắc §O.4                                                                                      |
| `shared/components/confirm/UseConfirm.ts`            | `useConfirm()` → `(opts) => Promise<boolean>`                                                                               | `useOverlay`, `ConfirmDialog.vue`                                                                         |
| `app/providers/ErrorHandling.ts`                     | `installErrorHandling(app, deps)`                                                                                           | errorHandler, unhandledrejection, chunk reload                                                            |
| `shared/lib/query/QueryClient.ts`                    | `createAppQueryClient(onMutationError)`                                                                                     | Nối ErrorPolicy vào Vue Query (retry, MutationCache)                                                      |
| `shared/lib/i18n/I18n.ts`                            | `createAppI18n()`, `useLocale()`, `useT()`                                                                                  | persist, `<html lang>`, locale Nuxt UI — do instance sở hữu                                               |
| `shared/composables/UseTheme.ts`                     | `useTheme()` → `{ mode }` (ref ghi được)                                                                                    | storage key, đồng bộ script chống nháy                                                                    |

---

## R. PWA, chặn index

### R.1. Chặn công cụ tìm kiếm

CMS là trang admin, **không được index**. Ba lớp, làm cả ba:

| Lớp                 | Nội dung                                            | Ghi chú                                                                             |
| ------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `index.html`        | `<meta name="robots" content="noindex, nofollow">`  | Bot đọc HTML                                                                        |
| `public/robots.txt` | `User-agent: *` + `Disallow: /`                     | Bot ngoan chấp hành; không phải cơ chế bảo mật                                      |
| Header server/CDN   | `X-Robots-Tag: noindex, nofollow` trên mọi response | Chắc nhất, áp dụng cả file tĩnh/PDF; cấu hình ở hạ tầng deploy (ghi chú cho DevOps) |

Thêm vào manifest PWA không ảnh hưởng. SEO thật (slug, meta của sản phẩm) thuộc Customer Store, ngoài phạm vi plan này.

### R.2. PWA

Mục tiêu cho CMS (công cụ nội bộ, dữ liệu nhạy cảm): **cài được như app, mở nhanh, báo khi có bản mới**. **Không** làm offline dữ liệu.

| Hạng mục         | Quyết định                                                                                                                                                                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plugin           | `vite-plugin-pwa` (Workbox, `generateSW`)                                                                                                                                                                                                                                                                               |
| Cài đặt          | Manifest `display: standalone`, `start_url: /`, `theme_color` = `brand-600`, `background_color` = `--ui-bg` (sáng)                                                                                                                                                                                                      |
| Icon             | Sinh từ `src/assets/images/Logo.svg` (cấu hình `images` trong `pwa-assets.config.ts`) bằng `@vite-pwa/assets-generator` (`pwa-assets.config.ts`), gồm maskable + apple-touch — `pwaAssets.integration.publicDir` trỏ `src/assets/images` để icon xuất ra `dist/`; `public/favicon.svg` là bản sao logo cho thẻ link SVG |
| Cache            | **Chỉ precache app shell** (JS/CSS/font/icon). Không cache response API (`/api/**` trong `navigateFallbackDenylist`, không có `runtimeCaching` cho API) — tránh lộ dữ liệu sau logout và tránh dữ liệu cũ                                                                                                               |
| Cập nhật         | `registerType: 'prompt'`: có bản mới → toast "Đã có phiên bản mới" + nút **Tải lại**; không tự reload (mất dữ liệu form đang nhập)                                                                                                                                                                                      |
| Kiểm tra bản mới | Mỗi 60 phút và khi tab được focus lại                                                                                                                                                                                                                                                                                   |
| Offline          | Mất mạng → `OfflineBanner` cố định đầu trang; mutation bị chặn ở UI (nút lưu disabled), query giữ dữ liệu đang có                                                                                                                                                                                                       |
| Dev              | `devOptions.enabled: false` (tránh SW cache khi dev); kiểm tra bằng `npm run build && npm run preview`                                                                                                                                                                                                                  |
| Không làm        | Web push, background sync, offline CRUD                                                                                                                                                                                                                                                                                 |

> Nguồn: [`vite.config.ts`](../vite.config.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/shared/composables/UsePwa.ts`](../src/shared/composables/UsePwa.ts) — tài liệu không chép lại code, đọc file.

- `DashboardLayout.vue` theo dõi `needRefresh` → `useNotify()` hiện toast có action Tải lại.
- `tsconfig.app.json` thêm `"types": ["vite-plugin-pwa/vue", "vite-plugin-pwa/info"]`.
- Logout: không cần xoá cache SW vì không cache API; xoá Vue Query cache (`queryClient.clear()`) trong `session.logout()`.

---

## S. Tính năng & tool bổ trợ cho CMS

### S.1. Tính năng tăng tốc thao tác (làm sẵn ở Foundation, phần nghiệp vụ gắn dần theo Phase)

| Tính năng                           | Cách làm                                                                                                                                                                                                                                                                                                                                                                        | Phase                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Navigation module**               | `layouts/Navigation.ts` — **một nơi duy nhất** suy ra từ route meta: `buildNavigation(routes, can)` (hàm thuần) → `{ sidebar, commands, shortcuts, titleOf }`; `useNavigation()` bọc reactive với `useAuth().can`. Sidebar, palette, bảng phím tắt, `document.title` chỉ render kết quả, không tự đọc `meta`. Test: `Navigation.spec.ts`, không mount (D38)                     | Foundation                                    |
| **Command palette** (`Ctrl/⌘ + K`)  | `UCommandPalette` của Nuxt UI trong `layouts/components/CommandPalette.vue`, render `useNavigation().commands`. Nhóm "Đi tới" từ route có `meta.command` (đã lọc theo `can()` trong Navigation); nhóm "Hành động nhanh" (Tạo sản phẩm, Tạo danh mục…) cũng khai báo bằng `meta.command` của route create; nhóm "Tìm kiếm" gọi qua `Use<Feature>.ts` (`useProducts().search(q)`) | P5 (Phase đầu có ≥ 2 route có `meta.command`) |
| **Phím tắt**                        | `defineShortcuts` của Nuxt UI, đọc `useNavigation().shortcuts` — Navigation gộp phím từ `meta.command.shortcut` (`g d`, `g p`, `g o`, `n`) với phím toàn cục không gắn route (`/`, `?`, `Ctrl/⌘+K`)                                                                                                                                                                             | P5                                            |
| Bảng phím tắt                       | `layouts/components/ShortcutsHelpModal.vue`, render `useNavigation().shortcuts`                                                                                                                                                                                                                                                                                                 | P5                                            |
| **Cảnh báo rời trang khi chưa lưu** | `shared/composables/UseUnsavedGuard.ts`: `onBeforeRouteLeave` + `beforeunload` + `useConfirm()`                                                                                                                                                                                                                                                                                 | P5                                            |
| **Bộ lọc đã lưu**                   | Trong `UseListState.ts`: lưu/đặt tên tổ hợp filter vào `localStorage` theo route (`cms.views.<routeName>`)                                                                                                                                                                                                                                                                      | P5                                            |
| **Xem gần đây**                     | `shared/composables/UseRecentItems.ts` lưu 10 bản ghi vừa mở (id, title, route), hiện trong command palette                                                                                                                                                                                                                                                                     | P5                                            |
| **Thao tác hàng loạt**              | `DataTable.vue` hỗ trợ chọn nhiều + thanh bulk action (xoá, đổi trạng thái), luôn qua `useConfirm()`                                                                                                                                                                                                                                                                            | P5                                            |
| **Xuất CSV**                        | `shared/lib/export/ExportCsv.ts` (không dùng thư viện), xuất theo filter hiện tại                                                                                                                                                                                                                                                                                               | P10                                           |
| **Sao chép nhanh**                  | `shared/components/display/CopyText.vue` (SKU, mã đơn) dùng `useClipboard` của VueUse                                                                                                                                                                                                                                                                                           | P5                                            |
| **Tương đối thời gian**             | `dayjs/plugin/relativeTime` + tooltip ngày giờ đầy đủ                                                                                                                                                                                                                                                                                                                           | P5                                            |

Route meta dùng chung (khai báo kiểu trong `src/app/router/RouteMeta.d.ts`):

> Nguồn: [`src/app/router/RouteMeta.d.ts`](../src/app/router/RouteMeta.d.ts) — tài liệu không chép lại code, đọc file.

`Router.ts` đặt `document.title` từ `titleOf(route)` của Navigation sau mỗi lần điều hướng (không tự đọc `meta.titleKey`).

### S.2. Tool cho dev

| Tool                           | Vai trò                                                                              | Có từ      |
| ------------------------------ | ------------------------------------------------------------------------------------ | ---------- |
| `vite-plugin-checker`          | Hiện lỗi `vue-tsc` + ESLint ngay trên overlay trình duyệt khi `npm run dev`          | Foundation |
| `vite-plugin-vue-devtools`     | Vue devtools trong trang                                                             | Foundation |
| `@tanstack/vue-query-devtools` | Xem cache query, chỉ load khi dev                                                    | Foundation |
| `@faker-js/faker`              | Factory dữ liệu test: `src/test/factories/<Entity>.factory.ts`                       | Foundation |
| `.github/dependabot.yml`       | PR cập nhật dependency hằng tuần, gom nhóm theo `vue`, `nuxt-ui`, `eslint`, `vitest` | Foundation |
| `knip`                         | Tìm file/export/dependency thừa — chạy `npm run knip` trong CI (không chặn merge)    | Foundation |
| `rollup-plugin-visualizer`     | `npm run analyze` xem kích thước bundle                                              | Foundation |

---

## T. Luồng dữ liệu — tách bạch data khỏi UI

### T.1. Các tầng trong một feature

```text
            ┌──────────────────────────── feature ─────────────────────────────┐
 Route ──►  views/            container: lấy data, điều phối, KHÔNG markup phức tạp
              │  props ▼  ▲ emits
            components/       presentational: chỉ props in / emits out, KHÔNG gọi API
              │
            [composables/]    logic màn hình: form, filter, quyền — tuỳ chọn
              │
            api/<Feature>.api.ts   server state: Vue Query composable, query key, invalidate
              │
            [api/<Entity>.mapper.ts] DTO ⇄ Model — chỉ khi lệch
            └──┼──────────────────────────────────────────────────────────────┘
               ▼
            shared/lib/api/client/HttpClient  ──►  BE
```

| Tầng                           | Được làm                                                                                                                        | Không được làm                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `views/` (container)           | Gọi composable của `api/` và `composables/`; truyền **model** xuống component qua props; xử lý emits; Loading/Empty/Error (§21) | Gọi `useHttpClient()`; map DTO; chứa logic validate                     |
| `components/` (presentational) | Render theo props, emit sự kiện, state UI cục bộ (mở/đóng, hover)                                                               | Import `../api/`, `../stores/`, `../composables/`; gọi router; biết DTO |
| `composables/` (feature)       | Ghép schema + mutation + `applyApiErrorToForm`; tính toán dẫn xuất                                                              | Render; giữ bản sao dữ liệu server                                      |
| `api/<Feature>.api.ts`         | Hàm HTTP (nội bộ), query key, `useXxxQuery` / `useXxxMutation`, invalidate; **trả về Model**                                    | Toast thành công, điều hướng, UI                                        |
| `api/<Entity>.mapper.ts`       | `toModel(dto)`, `toPayload(input)` — thuần, có test                                                                             | Gọi HTTP, phụ thuộc Vue                                                 |
| `types/`                       | **Model** của FE (tên field theo FE, `Date` thay chuỗi ISO, tiền là `number`…)                                                  | Re-export DTO                                                           |
| `schemas/`                     | Zod cho **input** form và list params                                                                                           | Kiểu server trả về                                                      |

### T.2. Ba loại dữ liệu, ba chỗ ở

| Loại                    | Ở đâu                                 | Ví dụ                                          | Quy tắc                                                                        |
| ----------------------- | ------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| Server state            | Vue Query cache (qua `api/`)          | danh sách sản phẩm, đơn hàng                   | **Không** copy vào Pinia/`ref`; đọc qua query, đổi qua mutation + invalidate   |
| Client state dùng chung | Pinia trong `stores/` của feature     | token, Store đang chọn                         | Chỉ `api/` và `Use<Feature>.ts` đọc/ghi                                        |
| UI / form state         | `ref` trong component hoặc composable | bản nháp form, dialog mở, filter (đồng bộ URL) | Form làm việc trên **bản nháp** (`XxxInput` từ schema), submit mới `toPayload` |

### T.3. DTO không đi ra khỏi `api/`

- Kiểu `components['schemas'][...]` từ `Api.generated.ts` **chỉ** được import trong `features/*/api/**` và `shared/lib/api/**` (ESLint §E, `noDto`).
- Khi DTO trùng Model: **không tạo mapper**. `types/` vẫn khai báo Model độc lập (không alias DTO); `api/` trả DTO với kiểu Model — TypeScript so khớp cấu trúc nên BE đổi field là typecheck báo lỗi ngay trong `api/`.
- Khi lệch (đổi tên, `Date`, tiền chuỗi → `number`…): tạo `<Entity>.mapper.ts` + test; BE đổi tiếp chỉ sửa mapper, view/component không đổi.

```ts
// features/products/api/Product.mapper.ts
import type { components } from '@shared/types/Api.generated'
import type { Product, ProductInput } from '../types/Product.types'

type ProductDto = components['schemas']['ProductDto']

export const toProduct = (dto: ProductDto): Product => ({
  id: dto.id,
  name: dto.name,
  price: Number(dto.price),
  status: dto.status,
  updatedAt: new Date(dto.updatedAt),
})

export const toProductPayload = (
  input: ProductInput,
): components['schemas']['UpsertProductDto'] => ({
  name: input.name.trim(),
  price: String(input.price),
  status: input.status,
})
```

```ts
// features/products/api/Products.api.ts — interface: chỉ các composable
export function useProductsQuery(params: MaybeRef<ProductListParams>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => productKeys.list(toValue(params))),
    queryFn: async ({ signal }) => {
      const page = await http.get('/products', { query: toValue(params), signal })
      return { ...page, items: page.items.map(toProduct) } // Model, không DTO
    },
  })
}
```

```vue
<!-- features/products/views/ProductListView.vue — container -->
<script setup lang="ts">
const { params, setPage } = useListState(productListParamsSchema)
const { data, isPending, isError, refetch } = useProductsQuery(params)
const { remove } = useProductActions() // composables/: confirm + mutation
</script>

<template>
  <ErrorState v-if="isError" @retry="refetch" />
  <ProductTable
    v-else
    :items="data?.items ?? []"
    :loading="isPending"
    @delete="remove"
    @page="setPage"
  />
</template>
```

---

## U. Áp dụng SOLID

Áp dụng ở mức **module** (file, composable, adapter), không ép thành class/interface cho mọi thứ. Một seam chỉ tạo khi có ≥ 2 adapter thật (VD: HttpClient thật + adapter test).

| Nguyên lý                     | Áp dụng trong CMS                                                                                                                                                                                                                                                                                                     | Ở đâu                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **S** — Single Responsibility | Mỗi tầng một lý do để đổi: hiển thị (component), điều phối (view), logic màn hình (composable), server state (api), hình dạng dữ liệu (mapper), vận chuyển HTTP (HttpClient). Tầng tuỳ chọn (composable, mapper) chỉ tạo khi có trách nhiệm thật                                                                      | §T.1, §O.3                 |
| **O** — Open/Closed           | Mở rộng bằng **khai báo**, không sửa lõi: thêm route → tự vào sidebar/command palette/phím tắt qua `meta`; thêm mã lỗi → thêm key `errors.*`; thêm cột bảng → mảng `columns` truyền vào `DataTable`; thêm trạng thái → thêm dòng trong map màu                                                                        | §S.1, §O.2, §L.4, §22      |
| **L** — Liskov Substitution   | Mọi adapter tại một seam phải giữ đúng hợp đồng của interface: `HttpClient` test (adapter mock) vẫn ném `ApiError`, vẫn trả `data`; Session dựng với `initial` trong test vẫn phát `authFailure` khi refresh thất bại. Component bọc Nuxt UI (VD `DataTable`) nhận/emit đúng như component gốc, không đổi nghĩa props | §M, §I                     |
| **I** — Interface Segregation | Interface nhỏ theo nhu cầu caller: `useStoreScope()` chỉ 3 thành viên; HttpClient chỉ thấy `Session` (token, storeId, refresh) — không thấy `login`, `user`, danh sách Store; props component chỉ nhận Model cần hiển thị, không nhận cả object query                                                                 | §M, §Q.3                   |
| **D** — Dependency Inversion  | Tầng thấp không biết tầng cao: `HttpClient` phụ thuộc hàm (`getAccessToken`, `getStoreId`…), không import feature; feature phụ thuộc interface `HttpClient`, không phụ thuộc axios; mọi thứ được nối ở **một** nơi — `createAppRuntime()` trong `app/Runtime.ts` (composition root, D37)                              | §A (chiều phụ thuộc), §M.2 |

**Không làm (tránh over-engineering):**

- Không tạo `IProductRepository` + class `ProductRepository` — `Products.api.ts` đã là seam; test đi qua HTTP (§I).
- Không DI container (inversify…) — `provide/inject` của Vue + composition root là đủ.
- Không base class cho component/store; tái sử dụng bằng composable và composition.
- Không tách interface khi chỉ có một adapter và không có test cần thay thế.
- Không tạo module chuyển tiếp: mapper identity, composable chỉ gọi lại mutation, file interceptor 3 dòng.

**Kiểm soát:** ESLint (§E) chặn `components/` import `api/`/`stores/`/`composables/` và chặn DTO ngoài `api/`; checklist PR thêm mục "Không có DTO ngoài `api/`, component không gọi API".

---
