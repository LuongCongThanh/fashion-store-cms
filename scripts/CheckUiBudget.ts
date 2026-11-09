import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const assetDir = new URL('../dist/assets/', import.meta.url)
const files = await readdir(assetDir)
const measured = await Promise.all(files.filter((file) => /\.(?:js|css)$/.test(file)).map(async (file) => ({ file, bytes: (await stat(join(assetDir.pathname, file))).size })))
const largestJs = measured.filter(({ file }) => file.endsWith('.js')).sort((a, b) => b.bytes - a.bytes)[0]
const css = measured.filter(({ file }) => file.endsWith('.css')).reduce((sum, item) => sum + item.bytes, 0)
const budgets = [
  { label: 'largest JS chunk', actual: largestJs?.bytes ?? 0, limit: 560_000 },
  { label: 'total CSS', actual: css, limit: 240_000 },
]
for (const budget of budgets) {
  const state = budget.actual <= budget.limit ? 'PASS' : 'REPORT'
  console.warn(`${state} ${budget.label}: ${(budget.actual / 1000).toFixed(2)} kB / ${(budget.limit / 1000).toFixed(2)} kB`)
}
// Phase 6 is report-only: measurements are visible in CI but do not block merge yet.
