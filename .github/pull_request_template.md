# 🏷️ Type

<!-- Chọn một, khớp type ở tiêu đề PR (Conventional Commits: feat(products): add server-side pagination).
     feat → Feature · fix → Bug · refactor → Refactor · perf → Perf · test → Test · docs → Docs
     ci, build, style, chore, revert → Chore -->

- [ ] ✨ Feature
- [ ] 🐛 Bug
- [ ] ♻️ Refactor
- [ ] ⚡ Perf
- [ ] 🧪 Test
- [ ] 🧹 Chore
- [ ] 📚 Docs

## 📌 Summary

**Làm gì:** <!-- Tóm tắt thay đổi trong 1–2 câu, theo hành vi người dùng CMS nhìn thấy. Không liệt kê file (đã có ở Changes) -->

**Vì sao:** <!-- Vấn đề PR giải quyết: lỗi gì, thiếu gì, ticket yêu cầu gì, hậu quả nếu không làm. Người đọc không cần mở ticket vẫn hiểu -->

**Giải pháp:** <!-- Cách làm và lý do chọn thay vì phương án khác. Tầng nào bị đụng: view → composable → api → types (CONVENTIONS §T) -->

**Kết quả:** <!-- Before → After: hành vi, số test, kích thước bundle, lỗi. Bằng chứng ghi ở Cách kiểm; phần chưa đạt ghi ở Gap và lưu ý -->

**Module:** <!-- auth, store, products, orders, router, api, ui, i18n, pwa, test, deps, config, ci, docs (khớp scope trong commitlint.config.ts) -->

**📋 Task:** CMS-xxx · **Phase:** P? (FE_architecture §30) · **ADR:** —

---

## 📋 Changes

<!-- Mỗi dòng: file hoặc nhóm file → thay đổi → lý do. Gom theo hành vi, không liệt kê từng file nhỏ -->

-
-
-

## 🔌 API / Migration / Cấu hình

<!-- Ghi "Không" cho mục không có -->

- **Endpoint:** <!-- endpoint BE mới dùng tới (method + path); đã chạy `npm run gen:api` chưa -->
- **Migration:** <!-- dữ liệu phía client đổi format: key localStorage (`cms.*`), cache PWA; hoặc "Không" -->
- **Biến môi trường, npm script:** <!-- tên mới, giá trị mặc định; đã thêm vào `.env.example` và `src/app/config/Env.config.ts` chưa -->

## 🧪 Cách kiểm

- **Tự động:** <!-- test chứng minh từng acceptance criterion: `file::test`; số test, coverage -->
- **Kiểm tay:** <!-- bước tái hiện, ảnh chụp nếu có UI (sáng + tối, vi + en); "Không" nếu chỉ cần test tự động -->

---

## ⚠️ Gap và lưu ý

<!-- Bắt buộc. Mục nào không có thì ghi "Không", đừng xoá mục -->

- **Chưa làm:** <!-- phần của ticket còn thiếu, lý do; acceptance criterion chưa kiểm được -->
- **Gap / rủi ro:** <!-- trường hợp biên chưa phủ, giới hạn đã biết, chỗ chờ BE -->
- **Quyết định tạm:** <!-- cách làm tạm thời, khi nào cần quay lại -->
- **Ticket mới:** <!-- việc ngoài phạm vi phát hiện được -->
- **Reviewer cần chú ý:** <!-- đoạn code khó, chỗ lệch CONVENTIONS có lý do, thay đổi trong `shared/` -->
- **Sau khi merge:** <!-- việc phải làm ở môi trường: biến env khi build, header server, cấu hình GitHub; hoặc "Không" -->

---

## ✅ Checklist

- [ ] 🔨 Build pass: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` (và `npm run test:e2e` nếu đổi luồng chính) đều xanh
- [ ] 🧱 Ranh giới: không import chéo feature (chỉ `Use*.ts`, `types/`); DTO chỉ trong `api/`; component không gọi API (CONVENTIONS §B.3, §T)
- [ ] 🧪 Tested: có test ở seam công khai (composable, view qua `renderWithPlugins()`), kể cả trường hợp lỗi API
- [ ] 🌐 i18n: không hard-code text; đã thêm key vào cả `vi.json` và `en.json`
- [ ] 🎨 UI: chỉ dùng màu ngữ nghĩa (`primary`, `error`…), không mã màu / palette thô; đúng ở dark mode (CONVENTIONS §L)
- [ ] 🔐 Quyền: route mới có `meta.permission`, nút ẩn bằng `useAuth().can()` (hoặc N/A)
- [ ] 🔒 Security: không lộ secret, token, dữ liệu cá nhân thật; không `v-html` khi chưa sanitize
- [ ] 📚 Docs: đã cập nhật CONVENTIONS, GLOSSARY hoặc FE_architecture nếu đổi quy ước (hoặc N/A)
- [ ] 💥 Breaking change: ghi rõ trong _Gap và lưu ý_ và thêm `!` vào tiêu đề PR (hoặc N/A)

---

## 💬 Notes

<!-- Thêm nếu có: kết luận review, link liên quan -->

---

📖 [README](../blob/dev/README.md) · [Quy ước (CONVENTIONS)](../blob/dev/docs/CONVENTIONS.md) · [Kiến trúc FE](../blob/dev/docs/FE_architecture.md)
