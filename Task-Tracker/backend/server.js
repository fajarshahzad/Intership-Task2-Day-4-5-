const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(express.json());

// Load tasks
function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save tasks
function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET all tasks
app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.status(200).json(tasks);
});

// POST new task
app.post('/tasks', (req, res) => {
  const { task, priority, dueDate } = req.body;

  if (!task || task.trim() === '') {
    return res.status(400).json({ error: 'Task must not be empty' });
  }

  const tasks = loadTasks();
  const newTask = {
    id: Date.now(),
    task,
    done: false,
    priority: priority || 'Normal',
    dueDate: dueDate || null
  };

  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
  saveTasks(tasks);
  res.status(200).json({ message: 'Task deleted' });
});

// PUT update (done/edit)
app.put('/tasks/:id', (req, res) => {
  let tasks = loadTasks();
  const id = parseInt(req.params.id);
  const updated = req.body;

  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, ...updated };
    }
    return task;
  });

  saveTasks(tasks);
  res.status(200).json({ message: 'Task updated' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
