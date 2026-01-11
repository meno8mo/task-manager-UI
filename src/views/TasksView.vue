<template>
  <div class="tasks-view">
    <!-- Page Header -->
    <header class="page-header">
      <h1>My Tasks</h1>
      <div class="task-stats">
        <span class="stat">
          <strong>{{ taskStore.activeTasksCount }}</strong> Active
        </span>
        <span class="stat">
          <strong>{{ taskStore.completedTasksCount }}</strong> Completed
        </span>
      </div>
    </header>

    <!-- Task Form - for creating/editing tasks -->
    <TaskForm
      :task="editingTask"
      @submit="handleFormSubmit"
      @cancel="cancelEdit"
    />

    <!-- Filter Buttons -->
    <div class="filter-buttons">
      <button
        :class="{ active: taskStore.filter === 'all' }"
        @click="taskStore.setFilter('all')"
      >
        All Tasks
      </button>
      <button
        :class="{ active: taskStore.filter === 'active' }"
        @click="taskStore.setFilter('active')"
      >
        Active
      </button>
      <button
        :class="{ active: taskStore.filter === 'completed' }"
        @click="taskStore.setFilter('completed')"
      >
        Completed
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="taskStore.loading" class="loading">
      Loading tasks...
    </div>

    <!-- Error State -->
    <div v-else-if="taskStore.error" class="error">
      {{ taskStore.error }}
    </div>

    <!-- Task List -->
    <div v-else-if="taskStore.filteredTasks.length > 0" class="task-list">
      <TaskItem
        v-for="task in taskStore.filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="handleToggleTask"
        @edit="handleEditTask"
        @delete="handleDeleteTask"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>{{ emptyStateMessage }}</p>
    </div>
  </div>
</template>

<script>
/**
 * TasksView - Main view for managing tasks
 * 
 * This component demonstrates:
 * 1. Using Pinia store for state management
 * 2. Component composition (using TaskForm and TaskItem)
 * 3. CRUD operations (Create, Read, Update, Delete)
 * 4. Event handling between parent and child components
 */
import { useTaskStore } from '@/stores/taskStore'
import TaskForm from '@/components/TaskForm.vue'
import TaskItem from '@/components/TaskItem.vue'

export default {
  name: 'TasksView',
  
  components: {
    TaskForm,
    TaskItem
  },
  
  data() {
    return {
      // Track which task is being edited (null when creating new task)
      editingTask: null
    }
  },
  
  computed: {
    // Get access to the task store
    taskStore() {
      return useTaskStore()
    },
    
    // Dynamic empty state message based on current filter
    emptyStateMessage() {
      if (this.taskStore.filter === 'active') {
        return 'No active tasks. Great job! 🎉'
      }
      if (this.taskStore.filter === 'completed') {
        return 'No completed tasks yet.'
      }
      return 'No tasks yet. Add your first task above!'
    }
  },
  
  // Lifecycle hook - runs when component is mounted
  mounted() {
    // Fetch tasks from API when page loads
    this.taskStore.fetchTasks()
  },
  
  methods: {
    /**
     * Handle form submission (create or update)
     * @param {Object} formData - Task data from the form
     */
    async handleFormSubmit(formData) {
      try {
        if (this.editingTask) {
          // UPDATE: Edit existing task
          await this.taskStore.updateTask(this.editingTask.id, formData)
          this.editingTask = null // Clear editing state
        } else {
          // CREATE: Add new task
          await this.taskStore.createTask(formData)
        }
      } catch (error) {
        alert('Failed to save task. Please try again.')
      }
    },
    
    /**
     * Handle task completion toggle
     * @param {number|string} taskId - ID of task to toggle
     */
    async handleToggleTask(taskId) {
      try {
        await this.taskStore.toggleTaskCompletion(taskId)
      } catch (error) {
        alert('Failed to update task. Please try again.')
      }
    },
    
    /**
     * Handle edit button click
     * @param {Object} task - Task to edit
     */
    handleEditTask(task) {
      // Set the task to be edited (form will populate with this data)
      this.editingTask = task
      
      // Scroll to top so user can see the form
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    
    /**
     * Handle delete button click
     * @param {number|string} taskId - ID of task to delete
     */
    async handleDeleteTask(taskId) {
      // Confirm before deleting
      if (!confirm('Are you sure you want to delete this task?')) {
        return
      }
      
      try {
        await this.taskStore.deleteTask(taskId)
      } catch (error) {
        alert('Failed to delete task. Please try again.')
      }
    },
    
    /**
     * Cancel editing mode
     */
    cancelEdit() {
      this.editingTask = null
    }
  }
}
</script>

<style scoped>
.tasks-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0 0 1rem;
  color: #2c3e50;
  font-size: 2rem;
}

.task-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  color: #6c757d;
  font-size: 0.875rem;
}

.stat strong {
  color: #4CAF50;
  font-size: 1.25rem;
  margin-right: 0.25rem;
}

/* Filter Buttons */
.filter-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filter-buttons button {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.filter-buttons button:hover {
  background: #f8f9fa;
}

.filter-buttons button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* States */
.loading,
.error,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.error {
  color: #dc3545;
  background: #fee;
  border-radius: 4px;
}

.empty-state p {
  font-size: 1.125rem;
  margin: 0;
}
</style>
