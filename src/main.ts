// Validate env trước khi dựng app: thiếu VITE_* thì dừng ngay với lỗi rõ ràng.
import '@app/config/Env.config'

import { createApp } from 'vue'

import App from './App.vue'

createApp(App).mount('#app')
