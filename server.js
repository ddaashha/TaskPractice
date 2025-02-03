const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "tasks.json");

app.use(express.json());
app.use(cors());


app.get("/tasks", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Помилка читання файлу" });
        res.json(JSON.parse(data || "[]"));
    });
});


app.post("/tasks", (req, res) => {
    const newTask = { text: req.body.text, completed: false };
    
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        let tasks = data ? JSON.parse(data) : [];
        tasks.push(newTask);
        fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Помилка запису файлу" });
            res.json(newTask);
        });
    });
});


app.put("/tasks/:index", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        let tasks = JSON.parse(data || "[]");
        let index = req.params.index;
        if (!tasks[index]) return res.status(404).json({ error: "Завдання не знайдено" });
        
        tasks[index].completed = !tasks[index].completed;
        fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Помилка запису файлу" });
            res.json(tasks[index]);
        });
    });
});

app.delete("/tasks/:index", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        let tasks = JSON.parse(data || "[]");
        let index = req.params.index;
        if (!tasks[index]) return res.status(404).json({ error: "Завдання не знайдено" });
        
        tasks.splice(index, 1);
        fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Помилка запису файлу" });
            res.json({ message: "Завдання видалено" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});
