# Sơ đồ điều hướng (Navigation flow)

Nguồn: [`src/app/router/Routes.ts`](../src/app/router/Routes.ts), [`src/app/router/Guards.ts`](../src/app/router/Guards.ts), [`src/features/auth/Auth.routes.ts`](../src/features/auth/Auth.routes.ts).

## Luồng chạy

```mermaid
flowchart TD
    U([Người dùng mở web]) --> ROOT["/"]
    ROOT -->|redirect| ADMIN["/admin"]

    ADMIN --> G{authGuard:<br/>đã đăng nhập?}
    G -->|Chưa| LOGIN["/login?redirect=/admin<br/>(AuthLayout → LoginView)"]
    G -->|Rồi| P{Route có<br/>meta.permission?}
    P -->|Không| HOME["/admin = home<br/>(DashboardLayout)"]
    P -->|Có → ensureUser rồi can()| OK{Có quyền?}
    OK -->|Có| PAGE[Trang feature]
    OK -->|Không| F403["/admin/403 (ForbiddenView)"]

    LOGIN -->|login thành công → safeRedirect(redirect)| ADMIN
    LOGIN -->|Quên mật khẩu?| FORGOT["/forgot-password"]
    FORGOT -->|Quay lại| LOGIN
    HOME -->|UserMenu → Đăng xuất ❓| LOGIN

    ANY["URL không khớp"] --> NF["NotFoundView (404)"]
```

❓ = chưa thấy code thực hiện, xem [Câu hỏi mở](#câu-hỏi-mở).

## Cây route

```
/                              → redirect sang /admin (không có trang)
├── AuthLayout                 (không cần đăng nhập)
│   ├── /login                 auth.login            (guestOnly)
│   └── /forgot-password       auth.forgot-password  (guestOnly)
├── DashboardLayout            /admin — meta.requiresAuth
│   ├── /admin                 home          (dashboard thật làm ở P4)
│   ├── /admin/403             forbidden
│   └── /admin/design-system   design-system (chỉ DEV)
└── /:pathMatch(.*)*           not-found     (không có layout)
```

## Trang nào chạy trước

1. Vào `/` → redirect `/admin`.
2. `authGuard` kiểm tra `meta.requiresAuth`: chưa đăng nhập → `/login?redirect=<đích>`.
3. Đã đăng nhập: nếu route có `meta.permission` thì gọi `ensureUser()` (tải lại user sau F5), rồi `can()`; không đủ quyền → `forbidden`.

→ Người dùng mới luôn thấy **Login** đầu tiên; người đã đăng nhập thấy **home**.

## Trang nào ngang hàng

| Cấp                     | Các trang ngang nhau                                                  | Ghi chú                                 |
| ----------------------- | --------------------------------------------------------------------- | --------------------------------------- |
| Layout gốc              | `AuthLayout`, `DashboardLayout`, `not-found`                          | 404 không bọc layout                    |
| Trong `DashboardLayout` | `home`, `forbidden`, `design-system` (+ feature sau này, vd `orders`) | Dùng chung sidebar/header               |
| Trong `AuthLayout`      | `auth.login`, `auth.forgot-password`                                  | Nhánh riêng, không ngang với `/admin/*` |

## Câu hỏi mở

1. ~~**Sau login đi đâu?**~~ Đã chốt: về `query.redirect` nếu là path dưới `/admin`, ngược lại về `/admin` ([`SafeRedirect.ts`](../src/features/auth/SafeRedirect.ts)). Người đã đăng nhập mở trang `guestOnly` → về `/admin`.
2. **Sau logout đi đâu?** `logout()` chỉ xoá user + `session.logout()`; chưa xác nhận có về `/login` không.
3. **404 không có layout:** người đã đăng nhập gõ sai URL sẽ mất sidebar — có chủ ý không?
