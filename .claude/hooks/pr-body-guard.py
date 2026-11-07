#!/usr/bin/env python3
"""PreToolUse hook (Bash): chặn tạo/sửa PR khi body không theo .github/pull_request_template.md.

- `gh pr create` / `gh pr edit`: body phải truyền bằng `--body-file <file>`; file được kiểm
  bằng scripts/check-pr-body.sh (cùng luật với CI pr-body.yml). `--body`, `--fill*` hoặc
  `gh pr create` không có body đều bị chặn. `gh pr edit` không đổi body thì cho qua.
- `gh api .../pulls...` có field `body`: phải là `body=@<file>` và file phải pass.
"""
import json, os, shlex, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHECK = os.path.join(ROOT, "scripts", "check-pr-body.sh")


def deny(reason):
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason}}))
    sys.exit(0)


def check_file(path, cwd):
    p = os.path.expanduser(path)
    p = p if os.path.isabs(p) else os.path.join(cwd, p)
    if not os.path.isfile(p):
        deny(f"PR body file không tồn tại: {path}")
    r = subprocess.run(["bash", CHECK, p], capture_output=True, text=True)
    if r.returncode != 0:
        deny("PR body không theo .github/pull_request_template.md:\n" + r.stdout.strip()
             + "\nSửa file rồi chạy lại.")


def opt(tokens, *names):
    """Trả giá trị của option (hỗ trợ `--x v` và `--x=v`); None nếu không có."""
    for i, t in enumerate(tokens):
        for n in names:
            if t == n and i + 1 < len(tokens):
                return tokens[i + 1]
            if n.startswith("--") and t.startswith(n + "="):
                return t.split("=", 1)[1]
    return None


def segments(cmd):
    lex = shlex.shlex(cmd, posix=True, punctuation_chars=";&|")
    lex.whitespace_split = True
    seg = []
    for t in lex:
        if t and set(t) <= set(";&|"):
            if seg: yield seg
            seg = []
        else:
            seg.append(t)
    if seg: yield seg


def main():
    data = json.load(sys.stdin)
    cmd = data.get("tool_input", {}).get("command", "")
    cwd = data.get("cwd") or os.getcwd()
    if "gh" not in cmd:
        return
    try:
        segs = list(segments(cmd))
    except ValueError:
        return
    for s in segs:
        while s and "=" in s[0] and not s[0].startswith("-"):  # bỏ tiền tố VAR=x
            s = s[1:]
        if not s or os.path.basename(s[0]) != "gh":
            continue
        s = s[1:]
        if s[:2] in (["pr", "create"], ["pr", "edit"]):
            bf = opt(s, "--body-file", "-F")
            if bf is not None:
                if bf == "-":
                    deny("Không kiểm được body từ stdin. Ghi body ra file rồi dùng --body-file <file>.")
                check_file(bf, cwd)
            elif opt(s, "--body", "-b") is not None or any(t.startswith("--fill") for t in s):
                deny("Tạo/sửa PR phải dùng --body-file <file> theo .github/pull_request_template.md "
                     "(không dùng --body/--fill). Hook sẽ kiểm file trước khi chạy.")
            elif s[1] == "create":
                deny("gh pr create cần --body-file <file> theo .github/pull_request_template.md.")
        elif s[:1] == ["api"] and any("pulls" in t for t in s):
            for i, t in enumerate(s):
                if t in ("-f", "-F", "--field", "--raw-field") and i + 1 < len(s) and s[i + 1].startswith("body="):
                    v = s[i + 1][5:]
                    if t in ("-F", "--field") and v.startswith("@"):
                        check_file(v[1:], cwd)
                    else:
                        deny("PR body qua gh api phải là -F body=@<file> để hook kiểm được template.")


if __name__ == "__main__":
    main()
