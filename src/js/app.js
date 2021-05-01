const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const listDisplayContainer = document.querySelector(
  '[data-list-display-container]'
);
const todoTitle = document.querySelector('[data-todo-title]');
const todoCount = document.querySelector('[data-todo-count]');
const tasksWrapper = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task_template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const deleteListButton = document.querySelector('[data-delete-list');
const deleteCompleteTasks = document.querySelector('[data-complete-tasks]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

// Select list
listsContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

tasksWrapper.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTasksCount(selectedList);
  }
});

// Delete completed tasks
deleteCompleteTasks.addEventListener('click', (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

// Delete hole list wrapper
deleteListButton.addEventListener('click', (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

// Creating new list
newListForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === '') return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}

// Adding tasks
newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === '') return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false };
}

// Global
function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(listsContainer);
  renderLists();
  const selectedList = lists.find((list) => list.id === selectedListId);

  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none';
  } else {
    listDisplayContainer.style.display = '';
    todoTitle.innerText = selectedList.name;
    renderTasksCount(selectedList);
  }

  clearElement(tasksWrapper);
  renderTasks(selectedList);
}

// Render Tasks
function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasksWrapper.appendChild(taskElement);
  });
}

// Displayed task count
function renderTasksCount(selectedList) {
  const incompleteTasksCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTasksCount === 1 ? 'task' : 'tasks';
  todoCount.innerText = `${incompleteTasksCount} ${taskString} remaining`;
}

// Render lists
function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    if (list.id === selectedListId) listElement.classList.add('active-list');
    listsContainer.appendChild(listElement);
  });
}

// Clear
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
