# Kế hoạch và tracker CMS

Đối chiếu ngày 29/11/2026. Thư mục này giữ plan tổng theo chủ đề, tracker công việc và map Wayfinder. Dòng `Status:` trong từng file là nguồn chuẩn; README này chỉ điều hướng. Cách tạo, đọc và đóng ticket: [issue tracker](../agents/issue-tracker.md).

## Cấu trúc

```text
docs/plan/
├── README.md
├── api-restructure/        # plan tổng: nối API nghiệp vụ theo tier, quyết định C1–C17
├── structure-migration/    # plan tổng: migration cấu trúc theo ADR 0001–0003
├── ui-hardening/           # plan tổng: UI/UX hardening theo DESIGN.md
├── wayfinding/<effort>/    # map quyết định (map.md + issues/), không phải hàng đợi triển khai
└── tasks/
    ├── todo/               # effort còn ít nhất một issue mở
    ├── done/               # mọi issue đã done, resolved hoặc superseded
    └── wontfix/            # effort đã quyết định không làm, lý do ghi trong spec
        └── <feature-slug>/
            ├── spec.md     # mục tiêu, phạm vi, trạng thái effort
            └── issues/     # mỗi ticket một file <NN>-<slug>.md, có Status: và Blocked by:
```

| Thư mục                             | Số effort | Ý nghĩa                                     |
| ----------------------------------- | --------- | ------------------------------------------- |
| [tasks/todo/](tasks/todo)           | 3         | Còn issue mở.                               |
| [tasks/done/](tasks/done)           | 2         | Mọi issue đã đóng.                          |
| [tasks/wontfix/](tasks/wontfix)     | 1         | Đã quyết định không làm.                    |
| [wayfinding/](initiatives)           | 1         | Map quyết định; `resolved` không phải merge. |

## Chưa hoàn tất (`tasks/todo/`)

| Effort                                                                  | Plan tổng                                              | Issue còn mở                                                                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| [cms-architecture-design](tasks/todo/cms-architecture-design/spec.md)   | [structure-migration](initiatives/structure-migration/map.md)   | 01 `ready-for-agent`; 02–15 `needs-triage`, chạy tuần tự theo `Blocked by`                                      |
| [ui-ux-hardening](tasks/todo/ui-ux-hardening/spec.md)                   | [ui-hardening](initiatives/ui-hardening/map.md)                 | 07 `ready-for-human`; 01, 02, 08–13, 15 `ready-for-agent`; 14 `needs-triage`. Đã xong 03–06, 16                |
| [three-repo-restructure](tasks/todo/three-repo-restructure/issues/)     | [api-restructure](initiatives/api-restructure/map.md)           | 07 `ready-for-human` (nhu cầu API Tier 1). Đã xong 01–06 (#70–#74)                                             |

## Đã hoàn tất (`tasks/done/`)

| Effort                                              | Nội dung                                    | PR       |
| --------------------------------------------------- | ------------------------------------------- | -------- |
| [login-page](tasks/done/login-page/spec.md)         | Trang đăng nhập, quên mật khẩu, guest guard | #55, #58 |
| [ui-audit-fixes](tasks/done/ui-audit-fixes/spec.md) | Sửa lỗi giao diện theo audit 2026-11-10     | #56      |

## Không thực hiện (`tasks/wontfix/`)

| Effort                                                          | Lý do                                                                                                                   |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [openapi-typed-paths](tasks/wontfix/openapi-typed-paths/spec.md) | Được thay bởi [issue 06 của cms-architecture-design](tasks/todo/cms-architecture-design/issues/06-typed-endpoint-proof.md) theo ADR 0003 |

## Wayfinding

| Map                                                       | Trạng thái                                                                  |
| --------------------------------------------------------- | --------------------------------------------------------------------------- |
| [cms-docs-cleanup](initiatives/cms-docs-cleanup/map.md)    | 01–04 `resolved`; kết quả đã merge ở #83                                    |

## Thứ tự tiếp tục

Cập nhật ngày 29/11/2026. Chuyển cấu trúc trước, việc giao diện sau, để không sửa một màn hình hai lần.

1. **`cms-architecture-design` 01→15**, tuần tự theo `Blocked by`. 01 đang `ready-for-agent`; mỗi issue sau chỉ được làm khi người dùng chuyển nó sang `ready-for-agent`.
2. **`ui-ux-hardening`**: các ticket còn mở làm sau slice chuyển cấu trúc của màn hình tương ứng. 07 cần người dùng duyệt Product list; việc duyệt không phụ thuộc migration và đang chặn 08.
3. **`three-repo-restructure` 07** chờ Backend phát hành API Tier 1 (đơn hàng, tồn kho, khách hàng; be-demo task 29–36). Effort chuyển sang `done/` khi 07 xong.

## Quy tắc cập nhật

- Effort mới đặt tại `tasks/todo/<feature-slug>/` và thêm một dòng vào bảng **Chưa hoàn tất**.
- Từ trạng thái: issue triển khai dùng nhãn triage (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) cùng `done` và `superseded`; ticket Wayfinder dùng `claimed`/`resolved`. Không dùng từ đồng nghĩa như `completed`.
- Khi mọi issue của effort đã `done`, `superseded` hoặc `wontfix`: `git mv` cả thư mục sang `tasks/done/`, chuyển dòng sang bảng **Đã hoàn tất** và sửa link trỏ tới nó trong cùng thay đổi.
- Khi quyết định bỏ: ghi quyết định và lý do trong spec, đặt `Status: wontfix`, rồi chuyển cả thư mục sang `tasks/wontfix/`. Chưa rõ hoặc đang bị chặn thì vẫn ở `tasks/todo/`.
- `Blocked by` ghi số issue trong cùng effort; không ghi `todo/`, `done/` hay `wontfix/`.
- Khi thay đổi nhóm, cập nhật bảng và số đếm trong README này.
