<template>
  <div id="app">
    <!-- Navigation Header -->
    <header class="app-header">
      <div class="container">
        <h1 class="app-title">📝 Task Tracker</h1>
        <nav class="app-nav">
          <router-link to="/tasks" class="nav-link">Tasks</router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="app-main">
      <!-- Router view - pages will appear here -->
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>Built with Vue.js 3 + Vite</p>
    </footer>
  </div>
</template>

<script>
/**
 * App Component - Root component of the application
 * 
 * This is the main wrapper that contains:
 * - Navigation header
 * - Router view for page content
 * - Footer
 */
export default {
  name: 'App'
}
</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f7fa;
  color: #2c3e50;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.app-header {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.app-nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

/* Main Content */
.app-main {
  flex: 1;
  padding: 2rem 0;
}

/* Footer */
.app-footer {
  background: white;
  border-top: 1px solid #dee2e6;
  padding: 1.5rem;
  text-align: center;
  color: #6c757d;
  font-size: 0.875rem;
}

.app-footer p {
  margin: 0;
}

/* Utility Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
