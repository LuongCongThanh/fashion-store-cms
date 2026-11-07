#!/usr/bin/env bash
# Kiểm tra PR body theo .github/pull_request_template.md.
# Dùng chung cho CI (pr-body.yml) và hook Claude Code (.claude/hooks/pr-body-guard.sh).
# Cách dùng: scripts/check-pr-body.sh <file-body>   (hoặc "-" để đọc stdin)
set -uo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
tpl="$root/.github/pull_request_template.md"
if [[ "${1:--}" == "-" ]]; then BODY=$(cat); else BODY=$(cat "$1"); fi
BODY=${BODY//$'\r'/}

# Heading và ô **...:** bắt buộc lấy thẳng từ template (một nguồn duy nhất)
mapfile -t required < <(
  grep -E '^#{1,3} ' "$tpl"
  grep -oE '^(- )?\*\*[^*]+:\*\*' "$tpl" | sed 's/^- //'
)
status=0
for h in "${required[@]}"; do
  if [[ "$BODY" != *"$h"* ]]; then
    echo "::error::Missing section: $h"
    status=1
  fi
done
if grep -Eq '^(- )?\*\*[^*]+:\*\*[[:space:]]*(<!--|$)' <<< "$BODY"; then
  echo "::error::Còn ô **...:** để trống hoặc giữ placeholder (ghi \"Không\" nếu không có)"
  status=1
fi
if grep -Eq '^-[[:space:]]*$' <<< "$BODY"; then
  echo "::error::Changes còn dòng '-' trống"
  status=1
fi
ticked=$(grep -Ec '^- \[[xX]\] (✨ Feature|🐛 Bug|♻️ Refactor|⚡ Perf|🧪 Test|🧹 Chore|📚 Docs)[[:space:]]*$' <<< "$BODY" || true)
if [[ "$ticked" != 1 ]]; then
  echo "::error::Tick exactly one Type checkbox (found $ticked)"
  status=1
fi
exit $status
