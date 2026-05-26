# Junior/Strong Junior FullStack test task - UITOP

### Task

Create a small **full-stack application** for managing tasks (**Todo with categories**).

### The app should allow users to:

1. Сreate tasks with text and a category
2. Mark the list of tasks
3. Mark tasks as completed
4. Filter the list by category
5. Follow the rule: **no more than 5 tasks per category**
6. When deleting or completing a task, show a **snackbar notification with Undo** which disappears after a few seconds

### Functionality

1. **Todos page**
    - The user sees a list of todos: text + category + status (done / not done).
    - Each todo can be:
        - marked done with a checkbox,
        - deleted.
2. **Completed-task logic**
    - If a task is marked as completed:
        - it remains in the list for **5 seconds**,
        - at the same time a **notification with an “Undo” button** appears at the top/bottom of the screen (e.g., snackbar / toast),
        - if the user clicks **Undo** → the task is restored to the list,
        - if the user does not click → the task is removed.
3. **Creating a new task**
    - There is a form with two fields:
        - task text (input),
        - category (select / dropdown).
    - On submit the form sends data to the backend.
    - If the selected category already has 5 tasks → the backend returns an error and the frontend shows an error message.
4. **Category filtering**
    - Above the list there is a select where the user can choose a category.
    - If a category is selected → only tasks from that category are shown.
    - If “All” → all tasks are shown.
5. **System state (UX):**
    - While loading → show a loader / spinner.
    - If an error occurs → show an error message.
    - If the list is empty → show “No tasks” with an icon / text.

### Frontend requirements

- **React / Next.js**
- **TypeScript**
- **React Hook Form** — for handling forms
- **Axios** — for API calls
- Styling may use anything: **MUI**, **Bootstrap**, **TailwindCSS**, **styled-components**, **CSS Modules**
- Use **any snackbar/toast library** (e.g., MUI Snackbar, React Toastify, or a custom one)

### Backend requirements

1. **Node.js**
2. **Express.js / Nest.js**
3. Persist data in **SQLite**
4. API:
    - `POST /todos` — create a todo
    - `GET /todos` — get list (accepts query parameter `category` for filtering)
    - `PATCH /todos/:id` — update status (completed / not completed)
    - `DELETE /todos/:id` — delete a todo
    - `GET /categories` — get categories list
5. Business logic:
    - A category may contain at most **5 tasks**.
    - If adding more → API returns `400 Bad Request`.

### Expected result

1. GitHub repository with folders:
    - `frontend/` — React app
    - `backend/` — Node.js API
2. `README.md` with instructions on how to run the project
3. Comments in code are welcome
4. Deployment of the project to GitHub Pages / Vercel
5. A **public link to your GitHub repository** and a **link to the deployed web page** with the completed task

### Time estimate

This task is expected to take around **3–4 hours** to complete. However, taking up to **8 hours** is also acceptable if needed.

### Bonuses

1. Simple tests (Jest, React Testing Library).
2. `docker-compose` for running the project.
3. Implement a bulk action that allows users to select all or multiple tasks and mark them as done.

### Answer on Questions

1. Did you use AI at any stage while working on this task? Why?
2. What kind of problems or uncertainties AI helps you resolve during the process?

### Evaluation criteria

1. Whether all described features work.
2. Code clarity and structure (naming, components).
3. Correct use of **React Hook Form** for forms.
4. Neatness of styling.
5. Presence of loading / error / empty states.
6. Implementation of **Undo / transient notification**.
7. Backend error handling (validation, 5-task limit).