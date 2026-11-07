import './assets/styles/main.css'

import { createApp } from 'vue'

import { createAppRuntime } from '@app/Runtime'

import App from './App.vue'

// Mock auth (GLOSSARY): điều kiện DEV đứng trước → Vite loại bỏ cả nhánh import khi build production.
const transport =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true'
    ? (await import('@app/dev/MockAuth')).createMockAuthTransport()
    : undefined

createApp(App).use(createAppRuntime({ transport }).plugin).mount('#app')
