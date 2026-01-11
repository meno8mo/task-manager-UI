<template>
  <!-- Task Form Component - For creating and editing tasks -->
  <div class="task-form">
    <h3>{{ isEditing ? 'Edit Task' : 'Add New Task' }}</h3>
    
    <form @submit.prevent="handleSubmit">
      <!-- Task Title Input -->
      <div class="form-group">
        <label for="task-title">Task Title *</label>
        <input
          id="task-title"
          v-model="formData.title"
          type="text"
          placeholder="Enter task title..."
          required
        />
      </div>

      <!-- Task Description Input (Optional) -->
      <div class="form-group">
        <label for="task-description">Description</label>
        <textarea
          id="task-description"
          v-model="formData.description"
          placeholder="Enter task description (optional)..."
          rows="3"
        ></textarea>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" class="btn-primary">
          {{ isEditing ? 'Update Task' : 'Add Task' }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          class="btn-secondary"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
/**
 * TaskForm Component
 * Reusable form for creating new tasks or editing existing ones
 * 
 * Props:
 * - task: Object - If provided, form is in edit mode with pre-filled data
 * 
 * Events:
 * - submit: Emitted when form is submitted (passes form data)
 * - cancel: Emitted when cancel button is clicked (edit mode only)
 */
export default {
  name: 'TaskForm',
  
  props: {
    // Optional task object for editing
    task: {
      type: Object,
      default: null
    }
  },
  
  emits: ['submit', 'cancel'],
  
  data() {
    return {
      // Form data object
      formData: {
        title: '',
        description: '',
        completed: false
      }
    }
  },
  
  computed: {
    // Check if we're in edit mode
    isEditing() {
      return this.task !== null
    }
  },
  
  watch: {
    // Watch for changes to task prop (when editing different tasks)
    task: {
      immediate: true,
      handler(newTask) {
        if (newTask) {
          // Populate form with task data for editing
          this.formData = {
            title: newTask.title || '',
            description: newTask.description || '',
            completed: newTask.completed || false
          }
        } else {
          // Reset form for new task
          this.resetForm()
        }
      }
    }
  },
  
  methods: {
    /**
     * Handle form submission
     */
    handleSubmit() {
      // Validate that title is not empty
      if (!this.formData.title.trim()) {
        alert('Please enter a task title')
        return
      }
      
      // Emit submit event with form data
      this.$emit('submit', { ...this.formData })
      
      // Reset form if creating new task
      if (!this.isEditing) {
        this.resetForm()
      }
    },
    
    /**
     * Handle cancel button click
     */
    handleCancel() {
      this.$emit('cancel')
      this.resetForm()
    },
    
    /**
     * Reset form to initial state
     */
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        completed: false
      }
    }
  }
}
</script>

<style scoped>
.task-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.task-form h3 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>
