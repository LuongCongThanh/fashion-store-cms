/** `datetime-local` (giờ máy) → ISO UTC cho API. */
export function localToIso(value: string): string {
  return new Date(value).toISOString()
}

/** ISO → giá trị cho `datetime-local` theo giờ máy, chính xác tới phút. */
export function isoToLocal(value: string): string {
  const date = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
