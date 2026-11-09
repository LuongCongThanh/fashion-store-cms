import { expect, it } from 'vitest'

import { generateVariants } from './Variants'

it('generates unique Size × Color SKUs and preserves the default variant for products without options', () => {
  expect(generateVariants(['S', 'M', 'S'], ['Red', 'Blue'], 'TEE', 200, 3)).toEqual([
    { size: 'S', color: 'Red', sku: 'TEE-S-RED', price: 200, stock: 3 },
    { size: 'S', color: 'Blue', sku: 'TEE-S-BLUE', price: 200, stock: 3 },
    { size: 'M', color: 'Red', sku: 'TEE-M-RED', price: 200, stock: 3 },
    { size: 'M', color: 'Blue', sku: 'TEE-M-BLUE', price: 200, stock: 3 },
  ])
  expect(generateVariants([], [], 'TEE', 200, 3)).toEqual([
    { size: '', color: '', sku: 'TEE', price: 200, stock: 3 },
  ])
})
