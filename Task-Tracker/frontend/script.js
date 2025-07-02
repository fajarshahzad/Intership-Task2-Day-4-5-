const API_URL = 'http://localhost:5000/tasks';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const priorityInput = document.getElementById('priority-input');
const dueDateInput = document.getElementById('due-date-input');
const taskList = document.getElementById('task-list');

async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    li.innerHTML = `
      <strong>${task.task}</strong>
      <div>Priority: ${task.priority || 'Normal'} | Due: ${task.dueDate || 'N/A'}</div>
      <div class="task-buttons">
        <button class="done-btn">${task.done ? 'Undo' : 'Done'}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Done button
    li.querySelector('.done-btn').onclick = async () => {
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !task.done })
      });
      fetchTasks();
    };

    // Delete button
    li.querySelector('.delete-btn').onclick = async () => {
      await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
      fetchTasks();
    };

    // Edit button
    li.querySelector('.edit-btn').onclick = () => {
      const newTask = prompt('Edit task:', task.task);
      if (newTask !== null && newTask.trim() !== '') {
        fetch(`${API_URL}/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: newTask.trim() })
        }).then(fetchTasks);
      }
    };

    taskList.appendChild(li);
  });
}

taskForm.onsubmit = async (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  const priority = priorityInput.value.trim();
  const dueDate = dueDateInput.value;

  if (task === '') return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, priority, dueDate })
  });

  taskInput.value = '';
  priorityInput.value = '';
  dueDateInput.value = '';
  fetchTasks();
};

fetchTasks();
