document.addEventListener("DOMContentLoaded", loadTasks);

function handleKeyPress(event) {
    if (event.key === "Enter") {
        addTask();
    }
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return;

    fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: taskText })
    })
    .then(response => response.json())
    .then(() => loadTasks()) 
    .catch(error => console.error("Error adding task:", error));

    taskInput.value = "";
}

function loadTasks() {
    fetch("http://localhost:3000/tasks")
        .then(response => response.json())
        .then(tasks => {
            let taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            tasks.forEach((task, index) => {
                let li = document.createElement("li");

                let taskSpan = document.createElement("span");
                taskSpan.textContent = task.text;
                taskSpan.classList.toggle('completed', task.completed);
                taskSpan.onclick = function() {
                    toggleTask(index);
                };

                let deleteButton = document.createElement("button");
                deleteButton.textContent = "×";
                deleteButton.className = "delete-btn";
                deleteButton.onclick = function() {
                    deleteTask(index);
                };

                li.appendChild(taskSpan);
                li.appendChild(deleteButton);
                taskList.appendChild(li);
            });

            updateProgress(tasks);
        })
        .catch(error => console.error("Error loading tasks:", error));
}

function toggleTask(index) {
    fetch(`http://localhost:3000/tasks/${index}`, {
        method: "PUT"
    })
    .then(response => response.json())
    .then(() => loadTasks()) 
    .catch(error => console.error("Error toggling task:", error));
}

function deleteTask(index) {
    if (confirm("Ви впевнені, що хочете видалити це завдання?")) {
        fetch(`http://localhost:3000/tasks/${index}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(() => loadTasks()) 
        .catch(error => console.error("Error deleting task:", error));
    }
}

function updateProgress(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    const progressText = document.getElementById("progressText");
    progressText.textContent = `${completedTasks}/${totalTasks} виконано`;

    const progressFill = document.getElementById("progressFill");
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressFill.style.width = `${progressPercentage}%`;

    if (progressPercentage === 100) {
        progressFill.style.background = "#4caf50"; 
    } else if (progressPercentage >= 50) {
        progressFill.style.background = "#ffeb3b"; 
    } else {
        progressFill.style.background = "#f44336";
    }
}