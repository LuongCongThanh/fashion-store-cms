/**
 * Tài khoản của Mock auth (GLOSSARY), dùng chung cho adapter giả lập (`app/dev/MockAuth.ts`)
 * và gợi ý trên LoginView. Chỉ được tham chiếu sau điều kiện `import.meta.env.DEV` để bị
 * loại khỏi bản build production.
 */
export const MOCK_ACCOUNT = { email: 'admin@cms.local', password: 'admin123' } as const
