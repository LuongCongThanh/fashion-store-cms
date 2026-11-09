#!/usr/bin/env python3
"""PreToolUse hook (Bash): chặn tạo/sửa PR khi body không theo .github/pull_request_template.md.

- `gh pr create` / `gh pr edit`: body phải truyền bằng `--body-file <file>`; file được kiểm
  bằng scripts/check-pr-body.sh (cùng luật với CI pr-body.yml). `--body`, `--fill*` hoặc
  `gh pr create` không có body đều bị chặn. `gh pr edit` không đổi body thì cho qua.
- `gh api .../pulls...` có field `body`: phải là `body=@<file>` và file phải pass.
"""
import json, os, shlex, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHECK = os.path.join(ROOT, "scripts", "check-pr-body.sh")


def _git_bash_from_git():
    """Git Bash nằm cạnh git.exe: <Git>/{cmd,bin,mingw64/bin}/git.exe → <Git>/bin/bash.exe."""
    git = shutil.which("git")
    if not git:
        return None
    folder = os.path.dirname(os.path.realpath(git))
    for _ in range(3):
        bash_path = os.path.join(folder, "bin", "bash.exe")
        if os.path.isfile(bash_path):
            return bash_path
        folder = os.path.dirname(folder)
    return None


def find_bash():
    """Đường dẫn bash chạy được script của repo, hoặc None nếu không có.

    Trên Windows, `bash` trong PATH có thể là WSL (System32\\bash.exe) và không chạy được
    script của repo, nên chỉ dùng Git Bash: tìm theo vị trí của git rồi các thư mục cài mặc định.
    Các hệ khác dùng `bash` trong PATH."""
    if os.name != "nt":
        return shutil.which("bash")
    bases = (os.environ.get("ProgramFiles"),
             os.environ.get("LOCALAPPDATA") and os.path.join(os.environ["LOCALAPPDATA"], "Programs"))
    defaults = (os.path.join(b, "Git", "bin", "bash.exe") for b in bases if b)
    return _git_bash_from_git() or next((d for d in defaults if os.path.isfile(d)), None)


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
    bash = find_bash()
    if not bash:
        deny("Không tìm thấy bash để chạy scripts/check-pr-body.sh (trên Windows cần Git Bash). "
             "Lỗi môi trường, không phải lỗi PR body.")
    try:
        r = subprocess.run([bash, CHECK, p], capture_output=True, text=True,
                           encoding="utf-8", errors="replace")
    except OSError as e:
        deny(f"Không chạy được {bash}: {e}. Lỗi môi trường, không phải lỗi PR body.")
    if r.returncode == 0:
        return
    if "::error::" not in r.stdout:  # script không chạy tới bước kiểm → lỗi môi trường
        detail = (r.stdout.strip() or r.stderr.strip() or "không có output")
        deny(f"scripts/check-pr-body.sh lỗi (exit {r.returncode}) qua {bash}: {detail}. "
             "Lỗi môi trường, không phải lỗi PR body.")
    deny("PR body không theo .github/pull_request_template.md:\n"
         + r.stdout.strip() + "\nSửa file rồi chạy lại.")


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
