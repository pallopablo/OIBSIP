
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const formMessage = document.querySelector("#form-message");

const pendingList = document.querySelector("#pending-list");
const completedList = document.querySelector("#completed-list");

const pendingCount = document.querySelector("#pending-count");
const completedCount = document.querySelector("#completed-count");

const pendingEmpty = document.querySelector("#pending-empty");
const completedEmpty = document.querySelector("#completed-empty");

const STORAGE_KEY = "taskflow-tasks";

let tasks = [];

try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean" &&
            typeof task.createdAt === "string"
        );
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return true;
    } catch (error) {
        formMessage.textContent =
            "Unable to save tasks. Check your browser storage settings.";
        return false;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function createButton(label, className, action, taskId) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.className = `action-button ${className}`;
    button.dataset.action = action;
    button.dataset.id = taskId;

    return button;
}

function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.completed) {
        item.classList.add("completed-task");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
        "aria-label",
        `Mark ${task.text} ${task.completed ? "pending" : "complete"}`
    );
    checkbox.dataset.action = "toggle";
    checkbox.dataset.id = task.id;

    const content = document.createElement("div");
    content.className = "task-content";

    const text = document.createElement("p");
    text.className = "task-text";
    text.textContent = task.text;

    const time = document.createElement("time");
    time.className = "task-time";
    time.dateTime = task.createdAt;
    time.textContent = `Added ${formatDate(task.createdAt)}`;

    content.append(text, time);

    if (task.completed && task.completedAt) {
        const completedTime = document.createElement("time");
        completedTime.className = "task-time";
        completedTime.dateTime = task.completedAt;
        completedTime.textContent =
            `Completed ${formatDate(task.completedAt)}`;

        content.appendChild(completedTime);
    }

    const actions = document.createElement("div");
    actions.className = "task-actions";

    if (!task.completed) {
        actions.appendChild(
            createButton("Edit", "edit-button", "edit", task.id)
        );

        actions.appendChild(
            createButton("Mark Complete", "complete-button", "toggle", task.id)
        );
    } else {
        actions.appendChild(
            createButton("Undo", "edit-button", "toggle", task.id)
        );
    }

    actions.appendChild(
        createButton("Delete", "delete-button", "delete", task.id)
    );

    item.append(checkbox, content, actions);

    return item;
}

function renderTasks() {
    pendingList.replaceChildren();
    completedList.replaceChildren();

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    pendingTasks.forEach(task => {
        pendingList.appendChild(createTaskElement(task));
    });

    completedTasks.forEach(task => {
        completedList.appendChild(createTaskElement(task));
    });

    pendingCount.textContent =
        `${pendingTasks.length} pending`;

    completedCount.textContent =
        `${completedTasks.length} completed`;

    pendingEmpty.hidden = pendingTasks.length > 0;
    completedEmpty.hidden = completedTasks.length > 0;
}

function addTask(text) {
    const task = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
}

function toggleTask(taskId) {
    const task = tasks.find(item => item.id === taskId);

    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed
        ? new Date().toISOString()
        : null;

    saveTasks();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();
    renderTasks();
}

function editTask(taskId, textElement) {
    const task = tasks.find(item => item.id === taskId);

    if (!task || task.completed) return;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.maxLength = 200;
    input.value = task.text;
    input.setAttribute("aria-label", "Edit task");

    textElement.replaceWith(input);
    input.focus();
    input.select();

    function finishEditing(saveChanges) {
        if (!input.isConnected) return;

        const newText = input.value.trim();

        if (saveChanges && newText) {
            task.text = newText;
            saveTasks();
        }

        renderTasks();
    }

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            finishEditing(true);
        }

        if (event.key === "Escape") {
            finishEditing(false);
        }
    });

    input.addEventListener("blur", () => {
        finishEditing(true);
    });
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        formMessage.textContent = "Please enter a task first.";
        taskInput.focus();
        return;
    }

    if (text.length > 200) {
        formMessage.textContent = "Tasks must be 200 characters or fewer.";
        return;
    }

    formMessage.textContent = "";
    addTask(text);

    taskInput.value = "";
    taskInput.focus();
});

document.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const taskId = button.dataset.id;
    const action = button.dataset.action;

    if (action === "toggle") {
        toggleTask(taskId);
    }

    if (action === "delete") {
        deleteTask(taskId);
    }

    if (action === "edit") {
        const item = button.closest(".task-item");
        const textElement = item.querySelector(".task-text");

        editTask(taskId, textElement);
    }
});

document.addEventListener("change", event => {
    if (
        event.target.matches(".task-check") &&
        event.target.dataset.action === "toggle"
    ) {
        toggleTask(event.target.dataset.id);
    }
});

renderTasks();
