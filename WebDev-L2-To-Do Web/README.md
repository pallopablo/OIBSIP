# TaskFlow — To-Do Web App

A modern, responsive task management application developed as **Task 3** of the Oasis Infobyte Internship (OIBSIP). TaskFlow helps users organise their daily activities by creating, editing, completing, and deleting tasks through a clean and intuitive interface.

## Features

- **Add Tasks:** Create new tasks using the input field and Add Task button.
- **Pending Tasks:** View all tasks that still need to be completed.
- **Complete Tasks:** Mark tasks as completed and move them to the Completed Tasks section.
- **Edit Tasks:** Modify pending task descriptions inline.
- **Delete Tasks:** Permanently remove tasks from either list.
- **Task Counters:** Display the total number of pending and completed tasks.
- **Timestamps:** Display when tasks were created and completed.
- **Persistent Storage:** Save tasks in browser `localStorage` so they remain available after refreshing the page.
- **Empty States:** Display helpful messages when either task list is empty.
- **Responsive Design:** Adapt the interface to desktop and mobile screens.

## Technologies Used

- HTML5 — page structure and semantic elements.
- CSS3 — styling, responsive layouts, animations, and visual design.
- JavaScript (Vanilla JS) — task management and interactive functionality.
- Browser localStorage — persistent client-side storage.

## Project Structure

```text
Task-3-To-Do-App/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

### Run Locally

1. Download or clone the repository.
2. Open the `Task-3-To-Do-App` folder.
3. Open `index.html` in your web browser.
4. Start adding and managing your tasks.

Alternatively, open the project in Visual Studio Code and use the Live Server extension.

### Use the Application

1. Enter a task in the input field.
2. Click **Add Task** to add it to Pending Tasks.
3. Click **Mark Complete** to move a task to Completed Tasks.
4. Click **Edit** to modify a pending task. Press Enter to save or Escape to cancel.
5. Click **Undo** to return a completed task to the pending list.
6. Click **Delete** to remove a task permanently.

## Data Storage

TaskFlow uses the browser's `localStorage` to preserve task information between page refreshes. Data is stored locally in the browser and is not synchronised across devices or users.

## Learning Objectives

This project demonstrates practical skills in:

- DOM manipulation and event handling.
- JavaScript arrays, objects, and array methods.
- Form validation and user input handling.
- Dynamic rendering of task lists.
- Client-side data persistence.
- Responsive web design.
- Accessible interface elements and user feedback.

## Internship Information

**Programme:** Oasis Infobyte Internship (OIBSIP)  
**Task:** Task 3 — To-Do Web App  
**Project Type:** Front-End Web Development

## Author
Pallo Mohoaladi 

Developed as part of the OIBSIP internship programme.

## License

This project was created for educational and internship purposes.

