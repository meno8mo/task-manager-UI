# CRUD Operations - Code Walkthrough for Students

This document provides a step-by-step explanation of how CRUD operations work in this application.

## 📖 Table of Contents
1. [Understanding the Flow](#understanding-the-flow)
2. [CREATE Operation](#create-operation)
3. [READ Operation](#read-operation)
4. [UPDATE Operation](#update-operation)
5. [DELETE Operation](#delete-operation)
6. [Key Concepts](#key-concepts)

---

## Understanding the Flow

Every CRUD operation follows this pattern:

```
User Action → Component Method → Store Action → API Call → Update State → UI Updates
```

The beauty of Vue's reactivity is that when the store state changes, the UI automatically updates!

---

## CREATE Operation

### Step-by-Step: Adding a New Task

#### 1. **User fills the form** (`TaskForm.vue`)
```vue
<input v-model="formData.title" />
```
- `v-model` creates two-way binding
- User types → `formData.title` updates automatically

#### 2. **User submits the form**
```vue
<form @submit.prevent="handleSubmit">
```
- `@submit.prevent` prevents page reload
- Calls `handleSubmit()` method

#### 3. **Form emits data to parent** (`TaskForm.vue`)
```javascript
handleSubmit() {
  this.$emit('submit', { ...this.formData })
}
```
- `$emit` sends data up to parent component
- Parent (TasksView) listens with `@submit="handleFormSubmit"`

#### 4. **Parent receives data** (`TasksView.vue`)
```javascript
async handleFormSubmit(formData) {
  await this.taskStore.createTask(formData)
}
```
- Calls the store's `createTask` action

#### 5. **Store makes API call** (`taskStore.js`)
```javascript
async createTask(taskData) {
  const response = await api.post('/tasks', taskData)
  this.tasks.push(response.data)
}
```
- `api.post()` sends HTTP POST request
- Server creates task and returns it
- New task added to `tasks` array

#### 6. **UI updates automatically**
- Vue detects `tasks` array changed
- Components re-render with new task
- User sees new task appear!

---

## READ Operation

### Step-by-Step: Loading Tasks

#### 1. **Component mounts** (`TasksView.vue`)
```javascript
mounted() {
  this.taskStore.fetchTasks()
}
```
- `mounted()` is a lifecycle hook
- Runs when component is added to the page

#### 2. **Store fetches data** (`taskStore.js`)
```javascript
async fetchTasks() {
  this.loading = true
  const response = await api.get('/tasks')
  this.tasks = response.data
  this.loading = false
}
```
- Sets `loading = true` to show loading state
- Makes GET request to API
- Stores tasks in state
- Sets `loading = false`

#### 3. **UI displays tasks** (`TasksView.vue`)
```vue
<TaskItem
  v-for="task in taskStore.filteredTasks"
  :key="task.id"
  :task="task"
/>
```
- `v-for` loops through tasks
- Creates one `TaskItem` for each task
- `:task="task"` passes task data as prop

#### 4. **Filtering works via getter** (`taskStore.js`)
```javascript
filteredTasks: (state) => {
  if (state.filter === 'active') {
    return state.tasks.filter(task => !task.completed)
  }
  return state.tasks
}
```
- Getter computes filtered list
- Updates automatically when filter changes

---

## UPDATE Operation

### Step-by-Step: Editing a Task

#### 1. **User clicks edit button** (`TaskItem.vue`)
```vue
<button @click="$emit('edit', task)">✏️</button>
```
- Emits `edit` event with task data

#### 2. **Parent sets editing mode** (`TasksView.vue`)
```javascript
handleEditTask(task) {
  this.editingTask = task
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
```
- Stores task being edited
- Scrolls to form

#### 3. **Form populates with data** (`TaskForm.vue`)
```javascript
watch: {
  task: {
    handler(newTask) {
      if (newTask) {
        this.formData = { ...newTask }
      }
    }
  }
}
```
- `watch` monitors `task` prop
- When it changes, updates form data

#### 4. **User submits changes** (`TasksView.vue`)
```javascript
async handleFormSubmit(formData) {
  if (this.editingTask) {
    await this.taskStore.updateTask(this.editingTask.id, formData)
    this.editingTask = null
  }
}
```
- Checks if editing (not creating)
- Calls store's `updateTask`

#### 5. **Store updates task** (`taskStore.js`)
```javascript
async updateTask(id, taskData) {
  const response = await api.put(`/tasks/${id}`, taskData)
  const index = this.tasks.findIndex(task => task.id === id)
  this.tasks[index] = response.data
}
```
- Makes PUT request to API
- Finds task in array
- Replaces with updated version

#### 6. **UI updates**
- Vue detects array item changed
- TaskItem re-renders with new data

---

## DELETE Operation

### Step-by-Step: Removing a Task

#### 1. **User clicks delete** (`TaskItem.vue`)
```vue
<button @click="$emit('delete', task.id)">🗑️</button>
```
- Emits `delete` event with task ID

#### 2. **Parent confirms** (`TasksView.vue`)
```javascript
async handleDeleteTask(taskId) {
  if (!confirm('Are you sure?')) {
    return
  }
  await this.taskStore.deleteTask(taskId)
}
```
- Shows confirmation dialog
- If confirmed, calls store

#### 3. **Store deletes task** (`taskStore.js`)
```javascript
async deleteTask(id) {
  await api.delete(`/tasks/${id}`)
  this.tasks = this.tasks.filter(task => task.id !== id)
}
```
- Makes DELETE request to API
- Removes task from array using `filter`

#### 4. **UI updates**
- Vue detects task removed from array
- TaskItem disappears from screen

---

## Key Concepts

### 1. **Reactive State**
```javascript
// When this changes...
this.tasks.push(newTask)

// This automatically updates!
<div v-for="task in tasks">
```

### 2. **Props Down, Events Up**
```vue
<!-- Parent passes data down -->
<TaskItem :task="task" />

<!-- Child sends events up -->
this.$emit('delete', taskId)
```

### 3. **Async/Await**
```javascript
// Old way (callback hell)
api.get('/tasks').then(response => {
  this.tasks = response.data
})

// New way (clean and readable)
const response = await api.get('/tasks')
this.tasks = response.data
```

### 4. **Separation of Concerns**

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Component** | Display UI, handle user input | TaskForm.vue |
| **Store** | Manage state, business logic | taskStore.js |
| **Service** | API communication | api.js |

### 5. **Single Source of Truth**
```javascript
// ❌ Bad: Each component has its own tasks
data() {
  return { tasks: [] }
}

// ✅ Good: One store, shared by all
const taskStore = useTaskStore()
taskStore.tasks
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Mutating props directly
```javascript
// In child component
props: ['task'],
methods: {
  updateTask() {
    this.task.title = 'New title' // ❌ Never do this!
  }
}
```

### ✅ Solution: Emit events
```javascript
methods: {
  updateTask() {
    this.$emit('update', { ...this.task, title: 'New title' })
  }
}
```

### ❌ Mistake 2: Not handling errors
```javascript
async createTask(data) {
  await api.post('/tasks', data) // ❌ What if this fails?
}
```

### ✅ Solution: Try-catch
```javascript
async createTask(data) {
  try {
    await api.post('/tasks', data)
  } catch (error) {
    this.error = 'Failed to create task'
  }
}
```

### ❌ Mistake 3: Forgetting loading states
```javascript
async fetchTasks() {
  const response = await api.get('/tasks')
  this.tasks = response.data
  // ❌ User sees nothing while loading
}
```

### ✅ Solution: Show loading indicator
```javascript
async fetchTasks() {
  this.loading = true // ✅ Show loading
  const response = await api.get('/tasks')
  this.tasks = response.data
  this.loading = false // ✅ Hide loading
}
```

---

## Practice Exercises

### Exercise 1: Add a "Mark All Complete" Feature
1. Add button in TasksView
2. Create store action `completeAllTasks()`
3. Loop through tasks and update each
4. Bonus: Make it a batch API call

### Exercise 2: Add Task Priority
1. Add priority field to TaskForm (Low/Medium/High)
2. Update task object structure
3. Display priority in TaskItem with colors
4. Add filter by priority

### Exercise 3: Add Search Functionality
1. Add search input in TasksView
2. Create `searchQuery` in store state
3. Update `filteredTasks` getter to include search
4. Bonus: Highlight matching text

---

## Debugging Tips

### 1. **Use Vue DevTools**
- Install Vue DevTools browser extension
- Inspect component data and props
- View Pinia store state
- Track events

### 2. **Console.log is your friend**
```javascript
async createTask(taskData) {
  console.log('Creating task:', taskData) // See what's being sent
  const response = await api.post('/tasks', taskData)
  console.log('Response:', response.data) // See what came back
}
```

### 3. **Check Network Tab**
- Open browser DevTools → Network
- See all API requests
- Check request/response data
- Verify status codes (200, 404, 500, etc.)

---

## Next Steps

1. ✅ Understand the basic CRUD flow
2. ✅ Trace one operation through the entire codebase
3. ✅ Modify existing features
4. ✅ Add new features (search, priority, etc.)
5. ✅ Implement your own CRUD app from scratch

**Remember**: The best way to learn is by doing. Try breaking things and fixing them!

---

**Questions?** Review the code comments in each file for more detailed explanations.
