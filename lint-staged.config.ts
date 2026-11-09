// Prettier tự bỏ qua file nằm trong .prettierignore (chỉ src/**/*.{ts,vue} được format).
// Windows giới hạn độ dài dòng lệnh → commit nhiều file thì chạy trên cả repo thay vì liệt kê.
const MAX_FILES = 30

const quote = (files: string[]) => files.map((file) => `"${file}"`).join(' ')

export default {
  '*.{ts,vue}': (files: string[]) =>
    files.length > MAX_FILES
      ? ['eslint --fix .', 'prettier --write --ignore-unknown .']
      : [`eslint --fix ${quote(files)}`, `prettier --write --ignore-unknown ${quote(files)}`],
}
