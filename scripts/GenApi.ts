// Sinh src/shared/lib/api/Api.generated.ts từ Swagger/OpenAPI của BE (Step 6).
// OPENAPI_URL đọc từ env (.env.local hoặc biến môi trường) — KHÔNG có tiền tố VITE_, không lộ ra browser.
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import openapiTS, { astToString } from 'openapi-typescript'
import { loadEnv } from 'vite'

const OUTPUT = fileURLToPath(new URL('../src/shared/lib/api/Api.generated.ts', import.meta.url))

const HEADER = `/**
 * FILE SINH TỰ ĐỘNG bằng \`npm run gen:api\` — KHÔNG sửa tay.
 * Nguồn: OPENAPI_URL. DTO chỉ được import trong features/<feature>/api/ và shared/lib/api/ (§T.3).
 */
`

async function main() {
  const env = loadEnv(process.env.MODE ?? 'development', process.cwd(), '')
  const source = env.OPENAPI_URL
  if (!source) {
    console.error(
      [
        'Thiếu OPENAPI_URL.',
        'Đặt trong .env.local (xem .env.example) hoặc chạy: OPENAPI_URL=<url-swagger> npm run gen:api',
      ].join('\n'),
    )
    process.exit(1)
  }

  const url = /^[a-z]+:\/\//i.test(source)
    ? new URL(source)
    : new URL(source, `file://${process.cwd()}/`)
  // Field có `default` trong body request vẫn là optional (BE tự điền default).
  const ast = await openapiTS(url, { defaultNonNullable: false })
  await writeFile(OUTPUT, HEADER + astToString(ast))
  console.warn(`Đã sinh ${OUTPUT} từ ${source}`)
}

main().catch((error: unknown) => {
  console.error('gen:api thất bại:', error instanceof Error ? error.message : error)
  process.exit(1)
})
