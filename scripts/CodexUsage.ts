import { createReadStream } from 'node:fs'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline'

interface Usage {
  input_tokens: number
  cached_input_tokens: number
  cache_write_input_tokens: number
  output_tokens: number
  reasoning_output_tokens: number
  total_tokens: number
}
interface Meta {
  id: string
  source?:
    string | { subagent?: { thread_spawn?: { parent_thread_id?: string; agent_path?: string } } }
}
interface Event {
  timestamp: string
  type: string
  payload: Meta & { type?: string; info?: { total_token_usage?: Usage } }
}
const fields = [
  'input_tokens',
  'cached_input_tokens',
  'cache_write_input_tokens',
  'output_tokens',
  'reasoning_output_tokens',
  'total_tokens',
] as const
const zero = (): Usage => Object.fromEntries(fields.map((field) => [field, 0])) as unknown as Usage

async function metadata(path: string) {
  const stream = createReadStream(path)
  const lines = createInterface({ input: stream, crlfDelay: Infinity })
  try {
    for await (const line of lines) {
      const event = JSON.parse(line) as Event
      return event.type === 'session_meta' ? event.payload : undefined
    }
  } finally {
    lines.close()
    stream.destroy()
  }
}
async function counters(path: string, since: string) {
  const lines = createInterface({ input: createReadStream(path), crlfDelay: Infinity })
  let cumulative = zero()
  let baseline = zero()
  let through: string | undefined
  for await (const line of lines) {
    const event = JSON.parse(line) as Event
    const usage =
      event.type === 'event_msg' && event.payload.type === 'token_count'
        ? event.payload.info?.total_token_usage
        : undefined
    if (!usage) continue
    cumulative = { ...zero(), ...usage }
    through = event.timestamp
    if (event.timestamp < since) baseline = cumulative
  }
  const task = zero()
  for (const field of fields) {
    task[field] = cumulative[field] - baseline[field]
    if (task[field] < 0) throw new Error(`Cumulative usage decreased: ${field}`)
  }
  return { baseline, cumulative, task, usage_through: through }
}
async function main() {
  const args = process.argv.slice(2)
  const option = (name: string) => {
    const index = args.indexOf(name)
    return index < 0 ? undefined : args[index + 1]
  }
  const source = option('--session')
  const since = option('--since')
  const output = option('--out')
  if (!source || !since || Number.isNaN(Date.parse(since)))
    throw new Error(
      'Usage: tsx scripts/CodexUsage.ts --session <rollout.jsonl> --since <ISO timestamp> [--out <json>]',
    )
  const primary = await metadata(source)
  if (!primary) throw new Error('Missing session metadata')
  const selected = [{ path: source, meta: primary, kind: 'primary' }]
  for (const name of await readdir(dirname(source))) {
    const path = join(dirname(source), name)
    if (!name.endsWith('.jsonl') || path === source) continue
    const meta = await metadata(path)
    const parent =
      typeof meta?.source === 'object'
        ? meta.source.subagent?.thread_spawn?.parent_thread_id
        : undefined
    if (meta && parent === primary.id) selected.push({ path, meta, kind: 'review' })
  }
  const total = zero()
  const sessions = []
  for (const session of selected) {
    const usage = await counters(session.path, since)
    for (const field of fields) total[field] += usage.task[field]
    sessions.push({ session_id: session.meta.id, kind: session.kind, ...usage })
  }
  if (
    total.cached_input_tokens > total.input_tokens ||
    total.input_tokens + total.output_tokens !== total.total_tokens
  )
    throw new Error('Unexpected counter semantics; inspect before reporting totals')
  const report = {
    snapshot_at: new Date().toISOString(),
    task_started_at: since,
    method:
      'Last cumulative token_count per session minus pre-task baseline; direct child review sessions counted separately once.',
    task_usage: {
      ...total,
      non_cached_input_tokens: total.input_tokens - total.cached_input_tokens,
    },
    sessions,
    per_plan_implementation_usage: null,
    allocation_note:
      'Initial implementation used one shared session across all 14 plans. Exact per-plan usage cannot be reconstructed; no equal split or estimates are used.',
    cost_usd: null,
    cost_note:
      'Rollout counters are not a ChatGPT billing invoice. No API-price cost estimate is substituted.',
    notes: [
      'Cached input is included in input tokens; do not add it again.',
      'Reasoning output is reported separately but is already represented in total_tokens; do not add it again.',
      'Snapshot excludes token usage not yet emitted by the active session.',
    ],
  }
  const json = JSON.stringify(report, null, 2) + '\n'
  if (output) {
    await mkdir(dirname(output), { recursive: true })
    await writeFile(output, json)
  } else process.stdout.write(json)
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
