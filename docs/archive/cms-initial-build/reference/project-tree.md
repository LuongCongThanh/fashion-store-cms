# A. Cây thư mục đầy đủ

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

Ký hiệu: không đánh dấu = tạo ở Foundation (Step 1–6) · `(P2)`, `(P5)`… = tạo khi tới Phase tương ứng ở §30 FE_architecture. Thư mục chỉ được tạo khi có file đầu tiên bên trong (không tạo thư mục rỗng). Cấu trúc bên trong từng feature: xem §Q.

```text
cms/
├── .github/                                # cấu hình GitHub
│   ├── ISSUE_TEMPLATE/                     # mẫu tạo issue
│   │   ├── bug_report.md                   # mẫu báo lỗi
│   │   └── feature_request.md              # mẫu đề xuất tính năng
│   ├── workflows/                          # GitHub Actions
│   │   └── ci.yml                          # CI: lint, type-check, test, build, e2e cho mỗi PR
│   ├── dependabot.yml                      # tự động mở PR cập nhật dependency
│   └── pull_request_template.md            # checklist mô tả PR
├── .husky/                                 # git hooks
│   ├── pre-commit                          # chạy lint-staged trên file đã stage
│   ├── commit-msg                          # kiểm tra message theo Conventional Commits (commitlint)
│   └── pre-push                            # chạy type-check + unit test trước khi push
├── .vscode/                                # cấu hình editor dùng chung cho team
│   ├── settings.json                       # format on save, ESLint/Prettier làm mặc định
│   └── extensions.json                     # extension VS Code khuyến nghị
├── docs/                                   # tài liệu kiến trúc + kế hoạch
│   ├── FE_architecture.md                  # kiến trúc FE (nguồn quyết định)
│   └── scaffold-plan.md                    # tài liệu này — kế hoạch dựng khung
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
│   │       ├── DesignSystemView.vue        # /admin/design-system, chỉ dev (§L.10)
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
```

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần trước](project-tree-02.md)
