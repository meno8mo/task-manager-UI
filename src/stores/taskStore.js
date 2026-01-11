/**
 * TASK STORE - Centralized State Management with Pinia
 * 
 * ============================================================================
 * STUDENT NOTE: What is Pinia?
 * ============================================================================
 * Pinia is Vue's official state management library. It's like a "global storage"
 * that all your components can access and modify.
 * 
 * Why use Pinia instead of just component data()?
 * - Share data between multiple components easily
 * - Keep your data organized in one place
 * - Easier to debug and test
 * 
 * ============================================================================
 * STORE STRUCTURE
 * ============================================================================
 * A Pinia store has 3 main parts:
 * 
 * 1. STATE - The data (like component's data())
 * 2. GETTERS - Computed properties (like component's computed)
 * 3. ACTIONS - Methods that can modify state (like component's methods)
 * 
 * ============================================================================
 */

import { defineStore } from 'pinia'
import api from '@/services/api'

/**
 * Define the Task Store
 * 
 * STUDENT NOTE: 'task' is the store ID - it must be unique across your app
 */
export const useTaskStore = defineStore('task', {
    /**
     * ========================================================================
     * STATE - The Data
     * ========================================================================
     * This is where we store all our task-related data.
     * Think of it as the "memory" of our task manager.
     */
    state: () => ({
        tasks: [],           // Array of all tasks from the database
        loading: false,      // Are we currently loading data from the API?
        error: null,         // Error message if something goes wrong
        filter: 'all'        // Current filter: 'all', 'active', or 'completed'
    }),

    /**
     * ========================================================================
     * GETTERS - Computed Properties
     * ========================================================================
     * Getters are like computed properties - they calculate values based on state.
     * They automatically update when the state changes.
     * 
     * STUDENT NOTE: Use getters when you need to:
     * - Filter or transform state data
     * - Calculate values based on state
     * - Avoid repeating the same logic in multiple components
     */
    getters: {
        /**
         * Get filtered tasks based on current filter
         * 
         * STUDENT NOTE: This getter returns different tasks depending on the filter:
         * - 'all' → all tasks
         * - 'active' → only incomplete tasks
         * - 'completed' → only completed tasks
         */
        filteredTasks: (state) => {
            if (state.filter === 'active') {
                return state.tasks.filter(task => !task.completed)
            }
            if (state.filter === 'completed') {
                return state.tasks.filter(task => task.completed)
            }
            return state.tasks // 'all'
        },

        /**
         * Count of active (incomplete) tasks
         * 
         * STUDENT NOTE: This is useful for showing "You have 5 tasks left" messages
         */
        activeTasksCount: (state) => {
            return state.tasks.filter(task => !task.completed).length
        },

        /**
         * Count of completed tasks
         * 
         * STUDENT NOTE: This is useful for showing progress like "3 tasks completed"
         */
        completedTasksCount: (state) => {
            return state.tasks.filter(task => task.completed).length
        }
    },

    /**
     * ========================================================================
     * ACTIONS - Methods
     * ========================================================================
     * Actions are methods that can modify the state.
     * They can be synchronous or asynchronous (using async/await).
     * 
     * STUDENT NOTE: Actions are where you:
     * - Make API calls
     * - Update the state
     * - Handle business logic
     */
    actions: {
        /**
         * FETCH ALL TASKS - Load tasks from the backend
         * 
         * STUDENT NOTE: This is called when the page loads to get all tasks
         * from the database and store them in the state.
         */
        async fetchTasks() {
            this.loading = true  // Show loading indicator
            this.error = null    // Clear any previous errors

            try {
                // Make GET request to backend API
                const response = await api.get('/tasks/')

                // Store the tasks in state
                // STUDENT NOTE: response.data contains the array of tasks from the backend
                // Map _id to id to ensure compatibility with frontend components
                this.tasks = response.data.map(task => ({
                    ...task,
                    id: task.id || task._id
                }))

                console.log(`✅ Loaded ${this.tasks.length} tasks from database`)
            } catch (error) {
                // If something goes wrong, store the error message
                this.error = 'Failed to load tasks. Please check if the backend is running.'
                console.error('Error fetching tasks:', error)
            } finally {
                // Always turn off loading, whether success or error
                this.loading = false
            }
        },

        /**
         * CREATE TASK - Add a new task to the database
         * 
         * STUDENT NOTE: This is called when the user submits the "Add Task" form.
         * 
         * @param {Object} taskData - The task data from the form
         * @param {string} taskData.title - Task title (required)
         * @param {string} taskData.description - Task description (optional)
         * @param {boolean} taskData.completed - Completion status (default: false)
         */
        async createTask(taskData) {
            this.loading = true
            this.error = null

            try {
                // Make POST request to create new task
                const response = await api.post('/tasks/', taskData)

                // Add the new task to our local state
                // STUDENT NOTE: We add it locally so the UI updates immediately
                // without needing to fetch all tasks again
                const newTask = {
                    ...response.data,
                    id: response.data.id || response.data._id
                }
                this.tasks.push(newTask)

                console.log('✅ Task created:', response.data.title)
            } catch (error) {
                this.error = 'Failed to create task. Please try again.'
                console.error('Error creating task:', error)
                throw error // Re-throw so the component can handle it
            } finally {
                this.loading = false
            }
        },

        /**
         * UPDATE TASK - Modify an existing task
         * 
         * STUDENT NOTE: This is called when editing a task or toggling its completion.
         * 
         * @param {string} id - The task ID (MongoDB _id)
         * @param {Object} taskData - The updated task data
         */
        async updateTask(id, taskData) {
            this.loading = true
            this.error = null

            try {
                // Make PUT request to update the task
                // STUDENT NOTE: We only send the fields that can be updated
                const { title, description, completed } = taskData
                const payload = { title, description, completed }

                const response = await api.put(`/tasks/${id}`, payload)

                // Update the task in our local state
                // STUDENT NOTE: We find the task by ID and replace it with the updated version
                const index = this.tasks.findIndex(task => task._id === id || task.id === id)
                if (index !== -1) {
                    this.tasks[index] = {
                        ...response.data,
                        id: response.data.id || response.data._id
                    }
                    console.log('✅ Task updated:', response.data.title)
                }
            } catch (error) {
                this.error = 'Failed to update task. Please try again.'
                console.error('Error updating task:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        /**
         * TOGGLE COMPLETION - Mark task as complete/incomplete
         * 
         * STUDENT NOTE: This is a helper method that makes it easy to toggle
         * a task's completion status with one function call.
         * 
         * @param {string} id - The task ID
         */
        async toggleTaskCompletion(id) {
            // Find the task in our state
            const task = this.tasks.find(t => t._id === id || t.id === id)
            if (!task) {
                console.error('Task not found:', id)
                return
            }

            try {
                // Update the task with the opposite completion status
                // STUDENT NOTE: !task.completed means "the opposite of current value"
                // If completed is true, it becomes false, and vice versa
                // We only send the fields that should be updated
                await this.updateTask(id, {
                    title: task.title,
                    description: task.description,
                    completed: !task.completed  // Toggle the completed field
                })
            } catch (error) {
                console.error('Error toggling task:', error)
            }
        },

        /**
         * DELETE TASK - Remove a task from the database
         * 
         * STUDENT NOTE: This permanently deletes the task.
         * 
         * @param {string} id - The task ID to delete
         */
        async deleteTask(id) {
            this.loading = true
            this.error = null

            try {
                // Make DELETE request to remove the task
                await api.delete(`/tasks/${id}`)

                // Remove the task from our local state
                // STUDENT NOTE: filter() creates a new array without the deleted task
                this.tasks = this.tasks.filter(task => task._id !== id && task.id !== id)

                console.log('✅ Task deleted')
            } catch (error) {
                this.error = 'Failed to delete task. Please try again.'
                console.error('Error deleting task:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        /**
         * SET FILTER - Change which tasks are displayed
         * 
         * STUDENT NOTE: This doesn't make an API call - it just changes
         * which tasks are shown in the UI.
         * 
         * @param {string} filter - 'all', 'active', or 'completed'
         */
        setFilter(filter) {
            this.filter = filter
            console.log(`📋 Filter changed to: ${filter}`)
        }
    }
})

/**
 * ============================================================================
 * HOW TO USE THIS STORE IN A COMPONENT
 * ============================================================================
 * 
 * 1. Import the store:
 *    import { useTaskStore } from '@/stores/taskStore'
 * 
 * 2. Get the store instance (in setup() or inside a method):
 *    const taskStore = useTaskStore()
 * 
 * 3. Access state:
 *    taskStore.tasks          // Get all tasks
 *    taskStore.loading        // Check if loading
 * 
 * 4. Access getters:
 *    taskStore.filteredTasks  // Get filtered tasks
 *    taskStore.activeTasksCount  // Get count
 * 
 * 5. Call actions:
 *    taskStore.fetchTasks()   // Load tasks
 *    taskStore.createTask({title: 'New task'})  // Create task
 * 
 * ============================================================================
 */
