import TasksView from '@/views/TasksView.vue'

/**
 * Application Routes
 * Define all the routes (pages) in the application
 */
export default [
  // Home route - redirects to tasks page
  {
    path: '/',
    redirect: '/tasks'
  },

  // Tasks page - main view for managing tasks
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView
  },

  // 404 Not Found - catch all undefined routes
  {
    path: '/:pathMatch(.*)*',
    redirect: '/tasks'
  }
]
