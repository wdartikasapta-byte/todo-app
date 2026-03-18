// DATE
const now = new Date();

document.getElementById("day").innerText =
  now.toLocaleDateString("en-US", { weekday: 'long' });

document.getElementById("dateNum").innerText = now.getDate();

document.getElementById("month").innerText =
  now.toLocaleDateString("en-US", { month: 'long' });
  // TASK
let tasks = [];

let currentFilter = "all";

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (input.value === "") return;

  tasks.push({ text: input.value, done: false });
  input.value = "";
  saveTasks();   // 🔥 tambah ini
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let doneCount = 0;

  tasks.forEach((task, index) => {

    // FILTER LOGIC
    if (currentFilter === "active" && task.done) return;
    if (currentFilter === "completed" && !task.done) return;

    if (task.done) doneCount++;

    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    li.innerHTML = `
      <span onclick="toggleTask(${index})" class="task-text">
        <i class="bi ${task.done ? 'bi-heart-fill' : 'bi-heart'} heart"></i>
        ${task.text}
      </span>

      <div class="actions">
        <i class="bi bi-pencil-square edit" onclick="editTask(${index})"></i>
        <i class="bi bi-trash delete" onclick="deleteTask(${index})"></i>
      </div>
    `;

    list.appendChild(li);
  });

  const percent = tasks.length ? (tasks.filter(t => t.done).length / tasks.length) * 100 : 0;

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressText").innerText =
    `${tasks.filter(t => t.done).length} / ${tasks.length} tasks done`;

  updateFilterUI();
}

function updateFilterUI() {
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach(btn => btn.classList.remove("active"));

  if (currentFilter === "all") buttons[0].classList.add("active");
  if (currentFilter === "active") buttons[1].classList.add("active");
  if (currentFilter === "completed") buttons[2].classList.add("active");
}

function editTask(index) {
  const newTask = prompt("Edit task:", tasks[index].text);
  if (newTask !== null && newTask.trim() !== "") {
    tasks[index].text = newTask;
    saveTasks();   // 🔥
    renderTasks();
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();   // 🔥
  renderTasks();
}



// THEME
function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}

window.onload = function () {
  const savedTheme = localStorage.getItem("theme");
  const themeSelect = document.querySelector(".theme-select select");

  if (savedTheme) {
    document.body.className = savedTheme;
    themeSelect.value = savedTheme; // 🔥 ini yang kurang
  }

  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
};

function deleteTask(index) {
  const confirmDelete = confirm("Yakin mau hapus task ini?");
  
  if (confirmDelete) {
    tasks.splice(index, 1);
    saveTasks();   // 🔥
    renderTasks();
    showToast("Task berhasil dihapus 🗑️");
  }
}



function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

