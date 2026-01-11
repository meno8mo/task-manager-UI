// Import global styles
import './assets/main.css'

// Import Vue and core dependencies
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Create Vue application instance
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use Vue Router for navigation
app.use(router)

// Mount the application to the DOM
app.mount('#app')
