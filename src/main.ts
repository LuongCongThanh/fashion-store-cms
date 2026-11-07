import { createApp } from 'vue'

import { createAppRuntime } from '@app/Runtime'

import App from './App.vue'

createApp(App).use(createAppRuntime().plugin).mount('#app')
