import { expect, it } from 'vitest'

import { renderWithPlugins } from '@test/Render'

import StatCard from './StatCard.vue'

it('uses the secondary KPI scale by default and the hero scale when requested', () => {
  const secondary = renderWithPlugins(StatCard, { props: { value: 42, format: 'number' } })
  const hero = renderWithPlugins(StatCard, { props: { value: 42, format: 'number', size: 'hero' } })
  expect(secondary.wrapper.find('p').classes()).toEqual(expect.arrayContaining(['text-2xl', 'font-semibold']))
  expect(hero.wrapper.find('p').classes()).toEqual(expect.arrayContaining(['text-4xl', 'font-bold']))
  expect(hero.wrapper.text()).toContain('42')
})
