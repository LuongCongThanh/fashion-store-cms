import type { ProductInput } from './Product.schema'

export function generateVariants(
  sizes: string[],
  colors: string[],
  prefix: string,
  price: number,
  stock: number,
): ProductInput['variants'] {
  const unique = (values: string[]) => [...new Set(values.map((value) => value.trim()).filter(Boolean))]
  const sizeOptions = unique(sizes)
  const colorOptions = unique(colors)
  const used = new Set<string>()
  return (sizeOptions.length ? sizeOptions : ['']).flatMap((size) =>
    (colorOptions.length ? colorOptions : ['']).map((color) => {
      const base = [prefix, size, color].filter(Boolean).join('-').toUpperCase().replace(/\s+/g, '-')
      let sku = base
      let index = 2
      while (used.has(sku)) sku = `${base}-${index++}`
      used.add(sku)
      return { size, color, sku, price, stock }
    }),
  )
}
