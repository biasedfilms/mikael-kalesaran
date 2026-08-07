// ========================================
// PROJECT XANDRO
// TODO MODULE
// ========================================


// ========================================
// DATA
// ========================================

let tasks = [];


// ========================================
// DOM ELEMENTS
// ========================================

const taskList = document.getElementById("task-list");

const taskInputContainer = document.querySelector(".task-input-container");

const taskInput = document.getElementById("task-input");

const addTaskButton = document.getElementById("add-task-btn");


// ========================================
// STATE
// ========================================

let isAddingTask = false;


// ========================================
// FUNCTIONS
// ========================================

function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

    taskList.innerHTML = `
        <li class="empty-state">
            No tasks yet.<br>
            <span>Click <strong>+</strong> to add one.</span>
        </li>
    `;

    updateProgress();

    return;

}

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.className = task.completed
            ? "task completed"
            : "task";

        li.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span>${task.title}</span>

            <button class="delete-task">
                ×
            </button>
            
        `;

        const checkbox = li.querySelector("input");

        const deleteButton = li.querySelector(".delete-task");

        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            refreshTodo();

        });

        deleteButton.addEventListener("click", () => {

            li.classList.add("deleting");

            setTimeout(() => {

                tasks = tasks.filter(t => t.id !== task.id);

                refreshTodo();

        }, 350);

});

        taskList.appendChild(li);

    });

}

function addTask(title) {

    if (title.trim() === "") return;

    tasks.push({

        id: Date.now(),

        title: title.trim(),

        completed: false

    });

    refreshTodo();

}

function refreshTodo() {

    save("tasks", tasks);

    renderTasks();

    updateProgress();

}

function updateTaskInputUI() {

    if (isAddingTask) {

        taskInputContainer.classList.remove("hidden");

        addTaskButton.textContent = "×";

        taskInput.focus();

    } else {

        taskInputContainer.classList.add("hidden");

        addTaskButton.textContent = "+";

        taskInput.value = "";

    }

}

function initTodo() {

    tasks = load(
        "tasks",
        []
);

    renderTasks();

    updateTaskInputUI();

}


// ========================================
// EVENT LISTENERS
// ========================================

addTaskButton.addEventListener("click", () => {

    isAddingTask = !isAddingTask;

    updateTaskInputUI();

});

taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        addTask(taskInput.value);

        isAddingTask = false;

        updateTaskInputUI();

    }

    else if (event.key === "Escape") {

        isAddingTask = false;

        updateTaskInputUI();

    }

});