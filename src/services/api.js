/**
 * API Service Configuration
 * 
 * STUDENT NOTE: This file sets up axios, a popular library for making HTTP requests.
 * Axios makes it easy to communicate with your backend API.
 * 
 * Key Concepts:
 * - Base URL: The common part of all API endpoints
 * - Interceptors: Functions that run before/after every request
 * - Headers: Metadata sent with requests (like Content-Type)
 */

import axios from 'axios'

/**
 * Create Axios Instance
 * 
 * STUDENT NOTE: Instead of using axios directly, we create a custom instance
 * with pre-configured settings. This means we don't have to repeat the base URL
 * and headers for every request.
 */
const api = axios.create({
  // Base URL for all API requests
  // STUDENT NOTE: Change this if your backend runs on a different port
  // Base URL for all API requests
  // STUDENT NOTE: We use an environment variable for the production URL.
  // If VITE_API_URL is not set (like when running locally), it falls back to localhost.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json' // Tell server we're sending JSON data
  }
})

/**
 * REQUEST INTERCEPTOR
 * 
 * STUDENT NOTE: This function runs BEFORE every request is sent to the server.
 * It's useful for:
 * - Adding authentication tokens
 * - Logging requests for debugging
 * - Modifying request data
 * 
 * Think of it as a checkpoint that all requests must pass through.
 */
api.interceptors.request.use(
  (config) => {
    // Get authentication token from localStorage (if it exists)
    // STUDENT NOTE: localStorage is browser storage that persists even after closing the tab
    const token = localStorage.getItem('token')

    // If token exists, add it to request headers
    // STUDENT NOTE: This is how you send authentication to the backend
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log the request for debugging (helpful for learning)
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`)

    return config // Must return config to continue the request
  },
  (error) => {
    // Handle errors that occur before the request is sent
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * RESPONSE INTERCEPTOR
 * 
 * STUDENT NOTE: This function runs AFTER every response is received from the server.
 * It's useful for:
 * - Handling errors globally (instead of in every component)
 * - Logging responses for debugging
 * - Transforming response data
 * 
 * Think of it as a checkpoint that all responses must pass through.
 */
api.interceptors.response.use(
  // SUCCESS HANDLER - Response status is 2xx (200, 201, etc.)
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response // Just return the response
  },

  // ERROR HANDLER - Response status is 4xx or 5xx (400, 404, 500, etc.)
  (error) => {
    if (error.response) {
      // Server responded with an error status code
      const status = error.response.status

      // Handle different error types
      if (status === 401) {
        // 401 Unauthorized - User is not logged in or token expired
        console.error('🔒 Unauthorized: Please log in')
        // Could redirect to login page here if you had authentication
      } else if (status === 404) {
        // 404 Not Found - Resource doesn't exist
        console.error('🔍 Not Found: Resource does not exist')
      } else if (status === 500) {
        // 500 Internal Server Error - Something went wrong on the server
        console.error('💥 Server Error: Please try again later')
      } else {
        console.error(`❌ Error ${status}:`, error.response.data)
      }
    } else if (error.request) {
      // Request was made but no response received
      // This usually means the backend is not running
      console.error('🔌 No Response: Is the backend server running on http://localhost:3000?')
    } else {
      // Something else went wrong
      console.error('❌ Error:', error.message)
    }

    return Promise.reject(error) // Pass error to component to handle
  }
)

/**
 * Export the configured axios instance
 * 
 * STUDENT NOTE: Other files will import this to make API calls.
 * Example usage in a component:
 * 
 *   import api from '@/services/api'
 *   const response = await api.get('/tasks')
 *   const tasks = response.data
 */
export default api
