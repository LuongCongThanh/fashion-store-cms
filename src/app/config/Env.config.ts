import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.url(),
})

export type Env = z.infer<typeof envSchema>

/** Validate biến `VITE_*`; ném lỗi liệt kê đủ biến thiếu/sai để dev sửa `.env.local`. */
export function parseEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw)
  if (result.success) return result.data
  const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n')
  throw new Error(
    `Biến môi trường không hợp lệ (xem .env.example, sửa trong .env.local):\n${issues}`,
  )
}

export const env: Env = parseEnv(import.meta.env)
