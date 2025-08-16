const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const prioritySelect = document.getElementById('todo-priority');
const list = document.getElementById('todo-list');
const filters = document.querySelectorAll('.filters button');
const countDisplay = document.getElementById('todo-count');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = '';

  let filtered = todos;
  if (currentFilter === 'pending') filtered = todos.filter(todo => !todo.completed);
  if (currentFilter === 'completed') filtered = todos.filter(todo => todo.completed);

  filtered.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    
    const text = document.createElement('span');
    text.textContent = todo.text;

    const priority = document.createElement('span');
    priority.textContent = todo.priority;
    priority.className = `priority ${todo.priority}`;

    li.appendChild(text);
    li.appendChild(priority);

    li.addEventListener('click', () => {
      todos[index].completed = !todos[index].completed;
      saveTodos();
      renderTodos();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  countDisplay.textContent = `Tarefas: ${todos.filter(t => !t.completed).length} pendentes / ${todos.length} total`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  todos.push({ text: input.value, priority: prioritySelect.value, completed: false });
  input.value = '';
  saveTodos();
  renderTodos();
});

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

renderTodos();
