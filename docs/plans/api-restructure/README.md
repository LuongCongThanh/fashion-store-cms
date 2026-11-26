# Tái cấu trúc CMS theo API — mục lục

Effort này khác migration folder/naming. Các quyết định, phân loại code và readiness được đọc riêng.

> **Phân biệt phạm vi (26/11/2026):** plan này sở hữu chuyển từ prototype sang API nghiệp vụ và các quyết định C1–C17; tiến độ ghi bên dưới là snapshot của đợt đó. Trạng thái công việc tiếp theo ở [tracker tái cấu trúc](../../../.scratch/three-repo-restructure/issues/07-tier1-contract-needs.md). Migration folder/naming có [thiết kế riêng](../structure-migration/README.md); việc thiết kế đó được duyệt không đóng các tier API còn lại.

> Trạng thái: **approved — grill 2026-11-14** · Tiến độ: Tier 0 xong (#70–#73), Voucher xong (#74, `openapi-v0.7.0`). Tier 1 prep xong (#76). Tiếp theo: Tier 1, chờ API (§7, issue 07).
> Nguồn lịch sử: `THREE-REPO-RESTRUCTURE-PLAN.md`, `THREE-REPO-RESTRUCTURE-SPEC.md`, `TARGET-REPOSITORY-TREE.md` §2 và `GLOSSARY-MAP.md` (re-plan API-first ngày 14/11/2026). Các file workspace này không còn tại checkout hiện tại; quyết định C1–C17 được giữ trong plan này. Tên ứng dụng hiện hành theo [glossary workspace](../../../../GLOSSARY.md).
> Thuật ngữ nghiệp vụ theo `be-demo/GLOSSARY.md`; thuật ngữ kỹ thuật theo [`GLOSSARY.md`](../../../GLOSSARY.md).
> Issue con: `.scratch/three-repo-restructure/issues/`, tạo khi bắt đầu từng tier.

## Theo chủ đề

- [Mục tiêu và quyết định C1–C17](decisions.md)
- [Giữ, viết lại và bỏ code theo feature](feature-disposition.md)
- [Cây đích, tier và phụ thuộc Backend](delivery.md)

Mỗi chủ đề có một nơi giữ nội dung chuẩn. Khi sửa policy, cập nhật file chủ đề và source/config thực thi trong cùng thay đổi.
