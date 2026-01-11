<template>
  <!-- Task Item Component - Displays a single task -->
  <div class="task-item" :class="{ completed: task.completed }">
    <!-- Checkbox to toggle task completion -->
    <div class="task-checkbox">
      <input
        type="checkbox"
        :id="`task-${task.id}`"
        :checked="task.completed"
        @change="$emit('toggle', task.id)"
      />
      <label :for="`task-${task.id}`"></label>
    </div>

    <!-- Task content -->
    <div class="task-content">
      <h3 class="task-title">{{ task.title }}</h3>
      <p v-if="task.description" class="task-description">
        {{ task.description }}
      </p>
    </div>

    <!-- Task actions -->
    <div class="task-actions">
      <button
        class="btn-edit"
        @click="$emit('edit', task)"
        title="Edit task"
      >
        ✏️
      </button>
      <button
        class="btn-delete"
        @click="$emit('delete', task.id)"
        title="Delete task"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script>
/**
 * TaskItem Component
 * Displays a single task with options to toggle, edit, or delete
 * 
 * Props:
 * - task: Object containing task data (id, title, description, completed)
 * 
 * Events:
 * - toggle: Emitted when checkbox is clicked (passes task id)
 * - edit: Emitted when edit button is clicked (passes task object)
 * - delete: Emitted when delete button is clicked (passes task id)
 */
export default {
  name: 'TaskItem',
  
  props: {
    task: {
      type: Object,
      required: true,
      validator: (task) => {
        // Validate that task has required properties
        return task.id !== undefined && task.title !== undefined
      }
    }
  },
  
  emits: ['toggle', 'edit', 'delete']
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.task-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-item.completed {
  opacity: 0.7;
  background: #f8f9fa;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #6c757d;
}

/* Checkbox styling */
.task-checkbox {
  flex-shrink: 0;
}

.task-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Task content */
.task-content {
  flex: 1;
  min-width: 0; /* Allow text truncation */
}

.task-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #2c3e50;
}

.task-description {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #6c757d;
}

/* Action buttons */
.task-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.task-actions button {
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.task-actions button:hover {
  background: #f8f9fa;
  transform: scale(1.1);
}

.btn-delete:hover {
  background: #fee;
}

.btn-edit:hover {
  background: #eff6ff;
}
</style>
