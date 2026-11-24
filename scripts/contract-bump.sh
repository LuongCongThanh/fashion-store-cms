#!/usr/bin/env bash
# Nâng API Contract (tag openapi-v* của be-demo) lên bản mới nhất rồi mở PR vào dev.
# Chạy bởi .github/workflows/contract-bump.yml. Thử ở local, không push: DRY_RUN=1 scripts/contract-bump.sh
#
# Backend tăng minor khi có Breaking Change, patch khi không (ADR 0002 của repo fashion-store):
#   patch → PR tự merge (squash) khi mọi check CI xanh.
#   minor → PR gắn nhãn breaking-contract, chờ người sửa code theo type mới rồi merge.
#
# Biến môi trường:
#   GH_TOKEN       token tạo PR và merge (PAT, để CI chạy trên PR và trên dev sau merge)
#   ACTIONS_TOKEN  token đọc trạng thái check và tạo nhãn (GITHUB_TOKEN của workflow); mặc định = GH_TOKEN
set -euo pipefail
cd "$(dirname "$0")/.."

BACKEND_REPO=LuongCongThanh/be-demo
PIN_FILES=(.env.development .env.example)
LABEL=breaking-contract
BRANCH_PREFIX=chore/contract-
DRY_RUN=${DRY_RUN:-}
ACTIONS_TOKEN=${ACTIONS_TOKEN:-${GH_TOKEN:-}}

current=$(grep -oP 'releases/download/openapi-v\K[0-9]+\.[0-9]+\.[0-9]+' .env.development)
latest=$(
  gh api --paginate "repos/$BACKEND_REPO/git/matching-refs/tags/openapi-v" --jq '.[].ref' |
    sed 's|^refs/tags/openapi-v||' | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -n 1
)

if [[ -z "$latest" || "$(printf '%s\n' "$current" "$latest" | sort -V | tail -n 1)" == "$current" ]]; then
  echo "API Contract đã mới nhất: openapi-v$current"
  exit 0
fi
tag=openapi-v$latest

# Tag được gắn trước, release (asset openapi.json) phát hành ngay sau trong cùng workflow của be-demo.
if ! gh release view "$tag" --repo "$BACKEND_REPO" --json assets --jq '.assets[].name' | grep -qx openapi.json; then
  echo "Release $tag chưa có openapi.json, chờ lần chạy sau"
  exit 0
fi

# Mỗi lúc chỉ một PR nâng hợp đồng: bản mới hơn phải đợi PR trước (thường là Breaking Change) merge xong.
pending=$(gh pr list --base dev --state open --json number,headRefName \
  --jq "[.[] | select(.headRefName | startswith(\"$BRANCH_PREFIX\")) | .number] | first // empty")
if [[ -n "$pending" ]]; then
  echo "Đang chờ PR #$pending, chưa nâng lên $tag"
  exit 0
fi

IFS=. read -r cur_major cur_minor _ <<<"$current"
IFS=. read -r new_major new_minor _ <<<"$latest"
breaking=
kind=patch
if [[ "$cur_major" != "$new_major" || "$cur_minor" != "$new_minor" ]]; then
  breaking=1
  kind="Breaking Change"
fi

branch="${BRANCH_PREFIX}$tag"
echo "Nâng openapi-v$current → $tag ($kind)"
git switch --quiet -C "$branch"
sed -i "s|releases/download/openapi-v$current/|releases/download/$tag/|" "${PIN_FILES[@]}"
[[ -d node_modules ]] || npm ci --no-audit --no-fund
npm run --silent gen:api

title="chore(api): bump API Contract to $tag"
compare="https://github.com/$BACKEND_REPO/compare/openapi-v$current...$tag"
if [[ -n "$breaking" ]]; then
  result="Đổi minor nên có Breaking Change: \`Api.generated.ts\` đổi, code dùng các type đó có thể không còn typecheck."
  gap="Có Breaking Change. Sửa code theo type mới ngay trên nhánh này, rồi merge bằng tay."
  attention="Đọc diff \`Api.generated.ts\` và các endpoint bị đổi trong [so sánh tag]($compare)."
else
  result="Đổi patch, không có Breaking Change. PR tự merge khi mọi check CI xanh."
  gap="Không"
  attention="Không"
fi

body=$(mktemp)
trap 'rm -f "$body"' EXIT
cat >"$body" <<EOF
# 🏷️ Type

- [ ] ✨ Feature
- [ ] 🐛 Bug
- [ ] ♻️ Refactor
- [ ] ⚡ Perf
- [ ] 🧪 Test
- [x] 🧹 Chore
- [ ] 📚 Docs

## 📌 Summary

**Làm gì:** Nâng API Contract từ \`openapi-v$current\` lên \`$tag\` và sinh lại \`Api.generated.ts\`.

**Vì sao:** Backend vừa phát hành \`$tag\`. Workflow \`contract-bump.yml\` mở PR này tự động.

**Giải pháp:** Đổi tag trong \`OPENAPI_URL\` (\`.env.development\`, \`.env.example\`) rồi chạy \`npm run gen:api\`.

**Kết quả:** $result

**Module:** api

**📋 Task:** — · **Phase:** — · **ADR:** [fashion-store ADR 0002](https://github.com/LuongCongThanh/fashion-store/blob/main/docs/adr/0002-automatic-contract-versioning.md)

---

## 📋 Changes

- \`.env.development\`, \`.env.example\` → \`OPENAPI_URL\` trỏ tới \`$tag\` → theo hợp đồng mới của Backend.
- \`src/shared/lib/api/Api.generated.ts\` → sinh lại bằng \`npm run gen:api\` → khớp hợp đồng mới ([so sánh tag]($compare)).

## 🔌 API / Migration / Cấu hình

- **Endpoint:** Theo [so sánh tag]($compare); đã chạy \`npm run gen:api\`.
- **Migration:** Không
- **Biến môi trường, npm script:** \`OPENAPI_URL\` đổi tag, không thêm biến mới.

## 🧪 Cách kiểm

- **Tự động:** Các job CI của PR (lint, typecheck, test, build, e2e, openapi-contract).
- **Kiểm tay:** Không

---

## ⚠️ Gap và lưu ý

- **Chưa làm:** $gap
- **Gap / rủi ro:** Không
- **Quyết định tạm:** Không
- **Ticket mới:** Không
- **Reviewer cần chú ý:** $attention
- **Sau khi merge:** Không

---

## ✅ Checklist

- [ ] 🔨 Build pass: CI kiểm; PR chỉ tự merge khi mọi check xanh
- [x] 📚 Docs: N/A
- [x] 💥 Breaking change: N/A (Breaking Change nằm ở hợp đồng của Backend, ghi ở Gap và lưu ý)

---

## 💬 Notes

Tạo bởi \`scripts/contract-bump.sh\`. Code review: diff chỉ gồm tag và file sinh tự động, CI là bước kiểm duy nhất.
EOF
bash scripts/check-pr-body.sh "$body"

git add "${PIN_FILES[@]}" src/shared/lib/api/Api.generated.ts
git -c user.name='github-actions[bot]' -c user.email='41898282+github-actions[bot]@users.noreply.github.com' \
  commit --quiet --no-verify -m "$title"

if [[ -n "$DRY_RUN" ]]; then
  git --no-pager show --stat HEAD
  echo "DRY_RUN: dừng trước khi push. Body PR:"
  cat "$body"
  exit 0
fi

git push --quiet --force-with-lease origin "$branch"
labels=()
if [[ -n "$breaking" ]]; then
  GH_TOKEN=$ACTIONS_TOKEN gh label create "$LABEL" --force --color D93F0B \
    --description 'API Contract đổi minor: cần sửa code theo type mới'
  labels=(--label "$LABEL")
fi
url=$(gh pr create --base dev --head "$branch" --title "$title" --body-file "$body" "${labels[@]}")
echo "Đã mở $url"
[[ -z "$breaking" ]] || exit 0

# Patch: đợi CI rồi squash merge. Check mất vài giây mới xuất hiện trên PR.
for _ in $(seq 20); do
  GH_TOKEN=$ACTIONS_TOKEN gh pr checks "$url" >/dev/null 2>&1 && break || sleep 15
done
if GH_TOKEN=$ACTIONS_TOKEN gh pr checks "$url" --watch --interval 30 --fail-fast >/dev/null; then
  gh pr merge "$url" --squash
  echo "Đã merge $url"
else
  gh pr comment "$url" --body 'CI không xanh nên PR này không tự merge. Sửa trên nhánh này rồi merge bằng tay.'
  exit 1
fi
