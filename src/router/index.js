import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

/**
 * Vue Router Configuration
 * Handles navigation between different views in the application
 */
const router = createRouter({
  // Use HTML5 history mode for clean URLs (no # in URL)
  history: createWebHistory(),

  // Import routes from separate file for better organization
  routes
})

// Export router instance to be used in main.js
export default router
